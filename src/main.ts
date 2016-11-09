import Bridge from './bridge';

class BridgeAdapter {
  private bridge: Bridge;
  constructor() {
    this.bridge = new Bridge();
  }
}
(function() {
	let bridgeloader = new BridgeAdapter();
})();

