CREATE TABLE cards (
    id                   VARCHAR(36) PRIMARY KEY,
    user_id              BIGINT,
    tier                 ENUM('S','M','L') NOT NULL,
    direction            VARCHAR(20) NOT NULL,
    title                VARCHAR(100) NOT NULL,
    instruction          TEXT NOT NULL,
    expected_output_hint TEXT NOT NULL,
    tags                 JSON,
    enabled_today        BOOLEAN DEFAULT TRUE,
    is_default           BOOLEAN DEFAULT FALSE,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
