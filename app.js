let  express = require('express');
let  app = express();
let  mongoose = require('mongoose');
let  path = require('path')
let  methodOverride = require('method-override') 
let  ExpressError = require('./utils/ExpressError');
let  { listingSchema, reviewSchema } = require('./schema.js');
let  ejsMate = require('ejs-mate'); 
let  listings = require('./routes/listing');
let session = require('express-session');
let  reviews = require('./routes/review');
let  MONGO_URL = 'mongodb://localhost:27017/WanderWave';
let  flash = require('connect-flash');  

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

let sessionOptions = {
    secret : 'mysupersecretcode',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);


app.all('*', (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  let  { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render('error', { message });
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
