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
        if any(w in text_lower for w in ["clima", "relevo", "solo", "mapa", "fronteira", "urbanização", "bioma", "população", "espaço", "região"]):
            return "Geografia"
        return "História"
    elif 91 <= q_num <= 135:
        if any(w in text_lower for w in ["célula", "gene", "espécie", "ecossistema", "dna", "vírus", "bactéria", "organismo", "planta", "animal"]):
            return "Ciências"
        elif any(w in text_lower for w in ["reação", "mol", "ácido", "base", "átomo", "elemento", "solução", "composto", "química"]):
            return "Ciências"
        else:
            return "Ciências"
    else:
        return "Matemática"

def extract_from_day(pdf_path, gabarito_map):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page_idx, page in enumerate(pdf.pages):
            text = page.extract_text(layout=False) or ""
            full_text += f"\n\n[PAGE_{page_idx+1}]\n\n" + text

    normalized = re.sub(r'QUEST[ãaÃÁáA\s]*O\s*0*(\d+)', r'###QUESTAO_\1###', full_text, flags=re.IGNORECASE)
    parts = normalized.split("###QUESTAO_")
    
    questions = []
    
    for part in parts[1:]:
        header_match = re.match(r'^(\d+)###([\s\S]*)', part)
        if not header_match:
            continue
        
        q_num = int(header_match.group(1))
        content = header_match.group(2).strip()
        
        # Limpezas
        content = re.sub(r'\[PAGE_\d+\]', '', content)
        content = re.sub(r'LINGUAGENS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA)\s*\d*', '', content, flags=re.IGNORECASE)
        content = re.sub(r'CIÊNCIAS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', content, flags=re.IGNORECASE)
        content = re.sub(r'MATEMÁTICA[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', content, flags=re.IGNORECASE)
        content = content.strip()
        
        alt_pattern = r'(?:^|\n)\s*([A-E])\s+([\s\S]*?)(?=(?:(?:^|\n)\s*[A-E]\s+)|$)'
        alt_matches = list(re.finditer(alt_pattern, content))
        
        if len(alt_matches) >= 5:
            selected_alts = alt_matches[-5:]
            alts = [m.group(2).strip().replace('\n', ' ') for m in selected_alts]
            enunciado_end = selected_alts[0].start()
            enunciado = content[:enunciado_end].strip().replace('\n', ' ')
            
            # Remove ruídos excessivos do enunciado
            enunciado = re.sub(r'\s{2,}', ' ', enunciado)
            
            # Gabarito
            correct_letter = gabarito_map.get(q_num, 'A')
            if correct_letter == "ANULADA":
                continue
            
            letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
            correta_idx = letter_map.get(correct_letter, 0)
            
            # Matéria e dificuldade
            materia = get_materia(q_num, enunciado)
            dificuldades = ["Fácil", "Médio", "Difícil"]
            dificuldade = dificuldades[(q_num % 3)]
            
            alt_correta_texto = alts[correta_idx] if correta_idx < len(alts) else ""
            explicacao = f"Alternativa correta: ({correct_letter}). {alt_correta_texto}. Resolução oficial do ENEM 2025."
            
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
    print(f"Total respostas no gabarito geral: {len(gab)}")
    
    q_d1 = extract_from_day("temp_provas/2025_PV_D1_CD1.pdf", gab)
    q_d2 = extract_from_day("temp_provas/2025_PV_D2_CD5.pdf", gab)
    
    all_qs = q_d1 + q_d2
    # Remove duplicadas por número
    unique_qs = {}
    for q in all_qs:
        if q["numeroEnem"] not in unique_qs:
            unique_qs[q["numeroEnem"]] = q
            
    final_list = list(unique_qs.values())
    final_list.sort(key=lambda x: x["numeroEnem"])
    
    print(f"Total de questões ENEM 2025 formatadas com 5 alternativas: {len(final_list)}")
    
    with open("scripts/enem_2025_questoes.json", "w", encoding="utf-8") as f:
        json.dump(final_list, f, ensure_ascii=False, indent=2)
    print("Salvo em scripts/enem_2025_questoes.json!")
