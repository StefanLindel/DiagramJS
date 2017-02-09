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

