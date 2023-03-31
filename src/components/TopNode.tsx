
import * as React from 'react';
import { NavigationNode, pageTabs } from '../helpers';



export const TopNode = (props: NavigationNode): JSX.Element => {

    const onMouseOver = (): void => { props?.onOver(props); };
    const onMouseOut = (): void => { props?.onOut(props); };
    const [children, setchildren] = React.useState<NavigationNode[]>(props.Children)
    const {Url,Title,Children} = props;
    const isLink = Url !== "http://linkless.header/";

 


    return (<div onMouseOver={onMouseOver} onMouseOut={onMouseOut}


        style={{
            padding: "8px",

            cursor: "pointer",
            display: "flex",
        }}

    >
        {!isLink &&
            <span
                style={{
                    fontSize: "18px",
                    lineHeight: "27px",
                    fontWeight: 500,
                    color: "#000000",
                    cursor: "default",
                    textDecoration: "none",
                    marginRight: "8px",
                    fontFamily: "'Ubuntu', sans-serif"
                }}

            >{props.Title}
            </span>}
        {isLink &&
            <a
                style={{
                    fontSize: "18px",
                    lineHeight: "27px",
                    fontWeight: 500,
                    color: "#000000",
                    cursor: "pointer",
                    textDecoration: "none",
                    marginRight: "8px",
                    fontFamily: "'Ubuntu', sans-serif"
                }}

                href={props.Url}>{props.Title}
            </a>}
        {(children?.length > 0) &&
            <svg style={{ marginTop: "12px" }} width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.528411 1.71L3.11841 4.3C3.50841 4.69 4.13841 4.69 4.52841 4.3L7.11841 1.71C7.74841 1.08 7.29841 0 6.40841 0H1.22841C0.338411 0 -0.101589 1.08 0.528411 1.71Z" fill="black" fill-opacity="0.54" />
            </svg>}

    </div>);
};

export interface NavigationNodeWithSiteURL extends NavigationNode {
  //  siteURL: string;
}
export const TopNodeRight = (props: NavigationNodeWithSiteURL): JSX.Element => {
    const {onOver,onOut} = props
    const onMouseOver = (): void => { if (onOver) onOver(props); };
    const onMouseOut = (): void => { if (onOut) onOut(props); };
    const isLink = props.Url !== "http://linkless.header/";


    return (<div onMouseOver={onMouseOver} onMouseOut={onMouseOut}


        style={{
            padding: "8px",

            cursor: "pointer",
            display: "flex",
        }}

    >
        {!isLink &&
            <span
                style={{
                    fontSize: "18px",
                    lineHeight: "27px",
                    fontWeight: 500,
                    color: "#000000",
                    cursor: "default",
                    textDecoration: "none",
                    marginRight: "8px",
                    fontFamily: "'Ubuntu', sans-serif"
                }}

            >{props.Title}
            </span>}
        {isLink &&
            <a
                style={{
                    fontSize: "18px",
                    lineHeight: "27px",
                    fontWeight: 500,
                    color: document.location.href.indexOf(props.Url)===-1  ? "#000000" : "#2D32AA" ,
                    cursor: "pointer",
                    textDecoration: "none",
                    marginRight: "8px",
                    fontFamily: "'Ubuntu', sans-serif"
                }}

                href={props.Url}>{props.Title}
            </a>}
        {(props?.Children?.length > 0) &&
            <svg style={{ marginTop: "12px" }} width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.528411 1.71L3.11841 4.3C3.50841 4.69 4.13841 4.69 4.52841 4.3L7.11841 1.71C7.74841 1.08 7.29841 0 6.40841 0H1.22841C0.338411 0 -0.101589 1.08 0.528411 1.71Z" fill="black" fill-opacity="0.54" />
            </svg>}

    </div>);
};
