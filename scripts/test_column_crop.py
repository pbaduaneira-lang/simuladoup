import sys
import pdfplumber
import re

sys.stdout.reconfigure(encoding='utf-8')

with pdfplumber.open("temp_provas/2025_PV_D1_CD1.pdf") as pdf:
    for p_idx in [1, 2, 3, 4, 5]:
        page = pdf.pages[p_idx]
        w = page.width
        h = page.height
        
        # Crop esquerda e direita (ignorando cabeçalho e rodapé)
        left_crop = page.crop((0, 40, w / 2, h - 40))
        right_crop = page.crop((w / 2, 40, w, h - 40))
        
        t_left = left_crop.extract_text() or ""
        t_right = right_crop.extract_text() or ""
        
        print(f"--- PÁGINA {p_idx+1} ESQUERDA ---")
        print(t_left[:250])
        print(f"\n--- PÁGINA {p_idx+1} DIREITA ---")
        print(t_right[:250])
        print("\n" + "="*50 + "\n")
