import { Meteor } from 'meteor/meteor';

function init(){
    //VimeoCollection.remove({});
  //GithubCollection.remove({});
  //SlackCollection.remove({});
  //FacebookCollection.remove({});
  //TwitterCollection.remove({});
  //jekPage.remove({});
  //Github.callStats();
  //Vimeo.callStats();
  //Slack.callStats();
  //Facebook.callStats();
  //Twitter.callStats();
  //jekPage.callStats();
}


Meteor.startup(() => {
  init();
});

Meteor.methods({
    /*TODO: SCHEDULE CALLING STATS AND WRITING IN THE DATABASE ONLY AT A CERTAIN HOUR, OTHERWISE WE WILL READ DIRECTLY FROM THE DATABASE; THREADS???
    JekPage.getRepoList();
    Slack.getRepoList();
    Facebook.getRepoList();
    Twitter.getRepoList();
    Vimeo.getRepoList();
    Linkedin.getRepoList();
    */
});

//TODO: CSS FOR EVERY TEMPLATE
//TODO: EVERYTHING NEEDS TO BE MODULAR, INCLUDING THE USER AGENT TAG "Meteor/1.0" AND VERSIONS OF THE API ("1.1")
//TODO: TWITTER STATS
//TODO: GOOGLE ANALYTICS STATS
//TODO: REFACTOR EVERYTHING TO ECMA6
//TODO: TURN THE APP USEFULL FOR ANYONE WHO WANTS STATS
