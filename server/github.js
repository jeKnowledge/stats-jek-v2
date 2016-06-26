import { HTTP } from 'meteor/http';
//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT GITHUB STATS
class GithubBucket {
  constructor() {
    this.allRepos = [];                 //array of repositories
    this.numberPeople = 0;
    this.People = [];
    this.totalDownloads = 0;
    this.totalViews = 0;               //????
    this.totalWatchers = 0;
    this.totalSize = 0;
    this.totalCommits = 0;
    this.totalPulls = 0;
    this.numberFollowers = 0;
    this.followersNames = [];
    this.lastCommit = new Date();
    this.lastPull = new Date();
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A REPOSITORY
class Repository {
  constructor() {
    this.name = new String();
    this.programLanguage = new String();
    this.sizeKB = 0;
    this.description = new String();
    this.gitUrl = new String();
    this.createdAt = new Date();
    this.numberWatchers = 0;

    this.numberContributors = 0;
    this.contributors = [{name : new String(), lastContribution : new Date(), contribution : new String(), numberCommits : 0}];
    this.numberReleases = 0;

    this.numberIssues = 0;
    this.issuesList = [];
    this.numberMembers = 0;
    this.membersNames = [];
    this.watchersNames = [];
    this.numberStargazers = 0;
    this.stargazersNames = [];
    this.lastUpdate = new Date();

  }
}

//-----------------------------------------------------   METHODS  ------------------------------------------------------------------//
Github = {
  //STRUCT THAT HOLDS ALL THE INFO ABOUT A COMMIT
  commit : {},
  //STRUCT THAT HOLDS ALL THE INFO ABOUT AN ISSUE
  issue : {},
  //STRUCT THAT HOLDS ALL THE INFO ABOUT A PULL REQUEST
  pullRequest : {},
  //STRUCT THAT HOLDS ALL THE INFO ABOUT A BRANCH
  branch : {},


  callStats : function(){
    var githubInfo = new GithubBucket();

    try{
      var results = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/repos?per_page=150&access_token=6924887df7913a97ee7452484c79d9321d2f3ce1", {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
    }
    for(var i = 0; i < results.data.length; i++){
        var newRepo = new Repository();
        githubInfo.allRepos.push(newRepo);
        githubInfo.allRepos[i].name = results.data[i].name;
        githubInfo.allRepos[i].description = results.data[i].description;
        githubInfo.allRepos[i].programLanguage = results.data[i].language;
        githubInfo.allRepos[i].sizeKB = results.data[i].size;
        githubInfo.allRepos[i].gitUrl = results.data[i].git_url;
        githubInfo.allRepos[i].numberWatchers = results.data[i].watchers_count;
        githubInfo.allRepos[i].createdAt = new Date(results.data[i].created_at).toUTCString();   //TIMEZONE IS ALREADY THE SAME AS OURS
        githubInfo.allRepos[i].lastUpdate = new Date(results.data[i].updated_at).toUTCString();
    }

    try{
      results = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/members?per_page=150&access_token=6924887df7913a97ee7452484c79d9321d2f3ce1", {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
    }
    for(var i = 0; i < results.data.length; i++){
      githubInfo.People.push(results.data[i].login);
      githubInfo.numberPeople++;
    }

    for (var i = 0; i < githubInfo.allRepos.length; i++) {
      try{
        HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/" + githubInfo.allRepos[i].name + "/contributors?per_page=150&access_token=6924887df7913a97ee7452484c79d9321d2f3ce1", {headers: {"User-Agent": "Meteor/1.0"}});
      } catch (e) {
        console.log("NAO FOI POSSIVEL OBTER OS DA DOS DO GITHUB: ", e);
      }
      githubInfo.allRepos[i].contributors.name = results.data[i].login;
      githubInfo.allRepos[i].numberContributors++;
    }
    console.log.allRepos[0].numberContributors;


    GitHubCollection.insert(githubInfo);

  },

updateDatabase : function(){
  db.github.remove({});
}


};
