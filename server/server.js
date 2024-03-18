require("dotenv").config();
const express = require("express");  // to import the express app

const db = require("./db");

const cors = require("cors");

const app = express(); // we created an instance of express and stored it in a variable called app

app.use(cors());           // this is done so that two different domains can send api requests to each other
app.use(express.json());

/*
//Middleware. It should be placed above the route handler as execution is from top to down
app.use((req, res, next) => {
    res.status(404).json({
        status : "fail"
    });     // from middleware, we can also send back the response to a user
    next();                                 // this is done so that the middleware passes the request to the next middleware/route handler
});

*/

app.use("/", (req,res) => {
  res.send("server is running");
});

//To define a route in express, first we have to reference the express instance(object)
app.get("/api/v1/restaurants", async (req, res) => {       // () is a callback function which triggers when a get request comes. It takes 2 params req(stores the request) and res(stores the response)

   
   // res.send();      // used to send a response
   
   //res.status(404).json()    // status is used to change the status code.

   try {
    //const results = await db.query("select * from restaurants");  // await is used as query takes time to complete

    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;"
    );
   

   res.status(200).json({
     status: "success",

     results: restaurantRatingsData.rows.length,        // it is a good practice to get the no. of results
     data : {
        restaurant: restaurantRatingsData.rows,
      },
    });
   } catch (err) {
    console.log(err);
   }

/*
   res.json({          // API sends the data back in a json format
    status : "success",
    data : {
        restaurant : ["mcdonalds", "wendys"],
    }
    
   });

*/

});


// Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {    // id is a url parameter(thing after :)
    //console.log(req);     // gives the content of the request object
    console.log(req.params.id);

    try{
        //const results = await db.query("select * from restaurants where id = $1", [req.params.id]);   //template string is bad as it is prone to sql injection attacks
        // select * from restaurants where id = req.params.id
        // so we used a parameterised query. When we go to make this query, we are going to pass the first item in the array to $1

        const restaurant = await db.query(
          "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
          [req.params.id]
        );

        const reviews = await db.query(
          "select * from reviews where restaurant_id = $1",
          [req.params.id]
        );
        console.log(reviews);
    
      
      res.status(200).json({
        String: "success",
        data : {
          restaurant: restaurant.rows[0],
          reviews: reviews.rows,
        }
      });
    
      } catch (err) {
        console.log(err);
      }
});



// Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {    
    console.log(req.body);

    try{

      const results = await db.query("INSERT INTO restaurants(name, location, price_range) values ($1, $2, $3) returning *", [req.body.name, 
      req.body.location, req.body.price_range]);

      console.log(results);
      res.status(201).json({
        status: "success",
        data : {
          restaurant: results.rows[0],
          },
    });

    } catch(err) {
      console.log(err);
    }
});


//update a restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
    console.log(req.params.id);
    console.log(req.body);

    try{

      const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *", [req.body.name, 
      req.body.location, req.body.price_range, req.params.id]);

  
      res.status(200).json({
        status: "success",
        data : {
          restaurant: results.rows[0],
          },
    });

    } catch(err) {
      console.log(err);
    }
});


//Delete a restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try{

    const results = await db.query("DELETE FROM restaurants where id = $1", [req.params.id]);

    res.status(204).json({
      status: "success",
  });

  } catch(err) {
    console.log(err);
  }
});




app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});



const port = process.env.PORT || 3001;  // 3001 is used in case when we dont give an environment variable

app.listen(port, () => {
    console.log(`The server is up and listening on port ${port}`);
});