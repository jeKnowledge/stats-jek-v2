import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './views/vimeo.html';
import './views/facebook.html';
import './views/github.html';
import './views/jekPage.html';
import './views/slack.html';
import './views/twitter.html';


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
    }
});


FlowRouter.route('/slack/', {
    name: 'slack.show',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'slack_page'});
    }
});


FlowRouter.route('/facebook/', {
    name: 'facebook.show',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'facebook_page'});
    }
});


FlowRouter.route('/twitter/', {
    name: 'twitter.show',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'twitter_page'});
    }
});

FlowRouter.route('/github/', {
    name: 'github.show',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'github_page'});
    }
});

FlowRouter.route('/jekpage/', {
    name: 'jekpage.show',
    action(params, queryParams) {
        BlazeLayout.render('App_body', {main: 'jekpage'});
    }
});



/*RETURNING THINGS FROM THE DATABASE*/
Template.vimeo_page.helpers({
    vimeo : function(){
     return VimeoCollection.find();
   }
});

Template.slack_page.helpers({
    slack : function(){
     return SlackCollection.find();
   }
});

/*Template.facebook_page.helpers({
    facebook : function(){
     return FacebookCollection.find();
   }
});


Template.twitter_page.helpers({
    twitter : function(){
     return TwitterCollection.find();
   }
});

Template.github_page.helpers({
    github : function(){
     return GithubCollection.find();
   }
});

Template.jekpage_page.helpers({
    jekpage : function(){
     return JekPageCollection.find();
   }
});
*/
