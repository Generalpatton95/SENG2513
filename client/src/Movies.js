import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  // Define the API base URL
  const API_BASE_URL = "http://localhost:3001";
    
  useEffect(() => {
    // Get search parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const genreParam = searchParams.get('genre');
    
    console.log("Search parameters:", { query, genreParam });
    
    let apiUrl;
    
    if (query) {
      // Text search with optional genre filter
      apiUrl = `${API_BASE_URL}/api/movie/search?query=${encodeURIComponent(query)}`;
      if (genreParam) {
        apiUrl += `&genre=${encodeURIComponent(genreParam)}`;
      }
    } else if (genreParam) {
      // Genre-only search
      apiUrl = `${API_BASE_URL}/api/movie/search?genre=${encodeURIComponent(genreParam)}`;
    } else {
      // No search parameters - just show popular movies
      apiUrl = `${API_BASE_URL}/api/movie/popular`;
    }
    
    apiUrl += `&rows=25`; // Reduce the number of results to prevent timeouts
    
    console.log("API URL:", apiUrl);
    
    // Set a shorter timeout
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Search request timed out. The API may be experiencing issues. Please try again later.");
    }, 10000); // 10 seconds instead of 15
    
    // Fetch movies with AbortController for better timeout control
    setLoading(true);
    setError(null);
    
    const controller = new AbortController();
    const signal = controller.signal;
    
    fetch(apiUrl, { signal })
      .then((res) => {
        clearTimeout(timeout);
        console.log("Response status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        // Ensure we're handling the response structure correctly
        const moviesList = Array.isArray(data) ? data : [];
        setMovies(moviesList);
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeout);
        // Only set error if not aborted
        if (error.name !== 'AbortError') {
          console.error("Fetch error:", error);
          setError(error.message);
        }
        setLoading(false);
      });
      
    return () => {
      clearTimeout(timeout);
      controller.abort(); // Abort fetch on unmount
    };
  }, [location.search, API_BASE_URL]);
  
  // Display a message showing current search/filter
  const renderSearchInfo = () => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const genreParam = searchParams.get('genre');
    
    if (!query && !genreParam) {
      return <h1>Popular Movies</h1>;
    }
    
    let message = "Movies";
    if (query) message += ` matching "${query}"`;
    if (genreParam) {
      const genres = genreParam.split(',');
      if (genres.length === 1) {
        message += query ? ` in the ${genres[0]} genre` : ` in ${genres[0]}`;
      } else if (genres.length > 1) {
        message += query ? " in genres: " : " Genres: ";
        message += genres.join(", ");
      }
    }
    
    return <h1>{message}</h1>;
  };

  if (loading) return <div className="loading">Searching for movies...</div>;
  if (error) return <div className="error">Error loading movies: {error}</div>;
  
  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        padding: "20px"
      }}>
        {renderSearchInfo()}
      </div>
      
      {movies.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "30px",
          fontSize: "18px"
        }}>
          No movies found matching your search criteria. Try different terms or genres.
        </div>
      ) : (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          padding: "20px"
        }}>
          {movies.map((movie, index) => (
            <div key={movie.id || index} style={{
              width: "200px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{
                height: "250px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {movie.primaryImage ? (
                  <img 
                    src={movie.primaryImage} 
                    alt={movie.primaryTitle || "Movie poster"} 
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>No Image</div>
                )}
              </div>
              <h3 style={{ margin: "10px 0", fontSize: "16px" }}>
                {movie.primaryTitle || movie.title || "Untitled Movie"}
              </h3>
              {movie.year && (
                <p style={{ margin: "5px 0", color: "#666" }}>
                  {movie.year}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Movies;