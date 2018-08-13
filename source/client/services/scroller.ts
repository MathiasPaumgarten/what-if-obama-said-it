import { throttle } from "lodash";

const callbacks: Array<{ limit: number, callback: () => void }> = [];
let offset = 0;

function sort() {
    callbacks.sort( ( a, b ) => a.limit - b.limit );
}

function check() {
    // tslint:disable-next-line Linter prefers for-of loop which are slightly slower. And this whole thing is already
    // janky as is.
    for ( let i = 0; i < callbacks.length; i++ ) {
        if ( callbacks[ i ].limit < offset ) {
            callbacks[ i ].callback();
            callbacks.splice( i, 1 );
            i--;
        } else break;
    }

    offset = Math.abs( window.scrollY );

    setTimeout( check, 100 );
}

export class ScrollerRef {
    constructor( public limit: number, readonly callback: () => void ) {}

    update( value: number ) {
        this.limit = value;
        sort();
    }
}

export function enableScroller() {
    check();
    window.addEventListener( "scroll", check );
}

export function registerScrollCallback( limit: number, callback: () => void ): ScrollerRef {
    const ref = new ScrollerRef( limit, callback );

    callbacks.push( ref );
    sort();

    return ref;
}
