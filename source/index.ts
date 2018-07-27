// @ts-ignore
import { Twitter } from "twitter-js-client";
import { readFileSync } from "fs";

interface Tweet {
    created_at: string,
    id: number,
    id_str: string,
    text: string,
}

const config = JSON.parse( readFileSync( __dirname + "/../credentials.json", { encoding: "utf-8" } ) );
const twitter = new Twitter( config );

twitter.getUserTimeline( { screen_name: "cnn", count: "30" }, error, onTweetsRecieved );

function error( error: string ) {
    console.warn( error );
}

function onTweetsRecieved( value: string ) {
    const tweets = JSON.parse( value ) as Tweet[];

    tweets
        .filter( hasTrump )
        .map( replaceTrump )
        .forEach( write );
}

function hasTrump( tweet: Tweet ): boolean {
    return tweet.text.toLowerCase().indexOf( "trump" ) > -1;
}

function replaceTrump( tweet: Tweet ): Tweet {
    return {
        ...tweet,
        text: tweet.text.replace( /[Dd]onald/g, "Barack" ).replace( /[Tt]rump/g, "Obama" )
    }
}

function write( tweet: Tweet ) {
    console.log( "\n" + tweet.text );
}