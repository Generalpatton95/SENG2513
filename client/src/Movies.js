import React from "react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Home.css"; // Reuse the Home styles for cards

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const API_BASE_URL = "http://localhost:3001";

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const genreParam = searchParams.get('genre');

    let apiUrl;
    if (query) {
      apiUrl = `${API_BASE_URL}/api/movie/search?query=${encodeURIComponent(query)}`;
      if (genreParam) apiUrl += `&genre=${encodeURIComponent(genreParam)}`;
    } else if (genreParam) {
      apiUrl = `${API_BASE_URL}/api/movie/search?genre=${encodeURIComponent(genreParam)}`;
    } else {
      apiUrl = `${API_BASE_URL}/api/movie/popular`;
    }

    apiUrl += `&rows=25`;

    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Search request timed out.");
    }, 10000);

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(apiUrl, { signal })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMovies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeout);
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
        setLoading(false);
      });

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [location.search, API_BASE_URL]);

  const renderSearchInfo = () => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const genreParam = searchParams.get('genre');

    if (!query && !genreParam) {
      return <h2 style={{ marginBottom: "20px" }}>Popular Movies</h2>;
    }

    let message = "Results";
    if (query) message += ` for "${query}"`;
    if (genreParam) message += ` in ${genreParam} genre`;

    return <h2 style={{ marginBottom: "20px" }}>{message}</h2>;
  };

  if (loading) return <div className="home-container">Loading movies...</div>;
  if (error) return <div className="home-container">Error: {error}</div>;

  return (
    <div className="home-container">
      {renderSearchInfo()}

      {movies.length === 0 ? (
        <div>No movies found. Try different keywords or genres.</div>
      ) : (
        <div className="movie-grid-container">
          {movies.map((movie, index) => (
            <div key={movie.id || index} className="movie-card">
              <Link to={`/movie/${movie.id}`} className="movie-link">
                <div className="movie-poster">
                  {movie.primaryImage ? (
                    <img
                      src={movie.primaryImage}
                      alt={movie.primaryTitle || "Movie Poster"}
                    />
                  ) : (
                    "No Image"
                  )}
                </div>
                <h3 className="movie-title">{movie.primaryTitle || "Untitled"}</h3>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;