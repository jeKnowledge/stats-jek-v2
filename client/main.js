import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.body.helpers({

	 facebook : function(){
	 	return FbookCollection.find();
	 },
	 slack : function(){
	 	return SlackCollection.find();
	 },

	 twitter : function(){
	 	return TwitterCollection.find();
	 },

	 github : function(){
	 	return GitHubCollection.find();
	 },

	 jekPage : function(){
	 	return JekPageCollection.find();
	 }	
});
