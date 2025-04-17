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

    // Initial call to set dimensions
    handleResize();

    // Add debounced resize listener for better performance
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  const deviceType = getDeviceType();
  const isPortrait = dimensions.height > dimensions.width;

  // Optional: Add debug information during development
  useEffect(() => {
    console.log(
      `Device: ${deviceType}, Mode: ${isPortrait ? "portrait" : "landscape"}`
    );
    console.log(`Dimensions: ${dimensions.width}x${dimensions.height}`);
  }, [deviceType, isPortrait, dimensions]);

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
