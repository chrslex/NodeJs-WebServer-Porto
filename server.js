const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credential = require('./middleware/credentials');

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// Handle options credential check - before CORS!
// and fetch cookies credentials requirement
app.use(credential);

// 3rd-party cors middleware
app.use(cors(corsOptions));
// built-in url-encoded data middleware
app.use(express.urlencoded({extended:false}));

// built-in json middleware
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// built-in static files middleware
app.use(express.static(path.join(__dirname, "/public"))) 

// Routes
app.use('/', require('./routes/root').router);
app.use('/register', require('./routes/register').router);
app.use('/auth', require('./routes/auth').router);
app.use('/refresh', require('./routes/refresh').router);
app.use('/logout', require('./routes/logout').router);

// Guard with JWT
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees').router);



app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// custom error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))