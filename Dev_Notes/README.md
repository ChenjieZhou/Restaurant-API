## Creating RESTful API

## 1. Setting up our Node Project Skeleton

```
npm init
```

Change `"main"` in `package.json` to `"dist"`

Install packages

```
npm install --save express mongoose body-parser
npm install --save-dev nodemon eslint babel-cli babel-core babel-eslint babel-preset-es2015 babel-preset-stage-0
```
- `--save-dev` are only dev tools those we need.

- body-parser: Parse object.

- nodemon: watch the change of code and auto restart.

- eslint: check error.

- babel: transform ES6 code to ES5

Add eslint config to make it work

```
  "eslintConfig":{
    "parserOptions": {
      "ecmaVersion": 7,
      "sourceType": "module"
    },
    "env":{
      "node": true  //node enviroment
    },
    "rules":{
      "no-console":0,       //false, or we could not use console.log
      "no-unused-vars":1     //true, watch vars usage    
      }
  }
```

Create `.babelrc` file 

```
{
  "presets":[
    "es2015",
    "stage-0"
  ]
}
```


Add these to `"scripts"` that we could use `npm run bulid` to build project or use `npm run lint` to check our code.
This is config for babelrc

```
"dev": "NODE_ENV=development nodemon -w src --exec \"babel-node src --presets es2015,stage-0\"",  //run babel-node src  every time when src changes
"build": "babel src -s -D -d dist --presets es2015,stage-0",   //copy src files to dist folder
"start": "NODE_ENV=production pm2 start dist", //process manage to start
"prestart": "npm run -s build", //use npm run prestart to build and copy to dist folder
"lint": "eslint src",  // use npm run lint to check error of code
```
.babelrc

```
{
  "presets":[
    "es2015",
    "stage-0"
  ]
}
```


## 2. Setting up MongoDB for Node API
Create `src/index.js` file

```
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import config from './config';
import routes from './routes';


let app = express();
app.server = http.createServer(app);


//middleware
//parse application/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));


//passport config


//api routes v1
app.use('/v1', routes);

app.server.listen(config.port);

console.log(`Start on port ${app.server.address().port}`);

export default app;
```

Create `src/config/index.js` to set some properties.

```
export default {
  "port": 3005,
  "mongoUrl" : "mongodb://localhost:27017/restaurant-api",
  "bodyLimit": "100kb"
}
```

Create `src/routes/index.js`

```
import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import restaurant from '../controller/restaurant'

let router = express();

//connect to database
initializeDb(db => {

  //internal middleware
  router.use(middleware({config, db}));
  //api routers v1 (/v1)

  router.use('/restaurant', restaurant({config, db}));
})

export default router;
```

Create `src/db.js`

```
import mongoose from 'mongoose';
import config from './config';

export default callback => {
  let db = mongoose.connect(config.mongoUrl);   // connect to mongodb
  callback(db); //when we import this, we connect database and call back whatever in it.
}
```

Create `middleware/html.js`

```
import {Router} from 'express';

export default({ config, db}) => {
  let api = Router();

  //add middleware

  return api;

}
```


## 3. Adding Data (POST requests in Node)

create `controller/restaurant.js`

```
import mongoose from 'mongoose';
import {Router} from 'express';
import Restaurant from '../model/restaurant';

export default({config, db}) => {
  let api = Router();

  // CRUD Create Read Update Delete

  //'/v1/restaurant/add'
  api.post('/add', (req, res) => {
    let newRest = new Restaurant();
    newRest.name = req.body.name;

    newRest.save(err => {
      if(err) {
        res.send(err);
      }
      res.json({message: 'restaurant saved successfully'});
    });
  });
  return api;
}
```

create `model/restaurant.js`
This is the property of Restaurant

```
import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let restaurantSchema = new Schema({
  name: String,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
```

## 4. Retrieving Data (GET requests in Node)
Add to `model/restaurant.js`

```
// '/v1/restaurant'  - Read
  api.get('/', (req, res) => {
    Restaurant.find({}, (err, restaurant) =>{  //find({}) means reaturn everythings, if something in {} means return some thing specifc
      if(err) {
        res.send(err);
      }
      res.json(restaurant);
    });
  });

  // '/v1/restaurant/:id'  - Read 1
  api.get('/:id',(req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) => {
      if(err) {
        res.send(err);
      }
      res.json(restaurant);
    });
  });

```

## 5. Updating Data (PUT requests in Node)
Add to `model/restaurant.js`

```
// 'v1/restaurant/:id'  -Update
  api.put('/:id', (req, res) => {
    Restaurant.findById(req.params.id, (err, restaurant) =>{
      if(err) {
        res.send(err);
      }
      restaurant.name = req.body.name;
      restaurant.save(err => {
        if(err){
          res.send(err);
        }
        res.json({message: "Restaurant info updated"});
      });
    });
  });

```
## 6. Deleting Data (DELETE requests in Node)

```
// 'v1/restaurant/:id'  --Delete

  api.delete('/:id',(req, res) => {
    Restaurant.remove({
      _id: req.params.id
    },(err, restaurant) => {
      if (err) {
        res.send(err);
      }
      res.json({message: "Restaurant Successfully Removed!"});
    });
  });
```

## 7. Start FoodTruck API
Change all `Restaurant` to `FoodTruck` and `restaurant` to `foodtruck`

Creat `model/review.js` as the Schema of Reviews

```
import mongoose from 'mongoose';
import FoodTruck from './foodtruck';
let Schema =  mongoose.Schema;

let ReviewSchema = new Schema({
  title:{
    type:String,
    require:true
  },
  text:String,
  foodtruck:{
    type:Schema.Types.ObjectID,  //As an obj of FoodTruck
    ref:'FoodTruck',
    require:true
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
```

 Change `model/foodtruck.js` as folowing
 
```
 import Review from './review';

let Schema = mongoose.Schema;

let FoodTruckSchema = new Schema({
  name: {
    type:String,
    required:true
  },
  foodtype:{
    type:String,
    required:true
  },
  avgcost:Number,
  geometry:{
    type:{type:String, default:'Point'},
    coordinates:[Number]
  },
  reviews:[{type: Schema.Types.ObjectId, ref:'Review'}]
});
```

Add following to `controller/foodtruck.js`

```
  //Add review for a specific foodtruck id
  // '/v1/foodtruck/review/add/:id'
  api.post('/reviews/add/:id', (req, res) =>{
    FoodTruck.findById(req.params.id,(err, foodtruck)=>{
      if(err){
        res.send(err);
      }

      let NewReview = new Review();

      newReview.title = req.body.title;
      newReview.text = req.body.text;
      newReview.foodtruck = foodtruck._id;
      NewReview.save((err,review) =>{
        if(err){
          res.send(err);
        }
        foodtruck.reviews.push(newReivew);      //this gonna push the array of reviews to reviews in foodtruck controller
        foodtruck.save(err=>{
          if(err){
            res.send(err);
          }
          res.json({message:'FoodTruck review saved!'})
        });
      });
    });
  });
```

Modify following to `controller/foodtruck.js`

```
  api.post('/add', (req, res) => {
    let newFoodTruck = new FoodTruck();
    newFoodTruck.name = req.body.name;
    newFoodTruck.foodtype = req.body.foodtype;
    newFoodTruck.avgcost = req.body.avgcost;
    newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;

    newFoodTruck.save(err => {
      if(err) {
        res.send(err);
      }
      res.json({message: 'foodtruck saved successfully'});
    });
  });
```

And don't forget import `Review` in `controller/foodtruck.js`

```
import Review from '../model/review';
```

Add these to get review by id and get foodtype by name

```
//get reviews for a specific food truck id
  //'/v1/foodtruck/reviews/:id'
  api.get('/reviews/:id',(req, res) => {
    Review.find({foodtruck: req.params.id}, (err, reviews) =>{
      if(err){
        res.send(err);
      }
      res.json(reviews);
    });
  });
  

  api.get('/foodtype/:foodtype', (req, res) =>{
    FoodTruck.find({foodtype: req.params.foodtype}, (err, foodtrucks) =>{
      if(err){
        res.send(err);
      }
      res.json(foodtrucks);
    });
  });
```
  


