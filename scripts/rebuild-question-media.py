"""Verify official PDFs/keys and reproduce the immutable question images.

Dependencies: PyMuPDF==2.0.0 and Pillow (lossless WebP support).
Usage: python scripts/rebuild-question-media.py PDF_DIRECTORY [--keys-only]
This script never approves a new question or overwrites a published image.
"""
import argparse
import hashlib
import io
import json
import re
from pathlib import Path
import pymupdf
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("pdf_directory", type=Path)
parser.add_argument("--keys-only", action="store_true")
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
audit = json.loads((root / "src/data/catalogue-provenance.json").read_text(encoding="utf-8"))
keys = json.loads((root / "src/data/official-answer-keys.json").read_text(encoding="utf-8"))
questions = json.loads((root / "src/data/approved-questions.json").read_text(encoding="utf-8"))
docs = {}
for source in audit["sources"]:
    path = args.pdf_directory / source["file"]
    assert hashlib.sha256(path.read_bytes()).hexdigest() == source["sha256"], f"PDF alterado: {path.name}"
    doc = pymupdf.open(path)
    if source["kind"] == "PV":
        docs[(source["year"], source["day"], source["booklet"])] = doc
        continue
    tokens = [line.strip() for page in doc for line in page.get_text().splitlines() if line.strip()]
    found = {}
    for i, token in enumerate(tokens[:-1]):
        if not re.fullmatch(r"\d{1,3}", token):
            continue
        answers = []
        for letter in tokens[i + 1:i + 3]:
            if not re.fullmatch(r"[ABCDE]|[Aa]nulad[ao]", letter):
                break
            answers.append(letter if len(letter) == 1 else None)
        if not answers:
            continue
        number = int(token)
        assert number not in found, f"Número duplicado: {path.name}/{number}"
        found[number] = answers
        foreign = source["day"] == 1 and number <= 5
        assert len(answers) == (2 if foreign else 1)
        for j, answer in enumerate(answers):
            language = ["ingles", "espanhol"][j] if foreign else "geral"
            origin = f"{source['year']}:regular:{source['day']}:{source['booklet']}:{language}:{number}"
            assert keys[origin] == answer, f"Gabarito divergente: {origin}"
    assert set(found) == set(range(1, 91) if source["day"] == 1 else range(91, 181))
print("16 PDFs e 740 entradas de gabarito oficial conferidos.", flush=True)
if args.keys_only:
    raise SystemExit(0)
by_id = {q["id"]: q for q in questions}
for crop in audit["crops"]:
    q = by_id[crop["questionId"]]
    s = q["source"]
    doc = docs[(s["year"], s["day"], s["booklet"])]
    parts = []
    for segment in crop["segments"]:
        pix = doc[segment["page"] - 1].get_pixmap(matrix=pymupdf.Matrix(2.7, 2.7), clip=pymupdf.Rect(segment["rect"]), alpha=False)
        parts.append(Image.frombytes("RGB", [pix.width, pix.height], pix.samples))
    if len(parts) == 1:
        image = parts[0]
    else:
        image = Image.new("RGB", (max(p.width for p in parts), sum(p.height for p in parts) + 16 * (len(parts) - 1)), "white")
        y = 0
        for part in parts:
            image.paste(part, (0, y))
            y += part.height + 16
    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", lossless=True, method=4)
    content = buffer.getvalue()
    assert hashlib.sha256(content).hexdigest() == q["media"]["sha256"], f"Renderização diferente: {q['id']}"
    target = root / "public" / q["media"]["src"].lstrip("/")
    if target.exists():
        assert target.read_bytes() == content, f"Imagem publicada alterada: {target.name}"
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(content)
print(f"{len(audit['crops'])} reproduções conferidas.")
