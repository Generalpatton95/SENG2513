// Add console logs to debug API response
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './MovieDetail.css';

const MovieDetail = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API base URL
  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
    if (!movieId) {
      setError("No movie ID provided");
      setLoading(false);
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Request timed out. The API may be experiencing issues.");
    }, 10000);
  
    async function fetchMovie() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/movie/${movieId}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log("Received simple movie data:", data);
        setMovie(data);
        setLoading(false);
        clearTimeout(timeoutId);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(`Failed to load movie details: ${err.message}`);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    }
  
    fetchMovie();
  
    return () => clearTimeout(timeoutId);
  }, [movieId, API_BASE_URL]);
  



  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="not-found-container">
        <h2>Movie Not Found</h2>
        <p>We couldn't find any movie with the provided ID.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes || isNaN(minutes)) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Check if we have a valid object with the expected properties
  const hasValidData = movie && movie.primaryTitle;

  return (
    <div className="movie-detail-container">
      {!hasValidData ? (
        <div className="error-message">
          <p>Invalid movie data received from server.</p>
          <Link to="/" className="back-button">Back to Home</Link>
        </div>
      ) : (
        <>
          <div className="movie-detail-header" 
               style={{
                 backgroundImage: movie.primaryImage ? 
                   `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${movie.primaryImage})` : 
                   'linear-gradient(to right, #141e30, #243b55)'
               }}>
            <div className="movie-detail-content">
              <div className="movie-detail-poster">
                {movie.primaryImage ? (
                  <img src={movie.primaryImage} alt={movie.primaryTitle} />
                ) : (
                  <div className="no-poster">No Poster Available</div>
                )}
              </div>
              <div className="movie-detail-info">
                <h1>{movie.primaryTitle}</h1>
                
                <div className="movie-meta">
                  {movie.contentRating && <span className="movie-rating">{movie.contentRating}</span>}
                </div>
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="movie-genres">
                    {movie.genres.map((genre, index) => (
                      <span key={index} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                )}
                
                {movie.averageRating && (
                  <div className="movie-score">
                    <span className="score-value">{movie.averageRating}</span>
                    <span className="score-label">IMDb</span>
                  </div>
                )}
                
                {movie.description && (
                  <div className="movie-description">
                    <p>{movie.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="movie-detail-body">
            {/* Cast Section */}
            {movie.cast && movie.cast.length > 0 && (
              <section className="movie-cast">
                <h2>Cast</h2>
                <div className="cast-list">
                  {movie.cast.map((member, index) => (
                    <div key={index} className="cast-member">
                      <div className="cast-info">
                        <p className="cast-name">{member.fullName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Crew (Directors and Writers) Section */}
            {(movie.directors || movie.writers) && (
              <section className="movie-crew">
                {movie.directors && movie.directors.length > 0 && (
                  <div className="crew-section">
                    <h2>Director{movie.directors.length > 1 ? "s" : ""}</h2>
                    <p>{movie.directors.map(d => d.fullName).join(", ")}</p>
                  </div>
                )}

                {movie.writers && movie.writers.length > 0 && (
                  <div className="crew-section">
                    <h2>Writer{movie.writers.length > 1 ? "s" : ""}</h2>
                    <p>{movie.writers.map(w => w.fullName).join(", ")}</p>
                  </div>
                )}
              </section>
            )}

            {/* Additional Info Section */}
            <section className="movie-additional">
              <div className="additional-grid">
                {movie.runtimeMinutes && (
                  <div className="additional-item">
                    <h3>Runtime</h3>
                    <p>{formatRuntime(movie.runtimeMinutes)}</p>
                  </div>
                )}
                {movie.releaseDate && (
                  <div className="additional-item">
                    <h3>Release Date</h3>
                    <p>{new Date(movie.releaseDate).toLocaleDateString('en-US')}</p>
                  </div>
                )}
                {movie.budget && (
                  <div className="additional-item">
                    <h3>Budget</h3>
                    <p>${Number(movie.budget).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </section>
          </div>
          
          <div className="back-section">
            <Link to="/" className="back-button">Back to Home</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetail;