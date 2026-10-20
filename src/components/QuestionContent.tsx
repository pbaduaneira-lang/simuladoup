"use client";
import { useRef } from "react";
import type { PublicQuestion } from "@/lib/types";
export function QuestionContent({ question }: { question: PublicQuestion }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <div className="question-text">{question.enunciado}</div>
      {question.media && (
        <figure className="original-question">
          {/* The original crop preserves diagrams, mathematical notation and alternatives. */}
          <img
            src={question.media.src}
            width={question.media.width}
            height={question.media.height}
            alt={question.media.alt}
          />
          <figcaption>
            Reprodução da prova oficial. Selecione A, B, C, D ou E abaixo.
          </figcaption>
          <button
            type="button"
            className="text-link"
            onClick={() => dialog.current?.showModal()}
          >
            Ampliar enunciado e alternativas
          </button>
          <dialog
            ref={dialog}
            className="question-zoom"
            aria-label={`Ampliação da questão ${question.source.number}`}
          >
            <button
              type="button"
              className="button quiet small zoom-close"
              onClick={() => dialog.current?.close()}
            >
              Fechar ampliação
            </button>
            <img
              src={question.media.src}
              width={question.media.width}
              height={question.media.height}
              alt={question.media.alt}
            />
          </dialog>
        </figure>
      )}
    </>
  );
}
