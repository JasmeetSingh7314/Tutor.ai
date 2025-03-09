def generate_card_prompt(lang: str, level: str, knownwords: str) -> str:
    return f"""You are a {lang} vocabulary teacher. Generate 2 vocabulary cards for {level}-level learners. 
    - MAKE SURE TO NOT REPEAT THESE WORDS: {knownwords} 
    - Return STRICTLY in JSON format.  
    - Use the appropriate script for the word in sentences (e.g., Kanji for Japanese, Hanzi for Chinese, etc.).  
    - Sentences must use the word naturally.  
    - Never use placeholders like "...".  
    - Ensure NO REPEATED WORDS OR SENTENCES.  
    - Do NOT include Markdown code blocks (e.g., ```json) or any other formatting.  
    - Follow the structure of the `VocabularyCards` class provided below:  

    {{
        "summary": "A brief summary of the vocabulary lesson, highlighting the key words and their usage.",
        "vocab": [
            {{
                "word_details": {{
                    "word": "aprender",
                    "reading": "a-pren-der",
                    "meaning": "to learn",
                    "components": ["a", "prender"],
                    "component_meanings": ["to", "grasp or seize"],
                    "literal_meaning": "to grasp knowledge"
                }},
                "pronunciation_guide": {{
                    "guide": "1. Break it into syllables: 'a' (ah), 'pren' (pren), 'der' (der). 2. Stress the second syllable 'pren'.",
                    "tips": "Practice rolling the 'r' sound in 'pren' and 'der' for better pronunciation."
                }},
                "usage_examples": {{
                    "examples": ["Voy a aprender español este año.", "Ella quiere aprender a cocinar."],
                    "dialogues": ["A: ¿Qué quieres aprender? B: Quiero aprender a tocar la guitarra."]
                }},
                "formal_vs_informal": {{
                    "formal": "aprender (used in all contexts, formal and informal)",
                    "informal": "aprenderse (less common, used colloquially in some regions)"
                }},
                "variations": {{
                    "variations": ["aprendizaje", "aprendido", "aprendiz"]
                }},
                "writing_guide": {{
                    "guide": "1. Write 'a' (a single letter). 2. Write 'prender' (p-r-e-n-d-e-r).",
                    "tips": "Remember that 'aprender' has two 'r's, and the second one is rolled."
                }},
                "cultural_note": {{
                    "note": "In Spanish-speaking cultures, learning is highly valued, and education is often seen as a path to personal and professional growth."
                }},
                "practice_tips": {{
                    "tips": "Use flashcards to memorize the verb conjugations and practice using it in sentences daily."
                }}
            }},
            {{
                "word_details": {{
                    "word": "hablar",
                    "reading": "ha-blar",
                    "meaning": "to speak",
                    "components": ["ha", "blar"],
                    "component_meanings": ["to", "talk"],
                    "literal_meaning": "to talk"
                }},
                "pronunciation_guide": {{
                    "guide": "1. Break it into syllables: 'ha' (ah), 'blar' (blar). 2. Stress the first syllable 'ha'.",
                    "tips": "Practice the 'h' sound, which is silent in Spanish."
                }},
                "usage_examples": {{
                    "examples": ["Necesito hablar con mi profesor.", "Ellos hablan muy rápido."],
                    "dialogues": ["A: ¿Puedes hablar español? B: Sí, puedo hablar un poco."]
                }},
                "formal_vs_informal": {{
                    "formal": "hablar (used in all contexts, formal and informal)",
                    "informal": "hablarse (less common, used colloquially in some regions)"
                }},
                "variations": {{
                    "variations": ["hablante", "hablado", "habla"]
                }},
                "writing_guide": {{
                    "guide": "1. Write 'ha' (h-a). 2. Write 'blar' (b-l-a-r).",
                    "tips": "Remember that 'hablar' starts with a silent 'h'."
                }},
                "cultural_note": {{
                    "note": "In Spanish-speaking cultures, communication is highly valued, and speaking clearly is seen as a sign of respect."
                }},
                "practice_tips": {{
                    "tips": "Practice speaking with native speakers or language partners to improve fluency."
                }}
            }}
        ]
    }}"""