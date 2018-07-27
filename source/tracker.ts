import { Subject } from "rxjs";

import { twitter } from "./twitter";

interface Tweet {
    created_at: string,
    id: number,
    id_str: string,
    text: string,
}

interface ExtendedTweet extends Tweet {
    updatedText: string,
}

export class Tracker {
    change = new Subject<void>();

    private cache: ExtendedTweet[] = [];

    constructor( private handle: string, private size: number ) {
        this.update();
    }

    update() {
        twitter.getUserTimeline(
            { screen_name: this.handle, count: "30" },
            error => this.onError( error ),
            values => this.onTweetReceived( values )
        );
    }

    getLines(): string[] {
        return this.cache.map( ( tweet: ExtendedTweet ) => tweet.updatedText );
    }

    private onError( error: string ) {}

    private onTweetReceived( value: string ) {
        const tweets = JSON.parse( value ) as Tweet[];

        tweets.filter( tweet => this.isNewTweet( tweet ) )
              .filter( tweet => this.hasTrump( tweet ) )
              .map( tweet => this.replaceTrump( tweet ) )
              .forEach( tweet => this.cache.unshift( tweet ) );

        this.resize();
        this.change.next();
    }

    private hasTrump( tweet: Tweet ): boolean {
        return tweet.text.toLowerCase().indexOf( "trump" ) > -1;
    }

    private replaceTrump( tweet: Tweet ): ExtendedTweet {
        return {
            ...tweet,
            updatedText: tweet.text.replace( /[Dd]onald/g, "Barack" )
                                   .replace( /[Tt]rump/g, "Obama" )
        }
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