import * as React from 'react';
import styles from './NexiTabs.module.scss';
import { INexiTabsProps } from './INexiTabsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useState, useEffect } from 'react';

interface ITabProps {
  text: string;
  isSelected: boolean;
  nobreak: boolean;
  onSelect: () => void;
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


  return (
    <div onClick={props?.onSelect} className={`${props.nobreak ? styles.tabnobreak : styles.tab} ${props.isSelected ? styles.selected : styles.unselected} `} >{props?.text}</div>
  )

}
export default function NexiTabs(props: INexiTabsProps): JSX.Element {

  const {
    tabs,
    hasTeamsContext,
    noWhiteSpaceBreak

  } = props;
  const tabsElements = tabs?.split("\n")
  const [selectedTab, setselectedTab] = useState(0)
  const [selectedTabText, setselectedTabText] = useState("")
  const [hash, setHash] = useHash()
  const [sections, setSections] = useState<any[]>([])
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


  return (


    <section className={`${ styles.nexiTabs} ${hasTeamsContext ? styles.teams : ''}`}>

      <div className={`${noWhiteSpaceBreak ? styles.tabsnobreak: styles.tabs} `} >
        {tabs?.split("\n").map((tab: string, ix: number) => {
          return <Tab nobreak={noWhiteSpaceBreak} isSelected={selectedTab === ix} key={ix} text={escape(tab)} onSelect={() => { 
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
