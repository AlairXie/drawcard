package com.drawcard.entity;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PeakStatsId implements Serializable {
    private Long userId;
    private String direction;
}
