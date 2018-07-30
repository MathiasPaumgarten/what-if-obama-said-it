import { readFileSync } from "fs";
import { Twitter, TwitterConfig } from "twitter-js-client";

const configFile: string = readFileSync( process.cwd() + "/credentials.json", "utf-8" );
const config: TwitterConfig = JSON.parse( configFile );

export const twitter = new Twitter( config );
