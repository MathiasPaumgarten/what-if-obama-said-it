import * as classname from "classnames";
import * as React from "react";

import { ExtendedTweet } from "../../server/tracker";
import { registerScrollCallback } from "../services/scroller";
import { Link } from "./link";

interface LineProps {
    tweet: ExtendedTweet;
    index: number;
}

interface LineState {
    fragments: Fragment[];
    twitterLink: string;
    sourceLink?: string;
}

interface Fragment {
    type: "text" | "url" | "cover";
    value: string;
    altValue?: string;
}

export class Line extends React.Component<LineProps, LineState> {

    constructor( props: LineProps ) {
        super( props );

        const fragments: Fragment[] = this.disect( props.tweet.updatedText );
        const reTweet = props.tweet.updatedText;
        const linkFragment = fragments.find( ( fragment: Fragment ) => fragment.type === "url" );
        const source = linkFragment ? linkFragment.value : "";

        this.state = {
            fragments,
            twitterLink: `https://twitter.com/intent/tweet?text=${ reTweet }&via=whatifitwasobam`,
            sourceLink: source,
        };
    }

    render() {
        return (
            <li className="tweet">
                <div className="tweet-text">
                    <a href={ this.state.sourceLink } target="_blank" className="source-link">
                        { this.state.fragments.map( ( fragment: Fragment, i: number ) => {
                            switch ( fragment.type ) {
                                case "url":
                                    return null;
                                case "text":
                                    return <span key={ i }>{ fragment.value }</span>;
                                case "cover":
                                    return <RevealFragment key={ i }
                                                           value={ fragment.value }
                                                           beforeValue={ fragment.altValue! }
                                                           delay={ i }
                                                           index={ this.props.index } />;
                            }
                        } ) }
                    </a>
                    <br />
                    <span className="cta">
                        <Link href={ this.state.twitterLink } icon="fas fa-retweet" text="Re-Tweet"/>
                    </span>
                </div>
            </li>
        );
    }

    /**
     * Splites a string into several fragments by finding URLs and key words. The array returned retains the order
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
                    value: value.substring( start, index ).replace( /&amp;/g, "&" ),
                } );

                const urlStart = index++;

                while ( value[ index ] !== " " && index < value.length ) index++;

                fragments.push( {
                    type: "url",
                    value: value.substring( urlStart, index ),
                } );

                start = index;
            }

            [ "Barack", "Obama" ].forEach( ( name: "Barack" | "Obama" ) => {
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
                        altValue: this.inverseName( name ),
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

    private inverseName( name: "Barack" | "Obama" ): string {
        return {
            Barack: "Donald",
            Obama: "Trump",
        }[ name ];
    }
}

interface RevealFramgmentProps {
    beforeValue: string;
    value: string;
    delay: number;
    index: number;
}

interface RevealFragmentState {
    uiState: "before" | "cover" | "after";
    showAlt: boolean;
}

export class RevealFragment extends React.Component<RevealFramgmentProps, RevealFragmentState> {

    constructor( props: RevealFramgmentProps ) {
        super( props );
        this.state = {
            uiState: "before",
            showAlt: true,
        };
    }

    componentDidMount() {
        const limit = this.props.index * window.innerHeight - window.innerHeight / 2;
        registerScrollCallback( limit, () => this.onInView() );
    }

    render(): JSX.Element {
        return (
            <span className={ classname( "reveal", "delay-" + this.props.delay, this.state.uiState ) }>
                <span className="value-holder"
                      style={ { opacity: this.state.showAlt ? 0 : 1 } }>
                    { this.props.value }
                    { this.props.value === "Barack" ? <span>&nbsp;</span> : null }
                </span>
                <span className="alt-value-holder"
                      style={ { opacity: this.state.showAlt ? 1 : 0 } }>
                    { this.props.beforeValue }
                </span>
            </span>
        );
    }

    private onInView() {
        this.setState( { uiState: "cover" } );

        setTimeout( () => {
            this.setState( { uiState: "after", showAlt: false } );
        }, 1000 );
    }
}
