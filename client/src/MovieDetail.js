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
    // Only fetch if we have a movieId
    if (!movieId) {
      setError("No movie ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    // Set a timeout in case the API request hangs
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Request timed out. The API may be experiencing issues.");
    }, 10000);
    
    // Fetch movie details
    fetch(`${API_BASE_URL}/api/movie/${movieId}`)
      .then(response => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMovie(data);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error("Error fetching movie details:", err);
        setError(`Failed to load movie details: ${err.message}`);
        setLoading(false);
      });
      
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
            {/* Cast section */}
            {movie.cast && movie.cast.length > 0 && (
              <section className="movie-cast">
                <h2>Cast</h2>
                <div className="cast-list">
                  {movie.cast.map((cast, index) => (
                    <div key={index} className="cast-member">
                      <div className="cast-info">
                        <p className="cast-name">{cast.fullName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Crew/Directors section */}
            {(movie.directors || movie.writers) && (
              <section className="movie-crew">
                {movie.directors && (
                  <div className="crew-section">
                    <h2>Director{movie.directors.split(',').length > 1 ? 's' : ''}</h2>
                    <p>{movie.directors}</p>
                  </div>
                )}
                
                {movie.writers && (
                  <div className="crew-section">
                    <h2>Writer{movie.writers.split(',').length > 1 ? 's' : ''}</h2>
                    <p>{movie.writers}</p>
                  </div>
                )}
              </section>
            )}
            
            {/* Additional information section */}
            <section className="movie-additional">
              <div className="additional-grid">
               
                
                {movie.runtimeMinutes && (
                  <div className="additional-item">
                    <h3>Runtime Minutes</h3>
                    <p>{formatRuntime(movie.runtimeMinutes)} </p>
                  </div>
                )}
                
                {movie.releaseDate && (
                  <div className="additional-item">
                    <h3>Release Date</h3>
                    <p>{movie.releaseDate}</p>
                  </div>
                )}
                
                {movie.budget && (
                  <div className="additional-item">
                    <h3>Budget</h3>
                    <p>{movie.budget}</p>
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