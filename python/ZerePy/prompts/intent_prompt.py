def generate_intent_prompt(prompt: str):
    return f"""
        Classify the following user input into one of these intents:
        - lesson: The user wants to start or continue a lesson. Examples: "Start a lesson", "Teach me something new", "Continue my lesson".
        - quiz: The user wants to take a quiz. Examples: "Give me a quiz", "Test my knowledge", "I want to take a test".
        - word meanings: The user wants to learn the meaning of a word. Examples: "What does this word mean?", "Define this term", "Explain this word".
        - progress: The user wants to check their learning progress. Examples: "Show me my progress", "How am I doing?", "What's my current level?".
        - general: The input is unrelated to learning, nonsensical, or unclear. Examples: "Hello", "What's the weather?", "Tell me a joke".

        Rules:
        1. If the input clearly matches one of the intents (lesson, quiz, word meanings, progress), classify it accordingly.
        2. If the input is unrelated, nonsensical, or unclear, classify it as "general".
        3. Return ONLY the intent (lesson, quiz, word meanings, progress, or general). DO NOT include any additional text, explanations, or examples.
        4. Ensure the output is EXACTLY one word representing the intent. DO NOT repeat the word or add any other content.
        5. Ensure the output is EXACTLY one word representing the intent. DO NOT repeat the word or add any other content.
        6. Ensure the output is EXACTLY one word representing the intent. DO NOT repeat the word or add any other content.
        User Input: "{prompt}"
        """