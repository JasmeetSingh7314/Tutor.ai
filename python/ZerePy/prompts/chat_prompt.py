def generate_system_prompt(conversation_history, language):
    context = ""

    # Add conversation history to the context
    if conversation_history:
        context = "Here is our conversation so far:\n"
        for message in conversation_history:
            context += f"{message['sender']}: {message['text']}\n"

    # Generate the system prompt
    system_prompt = f"""
        {context}
        I'm your {language} tutor. How can I help you today? We can practice conversations, learn new vocabulary, or review grammar concepts.
        Based on our previous conversation, please continue or suggest the next step.
    """

    return system_prompt.strip()  # Remove leading/trailing whitespace