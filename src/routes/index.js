import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';

let route = express();

//connect to database
initializeDb(db => {

  //internal middleware
  route.use(middleware({config, db}));
  //api routers v1 (/v1)
})

export default router;
