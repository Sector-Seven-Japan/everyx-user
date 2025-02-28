import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Image from "next/image";

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

  useEffect(() => {
    if (!data || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const processedData = processDataForChart(data, outcomeIds);
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
        maintainAspectRatio: false, // Ensure the chart takes the full height of its container
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true, // Show legend
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
              return index === dataset.data.length - 1 ? 5 : 0; // Only show dot at the end
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false, // Remove grid lines
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)", // Make font lighter
              maxRotation: 0, // Ensures labels stay straight
              minRotation: 0, // Ensures labels stay straight
              callback: function (value) {
                const label = this.getLabelForValue(value as number);
                const date = new Date(label);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              },
            },
          },
          y: {
            grid: {
              display: false, // Remove grid lines
            },
            ticks: {
              color: "#fff",
              callback: function () {
                return ""; // Hide the percentage labels
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
  }, [data, outcomeIds]);

  const processDataForChart = (data: GraphData[], outcomeIds?: string[]) => {
    const today = new Date().toISOString().split("T")[0];

    // Filter data up to today's date
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.datetime).toISOString().split("T")[0];
      return itemDate <= today; // Only past & today's records
    });

    // Extract unique sorted dates
    const dates = [
      ...new Set(
        filteredData.map(
          (item) => new Date(item.datetime).toISOString().split("T")[0]
        )
      ),
    ]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort descending
      .slice(0, 6) // Get only the latest 6 records
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Re-sort ascending

    const outcomes = outcomeIds || [
      ...new Set(filteredData.map((item) => item.event_outcome_id)),
    ];
    const colors = ["#00FFBB", "#FF5952", "#924DD3", "#26A45B", "#3661DF"];

    const datasets = outcomes.map((outcome, index) => {
      const outcomeData = dates.map((date) => {
        const dataPoint = filteredData.find(
          (item) =>
            new Date(item.datetime).toISOString().split("T")[0] === date &&
            item.event_outcome_id === outcome
        );
        return dataPoint ? dataPoint.probability * 100 : null; // Only probability data
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
      labels: dates,
      datasets,
    };
  };

  return (
    <div className="w-full rounded-lg">
      <div className="h-[200px] mt-8 w-full">
        {/* <canvas
          ref={chartRef}
          className="w-full h-full"
          style={{ backgroundColor: "transparent" }}
        ></canvas>{" "} */}
        {/* Set background color to transparent */}
        <Image
          src="/Images/graphdefault.png"
          alt="Default graph"
          width={100}
          height={100}
          className="w-full h-full cover"
        />
      </div>
    </div>
  );
};

export default DrawGraph;
