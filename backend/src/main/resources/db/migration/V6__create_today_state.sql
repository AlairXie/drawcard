CREATE TABLE today_state (
    user_id       BIGINT PRIMARY KEY,
    card_id       VARCHAR(36) NOT NULL,
    duration_min  INTEGER NOT NULL,
    rerolled      BOOLEAN NOT NULL DEFAULT FALSE,
    mode          ENUM('mixed','single') NOT NULL,
    direction     VARCHAR(20),
    started_at    BIGINT,
    end_at        BIGINT,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (card_id) REFERENCES cards(id)
);
