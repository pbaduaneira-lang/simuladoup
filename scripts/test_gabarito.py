import pypdf
import re
import json

def parse_gabarito(gabarito_path):
    reader = pypdf.PdfReader(gabarito_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    gabarito = {}
    
    # Regex para pegar número da questão e letra (ex: 46 E, 1 D B, etc.)
    # Questões de línguas 1 a 5 (Inglês / Espanhol)
    # Linhas normais: "6 E", "46 E"
    lines = text.split("\n")
    for line in lines:
        line = line.strip()
        # Caso padrão: "46 E" ou "12 C"
        match = re.match(r"^(\d+)\s+([A-E])(?:\s+([A-E]))?$", line)
        if match:
            q_num = int(match.group(1))
            letter = match.group(2) # Usar inglês como padrão para 1-5 se houver
            gabarito[q_num] = letter
            
    return gabarito

if __name__ == "__main__":
    gab = parse_gabarito("temp_provas/2025_GB_D1_CD1.pdf")
    print(f"Total respostas extraídas do gabarito: {len(gab)}")
    print("Primeiras 10 respostas:", {k: gab[k] for k in sorted(gab.keys())[:10]})
