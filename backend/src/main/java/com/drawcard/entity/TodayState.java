package com.drawcard.entity;

import com.drawcard.enums.GameMode;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "today_state")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TodayState {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "card_id", nullable = false, length = 36)
    private String cardId;

    @Column(name = "duration_min", nullable = false)
    private Integer durationMin;

    @Column(nullable = false)
    @Builder.Default
    private Boolean rerolled = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameMode mode;

    @Column(length = 20)
    private String direction;

    @Column(name = "started_at")
    private Long startedAt;

    @Column(name = "end_at")
    private Long endAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
