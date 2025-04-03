import "./Home.css";
import React from "react";

const Home = () => {
    return (
        <>
            {/* Home Container */}
            <div className="home-container">
                
                {/* Hero Banner */}
                <section className="hero-banner">
                    <div className="hero-content">
                        {/* Larger Movie Poster Placeholder */}
                        <div className="movie-poster"></div>
                        
                        <h2>Spider-Man: No Way Home</h2>
                        <p>
                            The multiverse is unleashed as Spider-Man faces his greatest challenge yet.
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
                            {[
                                "Dune", "Avatar", "Interstellar", "Inception", "The Matrix", 
                                "The Dark Knight", "Pulp Fiction", "The Godfather"
                            ].map((movie, index) => (
                                <div key={index} className="movie-card">
                                    <div className="movie-poster"></div>
                                    <h3 className="movie-title">{movie}</h3>
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
