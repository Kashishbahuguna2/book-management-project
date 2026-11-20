import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UpdateBook = () => {
    const location = useLocation();
    const book = location.state?.book;

    const [values, setValues] = useState({
        publisher: book?.publisher || '',
        name: book?.name || '',
        date: book?.date || '',
        Cost: book?.cost ?? book?.Cost ?? '',
        edition: book?.edition || ''
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!book) {
            return;
        }
        axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/update/${book.id}`, values)
            .then(() => navigate('/'))
            .catch(err => console.log(err));
    }

    if (!book) {
        return <p className="text-center mt-3">Select a book to update.</p>;
    }

    return (
        <main className="form-shell">
            <form className="form-card wt-50" onSubmit={handleSubmit}>
                <p className="eyebrow">EDIT CATALOGUE ENTRY</p>
                <h2>Update Book</h2>
                <div className="form-grid">
                <div className="form-field">
                    <label htmlFor="Publisher">Publisher</label>
                    <input type="text"
                        className="form-control"
                        placeholder="Enter Publisher name"
                        name="publisher"
                        value={values.publisher}
                        onChange={(e) => setValues({ ...values, publisher: e.target.value })}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Book name">Book name:</label>
                    <input type="text"
                        className="form-control"
                        placeholder="Enter Book name"
                        name="name"
                        value={values.name}
                        onChange={(e) => setValues({ ...values, name: e.target.value })}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Publish date">Publish Date:</label>
                    <input type="date"
                        className="form-control"
                        name="date"
                        value={values.date}
                        onChange={(e) => setValues({ ...values, date: e.target.value })}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Cost">cost:</label>
                    <input type="text"
                        className="form-control"
                        placeholder="Rupees"
                        name="Cost"
                        value={values.Cost}
                        onChange={(e) => setValues({ ...values, Cost: e.target.value })}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Edition">Edition</label>
                    <input type="text" className="form-control" placeholder="e.g. 2nd edition" name="edition"
                        value={values.edition}
                        onChange={(e) => setValues({ ...values, edition: e.target.value })}
                    />
                </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="primary-action">Save changes</button>
                </div>
            </form>
        </main>
    );
}

export default UpdateBook;