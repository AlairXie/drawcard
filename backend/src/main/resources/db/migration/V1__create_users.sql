CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50) NOT NULL UNIQUE,
    password    VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- default single-player user
INSERT INTO users (id, username) VALUES (1, 'player');
