/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { PostMessageBridgeImpl, IPostMessageBridge, IPostMessageEventTarget } from 'angular2-post-message';
import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./home'] ">
          Home
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./detail'] ">
          Detail
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./about'] ">
          About
        </a>
      </span>
    </nav>

    <main>
      <router-outlet></router-outlet>
      <iframe src="iframeApp/index.html"></iframe>
    </main>

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      <span>WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>
      <div>
        <a [href]="url">
          <img [src]="angularclassLogo" width="25%">
        </a>
      </div>
    </footer>
  `
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState,
    @Inject(PostMessageBridgeImpl) private postMessageBridge: IPostMessageBridge) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);

    /**
     * Root context
     */
    const iFrame: IPostMessageEventTarget = window.frames[0];
    const currentWindow: IPostMessageEventTarget = window;

    // The main usage scenario
    this.postMessageBridge
        .connect(currentWindow, iFrame)
        .makeBridge('Logout')
        .makeBridge('ChangeLanguage')
        .addListener('Logout', (message:any) => console.info('The iframe has sent a message to the parent: LOGOUT'));

    setTimeout(() => {
      this.postMessageBridge.sendMessage('ChangeLanguage', 'ru');

      setTimeout(() => {
        // The additional usage scenario
        // You can also use the direct native mechanism of sending the message (if the external application does not use Angular2)
        window.frames[0].postMessage([{channel: 'ChangeLanguage', message: 'de'}], '*');
      }, 500);
    }, 1000);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
