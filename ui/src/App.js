import './App.css';
import {useEffect, useState} from "react";
import "milligram";
import MovieForm from "./MovieForm";
import MoviesList from "./MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [addingMovie, setAddingMovie] = useState(false);
    const [actors, setActors] = useState([]);
    const [addingActors, setAddingActors] = useState(false);


//Show movies function
    useEffect (() => {
        async function fetchMovies() {
            const response = await fetch('/movies');
            if (response.ok) {
                const movies = await response.json();
                setMovies(movies);
            }
        }
        fetchMovies();
    }, 
    []);
// Add movie function
async function handleAddMovie(movie) {
    const response = await fetch('/movies', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
            'Content-Type': 'application/json'}
        });
    if (response.ok) {
        const movieFromServer = await response.json();
        setMovies([...movies, movieFromServer]);
        setAddingMovie(false);
    }
}
// Delete movie function
    async function handleDeleteMovie(movie){
        const response = await fetch(`/movies/${movie.id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const nextMovies = movies.filter(m => m !== movie);
            setMovies(nextMovies);
        }
    }

//Show actors function
    useEffect(() => {
        async function fetchActors() {
            const response = await fetch('/actors/');
            if (response.ok) {
                const actors = await response.json();
                setActors(actors); 
            }
        }
        fetchActors();
    }, []);

    return (
        <div className="container">
            <h1>My favourite movies to watch</h1>
            {movies.length === 0
                ? <p>No movies yet. Maybe add something?</p>
                : <MoviesList movies={movies}
                                actors={actors}
                              onDeleteMovie={handleDeleteMovie}
                />}

            {addingMovie
                ? <MovieForm onMovieSubmit={handleAddMovie}
                             buttonLabel="Add a movie"
                />
                : <button onClick={() => setAddingMovie(true)}>Add a movie</button>
                }
        </div>
    );
}

export default App;
