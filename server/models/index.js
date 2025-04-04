import sequelize from '../config/database.js';
import User from './user.js';
import Movie from './movie.js'; 


 
const options = { //get from api
  method: 'GET',
  url: 'https://imdb236.p.rapidapi.com/imdb/',
  headers: {
    'x-rapidapi-key': 'c07d5b540fmsh06d48509516eda8p15cf75jsn5d66c8561424',
    'x-rapidapi-host': 'imdb236.p.rapidapi.com'
  }
};

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
      await sequelize.sync({ alter: true }); // Use { force: true } to drop tables
      console.log('All models were synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing models:', error);
    }
    // Generate 10 users
    const users = [];
    for (let i = 1; i <= 10; i++) {
        users.push({
            username: `User ${i}`,
            email: `user${i}@example.com`,
            // Add other properties as needed
        });
    }

    const movies = [];
    for (let i = 1; i <= 10; i++) {
      movies.push({
          
          primaryTitle: `Movie ${i}`,
          releaseDate: `Movie ${i}`,
          description: `Plot: ${i}`,
          // Add other properties as needed
      });
  }

  Movie.bulkCreate(movies)//insert          
        .then(() => {
            console.log('Users inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting users:', error);
        });

    // Insert users into the table
    User.bulkCreate(users)
        .then(() => {
            console.log('Users inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting users:', error);
        });

  };
  
 export {
    sequelize, User, Movie, syncModels
  };
  