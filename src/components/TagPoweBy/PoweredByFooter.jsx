import React, { useState, useEffect } from "react";
import "./PoweredByFooter.scss";
import kuanticaLogo from "../../assets/Kuantica.svg";
import claroLogo from "../../assets/Claro.svg";

const PoweredByFooter = () => {
  const [visible, setVisible] = useState(false);
  const [currentLogo, setCurrentLogo] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 500);

    const interval = setInterval(() => {
      setVisible((prev) => {
        if (!prev) {
          setCurrentLogo((currentLogo) => (currentLogo === 0 ? 1 : 0));
        }
        return !prev;
      });
      console.log(currentLogo);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={`powered-by-footer ${visible ? "visible" : "hidden"}`}>
      <div className="content-container">
        <span className="powered-by-text">Powered by</span>

        <div className="logo-container">
          {currentLogo === 0 ? (
            <img src={kuanticaLogo} alt="Kuantica" width="120" />
          ) : (
            <img src={claroLogo} alt="Claro" width="90" />
          )}
        </div>
      </div>
    </footer>
  );
};

export default PoweredByFooter;
