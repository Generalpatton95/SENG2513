// Navbar.jsx
import "./Navbar.css";
import React, { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Companies from "./Companies";
import Users from "./Users";
import Movies from "./Movies";
import MovieDetail from "./MovieDetail";

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
          prev.includes(genre) ? [] : [genre]
        );
      };

// Replace your existing handleSearch function with this improved version
const handleSearch = () => {
    // Construct search URL with query and selected genres
    const params = new URLSearchParams();
    
    // Add search query if present
    if (searchQuery.trim()) {
      params.append('query', searchQuery.trim());
    }
    
    // Add genre if selected
    if (selectedGenres.length > 0) {
      // For the API, use only the first genre since it only supports one genre at a time
      params.append('genre', selectedGenres[0]);
      console.log(`Using primary genre for API: ${selectedGenres[0]}`);
      
      // Store all selected genres in session storage for client-side filtering
      if (selectedGenres.length > 1) {
        console.log(`Storing ${selectedGenres.length} genres for client-side filtering`);
        sessionStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
      } else {
        sessionStorage.removeItem('selectedGenres');
      }
    } else {
      // Clear any stored genres when no genres are selected
      sessionStorage.removeItem('selectedGenres');
    }
    
    // Check if we have any parameters before navigating
    if (params.toString()) {
      // Navigate to search results page with query parametersS
      console.log(`Navigating to: /search?${params.toString()}`);
      navigate(`/search?${params.toString()}`);
    } else {
      // If no parameters, navigate to the Movies page instead of an empty search
      console.log('No search parameters provided, navigating to Movies page');
      navigate('/Movies');
    }
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
                <div className="nav-left">
                <Link to="/">
                    <img src="/mlogo192.png" alt="Movie App Logo" className="nav-logo" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/" className="home-icon"><span className="home-icon">🏠︎</span></Link></li>
                </ul>
                </div>

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
                    <Route path="/movie/:movieId" element={<MovieDetail />} />
                </Routes>
               
            </div>
        </>
    );
};

export default Navbar;