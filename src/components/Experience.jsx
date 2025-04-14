import {
  Environment,
  OrbitControls,
  useTexture,
  useHelper,
  Gltf,
  Stage,
  useAspect,
} from "@react-three/drei";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { Loader, CameraControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils";
import { useEffect, useRef, useState } from "react";
import {
  DirectionalLightHelper,
  Object3D,
  TextureLoader,
  Vector3,
} from "three";
import { useControls, Leva, button } from "leva";

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

// Componente para detectar el tipo de dispositivo
const DeviceDetector = ({ children }) => {
  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 5; // Ajustar según necesidad (en unidades three.js)
  const isTablet = width >= 5 && width < 10;
  const isDesktop = width >= 10;

  return children({ isMobile, isTablet, isDesktop });
};

// Componente de fondo responsivo
const ResponsiveBackground = () => {
  const texture = useLoader(TextureLoader, "./textures/background_prueba.jpg");

  return (
    <DeviceDetector>
      {({ isMobile, isTablet, isDesktop }) => {
        // Ajustar escala y posición según el dispositivo
        const scale = isMobile
          ? [280, 250]
          : isTablet
          ? [320, 300]
          : [380, 350];
        const position = isMobile
          ? [0, -10, -80]
          : isTablet
          ? [0, -5, -90]
          : [0, 0, -100];

        return (
          <mesh position={position}>
            <planeGeometry args={scale} />
            <meshBasicMaterial map={texture} />
          </mesh>
        );
      }}
    </DeviceDetector>
  );
};

// Componente de avatar responsivo
const ResponsiveAvatar = () => {
  return (
    <DeviceDetector>
      {({ isMobile, isTablet, isDesktop }) => {
        // Ajustar posición y escala según el dispositivo
        const position = isMobile
          ? [0, -130, -40] // Móvil - Más cerca y más abajo
          : isTablet
          ? [0, -120, -45] // Tablet
          : [0, -115, -50]; // Desktop - Posición original

        const scale = isMobile
          ? 0.75 // Móvil - Más pequeño
          : isTablet
          ? 0.8 // Tablet
          : 0.9; // Desktop - Escala original

        return (
          <ClaroModelo
            position={position}
            scale={scale}
            rotation-y={degToRad(0)}
          />
        );
      }}
    </DeviceDetector>
  );
};

// Configuración responsiva de cámara
const ResponsiveCamera = ({ children }) => {
  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 5;

  // Configurar cámara según el dispositivo
  useThree(({ camera }) => {
    if (isMobile) {
      camera.position.set(0, 4, 36); // Más cercana para móviles
      camera.zoom = 1.0; // Menor zoom para móviles
    } else {
      camera.position.set(0, 4, 32); // Posición original
      camera.zoom = 1.3; // Zoom original
    }
    camera.updateProjectionMatrix();
  });

  return children;
};

export const Experience = () => {
  return (
    <>
      <Loader hidden />
      <Leva hidden />
      <Canvas shadows>
        <ResponsiveCamera>
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

          {/* Adjustable Lights */}
          <AdjustableLight
            lightName="Frontal"
            initialPosition={[73, 28, 10]}
            initialTarget={[90, 25, -31]}
            initialIntensity={0.9}
            color="white"
            coneColor="lightblue"
          />

          <AdjustableLight
            lightName="Sombra"
            initialPosition={[-5, 6, 4]}
            initialTarget={[-60, 47, -25]}
            initialIntensity={0.8}
            color="white"
            coneColor="yellow"
          />

          <AdjustableLight
            lightName="Cabello"
            initialPosition={[0, 0, 0]}
            initialTarget={[-60, 47, -25]}
            initialIntensity={0.8}
            color="white"
            coneColor="orange"
          />

          {/* Basic lighting for the model */}
          <ambientLight intensity={0.7} />

          {/* Background and Claro Model */}
          <ResponsiveBackground />
          <ResponsiveAvatar />
        </ResponsiveCamera>
      </Canvas>
    </>
  );
};
