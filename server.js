const express = require("express");
const app = express();
const axios = require("axios");
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");

// db config
const dbConfig = {
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// db test
db.connect()
  .then(obj => {
    // Can check the server version here (pg-promise v10.1.0+):
    console.log('Database connection successful');
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// set session
app.use(
  session({
    secret: 'XASDASDA',
    saveUninitialized: true,
    resave: true,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const user = {
  student_id: undefined,
  username: undefined,
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  year: undefined,
  major: undefined,
  degree: undefined,
};

app.get("/", async (req, res)=> {
 res.redirect("/main");
});


app.post("/main", async (req, res)=> {
    const url = "http://www.themealdb.com/api/json/v1/1/search.php?s=" + req.body.food;
        
    await axios
    .get(url, {
        headers: { Accept: "application/json", "Accept-Encoding": "identity" }, // or "Accept-Encoding": "*"
      })
    .then((response) => {
       
        if(response.data.meals==null){
            console.log('null meals');
        }
        //console.log(response.data);
      res.render("pages/main",{data:response.data});
    })
    .catch((error) => {
      console.log(error);

    });

})  

app.get("/main", async (req, res) => {

      res.render("pages/main");
  });


app.post('/addReview',async (req, res) => {
    const query ="INSERT INTO reviews (recipe,review) VALUES ($1,$2);";

    db.any(query,[req.body.reviewNM,req.body.review]).then(function (data) {
    
    res.redirect("/reviews");
    }).catch(function (err) {
        console.log('error');
      });
});

app.get('/reviews', async (req, res) => {
const query = "SELECT * FROM reviews;"

db.any(query).then(function (data) {

 //console.log(data);   
res.render("pages/reviews",{data:data});

}).catch(function (err) {
    console.log('error');
  });
});


 

app.listen(3000);
console.log('Server is listening on port 3000');