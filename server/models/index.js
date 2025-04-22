import sequelize from '../config/database.js';
import User from './user.js';
import Movie from './movie.js';
import axios from 'axios'; // Make sure to import axios here


export async function fetchData() {
    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true }); 
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
    
    // Generate 10 users (your existing code)
    const users = [];
    for (let i = 1; i <= 10; i++) {
        users.push({
            username: `User ${i}`,
            email: `user${i}@example.com`,
            // Add other properties as needed
        });
    }

    // Insert users into the table
    try {
        await User.bulkCreate(users);
        console.log('Users inserted successfully.');
    } catch (error) {
        console.error('Error inserting users:', error);
    }

    // Add sample movies
    try {
        
        const options = {
          method: 'GET',
          url: 'https://imdb236.p.rapidapi.com/imdb/top250-movies',
          headers: {
            'x-rapidapi-key': '04af0fd518msh9d4bdf0e758a66cp1ddc6cjsn53bc644d704c',
            'x-rapidapi-host': 'imdb236.p.rapidapi.com'
          }
        };
        
        const response = await axios.request(options);
        const movieData = response.data.data || response.data;
        
        // Transform the API data to match our Movie model
        const movies = movieData.slice(0, 10).map(item => ({
            primaryImage: item.image || "",
            primaryTitle: item.primaryTitle || "",
            description: item.description || "",
            releaseDate: item.releaseDate || "",
            contentRating: item.contentRating || "",
            runtimeMinutes: item.runtimeMinutes || 0,
            genres: item.genres || "",
            averageRating: item.averageRating || 0
        }));
        
        await Movie.bulkCreate(movies);
        console.log('Movies from API inserted successfully.');

    } catch (error) {
        console.error('Error inserting movies:', error);
    }
};

export {
    sequelize, User, Movie, syncModels
};