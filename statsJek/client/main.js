import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.helpers({

  github : function(){
   return GitHubCollection.find();
  },
/*
	 facebook : function(){
	 	return FbookCollection.find();
	 },

	 slack : function(){
	 	return SlackCollection.find();
	 },

	 twitter : function(){
	 	return TwitterCollection.find();
	 },

	 jekPage : function(){
	 	return JekPageCollection.find();
  },

   vimeo : function(){
    return VimeoCollection.find();
  },

   flickr : function(){
    return FlickrCollection.find();
  },

   linkedin : function(){
    return LinkedinCollection.find();
  }*/

});
