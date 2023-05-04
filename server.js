const express = require('express');

const app = express();
const port = 3000

const data= require("./movie data/data.json")

function Movie(title,poster_path,overview){
  this.title=title;
  this.poster_path=poster_path;
  this.overview=overview;
  }

  app.get('/', movieData )
  function movieData(req,res){
      let result=[];
      const newMovie= new Movie(data.title,data.poster_path,data.overview)
      result.push(newMovie)
      res.json(result);
  }

  app.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page');
  });
  

  app.use("*", handleNtFoundError)
  app.use("*", handleServerError)
  
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

    

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });



  