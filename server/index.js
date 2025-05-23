import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;

// API key consistency - use one key for all requests
const API_KEY = 'c07d5b540fmsh06d48509516eda8p15cf75jsn5d66c8561424';
const API_HOST = 'imdb236.p.rapidapi.com';

// Default headers for all requests
const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': API_HOST
};

const boxOfficeOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top-box-office',
  headers
};

const popularOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/most-popular-movies',
  headers
};

const top250Options = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top250-movies',
  headers
};

const movieDetailsOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/', // We will append the movie ID dynamically
  headers
};

app.get('/api/movie/boxoffice', async (req, res) => {
  try {
    const response = await axios.request(boxOfficeOptions);
    const data = response.data.data || response.data;
    const filteredData = data.filter(item => item.type === "movie");
    res.json(filteredData);
  } catch (error) {
    console.error("Box Office fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch Box Office data' });
  }
});

app.get('/api/movie/popular', async (req, res) => {
  try {
    const response = await axios.request(popularOptions);
    const data = response.data.data || response.data;
    const filteredData = data.filter(item => item.type === "movie");
    res.json(filteredData);
  } catch (error) {
    console.error("Popular movies fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch Popular data' });
  }
});

app.get('/api/movie/top250', async (req, res) => {
  try {
    const response = await axios.request(top250Options);
    const data = response.data.data || response.data;
    res.json(data);
  } catch (error) {
    console.error("Top 250 fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch Top 250 data' });
  }
});





// Search endpoint with correct structure
app.get('/api/movie/search', async (req, res) => {
  try {
    const { genre, query, type = 'movie', rows = '25' } = req.query;
    console.log("Search request received:", { genre, query, type, rows });
    
    // Set a shorter timeout for API requests
    const apiTimeout = 8000; // 8 seconds

    
    
// Handle genre search
if (genre) {
  console.log(`Performing genre search for: "${genre}"`);
  
  try {
    const response = await axios({ 
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/search',
      params: { 
        type: 'movie',
        genre: genre,
        rows,
        sortOrder: 'DESC',
        sortField: 'startYear'
      },
      headers,
      timeout: 10000
    });
    
    // Log the structure of the response to debug
    console.log("Response structure:", Object.keys(response.data));
    
    // Extract data properly based on the API's response structure
    let movieResults = [];
    if (response.data.movies && response.data.movies.results) {
      // New API structure
      movieResults = response.data.movies.results;
    } else if (response.data.results) {
      // Alternative structure
      movieResults = response.data.results;
    } else {
      // Fallback
      movieResults = response.data.data || [];
    }
    
    console.log(`Found ${movieResults.length} movies for genre: ${genre}`);
    
    return res.json(movieResults);
  } catch (error) {
    console.error("Genre search error:", error.message);
    return res.json([]);
  }
}
    
    // Handle text search
    if (query) {
      console.log(`Performing text search for: "${query}"`);
      
      try {
        const response = await axios({
          method: 'GET',
          url: 'https://imdb236.p.rapidapi.com/imdb/autocomplete',
          params: { query },
          headers,
          timeout: apiTimeout
        });
        
        const searchResults = response.data.data || response.data || [];
        console.log(`Found ${searchResults.length} results for query: ${query}`);
        
        if (searchResults.length > 0) {
          const filteredResults = type === 'movie' 
            ? searchResults.filter(item => item.type === 'movie' || item.type === 'feature')
            : searchResults;
          
          const enhancedResults = filteredResults.map(item => ({
            id: item.id,
            primaryTitle: item.title || item.primaryTitle,
            primaryImage: item.image || item.primaryImage,
            year: item.year,
            type: item.type
          }));
          
          return res.json(enhancedResults);
        } else {
          return res.json([]);
        }
      } catch (queryError) {
        console.error("Text search error:", queryError.message);
        return res.json([]);
      }
    }
    
    // If no genre or query specified, return popular movies
    console.log("No search parameters, returning popular movies");
    
    try {
      const response = await axios({
        method: 'GET',
        url: 'https://imdb236.p.rapidapi.com/imdb/most-popular-movies',
        headers,
        timeout: apiTimeout
      });
      
      const data = response.data.data || response.data || [];
      return res.json(data);
    } catch (error) {
      console.error("Popular movies error:", error.message);
      return res.json([]);
    }
    
  } catch (error) {
    console.error("General search error:", error.message);
    res.json([]); // Return empty array instead of error
  }
});


// New endpoint for fetching all available genres
app.get('/api/movie/genres', async (req, res) => {
  try {
    const genresOptions = {
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/genres',
      headers
    };
    
    const response = await axios.request(genresOptions);
    const data = response.data.data || response.data;
    res.json(data);
  } catch (error) {
    console.error("Genres fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// Test endpoint for genre search
// Test endpoint for genre search
app.get('/api/test/genre', async (req, res) => {
  try {
    const { genre = 'Action' } = req.query;
    
    console.log(`Testing genre search with: "${genre}"`);
    
    const apiOptions = {
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/search',
      params: { 
        type: 'movie',
        genre: genre,
        rows: '10',
        sortOrder: 'DESC',
        sortField: 'startYear'  // Changed from 'year' to 'startYear'
      },
      headers
    };
    
    console.log("Making test genre search API request:", apiOptions.params);
    
    const response = await axios.request(apiOptions);
    console.log("Response received from API");
    
    const data = response.data.data || response.data || [];
    console.log(`Found ${data.length} movies for genre: ${genre}`);
    
    res.json({
      success: true,
      genre: genre,
      count: data.length,
      movies: data
    });
  } catch (error) {
    console.error("Test genre search error:", error.message);
    
    if (error.response) {
      console.error("API error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to test genre search', 
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

app.get('/api/movie/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const options = {
      ...movieDetailsOptions,
      url: `${movieDetailsOptions.url}${id}` // e.g., https://imdb236.p.rapidapi.com/imdb/tt0816692
    };

    const response = await axios.request(options);
    const data = response.data.data || response.data;
    res.json(data);
  } catch (error) {
    console.error("Simple movie details fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});


// New endpoint for fetching movie details by IMDb ID
// Replace your existing /api/movie/:id endpoint with this improved version
app.get('/api/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }
    
    console.log(`Fetching details for movie ID: ${id}`);
    
    const movieDetailsOptions = {
      method: 'GET',
      url: `https://imdb236.p.rapidapi.com/imdb/${id}/details`,
      headers,
      timeout: 15000 // Increased timeout for potentially slow API
    };
    
    // First, try to get detailed movie information
    try {
      console.log(`Making API request to: ${movieDetailsOptions.url}`);
      const response = await axios.request(movieDetailsOptions);
      console.log(`API Response status: ${response.status}`);
      
      // Extract data with fallbacks for different API response structures
      let movieData = {};
      
      if (response.data && response.data.data) {
        movieData = response.data.data;
      } else if (response.data) {
        movieData = response.data;
      }
      
      // Ensure the movie has an id property
      if (!movieData.id) {
        movieData.id = id;
      }
      
      // Debug - log the structure of the response
      console.log(`Movie data fields: ${Object.keys(movieData).join(', ')}`);
      
      return res.json(movieData);
    } catch (detailsError) {
      console.error(`Could not get details for ${id}:`, detailsError.message);
      
      // Log the specific error for debugging
      if (detailsError.response) {
        console.error("API Error Details:", {
          status: detailsError.response.status,
          statusText: detailsError.response.statusText
        });
      }
      
      console.log("Falling back to search in cached movies");
      
      // Fallback: Search for the movie in our cached lists
      try {
        const [boxOfficeRes, popularRes, top250Res] = await Promise.all([
          axios.request(boxOfficeOptions),
          axios.request(popularOptions),
          axios.request(top250Options)
        ]);
        
        const boxOfficeData = boxOfficeRes.data.data || boxOfficeRes.data || [];
        const popularData = popularRes.data.data || popularRes.data || [];
        const top250Data = top250Res.data.data || top250Res.data || [];
        
        // Combine all movie lists and find the requested movie
        const allMovies = [
          ...boxOfficeData,
          ...popularData,
          ...top250Data
        ];
        
        // Try to find an exact ID match
        let movie = allMovies.find(m => m.id === id);
        
        // If not found, try with string comparison
        if (!movie) {
          movie = allMovies.find(m => String(m.id) === String(id));
        }
        
        if (movie) {
          console.log(`Found movie ${id} in cached lists`);
          return res.json(movie);
        } else {
          console.log(`Movie ${id} not found in any list`);
          return res.status(404).json({ error: 'Movie not found' });
        }
      } catch (fallbackError) {
        console.error("Fallback search error:", fallbackError.message);
        return res.status(500).json({ error: 'Failed to fetch movie details' });
      }
    }
  } catch (error) {
    console.error("Movie details fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

// Debug endpoint for genres
app.get('/api/debug/genres', async (req, res) => {
  try {
    console.log("Fetching available genres from API...");
    
    // Get valid genres from API
    const genresResponse = await axios.request({
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/genres',
      headers
    });
    
    const genres = genresResponse.data.data || genresResponse.data || [];
    console.log("Available genres:", genres);
    
    // Try a test search with "drama" genre (lowercase)
    console.log("Testing search with lowercase 'drama'...");
    const lowerResponse = await axios.request({
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/search',
      params: { 
        type: 'movie',
        genre: 'drama',
        rows: '5',
        sortOrder: 'DESC',
        sortField: 'startYear'
      },
      headers
    });
    
    const lowerResults = lowerResponse.data.data || lowerResponse.data || [];
    
    // Try a test search with "Drama" genre (capitalized)
    console.log("Testing search with capitalized 'Drama'...");
    const upperResponse = await axios.request({
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/imdb/search',
      params: { 
        type: 'movie',
        genre: 'Drama',
        rows: '5',
        sortOrder: 'DESC',
        sortField: 'startYear'
      },
      headers
    });
    
    const upperResults = upperResponse.data.data || upperResponse.data || [];
    
    // Return debugging info
    res.json({
      availableGenres: genres,
      testResults: {
        lowercase: {
          count: lowerResults.length,
          sample: lowerResults.slice(0, 2)
        },
        capitalized: {
          count: upperResults.length,
          sample: upperResults.slice(0, 2)
        }
      }
    });
  } catch (error) {
    console.error("Genre debug error:", error.message);
    
    if (error.response) {
      console.error("API error details:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to debug genres', 
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
