package com.drawcard.entity;

import com.drawcard.enums.CardTier;
import com.drawcard.enums.GameMode;
import com.drawcard.enums.RunOutcome;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "run_records", indexes = {
    @Index(name = "idx_user_date", columnList = "user_id, date"),
    @Index(name = "idx_user_mode", columnList = "user_id, game_mode")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RunRecord {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "started_at", nullable = false)
    private Long startedAt;

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin;

    @Column(name = "card_id", nullable = false, length = 36)
    private String cardId;

    @Column(name = "card_title", nullable = false, length = 100)
    private String cardTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "card_tier", nullable = false)
    private CardTier cardTier;

    @Column(name = "output_text", nullable = false, columnDefinition = "TEXT")
    private String outputText;

    @Column(name = "output_link", length = 500)
    private String outputLink;

    @Column(name = "screenshot_note", columnDefinition = "TEXT")
    private String screenshotNote;

    @Column(name = "file_path", length = 500)
    private String filePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RunOutcome result;

    @Enumerated(EnumType.STRING)
    @Column(name = "game_mode", nullable = false)
    private GameMode gameMode;

    @Column(length = 20)
    private String direction;

    @Column(name = "star_delta", nullable = false)
    @Builder.Default
    private Integer starDelta = 0;

    @Column(name = "rank_name", nullable = false, length = 10)
    private String rankName;

    @Column(nullable = false)
    @Builder.Default
    private Integer stars = 0;

    @Column(name = "peak_delta")
    private Integer peakDelta;

    @Column(name = "peak_score")
    private Integer peakScore;

    @Column(name = "is_life_mode", nullable = false)
    @Builder.Default
    private Boolean isLifeMode = false;

    @Column(name = "used_shield", nullable = false)
    @Builder.Default
    private Boolean usedShield = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
