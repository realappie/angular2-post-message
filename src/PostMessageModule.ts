import {NgModule} from '@angular/core';

import {PostMessageBridgeImpl} from "./PostMessageBridgeImpl";

@NgModule({
	providers: [
		PostMessageBridgeImpl
	]
})
export class PostMessageModule {
}
