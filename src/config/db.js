import mongoose from 'mongoose';

const connectDB = async () => {
    //  console.log('MONGO_URI', process.env.MONGO_URI);
  try {
    // Ensure the MONGO_URI environment variable is set
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
