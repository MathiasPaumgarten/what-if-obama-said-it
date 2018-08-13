import * as React from "react";

interface HeaderProps {
    uiState: string;
}

export class Header extends React.Component<HeaderProps, {}> {

    constructor( props: HeaderProps ) {
        super( props );
    }

    render() {
        return (
            <header className={ this.props.uiState }>
                <div className="center">
                    <span className="what-if">What if obama said it?</span>
                </div>
            </header>
        );
    }
}
