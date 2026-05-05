CREATE DATABASE bank_db;

USE bank_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(100),
    balance INT DEFAULT 1000
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender VARCHAR(50),
    receiver VARCHAR(50),
    amount INT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
