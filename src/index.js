const express = require('express');
const cors = require('cors');
const path = require('path');
const recipeRoutes = require('./routes/recipes');
const mongoose = require('mongoose');

const app = express();
let PORT = process.env.PORT || 3000;

// Connect to MongoDB
const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/recipeApp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/recipes', recipeRoutes);

// Serve the saved recipes page
app.get('/saved-recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'saved-recipes.html'));
});

// Serve the main HTML file for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const startServer = async (retries = 0) => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, trying alternative...`);
        server.close();
        if (retries < 3) {
          PORT++;
          startServer(retries + 1);
        } else {
          console.error('Could not find an available port. Please free up port 3000 or specify a different port.');
          process.exit(1);
        }
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  shutdown();
});

process.on('SIGINT', () => {
  console.info('SIGINT signal received.');
  shutdown();
});

const shutdown = () => {
  console.log('Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
};
