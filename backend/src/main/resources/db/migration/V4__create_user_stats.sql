CREATE TABLE user_stats (
    user_id              BIGINT PRIMARY KEY,
    rank_index           INTEGER NOT NULL DEFAULT 0,
    stars                INTEGER NOT NULL DEFAULT 0,
    streak               INT NOT NULL DEFAULT 0,
    total_runs           INT NOT NULL DEFAULT 0,
    wins                 INT NOT NULL DEFAULT 0,
    losses               INT NOT NULL DEFAULT 0,
    last_completed_date  DATE,
    last_shield_date     DATE,
    coins                INT NOT NULL DEFAULT 0,
    xp                   INT NOT NULL DEFAULT 0,
    updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- initialize stats for default player
INSERT INTO user_stats (user_id) VALUES (1);
