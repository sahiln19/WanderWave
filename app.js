const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const listing = require('./models/listing');
const review = require('./models/Review');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require('./schema.js');
const ejsMate = require('ejs-mate');
const Review = require('./models/Review');
const MONGO_URL = 'mongodb://localhost:27017/WanderWave';

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log('Database connected!');
}

main().catch(err => {
    console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

const validateListing = (req, res, next) => {
  let error = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(',');
      throw new ExpressError(400, errMsg);
  }else { 
    next();
  }
}

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(',');
      throw new ExpressError(400, errMsg);
  } else {
      next();
  }
}

//index route 
app.get('/listings', wrapAsync(async(req, res) => {
  const allListings = await listing.find({})
    res.render('./listings/index.ejs', {allListings});
}));
//New ROUTE
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

//show route  
app.get('/listings/:id', wrapAsync(async(req, res) => {
  const {id} = req.params;
  const Listing = await listing.findById(id).populate("reviews"); 
    res.render('./listings/show.ejs', {Listing});
})); 

//create route
app.post('/listings', validateListing ,wrapAsync(async(req, res, next) => {
        const { title, description, image, price, location, country } = req.body.Listing;
        const newListing = new listing({
          title,description,image,price,location,country,  
        }); 
        await newListing.save();
        res.redirect('/listings');
}));

//Edit route
app.get('/listings/:id/edit', wrapAsync(async(req, res) => {
    const {id} = req.params;
    const Listing = await listing.findById(id);
    res.render('./listings/edit.ejs', {Listing});
})); 

//update route
app.put('/listings/:id', validateListing , wrapAsync(async(req, res) => {
    const {id} = req.params;
    const Listing = await listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listings/${id}`);
}))

//Delete route
app.delete('/listings/:id', wrapAsync(async(req, res) => {
    const {id} = req.params;
    await listing.findByIdAndDelete(id); 
    res.redirect('/listings'); 
}));

//Reviews  
//Post Review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  let Listing = await listing.findById(req.params.id);
  
  // Ensure listing exists
  if (!Listing) {
      return res.status(404).send("Listing not found");
  }
  
  let newReview = new review(req.body.review);
  Listing.reviews.push(newReview);
  await newReview.save();
  await Listing.save();
  res.redirect(`/listings/${Listing._id}`);
}));

//Delete Review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}));


// app.get("testListing", async (req, res) => {
//     const sampleListings = new listing({
//       title : "sample title",
//         price : 100,
//         description : "sample description",
//         location : "sample location",
//         country : "sample country",
//     }) 
//     res.json(sampleListings);
// });
app.all('*', (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render('error', { message });
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
