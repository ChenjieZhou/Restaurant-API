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
