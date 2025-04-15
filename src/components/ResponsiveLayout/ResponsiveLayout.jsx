import React, { useEffect, useState } from "react";
import "./ResponsiveLayout.scss";

const ResponsiveLayout = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  });

  // Device type detection based on dimensions
  const getDeviceType = () => {
    const { width, height, aspectRatio } = dimensions;

    // Specific check for the kiosk dimensions
    const isKiosk =
      Math.abs(width - 616.41) < 50 && Math.abs(height - 1095.84) < 50;

    if (isKiosk) return "kiosk";
    if (width <= 768) return "mobile";
    if (width <= 1024) return "tablet";
    return "desktop";
  };

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const deviceType = getDeviceType();
  const isPortrait = dimensions.height > dimensions.width;

  return (
    <div
      className={`responsive-container ${deviceType} ${
        isPortrait ? "portrait" : "landscape"
      }`}
    >
      <div className="content-wrapper">{children}</div>
    </div>
  );
};

export default ResponsiveLayout;
