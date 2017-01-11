import {NgModule} from '@angular/core';

import {PostMessageBridgeImpl} from "./PostMessageBridgeImpl";
import {PostMessageBridgeFactory} from "./PostMessageBridgeFactory";

@NgModule({
	providers: [
		PostMessageBridgeImpl,
		PostMessageBridgeFactory
	]
})
export class PostMessageModule {
}
