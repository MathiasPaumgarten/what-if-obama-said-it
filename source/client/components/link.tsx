import * as React from "react";

interface LinkProps {
    href: string;
    text?: string;
    icon?: string;
}

export class Link extends React.Component<LinkProps, {}> {
    render() {
        return (
            <span className="link">
                <a href={ this.props.href } target="_blank">
                    { this.props.icon ? <i className={ this.props.icon }></i> : null }
                    &nbsp;
                    { this.props.text || this.props.href }
                </a>
                <div className="cover-container">
                    <a href={ this.props.href } target="_blank">
                        { this.props.icon ? <i className={ this.props.icon }></i> : null }
                        &nbsp;
                        { this.props.text || this.props.href }
                    </a>
                </div>
            </span>
        );
    }
}
