let mongoose = require('mongoose');
let Schema  = mongoose.Schema;

const listingSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
  },
  description: String,
  image: {
      url: {
          type: String,
              set: (v) => 
               v === "" 
                  ? 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  : v,
          },
      
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
      {
          type: Schema.Types.ObjectId,
          ref: 'review'
      }
  ],
});

const listing = mongoose.model('listing', listingSchema);
module.exports = listing;