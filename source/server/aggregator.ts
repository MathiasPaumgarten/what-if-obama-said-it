import { merge, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { ExtendedTweet, Tracker } from "./tracker";

export class Aggregator {
    readonly change: Observable<void>;

    private trackers: Tracker[];
    private timeout: NodeJS.Timer;
    private readonly SIZE = 30;

    constructor( handles: string[], private updateTime: number, useFixtures = false ) {
        this.trackers = handles.map( ( handle: string ) => {
            return new Tracker( handle, this.SIZE, useFixtures );
        } );

        this.change = merge( ...this.trackers.map( t => t.change ) ).pipe( debounceTime( 1000 ) );

        this.autoUpdate();
    }

    getLines(): string[] {
        return ([] as string[]).concat( ...this.trackers.map( t => t.getLines() ) );
    }

    getTweets(): ExtendedTweet[] {
        return ([] as ExtendedTweet[]).concat( ...this.trackers.map( t => t.getTweets() ) );
    }

    update() {
        this.trackers.forEach( t => t.update() );
    }

    dispose() {
        clearTimeout( this.timeout );
    }

    private autoUpdate() {
        this.update();
        this.timeout = setTimeout( _ => this.autoUpdate(), this.updateTime );
    }
}
