import React, { useEffect, useRef, useMemo, useCallback } from "react";
import Chart from "chart.js/auto";
import { usePathname } from "next/navigation";

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
  outcomeIds?: string[];
}

const DrawGraph: React.FC<DrawGraphProps> = ({ data, outcomeIds }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const path = usePathname();

  const processDataForChart = useCallback(
    (data: GraphData[], outcomeIds?: string[]) => {
      const now = new Date();
      const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

      const filteredData = data.filter(
        (item) => new Date(item.datetime) >= sixHoursAgo
      );

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
          return dataPoint ? dataPoint.probability * 100 : null;
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
        layout: {
          padding: {
            left: 0, // Reduce left padding
            right: 0,
            top: 0,
            bottom: 0,
          },
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
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
                if (path === "/trade") return "";
                const label = this.getLabelForValue(value as number);
                const date = new Date(label);
                return date.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                });
              },
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false, // Hide ticks completely
              color: "#fff",
              padding: 0, // Reduce padding between ticks and chart
            },
            // Optional: Set a very small offset to minimize space
            offset: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [processedData, path]);

  return (
    <div className="w-full h-full ">
      <div className="lg:h-[12vw] md:h-[15vw] sm:h-[40vw] mt-5 w-full  pr-1">
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
