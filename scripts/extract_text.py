import pypdf
import re
import json

def extract_all_text(pdf_path):
    reader = pypdf.PdfReader(pdf_path)
    full_text = ""
    for idx, page in enumerate(reader.pages):
        full_text += f"\n--- PAGE {idx+1} ---\n" + page.extract_text()
    return full_text

if __name__ == "__main__":
    t1 = extract_all_text("temp_provas/2025_PV_D1_CD1.pdf")
    with open("temp_provas/d1_text.txt", "w", encoding="utf-8") as f:
        f.write(t1)
    
    t2 = extract_all_text("temp_provas/2025_PV_D2_CD5.pdf")
    with open("temp_provas/d2_text.txt", "w", encoding="utf-8") as f:
        f.write(t2)
        
    print("Extraídos textos completos de D1 e D2.")
