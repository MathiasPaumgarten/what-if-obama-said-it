import * as Datastore from "@google-cloud/datastore";

const kind = "Url";
const ds = new Datastore( {
    projectId: "what-if-obama-said-it",
} );


export function list( callback: ( urls: object[] ) => void ) {
    const query = ds.createQuery( kind );

    ds.runQuery( query, ( error, entities ) => {
        if ( error ) {
            console.log( error );
            return;
        }

        callback( entities );
    } );
}

export function create( id: string, url: string ) {

    const key = ds.key( [ kind ] );
    const entity = {
        key,
        data: [
            {
                name: "url",
                value: url,
            },
            {
                name: "short",
                value: id,
            },
        ],
    };

    ds.save( entity, ( error ) =>  {

    } );
}
