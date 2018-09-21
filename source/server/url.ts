import Datastore = require( "@google-cloud/datastore" );

const kind = "Url";
const ds = new Datastore( {
    projectId: "what-if-obama-said-it",
} );

export interface UrlPair {
    url: string;
    id: string;
}

interface DatestoreEntity {
    url: string;
    [Datastore.KEY]: {
        id: string;
    };
}

export function listUrls(): Promise<UrlPair[]> {
    return new Promise<UrlPair[]>( ( resolve, reject ) => {
        const query = ds.createQuery( kind );

        ds.runQuery( query, ( error: Error | null, entities: DatestoreEntity[] ) => {
            if ( error ) {
                reject( error );
                return;
            }

            const urls = entities.map<UrlPair>( ( entity: DatestoreEntity ) => ( {
                url: entity.url,
                id: entity[Datastore.KEY].id,
            } ) );

            resolve( urls );
        } );
    } );
}

export function getUrl( id: string ): Promise<UrlPair> {
    return new Promise<UrlPair>( (resolve, reject) => {
        const key = ds.key( [ kind, parseInt( id, 10 ) ] );

        ds.get( key, ( error: Error | null, entity: DatestoreEntity ) => {
            if ( error ) {
                reject( error );
                return;
            }

            resolve( {
                url: entity.url,
                id: entity[Datastore.KEY].id,
            } );
        } );
    } );
}

export function createUrl( url: string ): Promise<void> {
    return new Promise( resolve => {
        const key = ds.key( [ kind ] );
        const entity = {
            key,
            data: [
                {
                    name: "url",
                    value: url,
                },
            ],
        };

        ds.save( entity, ( error ) =>  {
            resolve();
        } );
    } );
}
