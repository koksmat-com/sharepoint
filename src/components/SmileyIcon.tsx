import * as React from 'react';
import { useState } from "react"



interface SmileyButtonProps {
  defaultIsOn: boolean
  size: number
}

export function SmileyButton({ defaultIsOn,size }: SmileyButtonProps): JSX.Element {
  const [isOn, setisOn] = useState(defaultIsOn)
  const [isHover, setisHover] = useState(false)

const csssize = `${size}px`
const csssizeHover = `${size*1.1}px`
const cssDelta = `-${size*0.05}px`

  return (
    <div style={{ padding: "8px", cursor: "pointer",position:"relative" }} onDoubleClick={()=>{setisOn(!isOn)}}
    
    
    onMouseEnter={()=>{setisHover(true)}}
    onMouseLeave={()=>{setisHover(false)}}>
 
      {isOn && (
        <svg
          style={{

            position: "absolute",
             left: isHover ? cssDelta:"0px",
             top: isHover ? cssDelta:"0px",
             width: isHover ? csssizeHover:csssize,
             height:isHover ? csssizeHover:csssize,
             transition: "all .5s"
         }}
      
          viewBox="0 0 234 234"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_249_2)">
            <path
              d="M117 19.5C170.761 19.5 214.5 63.2385 214.5 117C214.5 170.761 170.761 214.5 117 214.5C63.2385 214.5 19.5 170.761 19.5 117C19.5 63.2385 63.2385 19.5 117 19.5ZM117 0C52.3868 0 0 52.3868 0 117C0 181.613 52.3868 234 117 234C181.613 234 234 181.613 234 117C234 52.3868 181.613 0 117 0ZM170.693 135.925C155.951 147.576 139.747 154.752 117.01 154.752C94.2533 154.752 78.0487 147.576 63.3068 135.925L58.5 140.732C69.4882 157.502 89.7 175.5 117.01 175.5C144.31 175.5 164.512 157.502 175.5 140.732L170.693 135.925ZM82.875 78C74.802 78 68.25 84.5423 68.25 92.625C68.25 100.708 74.802 107.25 82.875 107.25C90.948 107.25 97.5 100.708 97.5 92.625C97.5 84.5423 90.948 78 82.875 78ZM151.125 78C143.052 78 136.5 84.5423 136.5 92.625C136.5 100.708 143.052 107.25 151.125 107.25C159.198 107.25 165.75 100.708 165.75 92.625C165.75 84.5423 159.198 78 151.125 78Z"
              fill="black"
            />
          </g>
          <defs>
       
          </defs>
        </svg>
      )}
      {!isOn && (
        <svg
        style={{

            position: "absolute",
             left: isHover ? cssDelta:"0px",
             top: isHover ? cssDelta:"0px",
             width: isHover ? csssizeHover:csssize,
             height:isHover ? csssizeHover:csssize,
             transition: "all .5s"
         }}
          viewBox="0 0 234 234"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_249_4)">
            <circle cx="117.5" cy="117.5" r="106.5" fill="#FFB93E" />
            <path
              d="M117 19.5C170.761 19.5 214.5 63.2385 214.5 117C214.5 170.761 170.761 214.5 117 214.5C63.2385 214.5 19.5 170.761 19.5 117C19.5 63.2385 63.2385 19.5 117 19.5ZM117 0C52.3867 0 0 52.3867 0 117C0 181.613 52.3867 234 117 234C181.613 234 234 181.613 234 117C234 52.3867 181.613 0 117 0ZM170.693 135.925C155.951 147.576 139.747 154.752 117.01 154.752C94.2533 154.752 78.0488 147.576 63.3068 135.925L58.5 140.732C69.4882 157.502 89.7 175.5 117.01 175.5C144.31 175.5 164.512 157.502 175.5 140.732L170.693 135.925ZM82.875 78C74.802 78 68.25 84.5422 68.25 92.625C68.25 100.708 74.802 107.25 82.875 107.25C90.948 107.25 97.5 100.708 97.5 92.625C97.5 84.5422 90.948 78 82.875 78ZM151.125 78C143.052 78 136.5 84.5422 136.5 92.625C136.5 100.708 143.052 107.25 151.125 107.25C159.198 107.25 165.75 100.708 165.75 92.625C165.75 84.5422 159.198 78 151.125 78Z"
              fill="black"
            />
          </g>
          <defs>
       
          </defs>
        </svg>
      )}
    
    </div>
  )
}
