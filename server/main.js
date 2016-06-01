import { Meteor } from 'meteor/meteor';

var urlPath, args;

function init(){
   Github.getRepoList();
   /*
   JekPage.getRepoList();
   Slack.getRepoList();
   Facebook.getRepoList();
   Twitter.getRepoList();
   Vimeo.getRepoList();
   Linkedin.getRepoList();
   Flickr.getRepoList();
   */
}


Meteor.startup(() => {
  init();
});

Meteor.methods({





});
