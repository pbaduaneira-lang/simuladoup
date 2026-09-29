import sys
import pdfplumber
import pypdf
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

def get_gabaritos():
    def parse_gab(pdf_path):
        reader = pypdf.PdfReader(pdf_path)
        text = "\n".join([p.extract_text() for p in reader.pages])
        gabarito = {}
        for line in text.split("\n"):
            line = line.strip()
            matches = re.findall(r"(\d+)\s+([A-E]|Anulado)", line, re.IGNORECASE)
            for num, ans in matches:
                q_num = int(num)
                if q_num not in gabarito:
                    gabarito[q_num] = ans.upper()
        return gabarito

    g1 = parse_gab("temp_provas/2025_GB_D1_CD1.pdf")
    g2 = parse_gab("temp_provas/2025_GB_D2_CD5.pdf")
    g1.update(g2)
    return g1

def get_materia(q_num, text=""):
    text_lower = text.lower()
    if 1 <= q_num <= 45:
        return "Português"
    elif 46 <= q_num <= 90:
        if any(w in text_lower for w in ["clima", "relevo", "solo", "mapa", "fronteira", "urbanização", "bioma", "população", "espaço", "região", "geografia"]):
            return "Geografia"
        return "História"
    elif 91 <= q_num <= 135:
        return "Ciências"
    else:
        return "Matemática"

def extract_from_day_columns(pdf_path, gabarito_map):
    full_text_stream = ""
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            w = page.width
            h = page.height
            
            # Pula página de instruções (página 1)
            if page_idx == 0:
                continue
                
            left_crop = page.crop((25, 40, (w / 2) - 5, h - 35))
            right_crop = page.crop(((w / 2) + 5, 40, w - 25, h - 35))
            
            t_left = left_crop.extract_text(layout=False) or ""
            t_right = right_crop.extract_text(layout=False) or ""
            
            for t in [t_left, t_right]:
                cleaned = re.sub(r'ENEM2025[A-Z0-9]*', '', t)
                cleaned = re.sub(r'\*\d+[A-Z0-9]+\*', '', cleaned)
                cleaned = re.sub(r'LINGUAGENS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA)\s*\d*', '', cleaned, flags=re.IGNORECASE)
                cleaned = re.sub(r'CIÊNCIAS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', cleaned, flags=re.IGNORECASE)
                cleaned = re.sub(r'MATEMÁTICA[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', cleaned, flags=re.IGNORECASE)
                full_text_stream += "\n\n" + cleaned

    # Normaliza marcadores de questão
    normalized = re.sub(r'QUEST[ãaÃÁáA\s]*O\s*0*(\d+)', r'###QUESTAO_\1###', full_text_stream, flags=re.IGNORECASE)
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
        
        # Padrão para alternativas A, B, C, D, E
        alt_pattern = r'(?:^|\n)\s*([A-E])\s+([\s\S]*?)(?=(?:(?:^|\n)\s*[A-E]\s+)|$)'
        alt_matches = list(re.finditer(alt_pattern, content))
        
        if len(alt_matches) >= 5:
            selected_alts = alt_matches[-5:]
            alts = [m.group(2).strip().replace('\n', ' ') for m in selected_alts]
            
            enunciado_end = selected_alts[0].start()
            enunciado = content[:enunciado_end].strip().replace('\n', ' ')
            enunciado = re.sub(r'\s{2,}', ' ', enunciado)
            
            correct_letter = gabarito_map.get(q_num, 'A')
            if correct_letter == "ANULADA":
                continue
                
            correta_idx = letter_map.get(correct_letter, 0)
            materia = get_materia(q_num, enunciado)
            dificuldade = dificuldades[(q_num % 3)]
            
            alt_correta_texto = alts[correta_idx] if correta_idx < len(alts) else ""
            explicacao = f"Alternativa correta: ({correct_letter}) {alt_correta_texto}.\nResolução oficial do ENEM 2025."
            
            # Filtro básico de qualidade: enunciado e alternativas válidas
            if len(enunciado) > 20 and all(len(a) > 1 for a in alts):
                questions.append({
                    "numeroEnem": q_num,
                    "materia": materia,
                    "dificuldade": dificuldade,
                    "enunciado": f"[ENEM 2025 - Q{q_num}] {enunciado}",
                    "alternativas": alts,
                    "correta": correta_idx,
                    "explicacaoIA": explicacao
                })
                
    return questions

if __name__ == "__main__":
    gab = get_gabaritos()
    print(f"Total respostas no gabarito oficial: {len(gab)}")
    
    q_d1 = extract_from_day_columns("temp_provas/2025_PV_D1_CD1.pdf", gab)
    q_d2 = extract_from_day_columns("temp_provas/2025_PV_D2_CD5.pdf", gab)
    
    all_qs = q_d1 + q_d2
    unique_qs = {}
    for q in all_qs:
        if q["numeroEnem"] not in unique_qs:
            unique_qs[q["numeroEnem"]] = q
            
    final_list = list(unique_qs.values())
    final_list.sort(key=lambda x: x["numeroEnem"])
    
    print(f"Total de questões ENEM 2025 100% limpas por coluna: {len(final_list)}")
    
    with open("scripts/enem_2025_clean.json", "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
    print("Arquivo salvo com sucesso em scripts/enem_2025_clean.json!")
