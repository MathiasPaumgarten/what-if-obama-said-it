import * as React from "react";

interface LineProps {
    text: string;
}

export class Line extends React.Component<LineProps, {}> {
    render() {
        return (
            <li>{ this.props.text }</li>
        );
    }
}
