import { merge, Observable } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { ExtendedTweet, Tracker } from "./tracker";

export class Aggregator {
    readonly change: Observable<void>;

    private trackers: Tracker[];
    private timeout: NodeJS.Timer;
    private readonly SIZE = 30;
    private readonly EXPORT_SIZE = 50;

    constructor( handles: string[], private updateTime: number, useFixtures = false ) {
        this.trackers = handles.map( ( handle: string ) => {
            return new Tracker( handle, this.SIZE, useFixtures );
        } );

        this.change = merge( ...this.trackers.map( t => t.change ) ).pipe( debounceTime( 1000 ) );

        this.autoUpdate();
    }

    getLines(): string[] {
        return ([] as string[])
            .concat( ...this.trackers.map( t => t.getLines() ) )
            .slice(0, this.EXPORT_SIZE);
    }

    getTweets(): ExtendedTweet[] {
        return ([] as ExtendedTweet[])
            .concat( ...this.trackers.map( t => t.getTweets() ) )
            .sort( ( a, b ) => {
                const aDate = new Date( a.created_at );
                const bDate = new Date( b.created_at );
                return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
            } )
            .slice(0, this.EXPORT_SIZE);
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
