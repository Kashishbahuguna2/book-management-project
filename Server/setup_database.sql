-- SQLite Database Setup for Flask CRUD App
-- SQLite database (books.db) is auto-created by Flask on first run.
-- This script is provided for reference only.

-- Create the book table
CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    publisher TEXT NOT NULL,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    Cost REAL NOT NULL,
    edition TEXT NOT NULL DEFAULT 'Standard edition'
);

-- Insert sample data for testing
INSERT INTO book (publisher, name, date, Cost, edition) VALUES
('Penguin Random House', 'Python Crash Course', '2023-01-15', 299.99, '3rd edition'),
('O''Reilly Media', 'Learning Flask', '2023-06-20', 399.50, '2nd edition'),
('Manning Publications', 'Flask Web Development', '2024-03-10', 449.00, 'Limited edition');
