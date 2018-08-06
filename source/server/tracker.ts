import { readFile } from "fs";
import { Subject } from "rxjs";

import { twitter } from "./twitter";

/**
 * Type information for the few fields we need returned from the Twitter API.
 */
export interface Tweet {
    created_at: string;
    id: number;
    id_str: string;
    text: string;
}

export interface ExtendedTweet extends Tweet {
    updatedText: string;
    handle: string;
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
        return this.cache;
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

    /**
     * Returns only a sub set of the entire object. We don't have a need to store a large amount of the information
     * in the Twitter API. We leave most fields behind.
     */
    private replaceTrump( tweet: Tweet ): ExtendedTweet {
        return {
            created_at: tweet.created_at,
            id: tweet.id,
            id_str: tweet.id_str,
            text: tweet.text,
            handle: this.handle,
            updatedText: tweet.text.replace( /[Dd]onald/g, "<first>Barack</first>" )
                                   .replace( /[Tt]rump/g, "<last>Obama</last>" ),
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

