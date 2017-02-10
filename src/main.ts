import {Bridge} from './Bridge';

class BridgeAdapter {
  private bridge: Bridge;
  constructor() {
    this.bridge = new Bridge();
  }
}
(function() {
	let bridgeloader = new BridgeAdapter();
})();

export * from './elements';
export * from './handlers';
export * from './elements';
export * from './Bridge';
