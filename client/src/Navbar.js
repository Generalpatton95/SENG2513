// Navbar.jsx
import "./Navbar.css";
import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Companies from "./Companies";
import Users from "./Users";
import Movies from "./Movies";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const genres = [
        "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", 
        "Thriller", "Animation", "Fantasy", "Mystery"
    ];

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const toggleGenreSelection = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre) // Remove if already selected
                : [...prev, genre] // Add if not selected
        );
    };

    return (
        <>
            <div>
                <nav className="navbar">
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/Companies">Companies</Link></li>
                        <li><Link to="/Users">Users</Link></li>
                        <li><Link to="/Movies">Movies</Link></li>
                    </ul>

                    {/* Search Bar + Dropdown */}
                    <div className="search-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px", position: "relative" }}>
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

                        {/* Dropdown Toggle Button (Down Arrow with Counter) */}
                        <div style={{ position: "relative" }}>
                            <button 
                                onClick={toggleDropdown} 
                                style={{
                                    marginLeft: "10px",
                                    padding: "10px 12px",
                                    borderRadius: "50%",
                                    border: "none",
                                    backgroundColor: selectedGenres.length > 0 ? "#006EFF" : "#444",
                                    color: "white",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    position: "relative"
                                }}
                            >
                                ▼
                                {selectedGenres.length > 0 && (
                                    <span style={{
                                        position: "absolute",
                                        top: "-6px",
                                        right: "-6px",
                                        backgroundColor: "white",
                                        color: "#006EFF",
                                        fontSize: "0.75rem",
                                        fontWeight: "bold",
                                        borderRadius: "50%",  
                                        width: "18px",
                                        height: "18px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        boxShadow: "0 0 3px rgba(0, 0, 0, 0.2)"
                                    }}>
                                        {selectedGenres.length}
                                    </span>
                                )}
                            </button>

                            {/* Dropdown Menu - Positioned Directly Below the Arrow */}
                            {showDropdown && (
                                <div className="dropdown-menu" style={{
                                    position: "absolute",
                                    top: "100%",  // Moves it directly below the button
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "#222",
                                    padding: "10px",
                                    borderRadius: "10px",
                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "5px",
                                    width: "220px",
                                    zIndex: "10",
                                    marginTop: "5px" // Small spacing
                                }}>
                                    {genres.map((genre, index) => (
                                        <button 
                                            key={index} 
                                            onClick={() => toggleGenreSelection(genre)}
                                            style={{
                                                padding: "6px 10px",
                                                borderRadius: "15px",
                                                border: "none",
                                                backgroundColor: selectedGenres.includes(genre) ? "#006EFF" : "#555",
                                                color: "white",
                                                fontSize: "0.8rem",
                                                cursor: "pointer",
                                                transition: "background-color 0.2s"
                                            }}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button 
                            style={{ 
                                marginLeft: "10px",
                                padding: "10px 15px", 
                                borderRadius: "20px", 
                                border: "none", 
                                backgroundColor: "#006EFF",
                                color: "white",
                                fontSize: "1rem", 
                                fontWeight: "bold", 
                                cursor: "pointer" 
                            }}
                        >
                            Search
                        </button>
                    </div>
                </nav>

                <Routes>
                    <Route path="*" element={<Home />} />
                    <Route path="/Companies" element={<Companies />} />
                    <Route path="/Users" element={<Users />} /> 
                    <Route path="/Movies" element={<Movies />} /> 
                </Routes>
            </div>
        </>
    );
};

export default Navbar;
