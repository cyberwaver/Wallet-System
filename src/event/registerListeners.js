const WalletListener = require("./listeners/WalletListener");
const UserListener = require("./listeners/UserListener");

const Listeners = [WalletListener, UserListener];
const registerListeners = (container) => () => {
  Listeners.forEach((Listener) => Listener.listen(container));
};

module.exports = registerListeners;
