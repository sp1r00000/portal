/* eslint-disable no-underscore-dangle */
import { Meteor } from 'meteor/meteor';
import Web3 from 'web3';


/*

if (typeof web3 !== 'undefined') {
  window.web3 = new Web3(window.web3.currentProvider);

  // HACK: check for account changes and reload the browser then
  // - [ ] Improvement 1: Do not reload but update the state
  // - [ ] Improvement 2: Push MetaMask to update their API
  // (https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes)
  let initialAccount = window.web3.eth.accounts[0];
  window.setInterval(() => {
    const currentAccount = window.web3.eth.accounts[0];
    if (!initialAccount && currentAccount) initialAccount = currentAccount;
    if (currentAccount !== initialAccount) window.location.reload();
  }, 500);
} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}
*/

if (Meteor.isClient) window.__AppInitializedBeforeWeb3__ = false;

const injectedWeb3 = global.web3;
let web3Instance = new Web3();
let initialized = false;

const initWeb3Instance = () => {
  if (!initialized && !window.__AppInitializedBeforeWeb3__) {
    throw new Error(`
      Tryin to access web3 before app is initialized.
      Did you set window.__AppInitializedBeforeWeb3__ = true in your app startup code?
    `);
  }
  web3Instance = (injectedWeb3 === undefined)
    ? new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
    : new Web3(injectedWeb3.currentProvider);

  window.web3 = new Proxy(web3Instance, {
    get(target, property) {
      console.warn('Do not use window.web3. Import it from "/imports/lib/client/ethereum/web3.js"');
      return web3Instance[property];
    },
    set(target, property, value) {
      console.warn('Do not use window.web3. Import it from "/imports/lib/client/ethereum/web3.js"');
      web3Instance[property] = value;
      return true;
    },
  });

  initialized = true;
};

const web3Proxy = (Meteor.isClient) ?
  new Proxy(web3Instance, {
    get(target, property) {
      initWeb3Instance();
      return web3Instance[property];
    },
    set(target, property, value) {
      initWeb3Instance();
      web3Instance[property] = value;
      return true;
    },
  })
  : null;

export default web3Proxy;
