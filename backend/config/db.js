const mongoose = require("mongoose");

const DB_URI = 'mongodb+srv://sushmitha:test123@cluster0.pfqzsbm.mongodb.net/bug_ticket_management_system?retryWrites=true&w=majority';

//Connect to MongoDB database
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //  useCreateIndex: true,
        });
        console.log('MongoDB Atlas connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error.message);
        process.exit(1);// Exit the process with a failure code
    }
};

//Handling database connection events
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Atlas');
})

mongoose.connection.on('error', (error) => {
    console.log('MongoDB Atlas connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB Atlas');
});

// Close the database connection when the Node.js process is terminated

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB Atlas connection closed due to application termination');
        process.exit(0);// Exit the process with a success code

    } catch (error) {
        console.error('Error closing MongoDB Atlas connection:', error.message);
        process.exit(1);// Exit the process with a failure code
    }
});

module.exports = connectDB;
