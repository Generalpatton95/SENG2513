// Home.jsx

import React from "react";

const Home = () => {
    return (
        <>
            {/* New IMDb-Inspired Design */}
            <div className="home-container" style={{ padding: "20px", backgroundColor: "#121212", color: "white", fontFamily: "Arial, sans-serif" }}>
                
                {/* Header Section */}
                <header className="header" style={{ textAlign: "center", marginBottom: "20px" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Welcome to Movie Recommendation System</h1>
                    <p style={{ fontSize: "1.2rem", color: "#ccc" }}>Discover trending and top-rated movies.</p>
                </header>

                {/* Search Bar */}
                <div className="search-bar" style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        style={{ 
                            padding: "10px", 
                            borderRadius: "20px", 
                            border: "none", 
                            outline: "none", 
                            width: "650px", 
                            fontSize: "1rem" 
                        }} 
                    />
                    <button 
                        style={{ 
                            padding: "10px 15px", 
                            marginLeft: "10px", 
                            borderRadius: "20px", 
                            border: "none", 
                            backgroundColor: "#444", /* Dark gray */
                            color: "white",
                            fontSize: "1rem", 
                            fontWeight: "bold", 
                            cursor: "pointer" 
                        }}
                    >
                        Search
                    </button>
                </div>
                
                {/* Recommended Movies Section */}
                <section className="recommended-section">
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Recommended For You</h2>
                    <div className="movie-recommend-container" style={{ overflowX: "auto", width: "100%", paddingBottom: "20px", display: "flex", justifyContent: "center" }}>
                        <div style={{ display: "flex", flexWrap: "nowrap" }}>
                            {[
                                "Shawshank Redemption", "Forrest Gump", "Fight Club", "The Prestige", "Whiplash",
                                "Gladiator", "Parasite", "Inglourious Basterds"
                            ].map((movie, index) => (
                                <div key={index} className="movie-card" style={{ backgroundColor: "#1e1e1e", padding: "10px", borderRadius: "10px", textAlign: "center", width: "150px", marginRight: "15px" }}>
                                    {/* Placeholder for Movie Poster */}
                                    <div className="movie-poster" style={{ width: "100%", height: "200px", backgroundColor: "#333", borderRadius: "8px", marginBottom: "10px" }}></div>
                                    <h3 className="movie-title" style={{ fontSize: "1.2rem" }}>{movie}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trending Movies Section */}
                <section className="trending-section">
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Trending Now</h2>
                    <div className="movie-trend-container" style={{ overflowX: "auto", width: "100%", paddingBottom: "10px", display: "flex", justifyContent: "center" }}>
                        <div style={{ display: "flex", flexWrap: "nowrap" }}>
                            {[
                                "Dune", "Avatar", "Interstellar", "Inception", "The Matrix", 
                                "The Dark Knight", "Pulp Fiction", "The Godfather"
                            ].map((movie, index) => (
                                <div key={index} className="movie-card" style={{ backgroundColor: "#1e1e1e", padding: "10px", borderRadius: "10px", textAlign: "center", width: "150px", marginRight: "15px" }}>
                                    {/* Placeholder for Movie Poster */}
                                    <div className="movie-poster" style={{ width: "100%", height: "200px", backgroundColor: "#333", borderRadius: "8px", marginBottom: "10px" }}></div>
                                    <h3 className="movie-title" style={{ fontSize: "1.2rem" }}>{movie}</h3>
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
