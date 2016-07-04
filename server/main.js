import { Meteor } from 'meteor/meteor';

function init(){

  GitHubCollection.remove({});
  VimeoCollection.remove({});
  Github.callStats();
  //Vimeo.callStats();
   //TODO: METHOD THAT UPDATES STATES EACH DAY AT 5:30 AM
   /*
   JekPage.getRepoList();
   Slack.getRepoList();
   Facebook.getRepoList();
   Twitter.getRepoList();
   Vimeo.getRepoList();
   Linkedin.getRepoList();
   */
}


Meteor.startup(() => {
  init();
});

Meteor.methods({





});
