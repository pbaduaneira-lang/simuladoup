"use client";
import { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";
export function TtsPlayer({ text }: { text: string }) {
  const [playing, setPlaying] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [text]);
  const toggle = () => {
    if (!("speechSynthesis" in window)) {
      setError("A leitura em voz alta não está disponível neste navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    if (playing) {
      setPlaying(false);
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "pt-BR";
    speech.onend = () => setPlaying(false);
    speech.onerror = () => {
      setPlaying(false);
      setError(
        "Não foi possível reproduzir a voz. A explicação está disponível em texto.",
      );
    };
    setError("");
    setPlaying(true);
    window.speechSynthesis.speak(speech);
  };
  return (
    <div>
      <button type="button" className="button quiet small" onClick={toggle}>
        {playing ? <Square size={16} /> : <Volume2 size={17} />}{" "}
        {playing ? "Parar leitura" : "Ouvir explicação"}
      </button>
      {error && (
        <p role="status" className="muted">
          {error}
        </p>
      )}
    </div>
  );
}
