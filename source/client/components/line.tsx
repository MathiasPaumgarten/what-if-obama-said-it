import * as React from "react";

interface LineProps {
    text: string;
}

interface Fragment {
    type: "text" | "url";
    value: string;
}

export class Line extends React.Component<LineProps, {}> {
    render() {
        return (
            <li className="tweet">
                <div className="tweet-text">
                    { this.disect( this.props.text ).map( ( fragment: Fragment, i: number ) => {
                        return fragment.type === "url" ?
                            <a key={ i } href={ fragment.value } target="_blank">{ fragment.value }</a> :
                            <span key={ i }>{ fragment.value }</span>;
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
