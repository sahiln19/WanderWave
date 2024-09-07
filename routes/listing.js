let express = require('express');
let router = express.Router();
let  listing = require('../models/listing');
let  wrapAsync = require('../utils/wrapAsync');
let  { listingSchema} = require('../schema.js');
let  ExpressError = require('../utils/ExpressError');


let validateListing = (req, res, next) => {
  let error = listingSchema.validate(req.body);
  if (error && error.details) {  // Add a check for error.details
      let errMsg = error.details.map((el) => el.message).join(',');
      throw new ExpressError(400, errMsg);
  } else { 
      next();
  }
}


//index route 
router.get('/', wrapAsync(async(req, res) => {
    let allListings = await listing.find({})
      res.render('./listings/index.ejs', {allListings});
  }));
  //New ROUTE
  router.get('/new', (req, res) => {
      res.render('./listings/new.ejs');
  });
  
  //show route  
  router.get('/:id', wrapAsync(async(req, res) => {
    let {id} = req.params;
    let Listing = await listing.findById(id).populate("reviews"); 
    if (!Listing) {
      req.flash('error', 'Listing you requested for does not exists!');
      return res.redirect('/listings');
    }
      res.render('./listings/show.ejs', {Listing});
  })); 

  //create route
router.post('/', validateListing ,wrapAsync(async(req, res, next) => {
    let { title, description, image, price, location, country } = req.body.Listing;
    let newListing = new listing({
      title,description,image,price,location,country,  
    }); 
    await newListing.save();
    req.flash('success', 'Successfully Created New Listing!');
    res.redirect('/listings');
}));

//Edit route
router.get('/:id/edit', wrapAsync(async(req, res) => {
let {id} = req.params;
let Listing = await listing.findById(id);
if (!Listing) {
  req.flash('error', 'Listing you requested for does not exists!');
  return res.redirect('/listings');
}
res.render('./listings/edit.ejs', {Listing});
})); 

//update route
router.put('/:id', validateListing , wrapAsync(async(req, res) => {
let {id} = req.params;
let Listing = await listing.findByIdAndUpdate(id, {...req.body.Listing});
req.flash('success', 'Listing Updated!');
res.redirect(`/listings/${id}`);
}))

//Delete route
router.delete('/:id', wrapAsync(async(req, res) => {
let {id} = req.params;
await listing.findByIdAndDelete(id); 
req.flash('success', 'Listing Deleted!');
res.redirect('/listings'); 
}));

module.exports = router;