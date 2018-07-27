import { Tracker } from "./tracker";

const cnn = new Tracker( "cnn", 30 );

cnn.change.subscribe( () => {
    console.log( cnn.getLines().join( "\n" ) );
} );