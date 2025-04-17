// server/index.js
import express from "express";
import axios from "axios";
import company from "./api/json/company.json" with {type: "json"}; // Importing JSON data from a file
const app = express();
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const CORS = cors();
app.use(CORS);
const PORT = 3001;

const movieOptions = { //get from api
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

import User from './models/user.js';
import { syncModels } from "./models/index.js";

syncModels();

app.get("/api/company", (req, res) => {
  return res.json(company);
});

app.get("/api/user", async (req, res) => {
  // Find all users
    const users = await User.findAll();
  return res.json(users);
});

app.get('/api/movie', async (req, res) => {
  // Find all movies
  try {
    const response = await axios.request(movieOptions); 
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from external API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/api/movie/popular', async(req, res) => {
  try {
		const response = await axios.request(popularOptions);
		console.log(response.data);
	} catch (error) {
		console.error('Error fetching from external API:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' }); 
	}
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
