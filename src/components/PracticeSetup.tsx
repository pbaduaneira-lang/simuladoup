"use client";
import { useState } from "react";
import Link from "next/link";
export function PracticeSetup({ years }: { years: number[] }) {
  const [count, setCount] = useState(10),
    [year, setYear] = useState("");
  const params = new URLSearchParams({ quantidade: String(count) });
  if (year) params.set("ano", year);
  return (
    <div className="practice-setup">
      <div>
        <label htmlFor="practice-count">Seu ritmo</label>
        <select
          id="practice-count"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        >
          {[5, 10, 20].map((n) => (
            <option value={n} key={n}>
              {n} questões
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="practice-year">Provas</label>
        <select
          id="practice-year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Todos</option>
          {years.map((y) => (
            <option value={y} key={y}>
              ENEM {y}
            </option>
          ))}
        </select>
      </div>
      <Link className="button primary" href={`/app/feed?${params}`}>
        Começar minha prática →
      </Link>
    </div>
  );
}
