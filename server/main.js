import { Meteor } from 'meteor/meteor';

function init(){
    //VimeoCollection.remove({});
  //GitHubCollection.remove({});
  //SlackCollection.remove({});
  //FacebookCollection.remove({});
  //TwitterCollection.remove({});
  //Github.callStats();
  //Vimeo.callStats();
  //Slack.callStats();
  //Facebook.callStats();
  //Twitter.callStats();
}


Meteor.startup(() => {
  init();
});

Meteor.methods({
    /*TODO: SCHEDULE CALLING STATS AND WRITING IN THE DATABASE ONLY AT A CERTAIN HOUR, OTHERWISE WE WILL READ DIRECTLY FROM THE DATABASE
    JekPage.getRepoList();
    Slack.getRepoList();
    Facebook.getRepoList();
    Twitter.getRepoList();
    Vimeo.getRepoList();
    Linkedin.getRepoList();
    */
});
