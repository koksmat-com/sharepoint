import * as React from 'react';
import styles from './SharedPage.module.scss';
import { ISharedPageProps } from './ISharedPageProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class SharedPage extends React.Component<ISharedPageProps, {}> {
  public render(): React.ReactElement<ISharedPageProps> {
    const {
      description,
      url,
      height,
      width,
      accessToken
    } = this.props;
   
    // let timeoutHandler: any;
    // const getSuiteLinks = async () => {
    //   const SPSuiteLinksJson = localStorage.getItem('SPSuiteLinksJson')
    //   if (!SPSuiteLinksJson){
    //     setTimeout(() => {
    //       getSuiteLinks()
    //     },200)
    //   }
    //   setsuiteLinks(SPSuiteLinksJson)
    // }
    // useEffect(() => {
    //   getSuiteLinks()
    
    //   return () => {
    //     clearTimeout(timeoutHandler)
    //   }
    // }, [])
    

    if (!url){
      return <div>
        <h1>Shared Page</h1>
        <p>Edit the page and edit the URL of this web part</p>
      </div>
    }
    return (
      <div>
       
        <iframe src={accessToken ? url.replace("TOKEN",accessToken) : url} width={width??"100%"} height={height??"1500px"} frameBorder="0"></iframe>
        </div>
    );
  }
}
