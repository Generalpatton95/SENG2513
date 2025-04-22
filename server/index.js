import express from "express";
import axios from "axios";
import cors from "cors";
const app = express();
app.use(cors());
const PORT = 3001;
import { syncModels } from "./models/index.js";  

syncModels(); 

const boxOfficeOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top-box-office',
  headers: {
    'x-rapidapi-key': '04af0fd518msh9d4bdf0e758a66cp1ddc6cjsn53bc644d704c',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

const popularOptions = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/most-popular-movies',
  headers: {
    'x-rapidapi-key': '04af0fd518msh9d4bdf0e758a66cp1ddc6cjsn53bc644d704c',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

const top250Options = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top250-movies',
  headers: {
    'x-rapidapi-key': '04af0fd518msh9d4bdf0e758a66cp1ddc6cjsn53bc644d704c',
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

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
