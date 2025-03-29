// Movies.jsx

import React from "react";
import { useEffect, useState } from "react";

const Movies = () => {

  const [movie, setmovie] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const parseMovieData = (data) => {
    // Split by newline to get individual objects
    return data.split('\n')
      .map(line => {
        // Skip empty lines
        if (!line.trim()) return null;
        
        // Use regex to extract the values
        const idMatch = line.match(/id: '([^']+)'/);
        const tmdbIdMatch = line.match(/tmdbId: (\d+)/);
        
        if (idMatch && tmdbIdMatch) {
          return {
            id: idMatch[1],
            tmdbId: parseInt(tmdbIdMatch[1])
          };
        }
        return null;
      })
      .filter(item => item !== null); // Remove any null items
  };

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
          const parsedMovies = parseMovieData(data);
          setmovie(parsedMovies); // Ensure data is an array
          setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <h1>Movies</h1>
        </div>
        <div>
          {movie.length > 0 ? (
            console.log(movie),
            movie.map((data) => (
                <p key={data.id}>{data.tmdbId}</p>
            ))
          ) : (
            <p>No Movies found or data is not in expected format.</p>
          )}
        </div>
    </>
  );
}

export default Movies;