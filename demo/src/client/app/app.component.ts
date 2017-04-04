import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';

import { PostMessageBridgeImpl, IPostMessageBridge, IPostMessageEventTarget, PostMessageBridgeFactory } from 'angular2-post-message';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  constructor(@Inject(PostMessageBridgeFactory) private bridgeFactory: PostMessageBridgeFactory) {
    console.log('Environment config', Config);
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);

    /**
     * Root context
     */
    const iFrame: IPostMessageEventTarget = window.frames[0];
    const currentWindow: IPostMessageEventTarget = window;

    // The main usage scenario
    const bridge:IPostMessageBridge = this.bridgeFactory.makeInstance()
        .connect(currentWindow, iFrame)
        .makeBridge('Logout')
        .makeBridge('ChangeLanguage')
        .addListener('Logout', (message:any) => console.info('The iframe has sent a message to the parent: LOGOUT'));

    setTimeout(() => {
      bridge.sendMessage('ChangeLanguage', 'ru');

      setTimeout(() => {
        // The additional usage scenario
        // You can also use the direct native mechanism of sending the message (if the external application does not use Angular2)
        window.frames[0].postMessage([{channel: 'ChangeLanguage', message: 'de'}], '*');
      }, 500);
    }, 1000);
  }
}
