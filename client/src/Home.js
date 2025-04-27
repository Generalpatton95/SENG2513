import "./Home.css";
import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [boxOfficeMovies, setBoxOfficeMovies] = useState([]);
    const [boxOfficeLoading, setBoxOfficeLoading] = useState(true);
    const [boxOfficeError, setBoxOfficeError] = useState(null);
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularLoading, setPopularLoading] = useState(true);
    const [popularError, setPopularError] = useState(null);
    const [top250, setTop250] = useState([]);
    const [top250Loading, setTop250Loading] = useState(true);
    const [top250Error, setTop250Error] = useState(null);

    const movieDisplayLimit = 32;

    useEffect(() => {
        fetch(`/api/movie/boxoffice`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setBoxOfficeMovies(data.slice(0, movieDisplayLimit));
                setBoxOfficeLoading(false);
            })
            .catch((error) => {
                setBoxOfficeError(error.message);
                setBoxOfficeLoading(false);
            });

        fetch(`/api/movie/popular`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setPopularMovies(data.slice(0, movieDisplayLimit));
                setPopularLoading(false);
            })
            .catch((error) => {
                setPopularError(error.message);
                setPopularLoading(false);
            });

        fetch(`/api/movie/top250`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setTop250(data.slice(0, movieDisplayLimit));
                setTop250Loading(false);
            })
            .catch((error) => {
                setTop250Error(error.message);
                setTop250Loading(false);
            });
    }, []);

    if (boxOfficeLoading) return <div>Loading Box Office movies...</div>;
    if (boxOfficeError) return <div>Error loading Box Office: {boxOfficeError}</div>;
    if (popularLoading) return <div>Loading Most Popular movies...</div>;
    if (popularError) return <div>Error loading Most Popular: {popularError}</div>;
    if (top250Loading) return <div>Loading Top 250 movies...</div>;
    if (top250Error) return <div>Error loading Top 250: {top250Error}</div>;

    const isCentered = boxOfficeMovies.length < 8;
    const featuredMovie = boxOfficeMovies.length > 0 ? boxOfficeMovies[0] : null;

    return (
        <div className="home-container">
            {/* Hero Banner */}
            <section
                className="hero-banner"
                style={{
                    "--bg-url": featuredMovie?.primaryImage
                    ? `url(${featuredMovie.primaryImage})`
                    : "none"
                }}
                >
                <div className="hero-content">
                    <div className="movie-poster">
                        {featuredMovie && featuredMovie.primaryImage ? (
                            <Link to={`/movie/${featuredMovie.id}`}>
                                <img
                                    src={featuredMovie.primaryImage}
                                    alt={featuredMovie.primaryTitle || "Featured Movie"}
                                    className="hero-poster"
                                />
                            </Link>
                        ) : (
                            "Movie Poster"
                        )}
                    </div>
                    <h2>{featuredMovie ? featuredMovie.primaryTitle : "Movie Title"}</h2>
                    <p>{featuredMovie ? featuredMovie.description : "Movie description"}</p>
                     
                </div>
            </section>

            {/* Top Box Office */}
            <section className="trending-section">
                <h2>Top Box Office</h2>
                <div className={`movie-trend-container ${isCentered ? "centered" : ""}`}>
                <div className="movie-list">
                        {boxOfficeMovies.map((movie, index) => (
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

            {/* Most Popular */}
            <section className="recommended-section">
                <h2>Most Popular</h2>
                <div className="movie-recommend-container">
                    <div className="movie-list">
                        {popularMovies.map((movie, index) => (
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

            {/* IMDb Top 250 */}
            <section className="recommended-section">
                <h2>IMDb Top 250</h2>
                <div className="movie-recommend-container">
                    <div className="movie-list">
                        {top250.map((movie, index) => (
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
        </div>
    );
};

export default Home;