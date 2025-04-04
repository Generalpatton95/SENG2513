// server/index.js
import express from "express";
import company from "./api/json/company.json" with {type: "json"}; // Importing JSON data from a file
const app = express();
import cors from "cors"; // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const CORS = cors();
app.use(CORS);
const PORT = 3001;
import User from './models/user.js';
import Movie from './models/movie.js'; 
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

app.get("/api/movie", async (req, res) => {
  // Find all movies
    const movies= await Movie.findAll();
    return res.json(movies);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
