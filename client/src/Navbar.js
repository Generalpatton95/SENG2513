// Navbar.jsx
import "./Navbar.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);

    const genres = [
        "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", 
        "Thriller", "Animation", "Fantasy", "Mystery", "Adventure", 
        "Crime", "Documentary", "Family", "History", "Musical", 
        "Sport", "War", "Western", "Biography", "Noir", "Superhero"
    ];
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const toggleGenreSelection = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    return (
        <nav className="navbar">
            <img src="/mlogo192.png" className="nav-logo" alt="Movie Logo" />
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/companies">Companies</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/movies">Movies</Link></li>
            </ul>

            <div className="search-container">
                <input type="text" placeholder="Search" className="search-input" />

                <div className="dropdown-container">
                    <button 
                        onClick={toggleDropdown} 
                        className={`dropdown-button ${selectedGenres.length > 0 ? "active" : ""}`}
                    >
                        {showDropdown ? "▲" : "▼"}
                        {selectedGenres.length > 0 && (
                            <span className="dropdown-counter">{selectedGenres.length}</span>
                        )}
                    </button>

                    {showDropdown && (
                        <div className="dropdown-menu">
                            {genres.map((genre, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => toggleGenreSelection(genre)}
                                    className={`dropdown-item ${selectedGenres.includes(genre) ? "selected" : ""}`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className="search-button">Search</button>
            </div>
        </nav>
    );
};

export default Navbar; 