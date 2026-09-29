import sys
import pdfplumber
import re

sys.stdout.reconfigure(encoding='utf-8')

with pdfplumber.open("temp_provas/2025_PV_D1_CD1.pdf") as pdf:
    for page_idx in range(1, 4):
        page = pdf.pages[page_idx]
        text = page.extract_text(layout=False)
        print(f"=== PAGE {page_idx+1} ===")
        for line in text.split("\n"):
            if "QUEST" in line.upper():
                print("ACHOU:", repr(line))
