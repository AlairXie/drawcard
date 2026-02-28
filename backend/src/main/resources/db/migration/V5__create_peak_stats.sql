CREATE TABLE peak_stats (
    user_id              BIGINT NOT NULL,
    direction            VARCHAR(20) NOT NULL,
    score                INT NOT NULL DEFAULT 0,
    streak               INT NOT NULL DEFAULT 0,
    total_runs           INT NOT NULL DEFAULT 0,
    wins                 INT NOT NULL DEFAULT 0,
    losses               INT NOT NULL DEFAULT 0,
    last_completed_date  DATE,
    last_shield_date     DATE,
    updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, direction),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- initialize peak stats for default player (all 3 directions)
INSERT INTO peak_stats (user_id, direction) VALUES (1, '职业发展');
INSERT INTO peak_stats (user_id, direction) VALUES (1, '技术能力');
INSERT INTO peak_stats (user_id, direction) VALUES (1, '复盘');
