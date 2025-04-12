import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import useAudioStore from "../store/TalkingStore";
import { useControls } from "leva";
import { useFrame, useLoader } from "@react-three/fiber";

import * as THREE from "three";

const ANIMATION_FADE_TIME = 0.5;
const ANIMATION_NAMES = ["Cruzado", "Mirando", "Saludo", "Pensando"];
const MODEL_PATH = "./models/Avatar_Claro_v5_transformed.glb";

const Claro_modelo = () => {
  const group = useRef();
  const { scene, animations } = useGLTF(MODEL_PATH, true);
  const [morphInfluences, setMorphInfluences] = useState(null);
  /*
  const { playAudio, script } = useControls({
    playAudio: false,
    script: {
      value: "esim",
      options: ["esim", "anular"],
    },
  });

  const audio = useMemo(() => new Audio(`/Rhubarb-Lip/wav/esim.wav`), [script]);
  const json = useLoader(THREE.FileLoader, `/Rhubarb-Lip/wav/esim.json`);
  const lipsync = JSON.parse(json);

  useFrame(() => {
    const currentAudioTime = audio.currentTime;

    for (let i = 0; i < lipsync.mouthCues.length; i++) {
      const mouthCues = lipsync.mouthCues[i];
      if (
        currentAudioTime >= mouthCues.start &&
        currentAudioTime <= mouthCues.end
      ) {
        console.log(mouthCues.value);
      }
    }
  });

  useEffect(() => {
    if (playAudio) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [playAudio, script]);
*/
  const namedAnimation = useMemo(() => {
    const animationsCopy = [...animations];
    animations[0].name = "Cruzado";
    animations[1].name = "Saludo";
    animations[2].name = "Mirando";
    animations[3].name = "Hablando";
    animations[4].name = "HablandoSinSK";
    animations[5].name = "Pensando";
    return animationsCopy;
  }, [animations]);

  const { actions, mixer } = useAnimations(namedAnimation, group);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const getRandomAnimation = useCallback(() => {
    const currentAnimation = ANIMATION_NAMES.filter(
      (name) => name !== animation
    );
    return currentAnimation[
      Math.floor(Math.random() * currentAnimation.length)
    ];
  }, []);

  const [animation, setAnimation] = useState(
    () => ANIMATION_NAMES[Math.floor(Math.random() * ANIMATION_NAMES.length)]
  );

  const isTalking = useAudioStore((state) => state.isTalking);

  // Obtener referencia a los Morph Targets
  useEffect(() => {
    if (clone) {
      clone.traverse((child) => {
        if (child.isMesh && child.morphTargetInfluences) {
          setMorphInfluences(child.morphTargetInfluences);
        }
      });
    }
  }, [clone]);

  // Manejo de la boca cuando el avatar hable
  useEffect(() => {
    if (!morphInfluences) return;

    let interval;
    if (isTalking) {
      setAnimation("HablandoSinSK");
      interval = setInterval(() => {
        morphInfluences[0] = Math.random() * 0.7; // Ajusta según el índice del morph target de la boca
      }, 100);
    } else {
      morphInfluences[0] = 0; // Cierra la boca cuando no habla
    }

    return () => clearInterval(interval);
  }, [isTalking, morphInfluences]);

  // Cambio de animación cuando el avatar no hable
  useEffect(() => {
    const handleAnimationChange = () => {
      if (!isTalking) {
        const timer = setTimeout(() => {
          setAnimation(getRandomAnimation());
        }, 1000);

        return () => clearTimeout(timer);
      }
    };

    handleAnimationChange();
  }, [isTalking, getRandomAnimation]);

  // Manejo de animaciones en idle
  useEffect(() => {
    if (!isTalking && actions[animation]) {
      const action = actions[animation];
      const duration = action.getClip().duration;

      const timer = setTimeout(() => {
        setAnimation(getRandomAnimation());
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [animation, isTalking, actions, getRandomAnimation]);

  // Control de reproducción de animaciones
  useEffect(() => {
    const currentAction = actions[animation];
    if (currentAction) {
      currentAction
        .reset()
        .fadeIn(mixer.time > 0 ? ANIMATION_FADE_TIME : 0)
        .play();

      return () => {
        currentAction.fadeOut(ANIMATION_FADE_TIME);
      };
    }
  }, [animation, actions, mixer]);

  return (
    <group ref={group}>
      <primitive
        object={clone}
        position={[0, -115, -50]}
        scale={0.9}
        key={`avatar-${animation}`}
      />
    </group>
  );
};

export default Claro_modelo;

useGLTF.preload(MODEL_PATH);
