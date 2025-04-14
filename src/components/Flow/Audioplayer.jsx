import React, { useEffect, useRef } from "react";
import useAudioStore from "../../store/TalkingStore";

const AudioPlayer = ({ audioPath, autoPlay = true }) => {
  const audioRef = useRef(null);
  const { setTalking, stopTalking } = useAudioStore();
  const lastAudioPathRef = useRef(null);

  useEffect(() => {
    if (!audioPath || !audioRef.current) return;

    // Evitar reproducir el mismo audio múltiples veces
    if (lastAudioPathRef.current === audioPath) return;
    lastAudioPathRef.current = audioPath;

    const playAudio = async () => {
      try {
        // Resetear eventos del elemento de audio
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.oncanplaythrough = null;

        // Actualizar fuente si es diferente
        if (audioRef.current.src !== audioPath) {
          audioRef.current.src = audioPath;
          audioRef.current.load();
        }

        // Configurar manejadores de eventos
        audioRef.current.onplay = () => {
          setTalking();
          console.log("Audio iniciado:", audioPath);
        };

        audioRef.current.onended = () => {
          stopTalking();
          console.log("Audio finalizado");
          lastAudioPathRef.current = null; // Permitir reproducir el mismo audio de nuevo
        };

        audioRef.current.onerror = (e) => {
          console.error("Error al reproducir audio:", e);
          stopTalking();
          lastAudioPathRef.current = null;
        };

        // Añadir manejador para precargar el audio
        audioRef.current.oncanplaythrough = async () => {
          try {
            if (autoPlay) {
              await audioRef.current.play();
            }
          } catch (err) {
            console.error("Error al iniciar reproducción automática:", err);
            stopTalking();
            lastAudioPathRef.current = null;
          }
        };

        // Intentar precargar y reproducir
        if (audioRef.current.readyState >= 3) {
          // Ya está cargado, reproducir directamente
          if (autoPlay) {
            await audioRef.current.play();
          }
        }
      } catch (err) {
        console.error("Error general en AudioPlayer:", err);
        stopTalking();
        lastAudioPathRef.current = null;
      }
    };

    playAudio();

    // Limpiar eventos al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.oncanplaythrough = null;
        audioRef.current.pause();
      }
    };
  }, [audioPath, setTalking, stopTalking, autoPlay]);

  return <audio ref={audioRef} style={{ display: "none" }} preload="auto" />;
};

export default AudioPlayer;
