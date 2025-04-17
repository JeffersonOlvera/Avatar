import {
  Environment,
  OrbitControls,
  useTexture,
  useHelper,
  Gltf,
} from "@react-three/drei";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { Loader, CameraControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";
import { useEffect, useRef } from "react";
import { DirectionalLightHelper, Object3D, TextureLoader } from "three";
import { useControls, Leva, button } from "leva"; // Import Leva

import ClaroModelo from "./Avatar";

// Light Component with Leva Controls
const AdjustableLight = ({
  lightName,
  initialPosition,
  initialTarget,
  initialIntensity,
  color,
  coneColor,
}) => {
  const lightRef = useRef();
  const targetRef = useRef(new Object3D());

  // Leva controls for this specific light
  const { x, y, z, tx, ty, tz, intensity, helper } = useControls(lightName, {
    x: { value: initialPosition[0], min: -360, max: 360, step: 1 },
    y: { value: initialPosition[1], min: -360, max: 360, step: 1 },
    z: { value: initialPosition[2], min: -360, max: 360, step: 1 },
    tx: { value: initialTarget[0], min: -360, max: 360, step: 1 },
    ty: { value: initialTarget[1], min: -360, max: 360, step: 1 },
    tz: { value: initialTarget[2], min: -360, max: 360, step: 1 },
    intensity: { value: initialIntensity, min: 0, max: 5, step: 0.1 },
    helper: false, // Toggle to show or hide the helper
  });

  // Update the target position dynamically
  targetRef.current.position.set(tx, ty, tz);

  // Add a DirectionalLightHelper with a custom cone color
  useHelper(helper && lightRef, DirectionalLightHelper, 5, coneColor);

  return (
    <>
      <directionalLight
        ref={lightRef}
        intensity={intensity}
        color={color}
        position={[x, y, z]}
        castShadow
        target={targetRef.current}
      />
      <primitive object={targetRef.current} />
    </>
  );
};

const ImagePlane = ({ position }) => {
  //onst texture = useLoader(TextureLoader,"./textures/hotel_lobby.jpg");
  const texture = useLoader(TextureLoader, "./textures/background_prueba.jpg");
  return (
    <mesh position={position}>
      <planeGeometry args={[380, 350]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
};

export const Experience = () => {
  return (
    <>
      <Loader hidden />
      <Leva hidden />
      <Canvas shadows camera={{ position: [0, 4, 32], zoom: 1.3 }}>
        {/* Orbit Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          minAzimuthAngle={-Math.PI / 150}
          maxAzimuthAngle={Math.PI / 150}
          minDistance={10}
          maxDistance={50}
        />
        {/*<OrbitControls/>*/}

        {/* Adjustable Lights */}
        {
          <AdjustableLight
            lightName="Frontal"
            initialPosition={[73, 28, 10]}
            initialTarget={[90, 25, -31]}
            initialIntensity={0.9}
            color="white"
            coneColor="lightblue"
          />
        }

        {
          <AdjustableLight
            lightName="Sombra"
            initialPosition={[-5, 6, 4]}
            initialTarget={[-60, 47, -25]}
            initialIntensity={0.8}
            color="white"
            coneColor="yellow"
          />
        }

        {
          <AdjustableLight
            lightName="Cabello"
            initialPosition={[0, 0, 0]}
            initialTarget={[-60, 47, -25]}
            initialIntensity={0.8}
            color="white"
            coneColor="orange"
          />
        }

        {/* Basic lighting for the model */}
        <ambientLight intensity={0.7} />
        {/* <color attach="background" args={["#591212"]} />
        <directionalLight
          position={[73, 28, 10]}
          intensity={0.9}
          color="white"
          castShadow
        /> */}
        {/* Claro Model */}
        <ImagePlane position={[0, 0, -100]} />
        <ClaroModelo rotation-y={degToRad(0)} />
      </Canvas>
    </>
  );
};
