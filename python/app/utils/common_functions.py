## DE-DUPLICATION_LOGIC
from typing import List, Set

from models.card_models import Card


def deduplicate_cards(cards: List[Card]) -> List[Card]:
    seen_words: Set[str] = set()
    unique_cards: List[Card] = []

    for card in cards:
        if card.word not in seen_words:
            seen_words.add(card.word)
            unique_cards.append(card)

    return unique_cards
