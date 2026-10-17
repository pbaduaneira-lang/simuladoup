"use client";
import { useEffect, useRef, useState } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
export function FocusTimer() {
  const [seconds, setSeconds] = useState(25 * 60),
    [running, setRunning] = useState(false);
  const end = useRef(0);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((end.current - Date.now()) / 1000),
      );
      setSeconds(remaining);
      if (remaining === 0) setRunning(false);
    }, 250);
    return () => clearInterval(timer);
  }, [running]);
  function toggle() {
    if (running) {
      setRunning(false);
      return;
    }
    const duration = seconds || 25 * 60;
    end.current = Date.now() + duration * 1000;
    setSeconds(duration);
    setRunning(true);
  }
  return (
    <section
      className="mini-card focus-timer"
      aria-label="Temporizador de foco opcional"
    >
      <span className="eyebrow">
        <Timer size={14} /> SEU TEMPO DE FOCO
      </span>
      <strong
        className="timer-value"
        role="timer"
        aria-label={`${Math.floor(seconds / 60)} minutos e ${seconds % 60} segundos`}
      >
        {String(Math.floor(seconds / 60)).padStart(2, "0")}:
        {String(seconds % 60).padStart(2, "0")}
      </strong>
      <p>
        {seconds === 0
          ? "Pausa merecida. Levante, respire e volte quando quiser."
          : "25 minutos, no seu ritmo. Este timer é opcional e não interfere nas respostas."}
      </p>
      <div className="timer-actions">
        <button className="button quiet small" type="button" onClick={toggle}>
          {running ? <Pause size={15} /> : <Play size={15} />}{" "}
          {running ? "Pausar" : "Começar"}
        </button>
        <button
          className="button quiet small"
          type="button"
          aria-label="Reiniciar timer de foco"
          onClick={() => {
            setRunning(false);
            setSeconds(25 * 60);
          }}
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </section>
  );
}
