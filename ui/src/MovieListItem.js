import { useState } from "react";

export default function MovieListItem(props) {
    const [selectedActor, setSelectedActor] = useState("");

    async function handleAddActorToMovie() {
        if (!selectedActor) return alert("Select actor!");

        const response = await fetch(`/movies/${props.movie.id}/actor?actor_id=${selectedActor}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({actor_id: selectedActor})
        });

        if (response.ok) {
            const updatedMovie = await response.json();
            props.onUpdateMovie(updatedMovie);
            alert("Actor sucessfully added to film!");
            setSelectedActor("");
        } else {
            alert("Failed to add actor to film!");
        }
    }
    return (
        <tr>
            <td>{props.movie.title}</td>
            <td>{props.movie.director}</td>
            <td>
                {props.movie.actors.length > 0
                    ? props.movie.actors.map(actor => `${actor.name} ${actor.surname}`).join(", ")
                    : "Brak aktorów"}
            </td>
            <td>{props.movie.description}</td>
            <td>
                <button className="delete-button" onClick={() => props.onDeleteMovie(props.movie)}>🗑 Delete Movie</button>
            </td>
        </tr>
    );
}