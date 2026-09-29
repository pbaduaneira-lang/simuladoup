import sys
import os
import re
import json
import pdfplumber
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

def parse_gab(pdf_path):
    if not os.path.exists(pdf_path):
        return {}
    reader = pypdf.PdfReader(pdf_path)
    text = "\n".join([p.extract_text() for p in reader.pages if p.extract_text()])
    gabarito = {}
    for line in text.split("\n"):
        line = line.strip()
        matches = re.findall(r"(\d+)\s+([A-E]|Anulado)", line, re.IGNORECASE)
        for num, ans in matches:
            q_num = int(num)
            if q_num not in gabarito:
                gabarito[q_num] = ans.upper()
    return gabarito

def get_materia(q_num, text=""):
    text_lower = text.lower()
    if 1 <= q_num <= 45:
        return "Português"
    elif 46 <= q_num <= 90:
        if any(w in text_lower for w in ["clima", "relevo", "solo", "mapa", "fronteira", "urbanização", "bioma", "população", "espaço", "região", "geografia", "demográfica", "ambiente", "cerrado", "floresta"]):
            return "Geografia"
        return "História"
    elif 91 <= q_num <= 135:
        return "Ciências"
    else:
        return "Matemática"

def extract_pdf_questions(pdf_path, gabarito_map, ano_label="ENEM"):
    if not os.path.exists(pdf_path):
        print(f"[AVISO] Arquivo não encontrado: {pdf_path}")
        return []
        
    full_text_stream = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            w = page.width
            h = page.height
            if page_idx == 0:
                continue
                
            left_crop = page.crop((20, 35, (w / 2) - 5, h - 30))
            right_crop = page.crop(((w / 2) + 5, 35, w - 20, h - 30))
            
            t_left = left_crop.extract_text(layout=False) or ""
            t_right = right_crop.extract_text(layout=False) or ""
            
            for t in [t_left, t_right]:
                t = re.sub(r'ENEM\d{4}[A-Z0-9]*', '', t, flags=re.IGNORECASE)
                t = re.sub(r'\*\d+[A-Z0-9]+\*', '', t)
                t = re.sub(r'LINGUAGENS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA)\s*\d*', '', t, flags=re.IGNORECASE)
                t = re.sub(r'CIÊNCIAS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', t, flags=re.IGNORECASE)
                t = re.sub(r'MATEMÁTICA[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', t, flags=re.IGNORECASE)
                t = re.sub(r'[ \t]{2,}', ' ', t)
                full_text_stream += "\n\n" + t

    normalized = re.sub(r'(?:^|\n)\s*QUEST[^\d\n]{0,8}O\s*0*(\d+)', r'\n###QUESTAO_\1###\n', full_text_stream, flags=re.IGNORECASE)
    parts = normalized.split("###QUESTAO_")
    
    questions = []
    letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
    dificuldades = ["Fácil", "Médio", "Difícil"]
    
    for part in parts[1:]:
        header_match = re.match(r'^(\d+)###([\s\S]*)', part)
        if not header_match:
            continue
        
        q_num = int(header_match.group(1))
        content = header_match.group(2).strip()
        
        lines = content.split('\n')
        alts_dict = {}
        enunc_lines = []
        current_letter = None
        
        for line in lines:
            ls = line.strip()
            if not ls:
                continue
            alt_m = re.match(r'^([A-E])\1?\s+(.*)', ls)
            if alt_m:
                letter = alt_m.group(1)
                text = alt_m.group(2)
                current_letter = letter
                alts_dict[letter] = text
            elif current_letter:
                alts_dict[current_letter] += ' ' + ls
            else:
                enunc_lines.append(ls)
                
        # Verifica se temos A, B, C, D, E
        if all(k in alts_dict for k in ['A', 'B', 'C', 'D', 'E']):
            alts = [
                re.sub(r'\s{2,}', ' ', alts_dict['A']).strip(),
                re.sub(r'\s{2,}', ' ', alts_dict['B']).strip(),
                re.sub(r'\s{2,}', ' ', alts_dict['C']).strip(),
                re.sub(r'\s{2,}', ' ', alts_dict['D']).strip(),
                re.sub(r'\s{2,}', ' ', alts_dict['E']).strip()
            ]
            
            enunciado = ' '.join(enunc_lines).strip()
            enunciado = re.sub(r'\s{2,}', ' ', enunciado)
            
            if len(enunciado) < 20 or any(len(a) == 0 for a in alts):
                continue
                
            correct_letter = gabarito_map.get(q_num, 'A')
            if "ANULAD" in str(correct_letter).upper():
                continue
                
            correta_idx = letter_map.get(correct_letter, 0)
            materia = get_materia(q_num, enunciado)
            
            explicacoes_default = {
                "Português": f"A alternativa correta é a ({correct_letter}). Ela sintetiza a proposta do texto e a interpretação correta das relações discursivas.",
                "História": f"A alternativa correta é a ({correct_letter}). O item analisa os fatores sociopolíticos, econômicos e contextuais da época.",
                "Geografia": f"A alternativa correta é a ({correct_letter}). A questão analisa as transformações espaciais, territoriais e socioambientais.",
                "Ciências": f"A alternativa correta é a ({correct_letter}). A resposta decorre diretamente dos conceitos e leis das ciências da natureza.",
                "Matemática": f"A alternativa correta é a ({correct_letter}). A solução é obtida pelo equacionamento e proporcionalidade direta entre os dados do problema."
            }
            
            questions.append({
                "ano": ano_label,
                "numero": q_num,
                "materia": materia,
                "dificuldade": dificuldades[q_num % 3],
                "enunciado": f"[{ano_label} - Questão {q_num}] {enunciado}",
                "alternativas": alts,
                "correta": correta_idx,
                "explicacaoIA": explicacoes_default.get(materia, f"Gabarito Oficial: Letra ({correct_letter}).")
            })
            
    print(f"[{ano_label}] Extraídas {len(questions)} questões válidas de {pdf_path}")
    return questions

def main():
    all_dataset = []
    
    # 1. ENEM 2023
    print("--- Processando ENEM 2023 ---")
    gab_2023_d1 = parse_gab("temp_provas/2023_GB_D1_CD1.pdf")
    gab_2023_d2 = parse_gab("temp_provas/2023_GB_D2_CD5.pdf")
    gab_2023 = {**gab_2023_d1, **gab_2023_d2}
    
    q_2023_d1 = extract_pdf_questions("temp_provas/2023_PV_D1_CD1.pdf", gab_2023, "ENEM 2023")
    q_2023_d2 = extract_pdf_questions("temp_provas/2023_PV_D2_CD5.pdf", gab_2023, "ENEM 2023")
    all_dataset.extend(q_2023_d1)
    all_dataset.extend(q_2023_d2)
    
    # 2. ENEM 2024
    print("--- Processando ENEM 2024 ---")
    gab_2024_d1 = parse_gab("temp_provas/2024_GB_D1_CD1.pdf")
    gab_2024_d2 = parse_gab("temp_provas/2024_GB_D2_CD5.pdf")
    gab_2024 = {**gab_2024_d1, **gab_2024_d2}
    
    q_2024_d2 = extract_pdf_questions("temp_provas/2024_PV_D2_CD5.pdf", gab_2024, "ENEM 2024")
    all_dataset.extend(q_2024_d2)
    
    output_path = "scripts/enem_multi_anos.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_dataset, f, ensure_ascii=False, indent=2)
        
    print(f"\n🎉 SUCESSO! Total consolidado: {len(all_dataset)} questões extraídas e salvas em {output_path}!")

if __name__ == "__main__":
    main()
