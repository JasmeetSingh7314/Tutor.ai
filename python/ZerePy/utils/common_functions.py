## DE-DUPLICATION_LOGIC
from typing import List, Set




def get_unique_cards(json_data):
    """
    Takes JSON data and returns an array of unique cards based on the 'word' field.
    """
    unique_cards = []
    seen_words = set()  # Track words we've already seen

    # Iterate through each card in the JSON data
    for card in json_data['vocab']:
        word = card['word_details']['word']
        
        # If the word hasn't been seen, add the card to the unique list
        if word not in seen_words:
            unique_cards.append(card)
            seen_words.add(word)  # Mark the word as seen

    return {"vocab":unique_cards}