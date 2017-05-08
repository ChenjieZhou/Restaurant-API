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
    type:Schema.Types.ObjectId,  //As an obj of FoodTruck
    ref:'FoodTruck',
    require:true
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
