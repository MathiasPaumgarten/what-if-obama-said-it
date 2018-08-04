import * as classnames from "classnames";
import * as React from "react";

interface IntroProps {
    uiState: "enter" | "before" | "idle";
}

export class Intro extends React.Component<IntroProps, {}> {
    render() {
        return (
            <div className={ classnames( "intro", "layer", this.props.uiState ) }>
                <span className="line">Imagine how you react</span>
                <span className="line">if Obama had done it</span>
            </div>
        );
    }
}
