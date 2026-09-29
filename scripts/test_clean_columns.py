import sys
import pdfplumber
import re

sys.stdout.reconfigure(encoding='utf-8')

with pdfplumber.open("temp_provas/2025_PV_D1_CD1.pdf") as pdf:
    # Vamos testar página 7 e 8
    for p_idx in [6, 7, 8]:
        page = pdf.pages[p_idx]
        w = page.width
        h = page.height
        
        # Margens precisas da coluna esquerda e direita do ENEM
        left_crop = page.crop((30, 45, (w / 2) - 5, h - 45))
        right_crop = page.crop(((w / 2) + 5, 45, w - 30, h - 45))
        
        t_left = left_crop.extract_text(layout=False) or ""
        t_right = right_crop.extract_text(layout=False) or ""
        
        for col_name, text in [("COLUNA ESQUERDA", t_left), ("COLUNA DIREITA", t_right)]:
            # Limpa repetições de ENEM2025 e códigos de barra
            cleaned = re.sub(r'ENEM2025[A-Z0-9]*', '', text)
            cleaned = re.sub(r'\*\d+[A-Z0-9]+\*', '', cleaned)
            print(f"=== PÁGINA {p_idx+1} - {col_name} ===")
            print(cleaned.strip())
            print("-" * 40)
