import { Experience } from "../components/Experience.jsx";
import { Canvas } from "@react-three/fiber";

import StartButton from "../components/StartButton/StartButton.jsx";
// import { TypingBox } from "../components/TypingBox.jsx";
import "./ConsolePage.scss";

export const ConsolePage = () => {
  return (
    <div data-component="ConsolePage">
      <div className="content-block events">
        <div className="content-block-experience">
          {/* Canvas solo debe contener elementos de three.js */}

          <Experience />

          {/* StartButton debe estar fuera del Canvas */}
          <StartButton />
          {/* <TypingBox /> */}
        </div>
      </div>
    </div>
  );
};
