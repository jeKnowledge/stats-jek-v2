import { HTTP } from 'meteor/http';
//-----------------------------------------------------------------  STRUCTS  ------------------------------------------------------------------//
//CLASS THAT HOLDS ALL THE INFO ABOUT GITHUB STATS
class GithubBucket {
  constructor() {
    this.allRepos = [];                 //checked
    this.numberPeople = 0;              //checked
    this.People = [];                   //almost checked
    this.totalWatchers = 0;
    this.totalSizeKB = 0;
    this.totalCommits = 0;
    this.numberFollowers = 0;
    this.followersNames = [];
    this.totalDownloads = 0;
    this.totalPulls = 0;
    this.totalIssues = 0;
    this.totalStargazers = 0;
    this.totalComments = 0;
    this.totalForks = 0;
    this.totalMerges = 0;
    this.totalInvitations = 0;
    this.totalReleases = 0;
    this.lastInvitation = new Date();      //must be a diferente struct
    this.lastMerge = new Date();           //must be a diferente struct
    this.lastFork = new Date();            //must be a diferente struct
    this.lastComment = new Date();         //must be a diferente struct
    this.lastEvent = new Date();           //must be a diferente struct
    this.lastCommit = new Date();          //must be a diferente struct
    this.lastPull = new Date();            //must be a diferente struct
    this.lastIssue = new Date();           //must be a diferente struct
    this.lastRelease = new Date();         //must be a diferente struct
    //SOME EXTRA STATS
    this.commitsPerDay = 0;
    this.commitsPerWeek = 0;
    this.commitsPerYear = 0;
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A REPOSITORY
class Repository {
  constructor() {
    this.name = new String();                 //checked
    this.programLanguage = new String();      //checked
    this.sizeKB = 0;                          //checked
    this.description = new String();          //checked
    this.gitUrl = new String();               //checked
    this.createdAt = new Date();              //checked
    this.numberWatchers = 0;                  //checked
    this.numberContributors = 0;              //checked
    this.numberCommits = 0;                   //checked
    this.downloads = 0;                       //checked
    this.contributors = [];                   //almost checked
    this.numberComments = 0;
    this.commentsList = [];
    this.numberReleases = 0;
    this.Releases = [];
    this.numberIssues = 0;
    this.issuesList = [];
    this.numberMembers = 0;
    this.membersNames = [];
    this.watchersNames = [];
    this.numberStargazers = 0;
    this.stargazersNames = [];
    this.numberInvitations = 0;
    this.invitationList = [];
    this.numberPulls = 0;
    this.pullRequests = [];
    this.numberBranches = 0;
    this.branchesList = [];
    this.defaultBranch = new String();
    this.lastCommit = {name : new String(), login : new String(), link : new String(), date : new Date(), description : new String()};       //checked
    this.lastPull = new Date();             //must be a diferente struct
    this.lastIssue = new Date();            //must be a diferente struct
    this.lastEvent = new Date();            //must be a diferente struct
    this.lastFork = new Date();            //must be a diferente struct
    this.lastMerge = new Date();            //must be a diferente struct
    this.lastInvitation = new Date();       //must be a diferente struct
    this.lastRelease = new Date();          //must be a diferente struct
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A CONTRIBUTOR
class Contributor {
  constructor() {
    this.name = new String();               //checked
    this.login = new String();              //checked
    this.link = new String();               //checked
    this.numberCommits = 0;                 //checked
    this.commitsPerWeek = 0;                //Does the contributor work well in each week?!
    this.delectionsAdditionsPerWeek = 0;    //Are the commits significant?
    this.lastCommit = {date : new Date(), description : new String()};    //checked
    this.numberPulls = 0;
    this.lastPull = new Date();             //must be a diferente struct
    this.reportedIssues = 0;
    this.lastIssue = new Date();             //must be a diferente struct
    this.numberForks = 0;
    this.lastFork = new Date();             //must be a diferente struct
    this.numberMerges = 0;
    this.lastMerge = new Date();             //must be a diferente struct
  }
}

//-----------------------------------------------------------------  METHODS  ------------------------------------------------------------------//
Github = {

  //METHDO THAT DOES THE NECESSARY CALLS TO THE GITHUB API IN ORDER TO GET THE NECESSARY INFO ---------------------------------------------------
  //
  callStats : function(){
    //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
    var githubInfo = new GithubBucket();

    //LETS EXTRACT INFO ABOUT THE MEMBERS -----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/members?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
    }
    for(var i = 0; i < results.data.length; i++){
      githubInfo.People.push(results.data[i].login);      //TODO: ADD THE REAL NAMES AND THEIR LINKS
      githubInfo.numberPeople++;
    }

    //LETS EXTRACT INFO ABOUT EACH REPOSITORY  ----------------------------------------------------------------
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
        githubInfo.allRepos[i].gitUrl = results.data[i].git_url;
        githubInfo.allRepos[i].numberWatchers = results.data[i].watchers_count;
        githubInfo.allRepos[i].createdAt = new Date(results.data[i].created_at).toUTCString();   //TIMEZONE IS ALREADY THE SAME AS OURS
        githubInfo.allRepos[i].lastUpdate = new Date(results.data[i].updated_at).toUTCString();  //TIMEZONE IS ALREADY THE SAME AS OURS

        //EXTRACTING INFO ABOUT DOWNLOADS....
        try{
          var results1 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/downloads?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
          console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
        }
        if(results1.data.length != 0)
          githubInfo.allRepos[i].downloads = results1.data[0].download_count;

        //EXTRACTING INFO ABOUT CONTRIBUTORS....
        try{
          results1 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
          console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
        }
        for (var j = 0; j < results1.data.length; j++) {
          var newContrib = new Contributor();
          githubInfo.allRepos[i].contributors.push(newContrib);
          githubInfo.allRepos[i].contributors[j].login = results1.data[j].login;         //TODO: ADD THE REAL NAMES AND THEIR LINKS
          githubInfo.allRepos[i].numberContributors++;
          try{
            var results2 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/stats/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          } catch (e) {
            console.log("NAO FOI POSSIVEL OBTER OS DADOS DO GITHUB: ", e);
          }
          githubInfo.allRepos[i].contributors[j].numberCommits = results2.data[results2.data.length-1-j].total;
          githubInfo.allRepos[i].numberCommits +=  results2.data[results2.data.length-1-j].total;

          //EXTRACTING INFO ABOUT COMMITS....
          try{
            var results3 = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + githubInfo.allRepos[i].name + "/commits?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          } catch (e) {
            console.log("NAO FOI POSSIVEL OBTER OS DA DOS DO GITHUB: ", e);
          }
          for (var f = 0; f < results3.data.length; f++) {
            if (f == 0){
              githubInfo.allRepos[i].lastCommit.name = results3.data[f].commit.committer.name;
              githubInfo.allRepos[i].lastCommit.link = results3.data[f].author.html_url;
              githubInfo.allRepos[i].lastCommit.login = results3.data[f].author.login;
              githubInfo.allRepos[i].lastCommit.description = results3.data[f].commit.message;
              githubInfo.allRepos[i].lastCommit.date = new Date(results3.data[f].commit.committer.date).toUTCString();            //TIMEZONE IS ALREADY THE SAME AS OURS
            }
            if (results3.data[f].author.login == githubInfo.allRepos[i].contributors[j].login){
              githubInfo.allRepos[i].contributors[j].name = results3.data[f].commit.committer.name;
              githubInfo.allRepos[i].contributors[j].link = results3.data[f].author.html_url;
              githubInfo.allRepos[i].contributors[j].lastCommit.description = results3.data[f].commit.message;
              githubInfo.allRepos[i].contributors[j].lastCommit.date = new Date(results3.data[f].commit.committer.date).toUTCString(); //TIMEZONE IS ALREADY THE SAME AS OURS
              break;
            }
          }

          //EXTRACTING INFO ABOUT PULL REQUESTS....

          //EXTRACTING INFO ABOUT ISSUES....

          //EXTRACTING INFO ABOUT FORKS....

          //EXTRACTING INFO ABOUT MERGES....
          }

        }

    }

    GitHubCollection.insert(githubInfo);

  },

  //METHOD THAT CALCULATES THE TOTAL VALUES ABOUT JEKNOWLEDGE'S GITHUB ACCOUNT
  //
  calculateTotals : function(){

  }

};
