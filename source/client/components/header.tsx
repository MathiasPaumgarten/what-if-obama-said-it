import * as React from "react";

interface HeaderProps {
    uiState: string;
}

export class Header extends React.Component<HeaderProps, {}> {
    render() {
        return (
            <header className={ this.props.uiState }>
                <div className="center">
                    <span className="what-if">What if obama said it?</span>

                    <span className="twitter-wrapper">
                        <a className="twitter-follow-button"
                        href="https://twitter.com/whatifitwasobam"
                        data-show-count="false"
                        data-show-screen-name="false">
                            Follow @whatifitwasobama
                        </a>
                    </span>
                </div>

            </header>
        );
    }
}
