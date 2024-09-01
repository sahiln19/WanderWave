const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const methodOverride = require('method-override')
const listing = require('./models/listing');
const ejsMate = require('ejs-mate');
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


//index route 
app.get('/listings', async(req, res) => {
  const allListings = await listing.find({})
    res.render('./listings/index.ejs', {allListings});
});
//New ROUTE
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

//show route  
app.get('/listings/:id', async(req, res) => {
  const {id} = req.params;
  const Listing = await listing.findById(id);
    res.render('./listings/show.ejs', {Listing});
});

//create route
app.post('/listings', async(req, res) => {
    const newListing = new listing(req.body.Listing);
    await newListing.save();
    res.redirect(`/listings`);
});

//Edit route
app.get('/listings/:id/edit', async(req, res) => {
    const {id} = req.params;
    const Listing = await listing.findById(id);
    res.render('./listings/edit.ejs', {Listing});
}); 

//update route
app.put('/listings/:id', async(req, res) => {
    const {id} = req.params;
    const Listing = await listing.findByIdAndUpdate(id, {...req.body.Listing});
    res.redirect(`/listings/${id}`);
})

//Delete route
app.delete('/listings/:id', async(req, res) => {
    const {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

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



app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
