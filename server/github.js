import { HTTP } from 'meteor/http';
//-----------------------------------------------------------------  STRUCTS  ------------------------------------------------------------------//
//CLASS THAT HOLDS ALL THE INFO ABOUT GITHUB STATS
class GithubBucket {
  constructor() {
    this.allRepos = {};
    this.numberMembers = 0;
    this.members = {};
    this.totalWatchers = 0;
    this.totalSizeKB = 0;
    this.totalCommits = 0;
    this.totalDownloads = 0;
    this.totalForks = 0;
    this.totalIssues = 0;
    this.totalOpenedIssues = 0;
    this.totalClosedIssues = 0;
    this.totalOpenedPulls = 0;
    this.totalMerges = 0;         //count as closed Pulls
    this.totalPulls = 0;

    //TODO:------- not extracted -----------
    this.totalContributors = 0;
    this.contributors = [];
    this.numberFollowers = 0;
    this.followersNames = [];
    this.totalStargazers = 0;
    this.totalComments = 0;
    this.totalInvitations = 0;
    this.totalReleases = 0;
    this.lastInvitation;
    this.lastComment;
    this.lastEvent;
    this.lastRelease;
    this.lastForked;
    this.lastCommit;
    this.lastClosedIssue;
    this.lastOpenedIssues;
    this.lastPullRequest;            //it can be closed or opened
    this.lastOpenedPull;
    this.lastMerge;                 //or last closed pull request
    //SOME EXTRA STATS
    this.commitsPerDay = 0;
    this.commitsPerWeek = 0;
    this.commitsPerYear = 0;
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT AN ISSUE
class Issue {
  constructor() {
    this.openedby = "";
    this.assignees = [];
    this.milestone = null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.title = "";
    this.description = ""
    this.numberComments = 0;
    this.closedAt = null;                                                       //Issues start open by default
    this.closedby = null;                                                       //Issues start open by default
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A PULL REQUEST (OPENED OR CLOSED)
class PullRequest {
  constructor() {
    this.title = "";
    this.login = "";
    this.createdAt = null;
    this.updatedAt = null;
    this.mergedAt = null;
    this.assignees = [];
    this.milestone = null;
    this.body = "";
    this.numberComments = 0;
    this.numberCommits = 0;
    this.numberDelections = 0;
    this.numberInsertions = 0;
    this.mergeConflicts = true;
    this.changed_files = 0;
  }
}

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
      githubInfo.members[membersResults.data[i].login].lastPull = {};
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
        githubInfo.allRepos[repoName].url = repositoriesResults.data[i].html_url;
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
          contributorsResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/stats/contributors?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          //Sometimes the API returns an undefined file
          while(typeof contributorsResults.data.length === 'undefined'){
              contributorsResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/stats/contributors?per_page=50&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          }
        } catch (e) {
          console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT CONTRIBUTORS IN THIS REPOSITORY: " + repoName);
          console.log("THE ERROR: ", e);
          return;
        }
        githubInfo.allRepos[repoName].contributors = {};
        for (let j = 0; j < contributorsResults.data.length; j++) {
          githubInfo.allRepos[repoName].numberContributors = this.incrementing(githubInfo.allRepos[repoName].numberContributors, 1);
          githubInfo.allRepos[repoName].contributors[contributorsResults.data[j].author.login] = {};

          //Extracting the real names of the contributors ....
          let contributorInfo;
          try{
            contributorInfo = HTTP.call('GET', "https://api.github.com/users/" + contributorsResults.data[j].author.login + "?per_page=150&access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          } catch (e) {
            console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT THE FOLOWING CONTRIBUTOR NICKNAME: " + contributorsResults.data[j].author.login);
            console.log("THE ERROR: ", e);
            return;
          }
          githubInfo.allRepos[repoName].contributors[contributorsResults.data[j].author.login].name = contributorInfo.data.name;
          githubInfo.allRepos[repoName].contributors[contributorsResults.data[j].author.login].numberCommits = this.incrementing(githubInfo.allRepos[repoName].contributors[contributorsResults.data[j].author.login].numberCommits, contributorsResults.data[j].total);

          //these are the commits made since jeknowledge forked or created the repositories (the whole repository can have more commits)
          githubInfo.allRepos[repoName].commitsJek = this.incrementing(githubInfo.allRepos[repoName].commitsJek, contributorsResults.data[j].total);

          githubInfo.totalCommits += contributorsResults.data[j].total;

          if (githubInfo.members.hasOwnProperty(contributorsResults.data[j].author.login)){
            githubInfo.members[contributorsResults.data[j].author.login].numberCommits = this.incrementing(githubInfo.members[contributorsResults.data[j].author.login].numberCommits, contributorsResults.data[j].total);
            githubInfo.members[contributorsResults.data[j].author.login].numberProjects = this.incrementing(githubInfo.members[contributorsResults.data[j].author.login].numberProjects, 1);

            if(typeof (githubInfo.members[contributorsResults.data[j].author.login].projectsInvolved) === 'undefined'){
              githubInfo.members[contributorsResults.data[j].author.login].projectsInvolved = [];
            }
            githubInfo.members[contributorsResults.data[j].author.login].projectsInvolved.push(repoName);
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
            //hasOwnProperty in this case is needed because users like 'dmin' and 'web-flow' may appear
            if(githubInfo.allRepos[repoName].contributors.hasOwnProperty(commitsResults.data[f].committer.login) &&  typeof (githubInfo.allRepos[repoName].contributors[commitsResults.data[f].committer.login].lastCommit)  === 'undefined') {
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
            githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].numberForks = this.incrementing(githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].numberForks, 1);
            githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].lastForked = {};
            githubInfo.allRepos[repoName].contributors[forksResults.data[h].owner.login].lastForked.date = new Date(forksResults.data[h].created_at).toUTCString();  //TIMEZONE IS ALREADY THE SAME AS OURS;
          }
          let firstTime = contributorsArray.indexOf(forksResults.data[h].owner.login);
          if (githubInfo.members.hasOwnProperty(forksResults.data[h].owner.login)){
            githubInfo.members[forksResults.data[h].owner.login].numberForks = this.incrementing(githubInfo.members[forksResults.data[h].owner.login].numberForks, 1);
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
        githubInfo.allRepos[repoName].openedIssues = [];
        githubInfo.allRepos[repoName].closedIssues = [];
        githubInfo.allRepos[repoName].openedPulls = [];
        githubInfo.allRepos[repoName].merges = [];

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
            githubInfo.allRepos[i].totalIssues = this.incrementing(githubInfo.allRepos[i].totalIssues, 1);

            if (issuesResults.data.state === "open"){
              op++;
              githubInfo.allRepos[repoName].openedIssues.push(newIssue);
              githubInfo.allRepos[repoName].numberOpenedIssues = this.incrementing(githubInfo.allRepos[repoName].numberOpenedIssues, 1);
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
              githubInfo.allRepos[repoName].numberClosedIssues = this.incrementing(githubInfo.allRepos[repoName].numberClosedIssues, 1);
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
        try{
          pullsResults = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/pulls?access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch (e) {
          console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT PULL REQUESTS IN THIS REPOSITORY: " + repoName);
          console.log("THE ERROR: ", e);
          return;
        }


        for (var l = 0; l < pullsResults.data.length; l++) {
          try{
            pullRequest = HTTP.call('GET', "https://api.github.com/repos/jeknowledge/" + repoName + "/pulls/" + (l+1) + "access_token=" + Meteor.settings.TOKEN_JOEL_GITHUB, {headers: {"User-Agent": "Meteor/1.0"}});
          } catch (e) {
            console.log("IT WAS NOT POSSIBLE TO ACCESS INFORMATION ABOUT PULL REQUESTS IN THIS REPOSITORY: " + repoName);
            console.log("THE ERROR: ", e);
            return;
          }

          githubInfo.totalPulls++;
          this.incrementing(githubInfo.allRepos[repoName].numberPulls, 1);
          let isOpen = false;
          if (pullRequest.data.state === "open"){
            isOpen = true;
          }

          let newPull = new PullRequest();
          newPull.title = pullRequest.data.title;
          newPull.login = pullRequest.data.user.login;
          newPull.createdAt =  new Date(pullRequest.data.created_at).toUTCString();
          newPull.updatedAt =  new Date(pullRequest.data.updated_at).toUTCString();;
          newPull.mergedAt =  new Date(pullRequest.data.merged_at).toUTCString();;
          newPull.assignees = pullRequest.data.assignees;
          newPull.milestone = pullRequest.data.milestone;
          newPull.body = pullRequest.data.body;
          newPull.numberComments = pullRequest.data.comments;
          newPull.numberCommits = pullRequest.data.commits;
          newPull.numberDelections = pullRequest.data.deletions;
          newPull.numberInsertions = pullRequest.data.additions;
          newPull.mergeConflicts = !pullRequest.data.mergeable;
          newPull.changed_files = pullRequest.data.changed_files;

          if (l === 0){
            githubInfo.allRepos[repoName].lastPullRequest = newPull;
          }

          if(githubInfo.allRepos[repoName].contributors.hasOwnProperty(pullRequest.data.user.login)){
            this.incrementing(githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].numberPulls, 1);
            if(typeof (githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].lastPullRequest)  === 'undefined'){
              githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].lastPullRequest = newPull;
            }
            if(isOpen){
              let copy = newPull;
              if(typeof(githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].openedPulls) === 'undefined'){
                githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].openedPulls = [];
              }
              this.incrementing(githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].numberOpenedPulls, 1);
              githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].openedPulls.push(copy);
            } else {
              let copy = newPull;
              if(typeof(githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].merges) === 'undefined'){
                githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].merges = [];
              }
              this.incrementing(githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].numberMerges, 1);
              githubInfo.allRepos[repoName].contributors[pullRequest.data.user.login].merges.push(copy);
            }
          }

          if(githubInfo.members.hasOwnProperty(pullRequest.data.user.login)){
            this.incrementing(githubInfo.members[pullRequest.data.user.login].numberPulls, 1);
            if(typeof (githubInfo.members[pullRequest.data.user.login].lastPullRequest)  === 'undefined'){
              githubInfo.members[pullRequest.data.user.login].lastPullRequest = newPull;
            }
            if(isOpen){
              let copy = newPull;
              if(typeof(githubInfo.members[pullRequest.data.user.login].openedPulls) === 'undefined'){
                githubInfo.members[pullRequest.data.user.login].openedPulls = [];
              }
              this.incrementing(githubInfo.members[pullRequest.data.user.login].numberOpenedPulls, 1);
              githubInfo.members[pullRequest.data.user.login].openedPulls.push(copy);
            } else {
              let copy = newPull;
              if(typeof(githubInfo.members[pullRequest.data.user.login].merges) === 'undefined'){
                githubInfo.members[pullRequest.data.user.login].merges = [];
              }
              this.incrementing(githubInfo.members[pullRequest.data.user.login].numberMerges, 1);
              githubInfo.members[pullRequest.data.user.login].merges.push(copy);
            }
          }

          if (isOpen){
            githubInfo.totalOpenedPulls++;
            githubInfo.allRepos[repoName].openedPulls.push(newPull);
            this.incrementing(githubInfo.allRepos[repoName].numberOpenedPulls, 1);
          } else {
            githubInfo.totalMerges++;
            githubInfo.allRepos[repoName].merges.push(newPull);
            this.incrementing(githubInfo.allRepos[repoName].numberMerges, 1);
          }

        }

        if(repoName === "records-platform"){
          console.log(githubInfo.allRepos[repoName]);
          break;
        }

        //TODO:EXTRACT INFO LEFT
        //TODO: calculate lasts
        //TODO: run final tests to assure that everything is stable and all info is reliable
        //TODO:modularize code to allow different organizations get statistics from their platforms


        }

    GitHubCollection.insert(githubInfo);



  },

  //METHOD THAT CALCULATES THE TOTAL VALUES ABOUT JEKNOWLEDGE'S GITHUB ACCOUNT AND THE TOTAL VALUES OF ITS MEMBERS
  //
  calculateTotals : function(){

  },

  //AUXILIAR METHOD THAT INCREMENTS VARIABLE WHETHER EXISTS OR NOT
  incrementing : function(variable, increment){
    if(typeof(variable) === 'undefined'){
      variable = 0;
    }
    variable = variable + increment;
    return variable;
  }



};


/*EXAMPLE OF AN OBJECT THAT HOLDS ALL THE INFO ABOUT ONE REPOSITORY
    this.name = "";
    this.programLanguage = "";
    this.sizeKB = 0;
    this.description = "";
    this.gitUrl = "";
    this.createdAt = new Date();
    this.numberContributors = 0;
    this.numberCommits = 0;
    this.downloads = 0;
    this.contributors = {};
    this.numberMembers = 0;
    this.membersNames = [];
    this.closedIssues = [];
    this.openedIssues = [];
    this.totalIssues = 0;
    this.numberOpenedIssues = 0;
    this.numberClosedIssues = 0;
    this.numberForks = 0;
    this.lastCommit = {name : "", login : "", link : "", date : new Date(), description : "", comments : []};
    this.lastForked = {date : new Date(), name : ""};
    this.numberPulls = 0;
    this.numberOpenedPulls = 0;
    this.numberMerges = 0;
    this.openedPulls = [];
    this.merges = [];
    this.lastPullRequest;            //it can be closed or opened

    //TODO:------- not extracted -----------
    this.numberWatchers = 0;
    this.watchersNames = [];
    this.numberStargazers = 0;
    this.stargazersNames = [];
    this.numberInvitations = 0;
    this.invitationList = [];
    this.numberComments = 0;
    this.numberReleases = 0;
    this.releases = [];
    this.numberBranches = 0;
    this.branchesList = [];
    this.defaultBranch = "";
    this.lastRelease = new Date();
    this.lastEvent = new Date();
    this.lastInvitation = new Date();
*/

/*EXAMPLE OF AN OBJECT THAT HOLDS ALL THE INFO ABOUT A CONTRIBUTOR AND HIS CONTRIBUTIONS
    this.name = "";
    this.login = "";
    this.link = "";
    this.numberCommits = 0;
    this.lastCommit;
    this.totalIssues = 0;                   //Issues that he/she is envolved with (closed and/or opened and/or was assigned to).
    this.numberOpenedIssues = 0;            //Opened issues that he/she is envolved with (opened and/or was assigned to).
    this.numberClosedIssues = 0;            //Closed issues that he/she was envolved with (closed and/or was assigned to).
    this.openedIssues = [];                 //Opened issues that he/she is envolved with (opened and/or was assigned to). The most recently opened issue will be the first of the array
    this.closedIssues = [];                 //Closed issues that he/she was envolved with (closed and/or was assigned to). The most recently closed issue will be the first of the array
    this.numberForks = 0;
    this.lastForked = new Date();
    this.numberPulls = 0;
    this.numberOpenedPulls = 0;
    this.numberMerges = 0;
    this.openedPulls = [];            //the most recently opened pull will be the first of the array
    this.merges = [];                 //the most recently merged pull will be the first of the array
    this.lastPullRequest;            //it can be closed or opened

    //TODO:------- not extracted -----------
    this.commitsPerWeek = 0;                //Does the contributor work well in each week?!
    this.delectionsAdditionsPerWeek = 0;    //Are the commits significant?
*/

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A JEKNOWLEDGE'S MEMBER AND THEIR CONTRIBUTIONS FOR THE JEK REPOS
    this.name = "";
    this.login = "";
    this.link = "";
    this.numberCommits = 0;
    this.lastCommit = {date : new Date(), description : "", comments : []};
    this.totalIssues = 0;                   //Issues that he/she is envolved with (closed and/or opened and/or was assigned to).
    this.numberOpenedIssues = 0;            //Opened issues that he/she is envolved with (opened and/or was assigned to).
    this.numberClosedIssues = 0;            //Closed issues that he/she was envolved with (closed and/or was assigned to).
    this.openedIssues = [];                 //Opened issues that he/she is envolved with (opened and/or was assigned to).
    this.closedIssues = [];                 //Closed issues that he/she was envolved with (closed and/or was assigned to).
    this.numberForks = 0;
    this.lastForked = new Date();
    this.numberPulls = 0;
    this.numberOpenedPulls = 0;
    this.numberMerges = 0;
    this.openedPulls = [];            //the most recently opened pull will be the first of the array
    this.merges = [];                 //the most recently merged pull will be the first of the array
    this.lastPullRequest;            //it can be closed or opened

    //TODO:------- not extracted -----------
    this.commitsPerWeek = 0;                //Does the contributor work well in each week?!
    this.delectionsAdditionsPerWeek = 0;    //Are the commits significant?
*/
