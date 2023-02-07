const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const { errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

// custom middleware logger
app.use(logger);

// 3rd-party cors middleware
const whitelist = ['https://www.google.com','http://localhost:3500']
const corsOptions = {
    origin : (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));
// built-in url-encoded data middleware
app.use(express.urlencoded({extended:false}));

// built-in json middleware
app.use(express.json());

// built-in static files middleware
app.use(express.static(path.join(__dirname, "/public"))) 

app.get('^/$|/index(.html)?', (req, res)=> {
    res.sendFile(path.join(__dirname, "views", "index.html"));
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));

})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301,'/new-page.html');
})

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
})

// custom error handling
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))