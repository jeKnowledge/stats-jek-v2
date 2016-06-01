import { HTTP } from 'meteor/http';
Github = {

  getRepoList : function(){
      var namesRepos = [];

      HTTP.call('GET', "https://api.github.com/orgs/jeknowledge/repos", {headers: {"User-Agent": "Meteor/1.0"}}, function(error,results){

      for(var i = 0; i < results.data.length; i++){
        namesRepos.push(results.data[i].name);
        console.log(results.data[i].name);
      }
      GitHubCollection.insert({listaRepositorios : namesRepos});
      });
  }



};
