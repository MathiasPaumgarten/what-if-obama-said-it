import * as classnames from "classnames";
import * as React from "react";
import { render } from "react-dom";

import { Header } from "./components/header";
import { Intro } from "./components/intro";
import { Line } from "./components/line";

interface AppState {
    lines: string[];
    uiState: "before" | "enter" | "idle";
}

class App extends React.Component<{}, AppState> {

    constructor( props: {} ) {
        super( props );

        this.state = {
            lines: [],
            uiState: "before",
        };
    }

    componentDidMount() {
        fetch( "/api/list" )
            .then( ( response: Response ) => response.json() )
            .then( ( lines: string[] ) => {
                this.setState( { lines } );
            } );

        this.waitSeconds( 0.1 ).then( () => {
            this.setState( { uiState: "enter" } );
            return this.waitSeconds( 2 );
        } ).then( () => {
            this.setState( { uiState: "idle" } );
        } );
    }

    render() {
        return (
            <div className="container">
                <ul className={ classnames( "tweet-container", this.state.uiState ) }>
                    { this.state.lines.map( ( line: string, i: number ) => {
                        return <Line text={ line } key={ i } />;
                    } ) }
                </ul>
                <Intro uiState={ this.state.uiState } />
                <Header />
            </div>
        );
    }

    private waitSeconds( seconds: number ): Promise<void> {
        return new Promise( resolve => {
            setTimeout( resolve, seconds * 1000 );
        } );
    }
}

render( <App />, document.getElementById( "app" ) );
