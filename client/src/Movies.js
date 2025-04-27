import "./Home.css";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Movies = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState(null);
  const [moviesByGenre, setMoviesByGenre] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("top250"); // Default category
  
  const movieDisplayLimit = 32;

  useEffect(() => {
    setMoviesLoading(true);
    
    // Fetch movies from the selected category
    fetch(`/api/movie/${selectedCategory}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const moviesData = data.slice(0, movieDisplayLimit);
        setAllMovies(moviesData);
        organizeByGenre(moviesData);
        setMoviesLoading(false);
      })
      .catch((error) => {
        setMoviesError(error.message);
        setMoviesLoading(false);
      });
  }, [selectedCategory]);

  // Function to organize movies by genre
  const organizeByGenre = (movies) => {
    const genreMap = {};
    
    // Process each movie
    movies.forEach(movie => {
      // Check for genres in the movie data
      // This assumes genres might be available as an array property on the movie object
      const movieGenres = movie.genres || [];
      
      if (movieGenres.length === 0) {
        // If no genres are specified, add to "Uncategorized"
        if (!genreMap["Uncategorized"]) {
          genreMap["Uncategorized"] = [];
        }
        genreMap["Uncategorized"].push(movie);
      } else {
        // Add movie to each of its genres
        movieGenres.forEach(genre => {
          // Handle genre if it's a string or an object with a name property
          const genreName = typeof genre === 'string' ? genre : (genre.name || "Unknown");
          if (!genreMap[genreName]) {
            genreMap[genreName] = [];
          }
          genreMap[genreName].push(movie);
        });
      }
    });
    
    setMoviesByGenre(genreMap);
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (moviesLoading) return <div>Loading movies...</div>;
  if (moviesError) return <div>Error loading movies: {moviesError}</div>;

  // Get all genre names and sort them alphabetically
  const genreNames = Object.keys(moviesByGenre).sort();
  const isCentered = allMovies.length < 8;

  return (
    <div className="home-container">
      {/* Category Selection Header */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px 0"
      }}>
        <h1>Movies</h1>
        
        {/* Category buttons */}
        <div className="category-buttons">
          <button 
            className={selectedCategory === "popular" ? "active" : ""} 
            onClick={() => handleCategoryChange("popular")}
          >
            Most Popular
          </button>
          <button 
            className={selectedCategory === "boxoffice" ? "active" : ""} 
            onClick={() => handleCategoryChange("boxoffice")}
          >
            Box Office
          </button>
          <button 
            className={selectedCategory === "top250" ? "active" : ""} 
            onClick={() => handleCategoryChange("top250")}
          >
            Top 250
          </button>
        </div>
      </div>

      
      <section className="trending-section">
        <h2>{selectedCategory === "popular" ? "Most Popular Movies" : 
             selectedCategory === "boxoffice" ? "Top Box Office Movies" : 
             " Top 250 Movies"}</h2>
        <div className={`movie-trend-container ${isCentered ? "centered" : ""}`}>
          <div className="movie-list">
            {allMovies.map((movie, index) => (
              <div key={index} className="movie-card">
                <Link to={`/movie/${movie.id}`} className="movie-link">
                  <div className="movie-poster">
                    {movie.primaryImage ? (
                      <img
                        src={movie.primaryImage}
                        alt={movie.primaryTitle || "Movie Poster"}
                      />
                    ) : (
                      "Movie Poster"
                    )}
                  </div>
                  <h3 className="movie-title">{movie.primaryTitle || "Untitled"}</h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Genre Sections */}
      {genreNames.length > 0 ? (
        genreNames.map((genre, index) => (
          <React.Fragment key={genre}>
            <section className="recommended-section">
              <h2>{genre}</h2>
              <div className="movie-recommend-container">
                <div className="movie-list">
                  {moviesByGenre[genre].map((movie, movieIndex) => (
                    <div key={`${genre}-${movieIndex}`} className="movie-card">
                      <Link to={`/movie/${movie.id}`} className="movie-link">
                        <div className="movie-poster">
                          {movie.primaryImage ? (
                            <img
                              src={movie.primaryImage}
                              alt={movie.primaryTitle || "Movie Poster"}
                            />
                          ) : (
                            "Movie Poster"
                          )}
                        </div>
                        <h3 className="movie-title">{movie.primaryTitle || "Untitled"}</h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            {/* Add divider except after the last genre */}
            {index < genreNames.length - 1 && <hr className="section-divider" />}
          </React.Fragment>
        ))
      ) : (
        <div className="no-genres">No genre information available for these movies.</div>
      )}
    </div>
  );
};

export default Movies;