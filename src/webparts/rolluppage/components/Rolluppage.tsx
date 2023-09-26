import * as React from 'react';

import { IRolluppageProps } from './IRolluppageProps';


export default class Rolluppage extends React.Component<IRolluppageProps, {}> {
  public render(): React.ReactElement<IRolluppageProps> {
    const {
      url,
      height
    } = this.props;
if (!url) return <div>Rollup page not found</div>
    return (
      <section>
        <iframe src={url} style={{width:"100%",height,border:0}} />
      </section>
    );
  }
}
