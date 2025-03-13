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
  graphFilter: string;
  outcomeIds?: string[];
}

const DrawGraph: React.FC<DrawGraphProps> = ({
  data,
  graphFilter,
  outcomeIds,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const path = usePathname();

  const processDataForChart = useCallback(
    (data: GraphData[], filter: string, outcomeIds?: string[]) => {
      const now = new Date();
      let filterDate: Date;

      switch (filter) {
        case "1h":
          filterDate = new Date(now.getTime() - 1 * 60 * 60 * 1000);
          break;
        case "6h":
          filterDate = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          break;
        case "1d":
          filterDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "1w":
          filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "1m":
          filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "ALL":
        default:
          filterDate = new Date(0); // Show all data
          break;
      }

      const filteredData = data.filter(
        (item) => new Date(item.datetime) >= filterDate
      );

      const timestamps = [
        ...new Set(filteredData.map((item) => item.datetime)),
      ].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      const outcomes = outcomeIds || [
        ...new Set(filteredData.map((item) => item.event_outcome_id)),
      ];
      const colors = ["#00FFBB", "#FF5952", "#924DD3", "#d9ff00", "#3661DF"];

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
          borderWidth: 1, // Thin lines
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
    () => processDataForChart(data, graphFilter, outcomeIds),
    [data, graphFilter, outcomeIds, processDataForChart]
  );

  // Format the date for tooltip display based on filter
  const formatDateForTooltip = (dateString: string, filter: string) => {
    const date = new Date(dateString);

    switch (filter) {
      case "1h":
      case "6h":
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      case "1d":
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      case "1w":
      case "1m":
      case "ALL":
        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      default:
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
    }
  };

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
            left: 0,
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
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              title: (tooltipItems) => {
                if (tooltipItems.length > 0) {
                  const labelIndex = tooltipItems[0].dataIndex;
                  const label = processedData.labels[labelIndex];
                  return formatDateForTooltip(label as string, graphFilter);
                }
                return "";
              },
              label: (context) => {
                const label = context.dataset.label || "";
                const value = context.parsed.y.toFixed(2);
                return `${label}: ${value}%`;
              },
            },
            titleFont: {
              weight: "bold",
              size: 14,
            },
            padding: 10,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1,
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
              maxTicksLimit: 6, // Limit to maximum 6 labels
              callback: function (value) {
                if (path === "/trade") return "";
                const label = this.getLabelForValue(value as number);
                const date = new Date(label);

                switch (graphFilter) {
                  case "1h":
                  case "6h":
                  case "1d":
                    return date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                  case "1w":
                  case "1m":
                  case "ALL":
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  default:
                    return date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                }
              },
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
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
  }, [processedData, path, graphFilter]);

  return (
    <div className="w-full h-full">
      <div className="h-full mt-5 w-full">
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
