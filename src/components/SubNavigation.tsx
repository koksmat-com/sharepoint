import * as React from 'react';
import { useState } from 'react';
import { NavigationNode } from '../helpers';


export const SubMenuItem = (props: { node: NavigationNode; onNavigate: ()=>void}): JSX.Element => {
    const [hover, setHover] = useState(false)
    const isLink = props.node.Url !== "http://linkless.header/"
    return (<div style={{ display: "flex" }}
    onMouseOver={() => {
        setHover(true)
        props?.node?.onOver(props.node)    
    }}
    onMouseOut={() => setHover(false)}
    
    >
{!isLink &&
        <span
        
            style={{
                padding:"20px",
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 500,
                color:  hover ? "#2D32AA" : "#000000",
                cursor: "default",
                textDecoration: hover ? "underline" : "none",
                marginRight: "8px",
                fontFamily: "'Ubuntu', sans-serif",
                width:"184px",
                whiteSpace: "nowrap",
                textOverflow:"ellipsis",
                overflow:"hidden"
            }}

           >{props.node.Title}
        </span>}
        {isLink &&
        <a
            onClick={() => {
                debugger
                props.onNavigate()}}
            style={{
                padding:"20px",
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 500,
                color:  hover ? "#2D32AA" : "#000000",
                cursor: "pointer",
                textDecoration: hover ? "underline" : "none",
                marginRight: "8px",
                fontFamily: "'Ubuntu', sans-serif",
                width:"184px",
                whiteSpace: "nowrap",
                textOverflow:"ellipsis",
                overflow:"hidden"
            }}

            href={props.node.Url}>{props.node.Title}
        </a>}

        {(props?.node?.Children?.length > 0) &&
        <svg style={{ marginTop: "26px" }} width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.97656 7.35938C7.97656 7.22396 7.95052 7.09896 7.89844 6.98438C7.84635 6.86979 7.76823 6.76042 7.66406 6.65625L1.57812 0.703125C1.40625 0.53125 1.19271 0.445312 0.9375 0.445312C0.770833 0.445312 0.617188 0.486979 0.476562 0.570312C0.335938 0.648438 0.223958 0.755208 0.140625 0.890625C0.0625 1.02604 0.0234375 1.17969 0.0234375 1.35156C0.0234375 1.59635 0.117188 1.8151 0.304688 2.00781L5.78906 7.35938L0.304688 12.7109C0.117188 12.9036 0.0234375 13.125 0.0234375 13.375C0.0234375 13.5417 0.0625 13.6927 0.140625 13.8281C0.223958 13.9688 0.335938 14.0781 0.476562 14.1562C0.617188 14.2396 0.770833 14.2812 0.9375 14.2812C1.19271 14.2812 1.40625 14.1927 1.57812 14.0156L7.66406 8.0625C7.76823 7.95833 7.84635 7.84896 7.89844 7.73438C7.95052 7.61979 7.97656 7.49479 7.97656 7.35938Z" fill="#2D32AA" />
        </svg>}



    </div>);


};
export const SubNavigation = (props: { node: NavigationNode; onNavigate: ()=>void}): JSX.Element => {
    const [selectedNavigationNode, setselectedNavigationNode] = useState(null)
    const [showLevel3, setShowLevel3] = useState(false)
    const onMouseOver = (node: NavigationNode): void => {
        console.log("Show leve 3")
        setselectedNavigationNode(node)
        setShowLevel3(true)
    }
    
    return (
        <div 
        style={{display:"flex"}}
        onMouseLeave={() => { 
            console.log("level3 off")
            setShowLevel3(false) }}>
        
            <div style={{width:"300px"}}>

                {props?.node.Children.map((childNode: NavigationNode, key) => {
                    childNode.onOver = onMouseOver
                    return <SubMenuItem key={key} node={childNode} onNavigate={props.onNavigate} />;
                })}
                 
            </div>
            {showLevel3 && selectedNavigationNode?.Children.length > 0 &&
                   <div>
                    
                   <SubNavigation onNavigate={props.onNavigate} node={selectedNavigationNode}  />      
                   </div>         
                }
        </div>
    );
};
