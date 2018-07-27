import { Twitter, TwitterConfig } from "twitter-js-client";
import { readFileSync } from "fs";

const configFile: string = readFileSync( __dirname + "/../credentials.json", "utf-8" );
const config: TwitterConfig = JSON.parse( configFile );

export const twitter = new Twitter( config );