const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const {logger} = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// 3rd-party cors middleware
app.use(cors(corsOptions));
// built-in url-encoded data middleware
app.use(express.urlencoded({extended:false}));

// built-in json middleware
app.use(express.json());

// built-in static files middleware
app.use(express.static(path.join(__dirname, "/public"))) 

// Routes
app.use('/', require('./routes/root').router);
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