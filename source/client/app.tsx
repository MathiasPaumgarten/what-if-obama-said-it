import * as classnames from "classnames";
import * as React from "react";
import { render } from "react-dom";

import { ExtendedTweet } from "../server/tracker";
import { Header } from "./components/header";
import { Intro } from "./components/intro";
import { Line } from "./components/line";
import { RotationCover } from "./components/rotation-cover";
import { enableScroller } from "./services/scroller";

interface AppState {
    lines: ExtendedTweet[];
    uiState: "before" | "enter" | "idle";
}

class App extends React.Component<{}, AppState> {

    constructor( props: {} ) {
        super( props );

        this.state = {
            lines: [],
            uiState: "before",
        };

        window.onbeforeunload = () => window.scrollTo( 0, 0 );
    }

    componentDidMount() {
        fetch( "/api/tweets" )
            .then( ( response: Response ) => response.json() )
            .then( ( lines: ExtendedTweet[] ) => {
                this.setState( { lines } );
            } );

        this.waitSeconds( 0.1 ).then( () => {
            this.setState( { uiState: "enter" } );
            return this.waitSeconds( 2 );
        } ).then( () => {
            this.setState( { uiState: "idle" } );
            enableScroller();
        } );

    }

    render() {
        return (
            <div className="container">
                <ul className={ classnames( "tweet-container", this.state.uiState ) }>
                    { this.state.lines.map( ( tweet: ExtendedTweet, i: number ) => {
                        return <Line tweet={ tweet }
                                     key={ i }
                                     index={ i } />;
                    } ) }
                </ul>

                <Intro uiState={ this.state.uiState } />

                <Header uiState={ this.state.uiState } />

                <RotationCover />
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
