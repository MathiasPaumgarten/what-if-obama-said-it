import * as React from "react";

interface LinkProps {
    href: string;
}

export class Link extends React.Component<LinkProps, {}> {
    render() {
        return (
            <span className="link">
                <a href={ this.props.href } target="_blank">{ this.props.href }</a>
                <div className="cover-container">
                    <a href={ this.props.href } target="_blank">{ this.props.href }</a>
                </div>
            </span>
        );
    }
}