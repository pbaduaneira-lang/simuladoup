import sys
import pdfplumber
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

def extract_questions_from_pdf(pdf_path, is_d2=False):
    questions_raw = []
    
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page_idx, page in enumerate(pdf.pages):
            # Pula folha de rosto e redação se for o caso
            text = page.extract_text(layout=False) or ""
            full_text += f"\n\n[PAGE_{page_idx+1}]\n\n" + text

    # Normaliza headers tipo QUESTãO, QUESTÃO, etc.
    normalized = re.sub(r'QUEST[ãaÃÁáA\s]*O\s*0*(\d+)', r'###QUESTAO_\1###', full_text, flags=re.IGNORECASE)
    
    # Divide por questão
    parts = normalized.split("###QUESTAO_")
    
    parsed = []
    
    for part in parts[1:]:
        header_match = re.match(r'^(\d+)###([\s\S]*)', part)
        if not header_match:
            continue
        
        q_num = int(header_match.group(1))
        content = header_match.group(2).strip()
        
        # Limpa rodapés e cabeçalhos de página tipo "LINGUAGENS, CÓDIGOS..." ou "[PAGE_X]"
        content = re.sub(r'\[PAGE_\d+\]', '', content)
        content = re.sub(r'LINGUAGENS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA)\s*\d*', '', content, flags=re.IGNORECASE)
        content = re.sub(r'CIÊNCIAS[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', content, flags=re.IGNORECASE)
        content = re.sub(r'MATEMÁTICA[\s\S]*?(AZUL|AMARELO|BRANCO|ROSA|CINZA)\s*\d*', '', content, flags=re.IGNORECASE)
        content = content.strip()
        
        # Procura alternativas A, B, C, D, E
        # Geralmente começam com A ..., B ..., C ..., D ..., E ...
        alt_pattern = r'(?:^|\n)\s*([A-E])\s+([\s\S]*?)(?=(?:(?:^|\n)\s*[A-E]\s+)|$)'
        alt_matches = list(re.finditer(alt_pattern, content))
        
        if len(alt_matches) >= 5:
            # Pega as últimas 5 correspondências (A, B, C, D, E)
            selected_alts = alt_matches[-5:]
            alternativas = [m.group(2).strip().replace('\n', ' ') for m in selected_alts]
            
            # O enunciado é tudo antes da alternativa A
            enunciado_end = selected_alts[0].start()
            enunciado = content[:enunciado_end].strip().replace('\n', ' ')
            
            parsed.append({
                "numero": q_num,
                "enunciado": enunciado,
                "alternativas": alternativas
            })
        else:
            # Caso não consiga separar 5 alternativas perfeitamente
            parsed.append({
                "numero": q_num,
                "enunciado": content,
                "alternativas": []
            })
            
    return parsed

if __name__ == "__main__":
    d1_qs = extract_questions_from_pdf("temp_provas/2025_PV_D1_CD1.pdf")
    print(f"Total D1 processadas: {len(d1_qs)}")
    valid_alts = sum(1 for q in d1_qs if len(q["alternativas"]) == 5)
    print(f"Com 5 alternativas identificadas: {valid_alts}/{len(d1_qs)}")
    if d1_qs:
        print("\nExemplo Q6:")
        q6 = next((q for q in d1_qs if q["numero"] == 6), None)
        if q6:
            print("Enunciado:", q6["enunciado"][:200])
            print("Alternativas:", q6["alternativas"])
