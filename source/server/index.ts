import * as express from "express";
import * as session from "express-session";
import * as passport from "passport";

import { Aggregator } from "./aggregator";
import { AUTH_CALLBACK, AUTH_LOGIN, authRequired, SESSION_SECRET, strategy } from "./auth";

const SESSION_CONFIG: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    },
};

const USE_FIXTURES = process.argv.indexOf( "-fixtures" ) > -1 || process.argv.indexOf( "--fixtures" ) > -1;
const ONE_HOUR = 1000 * 60 * 60;
const handles = [
    "CNNPolitics",
    "voxdotcom",
    "politico",
    "BBCWorld",
    "nprpolitics",
    "MSNBC",
    "nytimes",
    "nytpolitics",
    "CBSNews",
    "postpolitics",
    "thehill",
    "ABCPolitics",
    "TheEconomist",
    "WSJ",
    "Reuters",
    "AP",
];

const app = express();
const aggregator = new Aggregator( handles, ONE_HOUR, USE_FIXTURES );

app.disable( "etag" );

app.set( "view engine", "pug" );
app.set( "views", process.cwd() + "/views" );
app.set( "trust proxy", true );

app.use( session( SESSION_CONFIG ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static( "dist/client" ) );

passport.use( strategy );
passport.serializeUser( ( user, callback ) => callback( null, user ) );
passport.deserializeUser( ( object, callback ) => callback( null, object ) );


// CLIENT FACING URLs
//
// Hosts the user facing website and all routes related to such.

app.get( "/", ( _, response: express.Response ) => {
    response.render( "index" );
} );

app.get( "/url", authRequired, ( _, response: express.Response ) => {
    response.render( "url" );
} );


// API
//
// Is used by the userfacing interface. This exposes all mined and prepared
// tweets from a set of twitter handles.

app.get( "/api/list", ( _, response ) => {
    response.send( JSON.stringify( aggregator.getLines() ) ).end();
} );

app.get( "/api/tweets", ( _, response ) => {
    response.send( JSON.stringify( aggregator.getTweets() ) ).end();
} );


// AUTH
//
// Contains all routes for log in and authentication

app.get(
    AUTH_LOGIN,
    ( request: express.Request, _, next: express.NextFunction ) => {
        if ( request.query.return ) {
            request.session!.oauth2return = request.query.return;
        }

        next();
    },
    passport.authenticate( "google", { scope: [ "email" ] } ),
);

app.get(
    AUTH_CALLBACK,
    passport.authenticate( "google" ),
    ( request: express.Request, response: express.Response ) => {
        const redirect = request.session!.oauth2return || "/";
        delete request.session!.oauth2return;
        response.redirect( redirect );
    },
);

app.listen( process.env.PORT || 1234 );
