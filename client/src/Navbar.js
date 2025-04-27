// Navbar.jsx
import "./Navbar.css";
import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Companies from "./Companies";
import Users from "./Users";
import Movies from "./Movies";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingGenres, setIsLoadingGenres] = useState(true);
    const navigate = useNavigate();
    
    // API base URL
    const API_BASE_URL = "http://localhost:3001";

    // Fetch genres from API
    useEffect(() => {
        fetch(`${API_BASE_URL}/api/movie/genres`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                // Extract genres from API response
                // Adjust this based on the actual structure of your API response
                const genresList = Array.isArray(data) 
                    ? data 
                    : data.genres || data.data || [];
                
                setGenres(genresList);
                setIsLoadingGenres(false);
            })
            .catch(error => {
                console.error("Error loading genres:", error);
                // Fallback to hardcoded genres if API fails
                setGenres([
                    "Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", 
                    "Thriller", "Animation", "Fantasy", "Mystery", "Adventure", 
                    "Crime", "Documentary", "Family", "History", "Musical", 
                    "Sport", "War", "Western", "Biography", "Noir", "Superhero"
                ]);
                setIsLoadingGenres(false);
            });
    }, []);
    
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

const handleSearch = () => {
  // Construct search URL with query and selected genres
  const params = new URLSearchParams();
  
  // Add search query if present
  if (searchQuery.trim()) {
    params.append('query', searchQuery.trim());
  }
  
  // Add genre if selected
  if (selectedGenres.length > 0) {
    // For simplicity, just use the first selected genre
    // The IMDb API seems to only support one genre at a time
    params.append('genre', selectedGenres[0]);
    console.log(`Using genre: ${selectedGenres[0]}`);
  }
  
  // Navigate to search results page with query parameters
  const searchPath = params.toString() ? `/search?${params.toString()}` : '/Movies';
  navigate(searchPath);
};

    // Handle Enter key in search input
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };


    return (
        <>
            <div>
                <nav className="navbar">
                    <Link to="/">
                        <img src="/mlogo192.png" alt="Movie App Logo" className="nav-logo" />
                    </Link>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/Companies">Companies</Link></li>
                        <li><Link to="/Users">Users</Link></li>
                        <li><Link to="/Movies">Movies</Link></li>
                    </ul>

                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search movies..." 
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                        />

                        <div className="dropdown-container">
                            <button 
                                onClick={toggleDropdown} 
                                className={`dropdown-button ${selectedGenres.length > 0 ? "active" : ""}`}
                                title="Filter by genres"
                            >
                                {showDropdown ? "▲" : "▼"}
                                {selectedGenres.length > 0 && (
                                    <span className="dropdown-counter">{selectedGenres.length}</span>
                                )}
                            </button>

                            {showDropdown && (
                                <div className="dropdown-menu">
                                    {isLoadingGenres ? (
                                        <div className="loading-genres">Loading genres...</div>
                                    ) : (
                                        genres.map((genre, index) => (
                                            <button 
                                                key={index} 
                                                onClick={() => toggleGenreSelection(genre)}
                                                className={`dropdown-item ${selectedGenres.includes(genre) ? "selected" : ""}`}
                                            >
                                                {genre}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button 
                            className="search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Companies" element={<Companies />} />
                    <Route path="/Users" element={<Users />} /> 
                    <Route path="/Movies" element={<Movies />} />
                    {/* Add a route for search results */}
                    <Route path="/search" element={<Movies />} />
                </Routes>
            </div>
        </>
    );
};

export default Navbar;
