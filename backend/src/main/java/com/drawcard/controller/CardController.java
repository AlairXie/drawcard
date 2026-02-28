package com.drawcard.controller;

import com.drawcard.dto.CardRequest;
import com.drawcard.dto.CardResponse;
import com.drawcard.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    private static final Long DEFAULT_USER_ID = 1L;

    @GetMapping
    public List<CardResponse> list(@RequestParam(required = false) String direction) {
        return cardService.listCards(DEFAULT_USER_ID, direction)
                .stream().map(CardResponse::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CardResponse create(@Valid @RequestBody CardRequest req) {
        return CardResponse.from(cardService.createCard(DEFAULT_USER_ID, req));
    }

    @PutMapping("/{id}")
    public CardResponse update(@PathVariable String id, @Valid @RequestBody CardRequest req) {
        return CardResponse.from(cardService.updateCard(DEFAULT_USER_ID, id, req));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        cardService.deleteCard(DEFAULT_USER_ID, id);
    }

    @PatchMapping("/{id}/toggle")
    public CardResponse toggle(@PathVariable String id) {
        return CardResponse.from(cardService.toggleEnabled(DEFAULT_USER_ID, id));
    }
}
