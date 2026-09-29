import pypdf
import re

def get_full_gabarito(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    gabarito = {}
    lines = text.split("\n")
    for line in lines:
        line = line.strip()
        # Procura números seguidos de letras
        matches = re.findall(r"(\d+)\s+([A-E]|Anulado)", line, re.IGNORECASE)
        for num, ans in matches:
            q_num = int(num)
            if q_num not in gabarito:
                gabarito[q_num] = ans.upper()
    return gabarito

g1 = get_full_gabarito("temp_provas/2025_GB_D1_CD1.pdf")
g2 = get_full_gabarito("temp_provas/2025_GB_D2_CD5.pdf")

print(f"Total D1: {len(g1)} respostas. Chaves: min={min(g1.keys())}, max={max(g1.keys())}")
print(f"Total D2: {len(g2)} respostas. Chaves: min={min(g2.keys())}, max={max(g2.keys())}")
