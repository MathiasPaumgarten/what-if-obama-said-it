import * as express from "express";
import { merge } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { Tracker } from "./tracker";

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

const FIVE_HOURS = 1000 * 60 * 60 * 5;
const trackers = handles.map( handle => new Tracker( handle, 30 ) );
let lines: string[] = [];

merge( ...trackers.map( tracker => tracker.change ) ).pipe( debounceTime( 1000 ) ).subscribe( refreshList );

function refreshList() {
    lines = [].concat( ...trackers.map( tracker => tracker.getLines() ) );
}

function updateTrackers() {
    trackers.forEach( tracker => tracker.update() );

    setTimeout( updateTrackers, FIVE_HOURS );
}

setTimeout( updateTrackers, FIVE_HOURS );

// ----------------------------------------

const app = express();

app.set( "view engine", "pug" );
app.set( "views", __dirname + "/../views" );

app.get( "/", ( _, response ) => {

    response.render( "index", { lines } );

} );

app.listen( process.env.PORT || 1234 );
