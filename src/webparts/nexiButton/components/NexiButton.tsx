import * as React from 'react';
import styles from './NexiButton.module.scss';
import { INexiButtonProps } from './INexiButtonProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class NexiButton extends React.Component<INexiButtonProps, {}> {
  public render(): React.ReactElement<INexiButtonProps> {
    const {
      text,
      url,
      state,
      hasTeamsContext

    } = this.props;

    return (
      <section className={`${state === "0" ? styles.nexiButton : styles.nexiButton} ${hasTeamsContext ? styles.teams : ''}`}>
        {state === "0" &&
          <div className={`${styles.nexi}`} >

            <a href={url} style={{ color: "#ffffff",textDecoration:"none" }} >
              <strong>{escape(text)}</strong>
            </a>
          </div>
        }
        {state !== "0" &&
          <div className={`${styles.nexidisabled}`} >
            <strong>{escape(text)}</strong>
          </div>
        }


      </section>
    );
  }
}
