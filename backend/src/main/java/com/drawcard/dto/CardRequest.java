package com.drawcard.dto;

import com.drawcard.enums.CardTier;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class CardRequest {

    @NotNull
    private CardTier tier;

    @NotBlank
    @Size(max = 20)
    private String direction;

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    private String instruction;

    @NotBlank
    private String expectedOutputHint;

    private List<String> tags;

    private Boolean enabledToday;
}
