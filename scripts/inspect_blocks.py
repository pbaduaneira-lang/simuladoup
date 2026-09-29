import re

with open("temp_provas/d1_text.txt", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

# Let's inspect questions matching
q_matches = list(re.finditer(r"QU\s*EST\s*?\s*O\s*(\d+)", text, re.IGNORECASE))
print(f"Total headers de questões encontrados em D1: {len(q_matches)}")

for i in range(min(5, len(q_matches))):
    start = q_matches[i].start()
    end = q_matches[i+1].start() if i+1 < len(q_matches) else start + 1000
    q_text = text[start:end].strip()
    print(f"\n--- QUESTÃO {q_matches[i].group(1)} ---")
    print(q_text[:300] + "...")
