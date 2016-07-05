import { Meteor } from 'meteor/meteor';
//APP MUST BE STARTED WITH THE FOLLOWING: meteor run --settings settings.json

function init(){
  GitHubCollection.remove({});
  VimeoCollection.remove({});
  Github.callStats();
  //Vimeo.callStats();

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
