package com.drawcard.dto;

import com.drawcard.entity.Card;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CardResponse {
    private String id;
    private String tier;
    private String direction;
    private String title;
    private String instruction;
    private String expectedOutputHint;
    private List<String> tags;
    private Boolean enabledToday;
    private Boolean isDefault;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static CardResponse from(Card card) {
        List<String> tagList = List.of();
        if (card.getTags() != null && !card.getTags().isBlank()) {
            try {
                tagList = MAPPER.readValue(card.getTags(), new TypeReference<>() {});
            } catch (Exception ignored) {}
        }

        return CardResponse.builder()
                .id(card.getId())
                .tier(card.getTier().name())
                .direction(card.getDirection())
                .title(card.getTitle())
                .instruction(card.getInstruction())
                .expectedOutputHint(card.getExpectedOutputHint())
                .tags(tagList)
                .enabledToday(card.getEnabledToday())
                .isDefault(card.getIsDefault())
                .build();
    }
}
