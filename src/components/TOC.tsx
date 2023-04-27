/* eslint-disable no-lone-blocks */
import * as React from 'react';
import { NavigationNode } from '../helpers';


interface ITOCelement {
    displayName: string
    id: string
    childs?: ITOCelement[]
}


export const TOCTree = (props: { nodes: ITOCelement[], level: number }): JSX.Element => {
    const {
        nodes,
        level
    } = props

    return (<div>
        {
            nodes.map((node : ITOCelement, index: number) => {
        
                // eslint-disable-next-line no-unused-expressions
                {node?.childs.length  &&
                    <div key={index}>
                        {node.displayName}
                        <svg style={{ marginTop: "12px" }} width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.528411 1.71L3.11841 4.3C3.50841 4.69 4.13841 4.69 4.52841 4.3L7.11841 1.71C7.74841 1.08 7.29841 0 6.40841 0H1.22841C0.338411 0 -0.101589 1.08 0.528411 1.71Z" fill="black" fill-opacity="0.54" />
                        </svg>
                    </div>
                
                }




            
            
            
            
            })
        }


    </div>)
};
