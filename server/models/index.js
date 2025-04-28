import sequelize from '../config/database.js';
import User from './user.js';
import axios from 'axios'; // Add missing axios import

// Define API options - currently undefined in your code
const options = {
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/top-box-office', // Example endpoint
  headers: {
    'x-rapidapi-key': 'c07d5b540fmsh06d48509516eda8p15cf75jsn5d66c8561424',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

// Fetch data from API and return the result
export async function fetchData() {
  try {
    const response = await axios.request(options);
    console.log('API data fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Error fetching API data:', error);
    throw error; // Propagate error for handling by caller
  }
}

// Synchronize database models and seed initial data
const syncModels = async () => {
  try {
    // Synchronize models with database
    await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
    console.log('All models were synchronized successfully.');
    
    // Check if users already exist to prevent duplicate seeding
    const count = await User.count();
    if (count === 0) {
      // Generate 10 users
      const users = [];
      for (let i = 1; i <= 10; i++) {
        users.push({
          username: `User ${i}`,
          email: `user${i}@example.com`,
          // Add other properties as needed
        });
      }

      // Insert users into the table
      await User.bulkCreate(users);
      console.log('Users inserted successfully.');
    } else {
      console.log(`Skipping user seeding: ${count} users already exist.`);
    }
    
    return true; // Indicate successful synchronization
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error; // Propagate error for handling by caller
  }
};

export {
  sequelize, 
  User, 
  syncModels
};