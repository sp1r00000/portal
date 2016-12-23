import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
// Collections
import { Portfolios } from '/imports/api/portfolios';
// Components
import '/imports/ui/components/blotter/blotter_chart.js';
import '/imports/ui/components/blotter/blotter_transaction_list.js';
import '/imports/ui/components/portfolio/portfolio_manage.js';
// Corresponding html file
import './blotter.html';


Template.blotter.onCreated(() => {
  Meteor.subscribe('portfolios');
});


Template.blotter.helpers({
  getPortfolioName() {
    const address = FlowRouter.getParam('address');
    return (address === undefined) ? '' : Portfolios.findOne({ address }).name;
  },
});


Template.blotter.onRendered(() => {});
