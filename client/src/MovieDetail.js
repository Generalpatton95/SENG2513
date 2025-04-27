import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Direct endpoint for movie details
    fetch(`/api/movie/${movieId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Movie data received:", data);
        setMovie(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch movie details:", error);
        
        // Fallback: try to find the movie in all categories
        Promise.all([
          fetch('/api/movie/boxoffice').then(res => res.ok ? res.json() : []),
          fetch('/api/movie/popular').then(res => res.ok ? res.json() : []),
          fetch('/api/movie/top250').then(res => res.ok ? res.json() : [])
        ])
        .then(([boxOffice, popular, top250]) => {
          // Combine all results and look for the movie
          const allMovies = [...boxOffice, ...popular, ...top250];
          const foundMovie = allMovies.find(m => m.id === movieId);
          
          if (foundMovie) {
            setMovie(foundMovie);
            setLoading(false);
          } else {
            setError("Movie not found");
            setLoading(false);
          }
        })
        .catch(fallbackError => {
          setError("Failed to load movie: " + fallbackError.message);
          setLoading(false);
        });
      });
  }, [movieId]);

  if (loading) return <div className="loading">Loading movie details...</div>;
  if (error) return (
    <div className="error-container">
      <div className="error-message">Error: {error}</div>
      <Link to="/" className="back-link">Return to Home</Link>
    </div>
  );
  if (!movie) return (
    <div className="error-container">
      <div className="error-message">Movie not found</div>
      <Link to="/" className="back-link">Return to Home</Link>
    </div>
  );

  return (
    <div className="movie-details-container">
      <div className="back-button">
        <Link to="/">← Back to Movies</Link>
      </div>
      
      <div className="movie-details-content">
        <div className="movie-poster-large">
          {movie.primaryImage ? (
            <img
              src={movie.primaryImage}
              alt={movie.primaryTitle || "Movie Poster"}
            />
          ) : (
            <div className="placeholder-poster">No Poster Available</div>
          )}
        </div>
        
        <div className="movie-info">
          <h1>{movie.primaryTitle}</h1>
          
          {movie.releaseDate && (
            <div className="info-row">
              <span className="label">Release Year:</span>
              <span>{movie.releaseDate}</span>
            </div>
          )}
          
          {movie.runtimeMinutes && (
            <div className="info-row">
              <span className="label">Runtime:</span>
              <span>{movie.runtimeMinutes} minutes</span>
            </div>
          )}
          
          {movie.genres && movie.genres.length > 0 && (
            <div className="info-row">
              <span className="label">Genres:</span>
              <span>{movie.genres.join(", ")}</span>
            </div>
          )}
          
          {movie.averageRating && (
            <div className="info-row">
              <span className="label">IMDb Rating:</span>
              <span>{movie.averageRating}/10</span> 
            </div>
          )}
          
          {movie.description && (
            <div className="movie-description">
              <h3>Description</h3> 
              <p>{movie.description}</p>
            </div>
          )}
          
          {movie.cast && movie.cast.length > 0 && (
            <div className="movie-cast">
              <h3>Cast</h3>
              <ul>
                {movie.cast.slice(0, 5).map((actor, index) => (
                  <li key={index}>{actor}</li>
                ))}
              </ul>
            </div>
          )}
          
          
          {movie.directors && movie.directors.length > 0 && (
            <div className="movie-directors">
              <h3>Directors</h3>
              <ul>
              {movie.directors.map((director, index) => (
                  <li key={index}>{director}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;