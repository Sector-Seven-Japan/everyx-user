import React, { useEffect, useRef, useState } from "react";
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
}

type ChartType = "probability" | "payout";

const DrawGraph: React.FC<DrawGraphProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<ChartType>("probability");
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const processedData = processDataForChart(data, activeTab);
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
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: "#fff",
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#fff",
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
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#fff",
              callback: function (value) {
                return activeTab === "probability"
                  ? value + "%"
                  : Number(value).toFixed(1) + "x";
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
  }, [data, activeTab]);

  const processDataForChart = (data: GraphData[], type: ChartType) => {
    const today = new Date().toISOString().split("T")[0];

    // Filter data up to today's date
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.datetime).toISOString().split("T")[0];
      return itemDate <= today; // Only past & today's records
    });

    // Extract unique sorted dates
    const dates = [
      ...new Set(filteredData.map((item) => new Date(item.datetime).toISOString().split("T")[0])),
    ]
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort descending
      .slice(0, 6) // Get only the latest 6 records
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()); // Re-sort ascending

    const outcomes = [...new Set(filteredData.map((item) => item.event_outcome_id))];
    const colors = ["#00FFBB", "#FF5952", "#924DD3", "#26A45B", "#3661DF"];

    const datasets = outcomes.map((outcome, index) => {
      const outcomeData = dates.map((date) => {
        const dataPoint = filteredData.find(
          (item) =>
            new Date(item.datetime).toISOString().split("T")[0] === date &&
            item.event_outcome_id === outcome
        );
        return dataPoint
          ? type === "probability"
            ? dataPoint.probability * 100
            : dataPoint.estimated_payout
          : null;
      });

      return {
        label: `Outcome ${outcome}`,
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
      <div className="flex justify-center mb-4">
        <div className="inline-flex gap-1 p-1 bg-[#1A1A1A] rounded-lg">
          <button
            onClick={() => setActiveTab("probability")}
            className={`text-sm py-1 px-2 rounded-md transition-all duration-200 ${
              activeTab === "probability"
                ? "bg-[#00FFBB] text-black"
                : "text-[#00FFBB] hover:bg-[#00FFBB]/10"
            }`}
          >
            Probability
          </button>
          <button
            onClick={() => setActiveTab("payout")}
            className={`text-sm py-1 px-2 rounded-md transition-all duration-200 ${
              activeTab === "payout"
                ? "bg-[#00FFBB] text-black"
                : "text-[#00FFBB] hover:bg-[#00FFBB]/10"
            }`}
          >
            Estimated Payout
          </button>
        </div>
      </div>
      <div className="h-[200px] mt-8">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default DrawGraph;
