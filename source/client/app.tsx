import * as React from "react";
import { render } from "react-dom";
import { Line } from "./components/line";

interface AppState {
    lines: string[];
}

class App extends React.Component<{}, AppState> {

    constructor( props: {} ) {
        super( props );

        this.state = { lines: [] };
    }

    componentDidMount() {
        fetch( "/api/list" )
            .then( ( response: Response ) => response.json() )
            .then( ( lines: string[] ) => {
                this.setState( { lines } );
            } );
    }

    render() {
        return (
            <ul>
                { this.state.lines.map( ( line: string, i: number ) => {
                    return <Line text={ line } key={ i } />;
                } ) }
            </ul>
        );
    }
}

render( <App />, document.getElementById( "app" ) );
