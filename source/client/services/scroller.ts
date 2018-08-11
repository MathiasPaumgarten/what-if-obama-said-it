const callbacks: Array<{ limit: number, callback: () => void }> = [];
let offset = 0;


export function enableScroller() {
    loop();
}

export function registerScrollCallback( limit: number, callback: () => void ) {
    callbacks.push( { limit, callback } );
    callbacks.sort( ( a, b ) => a.limit - b.limit );
}


function loop() {

    // tslint:disable-next-line Linter prefers for-of loop which are slightly slower.
    for ( let i = 0; i < callbacks.length; i++ ) {
        if ( callbacks[ i ].limit < offset ) {
            callbacks[ i ].callback();
            callbacks.splice( i, 1 );
            i--;
        } else break;
    }

    offset = Math.abs( window.scrollY );

    requestAnimationFrame( loop );
}
