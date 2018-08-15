import * as React from "react";

interface RotationCoverState {
    display: boolean;
}

export class RotationCover extends React.Component<{}, RotationCoverState> {

    constructor( props: {} ) {
        super( props );

        this.state = {
            display: Math.abs( window.orientation as number ) === 90,
        };
    }

    componentDidMount() {
        window.addEventListener( "orientationchange", () => this.onOrientationChange() );
    }

    render(): JSX.Element {
        return (
            <div id="rotation-cover" style={ { display: this.state.display ? "block" : "none" } }>
                <span>Rotate your phone upright.</span>
                <span className="insult">There is no way you read the news like this!</span>
            </div>
        );
    }

    private onOrientationChange() {
        this.setState( { display: Math.abs( window.orientation as number ) === 90 } );
    }
}
