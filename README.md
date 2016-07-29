# angular2-post-message

An implementation of the cross-origin communication via postMessage at Angular2.

## Description

The implementation is based on the PostMessageBusSource & PostMessageBusSink implementation of the @angular/platform-browser package.

## Installation

First you need to install the npm module:
```sh
npm install angular2-post-message --save
```

## Use

**main.ts**
```typescript
import {PostMessageBridgeImpl} from 'angular2-post-message';

export function main() {
    return bootstrap(App, [
        PostMessageBridgeImpl,
        ...
    ]);
}
```

**app.ts - Root app**
```typescript
import {IPostMessageBridge, PostMessageBridgeImpl, IPostMessageEventTarget} from 'angular2-post-message';

@Component({...})
export class App {

    constructor(@Inject(PostMessageBridgeImpl) protected postMessageBridge:IPostMessageBridge) {
        /**
         * Root context
         */
        const iFrame:IPostMessageEventTarget = window.frames[0];
        const currentWindow:IPostMessageEventTarget = window;

        postMessageBridge
            .connect(currentWindow, iFrame)
            .makeBridge('Logout')
            .makeBridge('ChangeLanguage')
            .addListener('Logout', (message:any) => console.log('The iframe has sent a message to the parent: LOGOUT'))
            .sendMessage('ChangeLanguage', 'ru');
            
        // Or use the direct method
        window.frames[0].postMessage([{channel: 'ChangeLanguage', message: 'de'}], '*');
    }
}
```

**app.ts - IFrame app**
```typescript
import {IPostMessageBridge, PostMessageBridgeImpl, IPostMessageEventTarget} from 'angular2-post-message';

@Component({...})
export class App {

    constructor(@Inject(PostMessageBridgeImpl) protected postMessageBridge:IPostMessageBridge) {
        /**
         * IFrame context
         */
        const iFrame:IPostMessageEventTarget = window;
        const parentWindow:IPostMessageEventTarget = window.top;

        postMessageBridge
            .connect(iFrame, parentWindow)
            .makeBridge('Logout')
            .makeBridge('ChangeLanguage')
            .addListener('ChangeLanguage', (message:any) => console.log(`The parent has sent a message to the iframe - set a new language as: ${message}`))
            .postMessageBridge.sendMessage('Logout');

        // Or use the direct method
        window.top.postMessage([{channel: 'Logout'}], '*');
    }
}
```

## Demo

![Preview](demo/preview.png)

## Publish

```sh
npm install & tsc & npm publish ./
```

## License

Licensed under MIT.