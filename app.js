require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SECRET,
})

// database
const connectDB = require('./db/connect');

const imageRouter = require('./routes/imageRoutes');
const authRouter = require('./routes/authRoutes');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const {rmvUnusedImgs} = require('./utils/rmvUnusedImg');

//security packages
const helmet = require('helmet');
const xss = require('xss-clean');

const rateLimiter = require('express-rate-limit');

const apiLimiter = rateLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: {
    msg: "Too many atempts from this IP, please try again in 24 hours"
  }
})



// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const authenticateUser = require('./middleware/authentication');
const swaggerDocument = YAML.load('./swagger.yaml');

app.set('trust proxy', 1)
app.use(morgan('tiny'))
app.use(express.static('./public'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())
app.use(fileUpload({
  useTempFiles:true
}))
app.use(helmet());
app.use(xss());


app.get('/', (req, res) => {
  res.send('<h1>Cermuel</h1><a href="/api-docs">Link to documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/images', imageRouter);

app.get('/remove', apiLimiter, authenticateUser,async (req, res)=>{
  await rmvUnusedImgs()
   res.send('Unused Images Removed')
})

// middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);





const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

cron.schedule('* * * * 0', () => {
  rmvUnusedImgs()
  .then(result=>console.log("Unused Images Deleted"))
  .catch(err=>console.log('error deleting images'));
});
