import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 3001;

const boxOfficeOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top-box-office',
  headers: {
    'x-rapidapi-key': 'c07d5b540fmsh06d48509516eda8p15cf75jsn5d66c8561424',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

const popularOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/most-popular-movies',
  headers: {
    'x-rapidapi-key': 'c07d5b540fmsh06d48509516eda8p15cf75jsn5d66c8561424',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

const top250Options = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top250-movies',
  headers: {
    'x-rapidapi-key': 'c07d5b540fmsh06d48509516eda8p15cf75jsn5d66c8561424',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
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

// New endpoint to get movie details by ID
app.get('/api/movie/:id', async (req, res) => {
  const movieId = req.params.id;
  
  try {
    
    const [boxOfficeRes, popularRes, top250Res] = await Promise.all([
      axios.request(boxOfficeOptions),
      axios.request(popularOptions),
      axios.request(top250Options)
    ]);
    
    const boxOfficeData = boxOfficeRes.data.data || boxOfficeRes.data;
    const popularData = popularRes.data.data || popularRes.data;
    const top250Data = top250Res.data.data || top250Res.data;
    
    // Combine all movie lists and find the requested movie
    const allMovies = [
      ...boxOfficeData,
      ...popularData,
      ...top250Data
    ];
    
    const movie = allMovies.find(m => m.id === movieId);
    
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    console.error("Movie details fetch error:", error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
}); 

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
