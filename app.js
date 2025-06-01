import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from './config/env.js';
//ROUTES
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json()); // This allows our app to handle json data sent in request
app.use(express.urlencoded({ extended: false })); // This helps us to process the form data sent via Html forms in a simple format
app.use(cookieParser()); // Reads cookies from incoming requests so our apps can store user data
app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);


app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send("Welcome to the subscription tracker api");
})

app.listen(3000, async () => {
    console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);
    await connectToDatabase();
});

export default app;