const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;
const apiKey = '4b6ae1c38276f2d6a391a4f6a5282249';
const apiUrl = 'https://api.themoviedb.org/3';

app.use(cors());

app.use(express.json());
const pool = new Pool({
  user: 'omar',
  host: 'Hamada', 
  database: 'movieLibDB', 
  password: '0000', 
  port: 5432, 
});


function Movie(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

app.get('/', async (req, res) => {
  try {
    const url = `${apiUrl}/trending/all/week?api_key=${apiKey}&language=en-US`;
    const response = await axios.get(url);
    const data = response.data;

    const movies = data.results.map(movie => {
      return new Movie(
        movie.id,
        movie.title,
        movie.release_date,
        movie.poster_path,
        movie.overview
      );
    });

    res.json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const encodedQuery = encodeURIComponent(query);
    const url = `${apiUrl}/search/movie?api_key=${apiKey}&language=en-US&query=${encodedQuery}`;
    const response = await axios.get(url);
    const data = response.data;

    const movies = data.results.map(movie => {
      return new Movie(
        movie.id,
        movie.title,
        movie.release_date,
        movie.poster_path,
        movie.overview
      );
    });

    res.json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});

app.get('/top-rated', async (req, res) => {
  try {
    const url = `${apiUrl}/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;
    const response = await axios.get(url);
    const data = response.data;

    const movies = data.results.map(movie => {
      return new Movie(
        movie.id,
        movie.name,
        movie.first_air_date,
        movie.poster_path,
        movie.overview
      );
    });

    res.json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});

app.get('/languages', async (req, res) => {
  try {
    const url = `${apiUrl}/configuration/languages?api_key=${apiKey}`;
    const response = await axios.get(url);
    const languages = response.data;

    res.json(languages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});


app.post('/addMovie', async (req, res) => {
  try {
    const { id, title, release_date, poster_path, overview } = req.body;

    const insertQuery = `
      INSERT INTO movies (id, title, release_date, poster_path, overview)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [id, title, release_date, poster_path, overview];

    const result = await pool.query(insertQuery, values);
    const savedMovie = result.rows[0];

    res.json(savedMovie);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});

app.get('/getMovies', async (req, res) => {
  try {
    const selectQuery = 'SELECT * FROM movies;';
    const result = await pool.query(selectQuery);
    const movies = result.rows;

    res.json(movies);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});




app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    const updateQuery = `
      UPDATE movies
      SET comments = $1
      WHERE id = $2
      RETURNING *;
    `;

    const values = [comments, id];

    const result = await pool.query(updateQuery, values);
    const updatedMovie = result.rows[0];

    res.json(updatedMovie);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});




app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `
      DELETE FROM movies
      WHERE id = $1;
    `;

    const values = [id];

    await pool.query(deleteQuery, values);

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});




app.get('/getMovie/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const selectQuery = 'SELECT * FROM movies WHERE id = $1;';
    const values = [id];

    const result = await pool.query(selectQuery, values);
    const movie = result.rows[0];

    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({
        status: 404,
        responseText: 'Movie not found'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  }
});



  
  app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      responseText: 'Page not found'
    });
  });
  

    

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });



  