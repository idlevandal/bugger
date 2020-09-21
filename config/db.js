const mongoose = require('mongoose');

const connectDB = async () => {
    const db = process.env.DATABASE;

    try {
        const conn = await mongoose.connect(
            db,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex:true,
            }
        )
        console.log(`Connected to mongodb - ${conn.connection.host}`);
    } catch (error) {
        console.log('💥 Error connecting to mongodb');
        console.log(error);
    }
}

module.exports = connectDB;