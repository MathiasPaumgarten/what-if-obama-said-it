import * as express from "express";

import { Aggregator } from "./aggregator";

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
const aggregator = new Aggregator( handles, ONE_HOUR );

app.set( "view engine", "pug" );
app.set( "views", process.cwd() + "/views" );

app.use( express.static( "dist/client" ) );

app.get( "/", ( _, response: express.Response ) => {

    response.render( "index", { lines: aggregator.getLines() } );

} );

app.get( "/api/list", ( _, response ) => {

    response.send( JSON.stringify( aggregator.getLines() ) ).end();

} );

app.listen( process.env.PORT || 1234 );
