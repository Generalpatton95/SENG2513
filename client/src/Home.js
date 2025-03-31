// Home.jsx
import React from "react";

const Home = () => {
    return (
        <>
            {/* Home Container */}
            <div className="home-container" style={{ padding: "20px", backgroundColor: "#121212", color: "white", fontFamily: "Arial, sans-serif" }}>
                
                {/* Hero Banner */}
                <section className="hero-banner" style={{
                    width: "100%",
                    height: "450px",  // Increased height to make space for the larger poster
                    backgroundColor: "#1e1e1e", // Dark background to simulate a banner
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "20px"
                }}>
                    <div style={{ maxWidth: "850px" }}>
                        {/* Larger Movie Poster Placeholder */}
                        <div className="movie-poster" style={{
                            width: "100%",
                            height: "300px",  // Increased height for the poster
                            backgroundColor: "#333",
                            borderRadius: "8px",
                            marginBottom: "15px"  // Increased margin to space things out
                        }}></div>
                        
                        <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>Spider-Man: No Way Home</h2>
                        <p style={{ fontSize: "1.2rem", color: "#ccc" }}>
                            The multiverse is unleashed as Spider-Man faces his greatest challenge yet.
                        </p>
                    </div>
                </section>

                {/* Recommended Movies Section */}
                <section className="recommended-section">
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Recommended For You</h2>
                    <div className="movie-recommend-container" style={{ overflowX: "auto", width: "100%", paddingBottom: "10px", display: "flex", justifyContent: "center" }}>
                        <div style={{ display: "flex", flexWrap: "nowrap" }}>
                            {[
                                "Shawshank Redemption", "Forrest Gump", "Fight Club", "The Prestige", "Whiplash",
                                "Gladiator", "Parasite", "The Imitation Game"
                            ].map((movie, index) => (
                                <div key={index} className="movie-card" style={{ backgroundColor: "#1e1e1e", padding: "10px", borderRadius: "10px", textAlign: "center", width: "150px", marginRight: "15px" }}>
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
