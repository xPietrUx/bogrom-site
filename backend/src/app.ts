import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import apiRoutes from './api';

const app = express();

app.set('trust proxy', 1);

// Global middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Main router's API
app.use('/api', apiRoutes);

// Middleware for 404
app.use((req, res) => {
    res.status(404).json({ message: '404 - Nie znaleziono!' });
});

export default app;
