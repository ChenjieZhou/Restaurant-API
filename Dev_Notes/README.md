## RESTFULL API Dev_Note

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


