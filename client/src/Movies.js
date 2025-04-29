import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Home.css";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [activeGenres, setActiveGenres] = useState([]);
  const location = useLocation();

  const API_BASE_URL = "http://localhost:3001";
  
  // Use OR logic instead of AND logic for genre filtering
  const useOrLogicForGenres = true; // Set this to true to use OR logic

  // Fetch available genres once when component mounts
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/movie/genres`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setGenres(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error("Error fetching genres:", error);
      });
      
    // Get any stored genres from session storage
    const storedGenres = sessionStorage.getItem('selectedGenres');
    if (storedGenres) {
      try {
        setActiveGenres(JSON.parse(storedGenres));
        console.log("Retrieved stored genres:", JSON.parse(storedGenres));
      } catch (e) {
        console.error("Error parsing stored genres:", e);
      }
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const genreParam = searchParams.get('genre');
    
    console.log("Search parameters:", { query, genreParam });
    console.log("Active genres from storage:", activeGenres);

    // Case normalization for genre matching
    const normalizedGenre = genreParam ? genreParam.toLowerCase().trim() : null;
    
    let apiUrl;
    
    // Priority for combined search approaches
    if (query && genreParam) {
      // Try genre search first with fallback to text search
      apiUrl = `${API_BASE_URL}/api/movie/search?genre=${encodeURIComponent(genreParam)}&rows=50`;
    } else if (query) {
      apiUrl = `${API_BASE_URL}/api/movie/search?query=${encodeURIComponent(query)}`;
    } else if (genreParam) {
      apiUrl = `${API_BASE_URL}/api/movie/search?genre=${encodeURIComponent(genreParam)}`;
    } else {
      apiUrl = `${API_BASE_URL}/api/movie/popular`;
    }
    
    // Only add rows parameter if not already included
    if (!apiUrl.includes('rows=')) {
      apiUrl += `&rows=50`; // Increase row count to get more results
    }
    
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Search request timed out.");
    }, 15000); // Increased timeout for potentially slower genre API
    
    const controller = new AbortController();
    const signal = controller.signal;

    // First search attempt
    fetch(apiUrl, { signal })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const initialResults = Array.isArray(data) ? data : [];
        
        // Filter by multiple genres if available from session storage
        let filteredResults = initialResults;
        
        if (activeGenres && activeGenres.length > 1) {
          console.log(`Applying client-side filtering for ${activeGenres.length} genres with ${useOrLogicForGenres ? 'OR' : 'AND'} logic`);
          
          filteredResults = initialResults.filter(movie => {
            // Skip if movie has no genres
            if (!movie.genres || !Array.isArray(movie.genres) || movie.genres.length === 0) {
              return false;
            }
            
            // Convert all genres to lowercase for case-insensitive comparison
            const movieGenresLower = movie.genres.map(g => g.toLowerCase().trim());
            
            if (useOrLogicForGenres) {
              // OR logic: movie has ANY of the selected genres
              return activeGenres.some(genre => 
                movieGenresLower.includes(genre.toLowerCase().trim())
              );
            } else {
              // AND logic: movie has ALL selected genres
              return activeGenres.every(genre => 
                movieGenresLower.includes(genre.toLowerCase().trim())
              );
            }
          });
          
          console.log(`Found ${filteredResults.length} movies matching genre criteria`);
        }

        // If we have both query and genre, filter results accordingly
        if (query && (genreParam || activeGenres.length > 0)) {
          if (filteredResults.length > 0) {
            // If genre search returned results, filter by text query
            const queryMatches = filteredResults.filter(movie => {
              // Create a searchable text from movie properties
              const searchableText = [
                movie.primaryTitle, 
                movie.description,
                movie.secondaryTitle,
                ...(movie.cast ? movie.cast.map(actor => actor.fullName) : [])
              ].filter(Boolean).join(' ').toLowerCase();
              
              // Check if any word in the query matches
              return query.toLowerCase().split(' ').some(word => 
                word.length > 2 && searchableText.includes(word.toLowerCase())
              );
            });
            
            if (queryMatches.length > 0) {
              setMovies(queryMatches);
            } else {
              // If no matches, try text search with genre filtering as fallback
              fallbackSearch(query, normalizedGenre, signal);
            }
          } else {
            // If genre search returned no results, try text search
            fallbackSearch(query, normalizedGenre, signal);
          }
        } else {
          // Standard single-parameter search - just return results
          setMovies(filteredResults);
        }
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeout);
        if (error.name !== 'AbortError') {
          console.error("Error in primary search:", error);
          // Try fallback if this is a combined search
          if (query && (genreParam || activeGenres.length > 0)) {
            fallbackSearch(query, normalizedGenre, signal);
          } else {
            setError(error.message);
            setLoading(false);
          }
        }
      });

    // Fallback search function
    const fallbackSearch = (query, normalizedGenre, signal) => {
      console.log("Attempting fallback search by query with genre filter");
      
      // Fetch more rows for a broader search
      const textSearchUrl = `${API_BASE_URL}/api/movie/search?query=${encodeURIComponent(query)}&rows=100`;
      
      fetch(textSearchUrl, { signal })
        .then(res => res.ok ? res.json() : [])
        .then(textResults => {
          const results = Array.isArray(textResults) ? textResults : [];
          
          // Apply multi-genre filtering if we have multiple active genres
          let filteredResults = results;
          
          if (activeGenres && activeGenres.length > 1) {
            filteredResults = results.filter(movie => {
              // Handle different genre field formats
              let movieGenres = [];
              
              if (movie.genres && Array.isArray(movie.genres)) {
                movieGenres = movie.genres.map(g => g.toLowerCase().trim());
              } else if (movie.genre && typeof movie.genre === 'string') {
                movieGenres = movie.genre
                  .split(',')
                  .map(g => g.toLowerCase().trim());
              }
              
              if (useOrLogicForGenres) {
                // OR logic: movie has ANY of the selected genres
                return activeGenres.some(genre => 
                  movieGenres.includes(genre.toLowerCase().trim())
                );
              } else {
                // AND logic: movie has ALL selected genres
                return activeGenres.every(genre => 
                  movieGenres.includes(genre.toLowerCase().trim())
                );
              }
            });
          } else if (normalizedGenre) {
            // Enhanced genre matching logic with normalization for single genre
            filteredResults = results.filter(movie => {
              // Check for genre array property
              if (movie.genres && Array.isArray(movie.genres)) {
                return movie.genres.some(genre => {
                  // Case-insensitive comparison with trimming
                  return genre.toLowerCase().trim() === normalizedGenre;
                });
              }
              // Check for single genre property (string)
              else if (movie.genre && typeof movie.genre === 'string') {
                // Split comma-separated genres and check each
                return movie.genre
                  .split(',')
                  .map(g => g.toLowerCase().trim())
                  .includes(normalizedGenre);
              }
              // If no genre info available, don't filter out
              return true;
            });
          }
          
          setMovies(filteredResults);
          setLoading(false);
        })
        .catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Error in fallback search:", error);
            setError(error.message);
          }
          setLoading(false);
        });
    };

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [location.search, API_BASE_URL, activeGenres]);

  const renderSearchInfo = () => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const genreParam = searchParams.get('genre');

    if (!query && !genreParam && (!activeGenres || activeGenres.length === 0)) {
      return <h2 style={{ marginBottom: "20px" }}>Popular Movies</h2>;
    }

    let message = "Results";
    if (query) message += ` for "${query}"`;
    
    if (activeGenres && activeGenres.length > 0) {
      const logicType = useOrLogicForGenres ? "any of" : "all";
      message += ` matching ${logicType}: ${activeGenres.join(', ')}`;
    } else if (genreParam) {
      message += ` in ${genreParam} genre`;
    }

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
                {movie.genres && movie.genres.length > 0 && (
                  <div className="movie-genres">
                    {movie.genres.slice(0, 2).map((genre, i) => (
                      <span key={i} className="movie-genre">{genre}</span>
                    ))}
                  </div>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;