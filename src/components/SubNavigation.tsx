import { SPFI } from '@pnp/sp';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavigationNode, onOver, pageTabs } from '../helpers';


export const SubMenuItem = (props: { selectParent: () => void,node: NavigationNode, sp: SPFI, onNavigate: () => void }): JSX.Element => {
    const [hover, setHover] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const isLink = props.node.Url !== "http://linkless.header/"
    const { Url } = props.node
    const [children, setChildren] = useState<NavigationNode[]>(props.node.Children)


    const select = () => {
        setIsSelected(true)
    }

    useEffect(() => {
        props.selectParent()


    }, [])
    
    return (<div style={{ display: "flex" }}
        onMouseOver={() => {
            console.log("Mouse enter submenu")
            setHover(true)
            props?.node?.onOver(props.node)
        }}
        onMouseLeave={() => {
            console.log("Mouse leave submenu")
            setHover(false)
        }}

    >
        {!isLink &&
            <span

                style={{
                    padding: "20px",
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: 500,
                    color:  (hover || isSelected) ? "#2D32AA" : "#000000",
                    cursor: "default",
                    textDecoration: (hover || isSelected) ? "underline" : "none",
                    marginRight: "8px",
                    fontFamily: "'Ubuntu', sans-serif",
                  
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                }}

            >{props.node.Title}
            </span>}
        {isLink &&
            <a
                onClick={() => {
                    props.onNavigate()
                }}
                style={{
                    padding: "20px",
                    fontSize: "16px",
                    lineHeight: "24px",
                    fontWeight: 500,
                    color: (hover || isSelected) ? "#2D32AA" : "#000000",
                    cursor: "pointer",
                    textDecoration: (hover || isSelected) ? "underline" : "none",
                    marginRight: "8px",
                    fontFamily: "'Ubuntu', sans-serif",
                  
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                }}

                href={props.node.Url}>{props.node.Title}
            </a>}

        {(props?.node?.Children?.length > 0) &&
            <svg style={{ marginTop: "26px" }} width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.97656 7.35938C7.97656 7.22396 7.95052 7.09896 7.89844 6.98438C7.84635 6.86979 7.76823 6.76042 7.66406 6.65625L1.57812 0.703125C1.40625 0.53125 1.19271 0.445312 0.9375 0.445312C0.770833 0.445312 0.617188 0.486979 0.476562 0.570312C0.335938 0.648438 0.223958 0.755208 0.140625 0.890625C0.0625 1.02604 0.0234375 1.17969 0.0234375 1.35156C0.0234375 1.59635 0.117188 1.8151 0.304688 2.00781L5.78906 7.35938L0.304688 12.7109C0.117188 12.9036 0.0234375 13.125 0.0234375 13.375C0.0234375 13.5417 0.0625 13.6927 0.140625 13.8281C0.223958 13.9688 0.335938 14.0781 0.476562 14.1562C0.617188 14.2396 0.770833 14.2812 0.9375 14.2812C1.19271 14.2812 1.40625 14.1927 1.57812 14.0156L7.66406 8.0625C7.76823 7.95833 7.84635 7.84896 7.89844 7.73438C7.95052 7.61979 7.97656 7.49479 7.97656 7.35938Z" fill="#2D32AA" />
            </svg>}



    </div>);


};
export const SubNavigation = (props: { selectParent: () => void, level: number, node: NavigationNode, sp: SPFI, onNavigate: () => void }): JSX.Element => {
    const [selectedNavigationNode, setselectedNavigationNode] = useState(null)
    const [selectedNavigationNodeChilds, setselectedNavigationNodeChilds] = useState(null)
    const [showLevel3, setShowLevel3] = useState(false)
    const [showLevel4, setShowLevel4] = useState(false)

    const [level4, setLevel4] = useState<NavigationNode[]>([])

    const { Url } = props.node

    const isLink = Url !== "http://linkless.header/";

    useEffect(() => {
        props.selectParent()


    }, [])

    const select = () => {
        props.selectParent()
    }
    const onMouseOver: onOver = (node: NavigationNode): void => {
        console.log("On mouse over level =", props.level)
        const childNode: NavigationNode = { ...node }
        switch (props.level) {
            case 1:
                setselectedNavigationNode(node)
                setShowLevel3(true)
                break
            case 2:
                setselectedNavigationNode(node)
                setShowLevel3(true)
                break
            case 3:
                setShowLevel3(true)

                setselectedNavigationNodeChilds(childNode)
                setShowLevel4(true)
                break;
            default:
                break
        }

    }

    return (
        <div
            style={{ display: "flex" }}
            onMouseLeave={() => {
                console.log("level3 off")
                setShowLevel3(false)
                setShowLevel4(false)
            }}>

            <div style={{ minWidth: "300px" }}>

                {props?.node.Children.map((childNode: NavigationNode, key) => {
                    childNode.onOver = onMouseOver
                    return <SubMenuItem selectParent={select} sp={props.sp} key={key} node={childNode} onNavigate={props.onNavigate} />;
                })}

            </div>
            {showLevel3 && selectedNavigationNode?.Children?.length > 0 &&
                <div>

                    <SubNavigation selectParent={select} level={props.level + 1} sp={props.sp} onNavigate={props.onNavigate} node={selectedNavigationNode} />
                </div>
            }
            {showLevel4 &&
                <div>

                    <SubNavigation selectParent={select} level={props.level + 1} sp={props.sp} onNavigate={props.onNavigate} node={selectedNavigationNodeChilds} />
                </div>
            }
        </div>
    );
};
