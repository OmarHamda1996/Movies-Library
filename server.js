const express = require('express');
const axios = require('axios');
const cors = require('cors');


const app = express();
const PORT = 3000;
const apiKey = '4b6ae1c38276f2d6a391a4f6a5282249';
const apiUrl = 'https://api.themoviedb.org/3';

app.use(cors());

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

  
  app.use((req, res, next) => {
    res.status(404).json({
      status: 404,
      responseText: 'Page not found'
    });
  });
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      status: 500,
      responseText: 'Sorry, something went wrong'
    });
  });

    

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });



  