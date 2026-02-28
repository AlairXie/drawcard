package com.drawcard.service;

import com.drawcard.dto.CardRequest;
import com.drawcard.entity.Card;
import com.drawcard.repository.CardRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private static final ObjectMapper MAPPER = new ObjectMapper();

    public List<Card> listCards(Long userId, String direction) {
        if (direction != null && !direction.isBlank()) {
            return cardRepository.findByUserIdAndDirectionOrderByCreatedAtDesc(userId, direction);
        }
        return cardRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Card createCard(Long userId, CardRequest req) {
        Card card = Card.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .tier(req.getTier())
                .direction(req.getDirection())
                .title(req.getTitle())
                .instruction(req.getInstruction())
                .expectedOutputHint(req.getExpectedOutputHint())
                .tags(toJson(req.getTags()))
                .enabledToday(req.getEnabledToday() != null ? req.getEnabledToday() : true)
                .isDefault(false)
                .build();
        return cardRepository.save(card);
    }

    public Card updateCard(Long userId, String cardId, CardRequest req) {
        Card card = findOwned(userId, cardId);
        card.setTier(req.getTier());
        card.setDirection(req.getDirection());
        card.setTitle(req.getTitle());
        card.setInstruction(req.getInstruction());
        card.setExpectedOutputHint(req.getExpectedOutputHint());
        card.setTags(toJson(req.getTags()));
        if (req.getEnabledToday() != null) {
            card.setEnabledToday(req.getEnabledToday());
        }
        return cardRepository.save(card);
    }

    public void deleteCard(Long userId, String cardId) {
        Card card = findOwned(userId, cardId);
        cardRepository.delete(card);
    }

    public Card toggleEnabled(Long userId, String cardId) {
        Card card = findOwned(userId, cardId);
        card.setEnabledToday(!card.getEnabledToday());
        return cardRepository.save(card);
    }

    private Card findOwned(Long userId, String cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Card not found"));
        if (!userId.equals(card.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your card");
        }
        return card;
    }

    private String toJson(List<String> tags) {
        if (tags == null || tags.isEmpty()) return "[]";
        try {
            return MAPPER.writeValueAsString(tags);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }
}
