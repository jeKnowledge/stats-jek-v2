import { HTTP } from 'meteor/http';
//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT GITHUB STATS
class GithubBucket {
  constructor() {
    this.allRepos = [];                 //array of repositories
    this.numberPeople = 0;
    this.People = [];
    this.totalWatchers = 0;
    this.totalSizeKB = 0;
    this.totalCommits = 0;


    this.totalDownloads = 0;
    this.totalViews = 0;
    this.totalPulls = 0;
    this.numberFollowers = 0;
    this.followersNames = [];
    this.lastCommit = new Date();           //must be a diferente struct
    this.lastPull = new Date();             //must be a diferente struct
    this.lastIssue = new Date();            //must be a diferente struct
    this.lastEvent = new Date();            //must be a diferente struct
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
    this.contributors = [{name : new String(), lastCommit : new Date(), numberCommits : 0}];

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
  //sTRUCT THAT HOLDS ALL THE INFO ABOUT A BRANCH
  branch : {},


  callStats : function(){
    //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
    var githubInfo = new GithubBucket();

    //LETS EXTRACT THE BASIC INFO ----------------------------------------------------------------------
    try{
      var results = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/repos?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
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
        githubInfo.totalSizeKB += results.data[i].size;
        githubInfo.allRepos[i].gitUrl = results.data[i].git_url;
        githubInfo.allRepos[i].numberWatchers = results.data[i].watchers_count;
        githubInfo.totalWatchers += results.data[i].watchers_count;
        githubInfo.allRepos[i].createdAt = new Date(results.data[i].created_at).toUTCString();   //TIMEZONE IS ALREADY THE SAME AS OURS
        githubInfo.allRepos[i].lastUpdate = new Date(results.data[i].updated_at).toUTCString();
    }
    try{
      results = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/members?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
    }
    for(var i = 0; i < results.data.length; i++){
      githubInfo.People.push(results.data[i].login);
      githubInfo.numberPeople++;
    }

    //LETS EXTRACT INFO ABOUT EACH REPOSITORY  ----------------------------------------------------------------
    for (var i = 0; i < githubInfo.allRepos.length; i++) {
      //EXTRACTING INFO ABOUT CONTRIBUTIONS
      try{
        var results1 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
      } catch (e) {
        console.log("NAO FOI POSSIVEL OBTER OS DA DOS DO GITHUB: ", e);
      }
      for (var j = 0; j < results1.data.length; j++) {
        githubInfo.allRepos[i].contributors[j].name = results1.data[j].login;
        githubInfo.allRepos[i].contributors[j].numberCommits = results1.data[j].contributions;
        githubInfo.totalCommits += results1.data[j].contributions;
        githubInfo.allRepos[i].numberContributors++;
          try{
            var results2 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/stats/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          } catch (e) {
            console.log("NAO FOI POSSIVEL OBTER OS DA DOS DO GITHUB: ", e);
          }
          for (var l = results2.data.length-1, k = 0; l >= 0; l--) {
            for (var i = 0; i < results2.data[k++].weeks.length; i++) {
              if (results2.data[k].weeks.c != 0){
                githubInfo.allRepos[i].contributors[j].lastCommit = new Date(results2.data[k++].weeks);
                break;
              }
            }
        }
      }
      //EXTRACTING INFO ABOUT COMMITS
      /*try{
        var results1 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
      } catch (e) {
        console.log("NAO FOI POSSIVEL OBTER OS DA DOS DO GITHUB: ", e);
      }*/
    }


    console.log(githubInfo.allRepos[0].numberContributors);
    console.log(githubInfo.allRepos[1].numberContributors);


    GitHubCollection.insert(githubInfo);

  },

updateDatabase : function(){
  db.github.remove({});
}


};
