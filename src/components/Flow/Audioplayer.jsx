import React, { useEffect, useRef } from "react";
import useAudioStore from "../../store/TalkingStore";

const AudioPlayer = ({ audioPath }) => {
  const audioRef = useRef(null);
  const { setTalking, stopTalking } = useAudioStore();

  useEffect(() => {
    if (!audioPath || !audioRef.current) return;

    const playAudio = async () => {
      try {
        // Resetear eventos del elemento de audio
        audioRef.current.onplay = null;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;

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
        };

        audioRef.current.onerror = (e) => {
          console.error("Error al reproducir audio:", e);
          stopTalking();
        };

        // Reproducir audio
        await audioRef.current.play();
      } catch (err) {
        console.error("Error al iniciar reproducción:", err);
        stopTalking();
      }
    };

    playAudio();
  }, [audioPath, setTalking, stopTalking]);

  return <audio ref={audioRef} style={{ display: "none" }} />;
};

export default AudioPlayer;
