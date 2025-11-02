-- MySQL schema for exams module

CREATE DATABASE IF NOT EXISTS nxtc_exams;
USE nxtc_exams;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exams (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(100),
  difficulty VARCHAR(50),
  duration_minutes INT DEFAULT 20,
  total_questions INT DEFAULT 10,
  passing_score INT DEFAULT 60,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36),
  exam_id VARCHAR(100),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  score INT NULL,
  total_questions INT NULL,
  correct_answers INT NULL,
  time_taken_minutes INT NULL,
  suggestions TEXT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS exam_questions (
  id VARCHAR(50) PRIMARY KEY,
  session_id VARCHAR(36),
  question_text TEXT,
  choices JSON,
  correct_index INT,
  question_order INT,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id)
);

CREATE INDEX idx_exam_sessions_user ON exam_sessions(user_id);
CREATE INDEX idx_exam_questions_session ON exam_questions(session_id);
