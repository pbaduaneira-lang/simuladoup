import pdfplumber
import re
import json

def get_gabarito(pdf_path, is_d2=False):
    gabarito = {}
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        for line in text.split("\n"):
            line = line.strip()
            # Padrão: "46 E" ou "1 D B" ou "91 C" ou "115 Anulado"
            parts = line.split()
            if len(parts) >= 2 and parts[0].isdigit():
                q_num = int(parts[0])
                ans = parts[1].upper()
                if ans in ['A', 'B', 'C', 'D', 'E']:
                    gabarito[q_num] = ans
                elif "ANULAD" in ans or (len(parts) > 1 and "ANULAD" in parts[1].upper()):
                    gabarito[q_num] = "ANULADA"
    return gabarito

if __name__ == "__main__":
    g1 = get_gabarito("temp_provas/2025_GB_D1_CD1.pdf")
    g2 = get_gabarito("temp_provas/2025_GB_D2_CD5.pdf", is_d2=True)
    print(f"Gabarito D1: {len(g1)} respostas (Q1 a Q{max(g1.keys())})")
    print(f"Gabarito D2: {len(g2)} respostas (Q91 a Q{max(g2.keys())})")
