from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import date
import sqlite3
import os

app = Flask(__name__)
CORS(app)

DB_PATH = os.path.join(os.path.dirname(__file__), 'books.db')

def get_db_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection

def init_db():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            publisher TEXT NOT NULL,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            Cost REAL NOT NULL,
            edition TEXT NOT NULL DEFAULT 'Standard edition'
        )
    ''')
    columns = {row['name'] for row in cursor.execute("PRAGMA table_info(book)")}
    if 'edition' not in columns:
        cursor.execute("ALTER TABLE book ADD COLUMN edition TEXT NOT NULL DEFAULT 'Standard edition'")
    connection.commit()
    connection.close()


def get_book_data(payload):
    if not request.is_json:
        return None, (jsonify({'error': 'Request must be JSON'}), 400)

    if payload is None or payload == {}:
        return None, (jsonify({'error': 'Missing request body'}), 400)

    for field in ('publisher', 'name', 'date'):
        if not payload.get(field):
            return None, (jsonify({'error': f'Missing field: {field}'}), 400)

    cost = payload.get('Cost', payload.get('cost'))
    if cost is None:
        return None, (jsonify({'error': 'Missing field: cost'}), 400)
    try:
        cost = float(cost)
    except (TypeError, ValueError):
        return None, (jsonify({'error': 'Invalid cost'}), 400)

    try:
        date.fromisoformat(payload['date'])
    except (TypeError, ValueError):
        return None, (jsonify({'error': 'Invalid date format'}), 400)

    return {
        'publisher': payload['publisher'],
        'name': payload['name'],
        'date': payload['date'],
        'Cost': cost,
        'edition': payload.get('edition') or 'Standard edition'
    }, None


def book_response(book):
    book = dict(book)
    return {
        'id': book.get('id'),
        'publisher': book.get('publisher'),
        'name': book.get('name'),
        'date': book.get('date'),
        'cost': book.get('Cost', book.get('cost')),
        'edition': book.get('edition') or 'Standard edition'
    }


init_db()

@app.route('/', methods=['GET'])
def get_books():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM book")
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify([book_response(row) for row in rows])

@app.route('/create', methods=['POST'])
def create_books():
    new_book, error = get_book_data(request.get_json(silent=True))
    if error:
        return error
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "INSERT INTO book (publisher, name, date, Cost, edition) VALUES (?, ?, ?, ?, ?)",
        (new_book['publisher'], new_book['name'], new_book['date'], new_book['Cost'], new_book['edition'])
    )
    new_book['id'] = cursor.lastrowid
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify(book_response(new_book)), 201

@app.route('/update/<int:id>', methods=['PUT'])
def update_book(id):
    updated_book, error = get_book_data(request.get_json(silent=True))
    if error:
        return error
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE book SET publisher=?, name=?, date=?, Cost=?, edition=? WHERE id=?",
        (updated_book['publisher'], updated_book['name'], updated_book['date'], updated_book['Cost'], updated_book['edition'], id)
    )
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({'error': 'Book not found'}), 404
    updated_book['id'] = id
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify(book_response(updated_book))

@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_book(id):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM book WHERE id=?", (id,))
    if cursor.rowcount == 0:
        connection.close()
        return jsonify({'error': 'Book not found'}), 404
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'result': 'Book deleted', 'message': 'Book deleted successfully'})


@app.route('/health', methods=['GET'])
def health_check():
    try:
        connection = get_db_connection()
        connection.execute('SELECT 1')
        connection.close()
        return jsonify({'status': 'healthy'})
    except Exception:
        return jsonify({'status': 'unhealthy'}), 503


@app.errorhandler(404)
def handle_not_found(error):
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(405)
def handle_method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405


@app.errorhandler(Exception)
def handle_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)
