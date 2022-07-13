const MEDIATOR =
  "https://authn.io/mediator" +
  "?origin=" +
  encodeURIComponent(window.location.origin);

const WALLET_LOCATION = window.location.origin;

export { MEDIATOR, WALLET_LOCATION };