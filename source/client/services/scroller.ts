import { throttle } from "lodash";

const callbacks: Array<{ limit: number, callback: () => void }> = [];

function sort() {
    callbacks.sort( ( a, b ) => a.limit - b.limit );
}

const check = throttle(() => {
    const offset = Math.abs( window.scrollY );

    for ( let i = 0; i < callbacks.length; i++ ) {
        if ( callbacks[ i ].limit < offset ) {
            callbacks[ i ].callback();
            callbacks.splice( i, 1 );
            i--;
        } else break;
    }

}, 100 );

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
