import * as React from 'react';
import styles from './NexiTabs.module.scss';
import { INexiTabsProps, TabColors } from './INexiTabsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useState, useEffect } from 'react';

interface ITabProps {
  text: string;
  isSelected: boolean;
  nobreak: boolean;
  onSelect: () => void;
  tabColors : TabColors
}

const useHash = () => {
  const clean = (h:string) => decodeURI(h.replace("#", ""))

  const [hash, setHash] = React.useState<string>(() => clean(window.location.hash));

  const hashChangeHandler = React.useCallback(() => {
    const h =  clean(window.location.hash)
   
    setHash(h);
  }, []);

  React.useEffect(() => {
    window.addEventListener('hashchange', hashChangeHandler);
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, []);

  const updateHash = React.useCallback(
    (newHash:string) => {
      if (newHash !== hash) window.location.hash = newHash;
    },
    [hash]
  );

  return [hash, updateHash] as const
};

const Tab = (props: ITabProps): JSX.Element => {
  return <div onClick={props?.onSelect} className={`${props.nobreak ? styles.tabnobreak : styles.tab} ${props.isSelected ? styles.selected : styles.unselected} `} >{props?.text}</div>


  // return (
  //   <div onClick={props?.onSelect} style={{ alignSelf: "center",
  //   borderTopLeftRadius:"10px",
  //   borderTopRightRadius:"10px",
  //   cursor:props.tabColors.cursor,
  //   backgroundColor:props.isSelected ? props.tabColors.activeBack : props.tabColors.passiveBack,
  //   color:props.isSelected ? props.tabColors.activeText : props.tabColors.passiveText,
  //   borderBottom : props.isSelected ? props.tabColors.activeBorder : props.tabColors.passiveBorder
  
  // }} className={` ${props.nobreak ? styles.tabnobreak : styles.tab}  `} >{props?.text}</div>
  // )

}
export default function NexiTabs(props: INexiTabsProps): JSX.Element {

  const { 
    tabs,
    hasTeamsContext,
    noWhiteSpaceBreak,
    colors

  } = props;

  /**
   * 
    .selected {
  background-color: #C4B6EC15;
  color: #2D32A9;

  border-bottom: 2px solid #2D32A9;
}
.unselected {
  background-color: rgba(126, 135, 152, 0.05);

  color: #000000;
  border-bottom: 2px solid #2D32A900;
}
   */
  const defaultTabColors : TabColors = {
    "activeText": "#2D32A9",
    "activeBack": "rgba(182, 185, 236, 0.5)",
    "activeBorder": "#2px solid #2D32A9",
"cursor":"pointer",
    "passiveText" :"#000000",
    "passiveBack": "rgba(182, 185, 236, 0.1)",
    "passiveBorder": "2px solid #2D32A910"
   
  }
  const tabsElements = tabs?.split("\n")
  const [selectedTab, setselectedTab] = useState(0)
  const [selectedTabText, setselectedTabText] = useState("")
  const [hash, setHash] = useHash()
  const [sections, setSections] = useState<any[]>([])
  const [tabColors, setTabColors] = useState<TabColors>(defaultTabColors)
  useEffect(() => {
   
      setselectedTabText(hash || tabsElements[0])
    
  }, [hash])


  useEffect(() => {

    const isEditing=  document.location.href.indexOf("Mode=Edit") !== -1
    

    const els = document.getElementsByClassName("Collapsible")
    const sec: any[] = []
    Array.prototype.forEach.call(els, function (el: HTMLElement) {
      const none = isEditing ? "block" : "none"
      const title = el.querySelector("h2")?.innerText
      const collapsibleHeader = el.firstChild as HTMLElement
      collapsibleHeader.style.display = none
     // el.style.backgroundColor = title === selectedTabText ? "green": "red"
     
     el.style.display = title === selectedTabText ? "block": none
     
      sec.push(title)

      setSections(sec)
    });

     // for loop over tabs
     for (let x = 0;x<tabsElements.length;x++)
     {
        if (tabsElements[x] === selectedTabText){
          if (selectedTabText){
          setselectedTab(x)}
        }
     }
  }, [selectedTabText])

  useEffect(() => {
    
   try {
    const tabColors : TabColors = JSON.parse(colors)
   // setTabColors(tabColors)
   } catch (error) {
    setTabColors(defaultTabColors)
   }
     
    
 
  }, [colors])

  return (


    <section className={`${ styles.nexiTabs} ${hasTeamsContext ? styles.teams : ''}`}>

      <div className={`${noWhiteSpaceBreak ? styles.tabsnobreak: styles.tabs} `} >
        {tabs?.split("\n").map((tab: string, ix: number) => {
          return <Tab tabColors={tabColors} nobreak={noWhiteSpaceBreak} isSelected={selectedTab === ix} key={ix} text={escape(tab)} onSelect={() => { 
            setHash( tab)
          //  setselectedTab(ix) 
          //  setselectedTabText(tab)

          }} />
        })}
        
      </div>

      {/*
      {sections.length} sections
 <pre>
        {JSON.stringify(sections, null, 2)}
</pre> */}
    </section>
  );

}
