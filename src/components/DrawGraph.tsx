import React, { useEffect, useRef } from "react";
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
        <svg
          width="341"
          height="178"
          viewBox="0 0 341 178"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.34"
            d="M1.87305 118.398H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            opacity="0.34"
            d="M1.87305 89.5449H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            opacity="0.34"
            d="M1.87305 59.791H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            opacity="0.34"
            d="M1.87305 30.0352H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            opacity="0.34"
            d="M1.87305 1.18359H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            opacity="0.34"
            d="M1.87305 177.006H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            opacity="0.34"
            d="M1.87305 148.152H340.924"
            stroke="#707070"
            stroke-width="0.5"
            stroke-dasharray="1 1"
          />
          <path
            d="M1 26.677L11.6236 26.7862L14.6764 23.117L24.3743 29.7672L32.0808 24.1162L35.7858 26.7862L49.3382 13.8066L53.6175 19.2923L63.6071 21.7869L72.3105 28.6026L76.5875 24.1162L79.8653 28.6026L83.2925 27.6101L87.4271 32.9303L92.7102 29.7706L95.4069 36.2488L98.6847 32.9402L108.674 32.8277L111.959 28.6159H130.795L133.36 32.1064L142.346 32.9369L150.473 25.6216L163.598 24.1162L166.74 27.6067L171.589 23.2824L175.441 28.6026L177.869 28.2685L178.722 24.1162H185.996L189.423 21.8002L193.128 24.1162L196.84 21.8002H204.832L207.257 27.6167L216.229 23.2824L218.228 24.1129V25.6084H253.625L256.404 28.5861L262.08 28.6953L269.942 32.9104L273.184 32.788L276.429 29.754L288.523 29.8367L293.117 36.2355L306.1 38.1512L309.805 34.0452H321.49L325.018 30.1974L330.579 32.9104L333.549 30.1974H340.922"
            stroke="#00FFB8"
            stroke-width="1.8"
          />
          <path
            d="M1 61.1467L11.6234 61.2883L14.6761 56.5319L24.3748 65.1526L32.0789 57.8271L35.7826 61.2883L49.3345 44.4629L53.6134 51.5739L63.6019 54.8077L72.3136 63.6429L76.5855 57.8271L79.8637 63.6429L83.289 62.3562L87.4298 69.2528L92.7208 65.1569L95.4307 73.5588L98.7089 69.2699L108.661 69.1198L111.946 63.66H130.777L133.344 68.1848L142.33 69.2613L150.457 59.7786L163.593 57.8271L166.735 62.3519L171.582 56.7463L175.435 63.6429L177.86 63.214L178.714 57.8271H185.988L189.406 54.8077L193.112 57.81L196.823 54.8077H204.819L207.244 62.3476L216.231 56.7463L218.228 57.8228V59.7614H253.623L256.404 63.6214L262.081 63.763L269.944 69.227L273.186 69.0683L276.429 65.1354L288.523 65.2426L293.124 73.5374L306.105 76.0207L309.809 70.6981H321.493L325.017 65.7316L330.577 69.2485L333.547 65.7316H340.922"
            stroke="#FF5952"
            stroke-width="1.8"
          />
          <path
            d="M1 94.8297L11.6236 94.951L14.6764 90.8741L24.3743 98.2633L32.0808 91.9843L35.7858 94.951L49.3382 80.5293L53.6175 86.6244L63.6071 89.3963L72.3105 96.9693L76.5875 91.9843L79.8653 96.9693L83.2925 95.8664L87.4271 101.778L92.7102 98.267L95.4069 105.465L98.6847 101.789L108.674 101.664L111.959 96.984H130.795L133.36 100.862L142.346 101.785L150.473 93.657L163.598 91.9843L166.74 95.8627L171.589 91.0579L175.441 96.9693L177.869 96.598L178.722 91.9843H185.996L189.423 89.411L193.128 91.9843L196.84 89.411H204.832L207.257 95.8738L216.229 91.0579L218.228 91.9807V93.6423H253.625L256.404 96.9509L262.08 97.0722L269.942 101.756L273.184 101.62L276.429 98.2486L288.523 98.3405L293.117 105.45L306.1 107.579L309.805 103.017H321.49L325.018 98.7412L330.579 101.756L333.549 98.7412H340.922"
            stroke="#9B51E0"
            stroke-width="1.8"
          />
          <path
            d="M1 162.557L11.6236 162.694L14.6764 158.074L24.3743 166.448L32.0808 159.332L35.7858 162.694L49.3382 146.35L53.6175 153.257L63.6071 156.399L72.3105 164.982L76.5875 159.332L79.8653 164.982L83.2925 163.732L87.4271 170.431L92.7102 166.452L95.4069 174.61L98.6847 170.444L108.674 170.302L111.959 164.998H130.795L133.36 169.394L142.346 170.44L150.473 161.228L163.598 159.332L166.74 163.728L171.589 158.282L175.441 164.982L177.869 164.561L178.722 159.332H185.996L189.423 156.416L193.128 159.332L196.84 156.416H204.832L207.257 163.74L216.229 158.282L218.228 159.328V161.211H253.625L256.404 164.961L262.08 165.098L269.942 170.406L273.184 170.252L276.429 166.431L288.523 166.536L293.117 174.593L306.1 177.006L309.805 171.835H321.49L325.018 166.99L330.579 170.406L333.549 166.99H340.922"
            stroke="#27AE60"
            stroke-width="1.8"
          />
        </svg>
      </div>
    </div>
  );
};

export default DrawGraph;
