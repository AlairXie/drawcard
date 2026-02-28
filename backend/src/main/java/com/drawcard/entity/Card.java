package com.drawcard.entity;

import com.drawcard.enums.CardTier;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Card {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardTier tier;

    @Column(nullable = false, length = 20)
    private String direction;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String instruction;

    @Column(name = "expected_output_hint", nullable = false, columnDefinition = "TEXT")
    private String expectedOutputHint;

    @Column(columnDefinition = "JSON")
    private String tags;

    @Column(name = "enabled_today")
    @Builder.Default
    private Boolean enabledToday = true;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
