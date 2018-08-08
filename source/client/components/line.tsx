import * as classname from "classnames";
import * as React from "react";

interface LineProps {
    text: string;
    handle: string;
}

interface LineState {
    fragments: Fragment[];
    twitterLink: string;
}

interface Fragment {
    type: "text" | "url" | "cover";
    value: string;
}

export class Line extends React.Component<LineProps, LineState> {

    constructor( props: LineProps ) {
        super( props );

        this.state = {
            fragments: this.disect( props.text ),
            twitterLink: `https://twitter.com/${ props.handle }`,
        };
    }

    render() {
        return (
            <li className="tweet">
                <div className="handle">
                    <a href={ this.state.twitterLink } target="_blank">@{ this.props.handle }</a>
                </div>
                <div className="tweet-text">
                    { this.state.fragments.map( ( fragment: Fragment, i: number ) => {
                        switch ( fragment.type ) {
                            case "url":
                                return <a key={ i } href={ fragment.value } target="_blank">{ fragment.value }</a>;
                            case "text":
                                return <span key={ i }>{ fragment.value }</span>;
                            case "cover":
                                return <RevealFragment key={ i } value={ fragment.value } delay={ i } />;
                        }
                    } ) }
                </div>
            </li>
        );
    }

    /**
     * Splites a string into several fragments by finding URLs. The array returned retains the order
     * of the string, separates in URLs and simple text.
     * @param value string to separate
     */
    private disect( value: string ): Fragment[] {
        let index = 0;
        let start = 0;
        const fragments: Fragment[] = [];

        while ( index < value.length ) {

            if ( value.substr( index, 4 ) === "http" ) {
                fragments.push( {
                    type: "text",
                    value: value.substring( start, index ),
                } );

                const urlStart = index++;

                while ( value[ index ] !== " " && index < value.length ) index++;

                fragments.push( {
                    type: "url",
                    value: value.substring( urlStart, index ),
                } );

                start = index;
            }

            [ "Barack", "Obama" ].forEach( name => {
                if ( value.substr( index, name.length ) === name ) {
                    if ( start !== index) {
                        fragments.push( {
                            type: "text",
                            value: value.substring( start, index ),
                        } );
                    }

                    fragments.push( {
                        type: "cover",
                        value: name,
                    } );

                    index += name.length;
                    start = index;
                }
            } );

            index++;
        }

        if ( start < value.length - 1 ) {
            fragments.push( {
                type: "text",
                value: value.substring( start, value.length ),
            } );
        }

        return fragments;
    }
}

interface RevealFramgmentProps {
    value: string;
    delay: number;
}

interface RevealFragmentState {
    uiState: "before" | "idle";
}

export class RevealFragment extends React.Component<RevealFramgmentProps, RevealFragmentState> {
    constructor( props: RevealFramgmentProps ) {
        super( props );
        this.state = { uiState: "before" };
    }

    componentDidMount() {
        setTimeout( () => {
            this.setState( { uiState: "idle" } );
        }, 4000 );
    }

    render(): JSX.Element {
        return (
            <span className={ classname( "reveal", "delay-" + this.props.delay, this.state.uiState ) }>
                { this.props.value }
            </span>
        );
    }
}
