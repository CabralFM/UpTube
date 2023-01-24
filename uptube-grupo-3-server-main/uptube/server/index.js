const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const fs = require("fs");
const fileStore = require('session-file-store')(session); // video

app.use((req, res, next) => {
    console.log("console.log(req.headers.origin)", req.headers.origin); // ao fazer login no POSTMAN, passa a undefined
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Methods", `GET,PUT,POST,PATCH,DELETE,OPTIONS`);
    res.header("Access-Control-Allow-Headers", `Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, x-ijt`);
    res.header("Access-Control-Allow-Credentials", `true`);
    res.removeHeader("X-Frame-Options");

    if ('OPTIONS' === req.method) return res.sendStatus(200);
    next();
});

// setting url as allowed origin header:
app.use(cors());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
process.on('error', function (err) {
    console.log(err);
});

// defining a static path called 'public' in our root directory:
app.use(express.static('public'));  // video

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    limits: {fileSize: 500 * 1024 * 1024},
    abortOnLimit: true,
    responseOnLimit: "file must be less than 500MB",
    safeFileNames: false,
    preserveExtension: false,
    uploadTimeout: 120000
})); // req.files.whatever

app.use(session({
    store: new fileStore(),
    secret: "34u23459309u",
    resave: true, // resave option, cause: express-session deprecated undefined;
    saveUninitialized: false
}));

app.use(function responseLogger(req, res, next) { // url reader
    const originalSendFunc = res.send.bind(res);
    res.send = function(body) {
        console.log('url sent:', req.originalUrl);
        return originalSendFunc(body);
    };
    next();
});

// attaching the express.json middleware to routes, configuring a maximum size of 100 bytes for the JSON request.
app.use('/', express.json({ limit: 100 }))


// configure middleware (file upload)
/*
let rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};
app.use(bodyParser.json({ verify: rawBodySaver, limit:'100mb'}));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true, limit:'100mb' }));
*/


//app.use(fileUpload());

// endpoints:
app.use("/playlist", require("./endpoints/playlist.js"));
app.use("/achievements", require("./endpoints/achievements.js"));
app.use("/", require("./endpoints/video.js"));
app.use("/comments", require("./endpoints/comments.js"));
app.use("/reactions", require("./endpoints/reactions.js"));
app.use("/tags", require("./endpoints/tags.js"));
app.use("/user", require("./endpoints/user.js"));
app.use("/notification", require("./endpoints/notification.js"));
app.use("/report", require("./endpoints/report.js"));

/*
if(!fs.existsSync("/uploads")) {
    fs.mkdirSync("/uploads")
}

 */

app.listen(process.env.PORT || 5050, () => {
    console.log("server started on port", process.env.PORT);
});