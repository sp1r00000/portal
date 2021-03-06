<<<<<<< HEAD
// NPM
// import d3 from 'd3';
// import drawOrderbook from '@melonproject/orderbook-visualisation';
import { Template } from 'meteor/templating';
// Collections
import Orders from '/imports/api/orders';

// Components
=======
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { Cores } from '/imports/api/cores';
import { Orders } from '/imports/api/orders';
import convertFromTokenPrecision from '/imports/melon/interface/helpers/convertFromTokenPrecision';
>>>>>>> 964f2c69dfbe19a999d037a9b5f6ead00ba2dc78
import '/imports/ui/components/manage/manageHoldings';
import '/imports/ui/components/manage/manageOverview';
import '/imports/ui/components/manage/openOrders';
import '/imports/ui/components/manage/orderBookContents';
import '/imports/ui/components/manage/recentTrades';
import './manage.html';


const calcBuyCumulativeVolume = (currentOrder) => {
  let beforeCurrent = true;

  return Orders.find({
    isActive: true,
    'buy.price': { $gte: currentOrder.buy.price },
    'buy.symbol': currentOrder.buy.symbol,
    'sell.symbol': currentOrder.sell.symbol,
  }, {
    sort: {
      'buy.price': -1,
      'buy.howMuch': 1,
      createdAt: 1,
    },
  }).fetch()
  .reduce((accumulator, currentValue) => {
    let cumulativeBuyVolume = accumulator;
    if (beforeCurrent) cumulativeBuyVolume += currentValue.buy.howMuch;

    if (currentValue._id === currentOrder._id) { beforeCurrent = false; }

    return cumulativeBuyVolume;
  }, 0);
};

const calcSellCumulativeVolume = (currentOrder) => {
  let beforeCurrent = true;
  return Orders.find({
    isActive: true,
    'sell.price': { $lte: currentOrder.sell.price },
    'sell.symbol': currentOrder.sell.symbol,
    'buy.symbol': currentOrder.buy.symbol,
  }, {
    sort: {
      'sell.price': 1,
      'buy.howMuch': 1,
      createdAt: 1,
    },
  }).fetch()
  .reduce((accumulator, currentValue) => {
    const cumulativeSellVolume = beforeCurrent
      ? accumulator + currentValue.sell.howMuch
      : accumulator;

    if (currentValue._id === currentOrder._id) { beforeCurrent = false; }

    return cumulativeSellVolume;
  }, 0);
};

Template.manage.onCreated(() => {});

Template.manage.helpers({});

Template.manage.onRendered(function () {
  $('select').select2();

  /*
  const templateInstance = this;

  // Wait until all Session variables are set to ensure that #charts is in the DOM
  Tracker.autorun(() => {
    if (Session.get('isClientConnected')
        && Session.get('selectedAccount') !== ''
        && Session.get('network') === 'Kovan'
        && Cores.find({ owner: Session.get('selectedAccount') }).count() > 0) {
      // Defer execution until next tick. I.e. after the DOM is updated

      const [baseTokenSymbol, quoteTokenSymbol] = (Session.get('currentAssetPair') || '---/---').split('/');

      const allOrders = Orders.find({
        isActive: true,
        'buy.symbol': { $in: [baseTokenSymbol, quoteTokenSymbol] },
        'sell.symbol': { $in: [baseTokenSymbol, quoteTokenSymbol] },
      }, {
        sort: {
          'buy.symbol': 1,
          'buy.price': 1,
          createdAt: 1,
        },
      }).map(order => ({
        price: order.buy.symbol === baseTokenSymbol
          ? convertFromTokenPrecision(order.sell.howMuch, order.sell.precision)
            / convertFromTokenPrecision(order.buy.howMuch, order.buy.precision)
          : convertFromTokenPrecision(order.buy.howMuch, order.buy.precision)
            / convertFromTokenPrecision(order.sell.howMuch, order.sell.precision),
        buySymbol: order.buy.symbol,
        howMuch: order.buy.symbol === baseTokenSymbol
          ? convertFromTokenPrecision(order.buy.howMuch, order.buy.precision)
          : convertFromTokenPrecision(order.sell.howMuch, order.sell.precision),
        cumulativeVolume: order.buy.symbol === baseTokenSymbol
          ? convertFromTokenPrecision(calcBuyCumulativeVolume(order), order.buy.precision)
          : convertFromTokenPrecision(calcSellCumulativeVolume(order), order.sell.precision),
      }))
      .sort((a, b) => (a.price > b.price ? 1 : -1));

      Meteor.defer(() => {
        const svg = d3.select('svg.js-charts');

        // HACK: set svg inner html to "" empty string to prevent overdrawing
        svg.html('');

        const data = allOrders.map(o => ({
          price: o.price,
          howMuch: o.howMuch,
          total: parseInt(o.cumulativeVolume, 10),
          type: o.buySymbol === baseTokenSymbol ? 'bid' : 'ask',
        }));

        drawOrderbook(data, svg, d3);
      });
    }
  });
  */
});
