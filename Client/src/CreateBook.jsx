import axios from 'axios'//core react library for building user interface
import {useState} from 'react'//for making requests to your backend server
import { useNavigate } from 'react-router-dom' // useNavigate use to navigate to different routes

const CreateBook = () => { // defined the functional component named createbook
    const [ values, setValues] = useState({
        publisher:"",
        name:"",
        date:'',
        Cost:'',
        edition:''
    })
    const navigate = useNavigate() // navigate to the home page
    const handleSubmit= (e) =>{    // event handler to handle form submission
        e.preventDefault()        // prevent default form submission
        axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/create`, values) // sends the post request to the server
        .then(() => navigate('/'))                        // on successful response user will be navigated to the home page
        .catch(err => console.log(err))                    //logs error occur during request
    }
    return ( // div container contain flexbox classes to centring content
        <main className="form-shell">
            <form className="form-card wt-50" onSubmit={handleSubmit}>
                <p className="eyebrow">NEW CATALOGUE ENTRY</p>
                <h2>Add a Book</h2>
                <div className="form-grid">
                <div className="form-field">
                    <label htmlFor="Publisher">Publisher</label>
                    <input type="text" 
                    className="form-control"
                    placeholder="Enter Publisher name" 
                    name="publisher" 
                    onChange={(e)=> setValues({...values, publisher: e.target.value})}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Book name">Book name:</label>
                    <input type="text" 
                    className="form-control"
                    placeholder="Enter Book name" 
                    name="name" 
                    onChange={(e)=> setValues({...values, name: e.target.value})}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Publish date">Publish Date:</label>
                    <input type="date" 
                     className="form-control"
                    name="date"
                    onChange={(e)=> setValues({...values, date: e.target.value})}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Cost">cost:</label>
                    <input type="text" 
                     className="form-control"
                    name="Cost" 
                    onChange={(e)=> setValues({...values, Cost: e.target.value})}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="Edition">Edition</label>
                    <input type="text" className="form-control" placeholder="e.g. 2nd edition" name="edition"
                        onChange={(e) => setValues({...values, edition: e.target.value})}
                    />
                </div>
                </div>
                <div className="form-actions">
                    <button type="submit" className="primary-action btn btn-primary">Submit</button>
                </div>
            </form>
        </main>
    )
}

export default CreateBook