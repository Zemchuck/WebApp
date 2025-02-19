from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import db

import schemas
import models

app = FastAPI()
app.mount("/static", StaticFiles(directory="../ui/build/static", check_dir=False), name="static")

@app.get("/")
def serve_react_app():
    return FileResponse("../ui/build/index.html")


@app.get("/movies", response_model=List[schemas.Movie])
def get_movies():
    return list(models.Movie.select())


@app.post("/movies", response_model=schemas.Movie)
# def add_movie(movie: schemas.Movie):
#     movie = models.Movie.create(**movie.dict())
#     return movie
def add_movie(movie: schemas.MovieCreate):
    db_movie = models.Movie.create(
        title=movie.title,
        year=movie.year,
        director=movie.director,
        description=movie.description
    )
    for actor_id in movie.actors:
        db_actor = models.Actor.get_or_none(models.Actor.id == actor_id)
        if db_actor:
            db_movie.actors.add(db_actor)
    return db_movie

@app.get("/movies/{movie_id}", response_model=schemas.Movie)
def get_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    return db_movie


@app.delete("/movies/{movie_id}", response_model=schemas.Movie)
def delete_movie(movie_id: int):
    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")
    db_movie.delete_instance()
    return db_movie

@app.get("/actors/", response_model=List[schemas.Actor])
def get_actors():
    db_actors = list(models.Actor.select())
    if not db_actors:
        raise HTTPException(status_code=404, detail="Actors not found")
    return db_actors

@app.get("/actors/{actor_id}", response_model=schemas.Actor)
def get_actor(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    return db_actor

@app.post("/actors", response_model=schemas.Actor)
def add_actor(actor: schemas.ActorBase):
     db_actor = models.Actor.create(**actor.dict())
     return db_actor

@app.delete("/actors/{actor_id}", response_model=schemas.Actor)
def delete_actor(actor_id: int):
    db_actor = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actor is None:
        raise HTTPException(status_code=404, detail="Actor not found")
    db_actor.delete_instance()
    return db_actor

@app.post("/movies/{movie_id}/actor", response_model=schemas.Movie)
def add_actor_to_movie(movie_id: int, actor_id: int):

    db_movie = models.Movie.filter(models.Movie.id == movie_id).first()
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Movie not found")

    #get actor
    db_actors = models.Actor.filter(models.Actor.id == actor_id).first()
    if db_actors is None:
        raise HTTPException(status_code=404, detail="Actor not found")

    #check
    if db_actors in db_movie.actors:
        raise HTTPException(status_code=400, detail="Actor is already assigned to this movie")

    db_movie.actors.add(db_actors)

    return db_movie