import mongoose from 'mongoose';
import config from './config';

export default callback => {
  let db = mongoose.connect(config.mongoUrl);   // connect to mongodb
  callback(db); //when we import this, we connect database and call back whatever in it.
}
