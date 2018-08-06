import { readFile } from "fs";
import { Subject } from "rxjs";

import { twitter } from "./twitter";

interface Tweet {
    created_at: string;
    id: number;
    id_str: string;
    text: string;
}

interface ExtendedTweet extends Tweet {
    updatedText: string;
}

export class Tracker {
    change = new Subject<void>();

    private cache: ExtendedTweet[] = [];
    private readonly relatives = [
        "ivanka trump",
        "donald trump jr",
        "eric trump",
        "tiffany trump",
        "barron trump",
        "melania trump",
        "ivana trump",
    ];

    constructor( private handle: string, private size: number, private useFixtures = false ) {
        this.update();
    }

    update() {
        if ( this.useFixtures ) {
            readFile(
                process.cwd() + "/fixtures/" + this.handle + ".json",
                { encoding: "utf-8" },
                ( error , result: string ) => {
                    if ( error ) this.onError( error.toString() );
                    else this.onTweetReceived( result );
                },
            );
        } else {
            twitter.getUserTimeline(
                { screen_name: this.handle, count: "30" },
                error => this.onError( error ),
                values => this.onTweetReceived( values ),
            );
        }
    }

    getLines(): string[] {
        return this.cache.map( ( tweet: ExtendedTweet ) => tweet.updatedText );
    }

    getTweets(): ExtendedTweet[] {
        return [];
    }

    private onError( error: string ) {
        console.warn( error );
    }

    private onTweetReceived( value: string ) {
        const tweets = JSON.parse( value ) as Tweet[];

        tweets.filter( tweet => this.isNewTweet( tweet ) )
              .filter( tweet => this.isTrump( tweet ) )
              .filter( tweet => this.isDonald( tweet ) )
              .map( tweet => this.replaceTrump( tweet ) )
              .forEach( tweet => this.cache.unshift( tweet ) );

        this.resize();
        this.change.next();
    }

    private isTrump( tweet: Tweet ): boolean {
        return tweet.text.toLowerCase().indexOf( "trump" ) > -1;
    }

    private isDonald( tweet: Tweet ): boolean {
        const text = tweet.text.toLowerCase();
        return !this.relatives.some( relative => text.indexOf( relative ) > -1 );
    }

    private replaceTrump( tweet: Tweet ): ExtendedTweet {
        return {
            ...tweet,
            updatedText: tweet.text.replace( /[Dd]onald/g, "Barack" )
                                   .replace( /[Tt]rump/g, "Obama" ),
        };
    }

    private isNewTweet( tweet: Tweet ) {
        return this.cache.findIndex( ( other: Tweet ) => other.id_str === tweet.id_str ) === -1;
    }

    private resize() {
        if ( this.cache.length > this.size ) {
            this.cache.length = this.size;
        }
    }
}

