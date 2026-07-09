require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const start = async () => {
    // Connect to MongoDB first, then start server
    await connectDB();

    const server = app.listen(PORT, () => {
        console.log(
            `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
        );
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.error(`Unhandled Rejection Error: ${err.message}`);
        server.close(() => process.exit(1));
    });
};

start();
