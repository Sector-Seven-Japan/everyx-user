import React, { useEffect, useRef, useMemo, useCallback } from "react";
import Chart from "chart.js/auto";

interface GraphData {
  datetime: string;
  event_id: string;
  event_outcome_id: string;
  probability: number;
  estimated_payout: number;
  num_wagers: number;
  sum_wagers: number;
}

interface DrawGraphProps {
  data: GraphData[];
  outcomeIds?: string[]; // Optional prop to filter outcomes
}

const DrawGraph: React.FC<DrawGraphProps> = ({ data, outcomeIds }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const processDataForChart = useCallback(
    (data: GraphData[], outcomeIds?: string[]) => {
      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours ago

      // Filter data to include only the last 6 hours
      const filteredData = data.filter(
        (item) => new Date(item.datetime) >= sixHoursAgo
      );

      // Extract unique sorted hourly timestamps within last 6 hours
      const timestamps = [
        ...new Set(filteredData.map((item) => item.datetime)),
      ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const outcomes = outcomeIds || [
        ...new Set(filteredData.map((item) => item.event_outcome_id)),
      ];
      const colors = ["#00FFBB", "#FF5952", "#924DD3", "#26A45B", "#3661DF"];

      const datasets = outcomes.map((outcome, index) => {
        const outcomeData = timestamps.map((timestamp) => {
          const dataPoint = filteredData.find(
            (item) =>
              item.datetime === timestamp && item.event_outcome_id === outcome
          );
          return dataPoint ? dataPoint.probability * 100 : null; // Convert to percentage
        });

        return {
          label: `${outcome}`,
          data: outcomeData,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length],
          tension: 0.4,
          fill: false,
        };
      });

      return {
        labels: timestamps,
        datasets,
      };
    },
    []
  );

  const processedData = useMemo(
    () => processDataForChart(data, outcomeIds),
    [data, outcomeIds, processDataForChart]
  );

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: processedData.labels,
        datasets: processedData.datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: "#fff",
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        elements: {
          point: {
            radius: function (context) {
              const index = context.dataIndex;
              const dataset = context.dataset;
              return index === dataset.data.length - 1 ? 5 : 0;
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              maxRotation: 0,
              minRotation: 0,
              callback: function (value) {
                const label = this.getLabelForValue(value as number);
                const date = new Date(label);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                }); // Display hour and minute
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#fff",
              callback: function () {
                return ""; // Hide percentage labels
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [processedData]);

  return (
    <div className="w-full rounded-lg h-full">
      <div className="lg:h-[12vw] md:h-[15vw] sm:h-[40vw] mt-8 w-full">
        <canvas
          ref={chartRef}
          className="w-full h-full"
          style={{ backgroundColor: "transparent" }}
        ></canvas>
      </div>
    </div>
  );
};

export default DrawGraph;
