"use client";

import type React from "react";

interface LiveIconProps {
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "away";
  showText?: boolean;
  className?: string;
}

const LiveIcon: React.FC<LiveIconProps> = ({
  size = "lg",
  status = "offline",
  showText = false,
  className = "",
}) => {
  // Size mapping in pixels
  const sizeMap = {
    sm: 8,
    md: 12,
    lg: 16,
  };

  // Status color mapping
  const colorMap = {
    online: "#FF4400", // Green
    offline: "#FF4400", // Red
    away: "#FF4400", // Orange
  };

  // Status text mapping
  const textMap = {
    online: "Online",
    offline: "Offline",
    away: "Away",
  };

  const dotSize = sizeMap[size];
  const statusColor = colorMap[status];
  const statusText = textMap[status];

  return (
    <div className={`live-indicator-container ${className}`}>
      <div
        className={`live-dot status-${status}`}
        style={
          {
            "--dot-size": `${dotSize}px`,
            "--dot-color": statusColor,
          } as React.CSSProperties
        }
      ></div>

      {showText && <span className="live-text">{statusText}</span>}

      <style jsx>{`
        .live-indicator-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .live-dot {
          width: var(--dot-size);
          height: var(--dot-size);
          border-radius: 50%;
          background-color: var(--dot-color);
          position: relative;
        }

        .live-dot::before,
        .live-dot::after {
          content: "";
          position: absolute;
          /* Fixed positioning to ensure perfect centering */
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 100%;
          height: 100%;
          background: inherit;
          border-radius: 50%;
          /* Removed translate transform that was causing the shift */
          transform-origin: center;
          opacity: 0.3;
        }

        .live-dot::before {
          animation: pulse 2s infinite linear;
        }

        .live-dot::after {
          animation: pulse 2s infinite linear;
          animation-delay: 1s;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        .live-text {
          font-size: 14px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default LiveIcon;
