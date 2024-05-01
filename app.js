const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');   

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/backendProject', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

// Define user schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile('./front.html');
})

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user) {
            if (user.password === password) {
                res.sendFile(__dirname + '/public/index.html'); // Successful login
            } else {
                console.log('Password is wrong'); // Incorrect password
                console.log(username, password);
                res.send('Invalid username or password.');
            }
        } else {
            console.log('User not found'); // User not found
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Signup route
// Signup route
app.post('/signup', async (req, res) => {
    const { newUsername, newPassword } = req.body; // Correct field names
    try {
        const existingUser = await User.findOne({ username: newUsername }); // Check for existing user
        if (existingUser) {
            res.send('Username already exists');
        } else {
            const newUser = new User({ username: newUsername, password: newPassword }); // Create new user instance
            await newUser.save(); // Save user to the database
            res.send('Signup successful! You can now login.');
            
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
})

// Validator route
app.get('/validateUsername/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (user) {
            res.send('Username already exists');
        } else {
            res.send('Username available');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/contactus.html' , (req, res) => {
    res.sendFile(__dirname + '/public/contactus.html');
})
app.get('/About.html' , (req, res) => {
    res.sendFile(__dirname + '/public/About.html');
})

// Validator route for checking if username exists during login
app.get('/validateLogin/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (user) {
            res.send('Username found');
        } else {
            res.send('Username not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// Serve login.html via GET request
app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.listen(5581, () => {
    console.log('Server is running on port 5581');
});
