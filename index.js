const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const enforce = require('express-sslify');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const bugRoute = require('./routes/bug.route');
const userRoute = require('./routes/user.route');

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(enforce.HTTPS({ trustProtoHeader: true }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h3>Huh? 😜</h3>');
});

app.use('/bugs', bugRoute);
app.use('/users', userRoute);

// handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err
    });
  });
  
connectDB();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));