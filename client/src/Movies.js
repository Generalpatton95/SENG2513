import React from "react";
import { useEffect, useState } from "react";

const Movies = () => {

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

  
  return (
    <>
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <h1>Movies</h1>
        </div>
        <div>
          {Array.isArray(movie) && movie.length > 0 ? (
            movie.map((data) => (
                <p key={data.id}>{data.primaryTitle}</p>
            ))
          ) : (
            <p>No Movies found or data is not in expected format.</p>
          )}
        </div>
    </>
  );
}

export default Movies;