import MovieListItem from "./MovieListItem";

export default function MoviesList(props) {
    return (
        <div>
            <h2>Movies Base:</h2>
            <table className="movies-table">
                <thead>
                    <tr>
                        <th>Title:</th>
                        <th>Director:</th>
                        <th>Actors:</th>
                        <th>Description:</th>
                        <th>Actions:</th>
                    </tr>
                </thead>
                <tbody>
                    {props.movies.map(movie => (
                        <MovieListItem
                            key={movie.id}
                            movie={movie}
                            actors={props.actors}
                            onDeleteMovie={props.onDeleteMovie}
                            onUpdateMovie={props.onUpdateMovie}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
