import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loadBooks = useCallback(() => {
        setLoading(true);
        setError('');
        axios.get(API_URL)
            .then(res => setBooks(Array.isArray(res.data) ? res.data : []))
            .catch(() => setError('The catalogue could not be loaded. Check that the server is running.'))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = (book) => {
        navigate('/update', { state: { book } });
    };

    const handleDelete = (bookId) => {
        axios.delete(`${API_URL}/delete/${bookId}`)
            .then(() => {
                setBooks(currentBooks => currentBooks.filter(book => book.id !== bookId));
            })
            .catch(() => setError('The book could not be deleted. Please try again.'));
    };

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    return (
        <main className="library-shell">
            <section className="library-hero">
                <div>
                    <p className="eyebrow">PERSONAL CATALOGUE</p>
                    <h1>Your reading shelf</h1>
                    <p className="hero-copy">Keep every title, edition, and publishing detail in one calm, searchable place.</p>
                </div>
                <Link to="/create" className="primary-action btn btn-success">Create Link</Link>
            </section>

            <section className="library-summary" aria-label="Catalogue summary">
                <div><span className="summary-label">Titles</span><strong>{books.length}</strong></div>
                <div><span className="summary-label">Editions tracked</span><strong>{books.filter(book => book.edition).length}</strong></div>
                <div><span className="summary-label">Catalogue status</span><strong className="status"><span /> {loading ? 'Syncing' : 'Up to date'}</strong></div>
            </section>

            {error && <div className="notice notice-error" role="alert">{error}</div>}

            <section className="catalogue-panel">
                <div className="panel-heading">
                    <div>
                        <p className="eyebrow">ALL TITLES</p>
                        <h2>Book catalogue</h2>
                    </div>
                    <button type="button" className="refresh-action" onClick={loadBooks} disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {loading ? <p className="empty-state">Loading your catalogue...</p> : books.length === 0 ?
                    <div className="empty-state"><h2>No records</h2><strong>Your shelf is waiting.</strong><span>Add your first book to start building the catalogue.</span><Link to="/create" className="text-action">Add the first book</Link></div> :
                    <div className="table-wrap"><table className="catalogue-table table">
                        <thead><tr><th>Publisher</th><th>Book</th><th>Date</th><th>cost</th><th>Edition</th><th>Actions</th></tr></thead>
                        <tbody>{books.map(book => <tr key={book.id}>
                            <td>{book.publisher}</td>
                            <td><strong>{book.name}</strong><small>Book #{book.id}</small></td>
                            <td>{book.date}</td>
                            <td>{book.cost}</td>
                            <td><span className="edition-tag">{book.edition || 'Standard edition'}</span></td>
                            <td className="row-actions"><button type="button" className="table-action btn btn-primary" onClick={() => handleUpdate(book)}>Update</button><button type="button" className="table-action danger btn btn-danger" onClick={() => handleDelete(book.id)}>Delete</button></td>
                        </tr>)}</tbody>
                    </table></div>
                }
            </section>
        </main>
    );
}

export default Books;