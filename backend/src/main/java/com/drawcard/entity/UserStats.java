package com.drawcard.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserStats {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "rank_index", nullable = false)
    @Builder.Default
    private Integer rankIndex = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer stars = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer streak = 0;

    @Column(name = "total_runs", nullable = false)
    @Builder.Default
    private Integer totalRuns = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer wins = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer losses = 0;

    @Column(name = "last_completed_date")
    private LocalDate lastCompletedDate;

    @Column(name = "last_shield_date")
    private LocalDate lastShieldDate;

    @Column(nullable = false)
    @Builder.Default
    private Integer coins = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer xp = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
