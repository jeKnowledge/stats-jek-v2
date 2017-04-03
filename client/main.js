import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

import './main.html';
import './views/vimeo.html';

/*DEFINING ROUTES*/
FlowRouter.route('/', {
  name: 'Home.show',
  action(params, queryParams) {
    BlazeLayout.render('App_body', {main: 'Home_show_page'});
  }
});

FlowRouter.route('/vimeo/', {
    name: 'vimeo.show',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'vimeo_page'});
    },
    link: {
            twbs: {
            rel: 'stylesheet',
            href: 'vimeo.css'
        }
    }/*
    script: {
      twbs: 'https://maxcdn.bootstrapcdn.com/bootstrap/2.2.0/js/bootstrap.min.js'
  }*/
});
new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);


/*RETURNING THINGS FROM THE DATABASE*/
Template.vimeo_page.helpers({
    vimeo : function(){
     return VimeoCollection.find();
   }
});
