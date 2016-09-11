import { HTTP } from 'meteor/http';
//-----------------------------------------------------------------  STRUCTS  ------------------------------------------------------------------//
//CLASS THAT HOLDS ALL THE INFO ABOUT GITHUB STATS
class GithubBucket {
  constructor() {
    this.allRepos = {};                   //checked
    this.numberMembers = 0;              //checked
    this.members = {};                   //checked
    this.totalWatchers = 0;
    this.totalSizeKB = 0;
    this.totalCommits = 0;
    this.numberFollowers = 0;
    this.followersNames = [];
    this.totalDownloads = 0;
    this.totalPulls = 0;
    this.totalStargazers = 0;
    this.totalComments = 0;
    this.totalForks = 0;
    this.totalMerges = 0;
    this.totalInvitations = 0;
    this.totalReleases = 0;
    this.totalIssues = 0;
    this.totalOpenedIssues = 0;
    this.totalClosedIssues = 0;
    this.lastInvitation;      //must be a diferente struct
    this.lastMerge;           //must be a diferente struct
    this.lastForked;            //must be a diferente struct
    this.lastComment;         //must be a diferente struct
    this.lastEvent;           //must be a diferente struct
    this.lastCommit;          //must be a diferente struct
    this.lastPull;            //must be a diferente struct
    this.lastClosedIssue;     //must be a diferente struct
    this.lastOpenedIssues;         //must be a diferente struct
    this.lastRelease;         //must be a diferente struct
    //SOME EXTRA STATS
    this.commitsPerDay = 0;
    this.commitsPerWeek = 0;
    this.commitsPerYear = 0;
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A REPOSITORY
/*class Repository {
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
    this.contributors = {};                   //checked
    this.numberComments = 0;
    this.commentsList = [];
    this.numberReleases = 0;
    this.releases = [];
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
    this.closedIssues = [];                   //checked
    this.openedIssues = [];                   //checked
    this.totalIssues = 0;                     //checked
    this.numberOpenedIssues = 0;              //checked
    this.numberClosedIssues = 0;              //checked
    this.numberForks = 0;                     //checked
    this.lastCommit = {name : new String(), login : new String(), link : new String(), date : new Date(), description : new String(), comments : []};       //comments unchecked
    this.lastPull = new Date();             //must be a diferente struct
    this.lastEvent = new Date();            //must be a diferente struct
    this.lastForked = {date : new Date(), name : new String()};            //checked
    this.lastMerge = new Date();            //must be a diferente struct
    this.lastInvitation = new Date();       //must be a diferente struct
    this.lastRelease = new Date();          //must be a diferente struct
  }
}*/

//CLASS THAT HOLDS ALL THE INFO ABOUT A CONTRIBUTOR AND HIS CONTRIBUTIONS
/*class Contributor {
  constructor() {
    this.name = new String();               //checked
    this.login = new String();              //checked
    this.link = new String();               //checked
    this.numberCommits = 0;                 //checked
    this.commitsPerWeek = 0;                //Does the contributor work well in each week?!
    this.delectionsAdditionsPerWeek = 0;    //Are the commits significant?
    this.lastCommit = {date : new Date(), description : new String(), comments : []};    // comments unchecked
    this.numberPulls = 0;
    this.lastPull = new Date();             //must be a diferente struct
    this.totalIssues = 0;                   //Issues that he/she is envolved with (closed and/or opened and/or was assigned to). Checked
    this.numberOpenedIssues = 0;            //Opened issues that he/she is envolved with (opened and/or was assigned to). Checked
    this.numberClosedIssues = 0;            //Closed issues that he/she was envolved with (closed and/or was assigned to). Checked
    this.openedIssues = [];                 //Opened issues that he/she is envolved with (opened and/or was assigned to). Checked
    this.closedIssues = [];                 //Closed issues that he/she was envolved with (closed and/or was assigned to). Checked
    this.numberForks = 0;                   //checked
    this.lastForked = new Date();            //checked
    this.numberMerges = 0;
    this.lastMerge = new Date();             //must be a diferente struct
  }
}*/

//CLASS THAT HOLDS ALL THE INFO ABOUT AN ISSUE
class Issue {
  constructor() {
    this.openedby = new String();
    this.assignees = [];
    this.milestone = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.title = new String();
    this.description = new String()
    this.numberComments = 0;
    this.closedAt = null;                                                       //Issues start open by default
    this.closedby = null;                                                       //Issues start open by default
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A MEMBER OF JEKNOWLEDGE AND IT'S CONTRIBUTIONS FOR THE JEK REPOS
//
/*class Member {
  constructor() {
    this.name = new String();
    this.login = new String();
    this.link = new String();
    this.numberCommits = 0;
    this.commitsPerWeek = 0;                //Does the contributor work well in each week?!
    this.delectionsAdditionsPerWeek = 0;    //Are the commits significant?
    this.lastCommit = {date : new Date(), description : new String(), comments : []};
    this.numberPulls = 0;
    this.lastPull = new Date();             //must be a diferente struct
    this.totalIssues = 0;                   //Issues that he/she is envolved with (closed and/or opened and/or was assigned to).
    this.numberOpenedIssues = 0;            //Opened issues that he/she is envolved with (opened and/or was assigned to).
    this.numberClosedIssues = 0;            //Closed issues that he/she was envolved with (closed and/or was assigned to).
    this.openedIssues = [];                 //Opened issues that he/she is envolved with (opened and/or was assigned to).
    this.closedIssues = [];                 //Closed issues that he/she was envolved with (closed and/or was assigned to).
    this.numberForks = 0;
    this.lastForked = new Date();
    this.numberMerges = 0;
    this.lastMerge = new Date();             //must be a diferente struct
  }
}*/
//-----------------------------------------------------------------  METHODS  ------------------------------------------------------------------//
Github = {

  //METHDO THAT DOES THE NECESSARY CALLS TO THE GITHUB API IN ORDER TO GET THE NECESSARY INFO ---------------------------------------------------
  //
  callStats : function(){
    //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
    let githubInfo = new GithubBucket();

    //LETS EXTRACT INFO ABOUT THE M EMBERS -----------------------------------------------------------------------
    let membersResults;
    try{
      membersResults = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/members?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT MEMBERS: ");
      console.log("THE ERROR: ", e);
      return;
    }

    for(let i = 0; i < membersResults.data.length; i++){
      //initializing emptinesss
      githubInfo.members[membersResults.data[i].login] = {};
      githubInfo.members[membersResults.data[i].login].lastCommit = {};
      githubInfo.members[membersResults.data[i].login].lastForked = {};

      githubInfo.members[membersResults.data[i].login].url = membersResults.data[i].html_url;
      //Extracting their names...
      let memberInfo;
      try{
        memberInfo = HTTP.call('GET', "https://api.github.com/users/" + membersResults.data[i].login + "?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
      } catch (e) {
        console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT THE FOLOWING MEMBER NICKNAME: " + membersResults.data[i].login);
        console.log("THE ERROR: ", e);
        return;
      }
      githubInfo.members[membersResults.data[i].login].name = memberInfo.data.name;
      githubInfo.numberMembers++;
    }

    //LETS EXTRACT INFO ABOUT EACH REPOSITORY  ----------------------------------------------------------------
    let repositoriesResults;
    try{
      repositoriesResults = HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/repos?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
        console.log("IT WAS NOT POSSIBLE TO ACCESS THE REPOSITORIES");
        console.log("THE ERROR: ", e);
        return;
    }

    for(let i = 0; i < repositoriesResults.data.length; i++){
        let repoName = repositoriesResults.data[i].name;
        githubInfo.allRepos[repoName] = {};
        githubInfo.allRepos[repoName].description = repositoriesResults.data[i].description;
        githubInfo.allRepos[repoName].programLanguage = repositoriesResults.data[i].language;
        githubInfo.allRepos[repoName].sizeKB = repositoriesResults.data[i].size;
        githubInfo.allRepos[repoName].gitUrl = repositoriesResults.data[i].git_url;
        githubInfo.allRepos[repoName].numberWatchers = repositoriesResults.data[i].watchers_count;
        githubInfo.allRepos[repoName].createdAt = new Date(repositoriesResults.data[i].created_at).toUTCString();   //TIMEZONE IS ALREADY THE SAME AS OURS
        githubInfo.allRepos[repoName].lastUpdate = new Date(repositoriesResults.data[i].updated_at).toUTCString();  //TIMEZONE IS ALREADY THE SAME AS OURS

        //EXTRACTING INFO ABOUT DOWNLOADS....
        let downloadsResults;
        try{
          downloadsResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/downloads?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
          console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT DOWNLOADS IN THIS REPOSITORY: " + repoName);
          console.log("THE ERROR: ", e);
          return;
        }
        if(downloadsResults.data.length != 0){
          githubInfo.allRepos[repoName].downloads = downloadsResults.data[0].download_count;
          githubInfo.totalDownloads = githubInfo.totalDownloads + downloadsResults.data[0].download_count || 0;
        }

        //EXTRACTING INFO ABOUT CONTRIBUTORS....
        let contributorsResults;
        try{
          contributorsResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
          console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT CONTRIBUTORS IN THIS REPOSITORY: " + repoName);
          console.log("THE ERROR: ", e);
          return;
        }
        githubInfo.allRepos[repoName].contributors = {};
        for (let j = 0; j < contributorsResults.data.length; j++) {
          githubInfo.allRepos[repoName].numberContributors = githubInfo.allRepos[repoName].numberContributors + 1 || 0;
          githubInfo.allRepos[repoName].contributors[contributorsResults.data[j].login] = {};

          //Extracting the real names of the contributors ....
          let contributorInfo;
          try{
            contributorInfo = HTTP.call('GET', "https://api.github.com/users/" + contributorsResults.data[j].login + "?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          } catch (e) {
            console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT THE FOLOWING CONTRIBUTOR NICKNAME: " + contributorsResults.data[j].login);
            console.log("THE ERROR: ", e);
            return;
          }
          githubInfo.allRepos[repoName].contributors[contributorsResults.data[j].login].name = contributorInfo.data.name;

          //Extracting info about the commits of each contributor ....
          let contributorsNumbers;
          try{
            contributorsNumbers = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/stats/contributors?per_page=50&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
            //Sometimes the API returns an undefined file
            while(typeof contributorsResults.data.length === 'undefined'){
                contributorsNumbers = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/stats/contributors?per_page=50&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
            }
          } catch (e) {
              console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT STATS IN THIS REPOSITORY: " + repoName);
              console.log("THE ERROR: ", e);
              return;
          }
          if(typeof(contributorsNumbers.data[j]) === 'undefined'){
            console.log(repoName + ' ' + contributorsResults.data.length + ' ' + contributorsNumbers.data.length);
          }
          githubInfo.allRepos[repoName].contributors[contributorsNumbers.data[j].author.login] = {};

          githubInfo.allRepos[repoName].contributors[contributorsNumbers.data[j].author.login].numberCommits = githubInfo.allRepos[repoName].contributors[contributorsNumbers.data[j].author.login].numberCommits + contributorsNumbers.data[j].total || 0;
          githubInfo.allRepos[repoName].numberCommits = githubInfo.allRepos[repoName].numberCommits + contributorsNumbers.data[j].total || 0;
          githubInfo.totalCommits += contributorsNumbers.data[j].total;

          if (githubInfo.members.hasOwnProperty(contributorsNumbers.data[j].author.login)){
            githubInfo.members[contributorsNumbers.data[j].author.login].numberCommits = githubInfo.members[contributorsNumbers.data[j].author.login].numberCommits + contributorsNumbers.data[j].total || 0;
            githubInfo.members[contributorsNumbers.data[j].author.login].numberProjects = githubInfo.members[contributorsNumbers.data[j].author.login].numberProjects + 1 || 0;

            if(typeof (githubInfo.members[contributorsNumbers.data[j].author.login].projectsInvolved) === 'undefined'){
              githubInfo.members[contributorsNumbers.data[j].author.login].projectsInvolved = [];
            }
            githubInfo.members[contributorsNumbers.data[j].author.login].projectsInvolved.push(repoName);
          }
        }

        //EXTRACTING INFO ABOUT THE LAST COMMITS....
        let commitsResults;
        try{
          commitsResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/commits?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
            console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT COMMITS IN THIS REPOSITORY: " + repoName);
            console.log("THE ERROR: ", e);
            return;
        }

        let contributorsArray = [];
        for (let f = 0; f < commitsResults.data.length; f++) {
          if (f === 0){
            githubInfo.allRepos[repoName].lastCommit = {};
            githubInfo.allRepos[repoName].lastCommit.name = commitsResults.data[f].commit.committer.name;
            githubInfo.allRepos[repoName].lastCommit.description = commitsResults.data[f].commit.message;
            githubInfo.allRepos[repoName].lastCommit.date = new Date(commitsResults.data[f].commit.committer.date).toUTCString();            //TIMEZONE IS ALREADY THE SAME AS OURS
          }
          if(commitsResults.data[f].committer !== null){
            if(typeof (githubInfo.allRepos[repoName].contributors[commitsResults.data[f].committer.login].lastCommit)  === 'undefined') {
                githubInfo.allRepos[repoName].contributors[commitsResults.data[f].committer.login].lastCommit = {};
                githubInfo.allRepos[repoName].contributors[commitsResults.data[f].committer.login].lastCommit.date = new Date(commitsResults.data[f].commit.committer.date).toUTCString();
                githubInfo.allRepos[repoName].contributors[commitsResults.data[f].committer.login].lastCommit.description = commitsResults.data[f].commit.message;
                githubInfo.allRepos[repoName].contributors[commitsResults.data[f].committer.login].lastCommit.shaCode = commitsResults.data[f].sha;
            }

            let firstTime = contributorsArray.indexOf(commitsResults.data[f].committer.login);
            if (githubInfo.members.hasOwnProperty(commitsResults.data[f].committer.login) && firstTime === -1){
              contributorsArray.push(commitsResults.data[f].committer.login);
              let newDate = new Date(commitsResults.data[f].commit.committer.date).toUTCString();
              if(githubInfo.members[commitsResults.data[f].committer.login].lastCommit.date < newDate ){
                githubInfo.members[commitsResults.data[f].committer.login].lastCommit.date = newDate;
                githubInfo.members[commitsResults.data[f].committer.login].lastCommit.repoName = repoName;
                githubInfo.members[commitsResults.data[f].committer.login].lastCommit.description = commitsResults.data[f].commit.message;
                githubInfo.members[commitsResults.data[f].committer.login].lastCommit.shaCode = commitsResults.data[f].sha;
              }
            }
          }
        }

        //EXTRACTING INFO ABOUT FORKS....
        let forksResults;
        try{
          forksResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/forks?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
            console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT FORKS IN THIS REPOSITORY: " + repoName);
            console.log("THE ERROR: ", e);
            return;
        }
        githubInfo.allRepos[repoName].numberForks = forksResults.data.length;
        githubInfo.totalForks += forksResults.data.length;
        contributorsArray = [];


        for (let h = 0; h < forksResults.data.length; h++) {
          if(h === 0){
            githubInfo.allRepos[repoName].lastForked = {};
            githubInfo.allRepos[repoName].lastForked.date = new Date(forksResults.data[h].created_at).toUTCString();    //TIMEZONE IS ALREADY THE SAME AS OURS;
            githubInfo.allRepos[repoName].lastForked.login = forksResults.data[h].owner.login;
          }
          if(githubInfo.allRepos[repoName].contributors.hasOwnProperty(forksResults.data[h].owner.login) && typeof (githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].lastForked)  === 'undefined') {
              githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].numberForks = githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].numberForks + 1 || 0;
              githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].lastForked = {};
              githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].lastForked.date = new Date(forksResults.data[h].created_at).toUTCString();  //TIMEZONE IS ALREADY THE SAME AS OURS;
          }
          let firstTime = contributorsArray.indexOf(forksResults.data[h].owner.login);
          if (githubInfo.members.hasOwnProperty(forksResults.data[h].owner.login)){
            githubInfo.members[forksResults.data[h].owner.login].numberForks = githubInfo.members[forksResults.data[h].owner.login].numberForks + 1 || 0;
            if (firstTime === -1) {
              contributorsArray.push(forksResults.data[h].owner.login);
              let newDate = new Date(forksResults.data[h].created_at).toUTCString();
              if(githubInfo.members[forksResults.data[h].owner.login].lastForked.date < newDate ){
                githubInfo.members[forksResults.data[h].owner.login].lastForked.date = newDate;
                githubInfo.members[forksResults.data[h].owner.login].lastForked.repoName = repoName;
              }
            }
          }
        }

        //EXTRACTING INFO ABOUT ISSUES....
        let cl = 0, op = 0, f = 1;
        let issuesResults;
        try{
          issuesResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/issues?access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
          console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT ISSUES IN THIS REPOSITORY: " + repoName);
          console.log("THE ERROR: ", e);
          return;
        }
        githubInfo.allRepos[repoName].openedIssues = {};
        githubInfo.allRepos[repoName].closedIssues = {};

        if (typeof issuesResults === 'undefined' || issuesResults.length <= 0) {
          while(true) {
            try{
              issuesResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/issues/" + f + "?access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch (e) {
              console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT THE ISSUE NUMBER:" + f + " IN THIS REPOSITORY: " + repoName);
              console.log("THE ERROR: ", e);
              return;
            }
            let newIssue = new Issue();
            githubInfo.allRepos[i].totalIssues = githubInfo.allRepos[i].totalIssues + 1 || 0;
            if (issuesResults.data.state === "open"){
              op++;
              githubInfo.allRepos[repoName].openedIssues.push(newIssue);
              githubInfo.allRepos[repoName].numberOpenedIssues = githubInfo.allRepos[repoName].numberOpenedIssues + 1 || 0;
              githubInfo.allRepos[repoName].openedIssues.openedby = issuesResults.data.user.login;
              githubInfo.allRepos[repoName].openedIssues.milestone = new Date(issuesResults.data.milestone).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].openedIssues.createdAt = new Date(issuesResults.data.created_at).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].openedIssues.updatedAt = new Date(issuesResults.data.updated_at).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].openedIssues.title = issuesResults.data.title;
              githubInfo.allRepos[repoName].openedIssues.description = issuesResults.data.body;
              githubInfo.allRepos[repoName].openedIssues.numberComments = issuesResults.data.comments;
              for (let v = 0; v < issuesResults.data.assignees.length; v++) {
                if(githubInfo.allRepos[repoName].contributors.hasOwnProperty(issuesResults.data.assignees[v])){
                  if(typeof(githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].openedIssues) === 'undefined'){
                    githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].openedIssues = [];
                  }
                  githubInfo.allRepos[repoName].openedIssues.assignees.push(issuesResults.data.assignees[v]);
                  githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].openedIssues.push(githubInfo.allRepos[repoName].openedIssues[op]);
                  githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].totalIssues = githubInfo.allRepos[repoName].contributors[issuesResults.data.user.login].totalIssues + 1 || 0;
                  githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].numberOpenedIssues = githubInfo.allRepos[repoName].contributors[issuesResults.data.user.login].numberOpenedIssues + 1 || 0;
                }
              }
            } else {
              cl++;
              githubInfo.allRepos[repoName].closedIssues.push(newIssue);
              githubInfo.allRepos[repoName].numberClosedIssues = githubInfo.allRepos[repoName].numberClosedIssues + 1 || 0;
              githubInfo.allRepos[repoName].closedIssues.openedby = issuesResults.data.user.login;
              githubInfo.allRepos[repoName].closedIssues.milestone = new Date(issuesResults.data.milestone).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].closedIssues.createdAt = new Date(issuesResults.data.created_at).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].closedIssues.updatedAt = new Date(issuesResults.data.updated_at).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].closedIssues.title = issuesResults.data.title;
              githubInfo.allRepos[repoName].closedIssues.description = issuesResults.data.body;
              githubInfo.allRepos[repoName].closedIssues.numberComments = issuesResults.data.comments;
              githubInfo.allRepos[repoName].closedIssues.closedAt = new Date(issuesResults.data.closed_at).toUTCString();              //TIMEZONE IS ALREADY THE SAME AS OURS
              githubInfo.allRepos[repoName].closedIssues.closedby = issuesResults.data.closed_by.login;
              for (let v = 0; v < issuesResults.data.assignees.length; v++) {
                if(githubInfo.allRepos[repoName].contributors.hasOwnProperty(issuesResults.data.assignees[v])){
                  if(typeof(githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].closedIssues) === 'undefined'){
                    githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].closedIssues = [];
                  }
                  githubInfo.allRepos[repoName].closedIssues.assignees.push(issuesResults.data.assignees[v]);
                  githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].closedIssues.push(githubInfo.allRepos[repoName].closedIssues[op]);
                  githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].totalIssues = githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].totalIssues + 1 || 0;
                  githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].numberClosedIssues = githubInfo.allRepos[repoName].contributors[issuesResults.data.assignees[v]].numberClosedIssues + 1 || 0;
                }
              }
            }
          f++;
          }
        }

        //EXTRACTING INFO ABOUT PULL REQUESTS....

        //EXTRACTING INFO ABOUT MERGES....

        //EXTRACTING INFO ABOUT BRANCHES....
        }

        

    GitHubCollection.insert(githubInfo);

  },

  //METHOD THAT CALCULATES THE TOTAL VALUES ABOUT JEKNOWLEDGE'S GITHUB ACCOUNT AND THE TOTAL VALUES OF ITS MEMBERS
  //
  calculateTotals : function(){

  }

};
