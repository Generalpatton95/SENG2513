import "./Home.css";
import React from "react";
import { useEffect, useState } from "react";

const Home = () => {
     const [movie, setmovie] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
        
      useEffect(() => {
        
        fetch(`/api/movie`)
          .then((res) => {
            console.log("Response status:", res.status);
            if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
              setmovie(data); // Ensure data is an array
              setLoading(false);
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
          });
      }, []);
    
      
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;

      
  const featuredMovie = movie.length > 0 ? movie[0] : null;
  const trendingMovies = movie.slice(0, 8);

    return (
        <>
            {/* Home Container */}
            <div className="home-container">
                
                {/* Hero Banner */}
                <section className="hero-banner">
                    <div className="hero-content">
                        {/* Larger Movie Poster Placeholder */}
                        <div className="movie-poster"></div>
                        
                        <h2> {featuredMovie ? featuredMovie.primaryTitle : "Movie Title"} </h2>
                        <p>
                            {featuredMovie ? featuredMovie.description: "Movie description"}
                        </p>
                    </div>
                </section>

                {/* Recommended Movies Section */}
                <section className="recommended-section">
                    <h2>Recommended For You</h2>
                    <div className="movie-recommend-container">
                        <div className="movie-list">
                            {[
                                "Shawshank Redemption", "Forrest Gump", "Fight Club", "The Prestige", "Whiplash",
                                "Gladiator", "Parasite", "The Imitation Game"
                            ].map((movie, index) => (
                                <div key={index} className="movie-card">
                                    <div className="movie-poster"></div>
                                    <h3 className="movie-title">{movie}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trending Movies Section */}
                <section className="trending-section">
                    <h2>Trending Now</h2>
                    <div className="movie-trend-container">
                        <div className="movie-list">
                            {trendingMovies.map((movie, index) => (
                                <div key={index} className="movie-card">
                                    <div className="movie-poster"></div>
                                    <h3 className="movie-title">{movie.primaryTitle || "Untitled"}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;
