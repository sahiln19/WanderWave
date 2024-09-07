let express = require('express');
let router = express.Router( {mergeParams: true }); 
let  wrapAsync = require('../utils/wrapAsync');
let  ExpressError = require('../utils/ExpressError');
let  {reviewSchema } = require('../schema.js');
let  review = require('../models/Review'); 
let  listing = require('../models/listing.js');

 
let  validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
  }
//Reviews
//Post Review route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let Listing = await listing.findById(req.params.id);
    
    // Ensure listing exists
    if (!Listing) {
        return res.status(404).send("Listing not found");
    }
    
    let newReview = new review(req.body.review);
    Listing.reviews.push(newReview);
    await newReview.save();
    await Listing.save();
    req.flash('success', 'Successfully Created New Review!');
    res.redirect(`/listings/${Listing._id}`);
  }));
  
  //Delete Review route
  router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${id}`);
  }));


module.exports = router;