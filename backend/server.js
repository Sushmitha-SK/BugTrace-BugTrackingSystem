const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const bugRoutes = require('./routes/bugRoutes');
const projectRoutes = require('./routes/projectRoutes');

require("dotenv").config();

// connectToMongo();
const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
    console.log("MongoDB Connected");
});


// Available Routes
app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/projects', projectRoutes);


app.listen(port, () => {
    console.log(`BugTrace backend listening at ${port}`)
});

// Export the Express API
module.exports = app