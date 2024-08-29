const mongoose = require('mongoose');
const initData = require('./data');
const listing = require('../models/listing');
const MONGO_URL = 'mongodb://localhost:27017/WanderWave';

main()
.then(() =>
     console.log('Database connected!'))
.catch(err =>
     console.log(err));

async function main() {
await mongoose.connect(MONGO_URL);
 console.log('Database connected!');
}

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log('Data was initialized!');
}
initDB();