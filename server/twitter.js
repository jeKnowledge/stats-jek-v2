const oauthSignature = require('oauth-signature');
const crypto = require('crypto');
//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT Twitter STATS
class TwitterBucket {
    constructor() {


    }
}

Twitter = {
    callStats : function(){

        let results;
        let oauth_nonce = "";
        let oauth_signature = "";
        let httpVERB = 'GET';
        let url = "";
        let consumerSecret = Meteor.settings.TWITTER_CONSUMER_SECRET_JOEL;
        let tokenSecret = Meteor.settings.TWITTER_TOKEN_SECRET_JOEL;
        let parameters = {};

        //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
        let TwitterInfo = new TwitterBucket();

        //LETS EXTRACT THE BASIC INFO
        try{
            url = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

            parameters.oauth_timestamp = '1486740634';
            parameters.oauth_nonce = '3081383485';
            parameters.oauth_version = '1.0';
            parameters.oauth_signature_method = 'HMAC-SHA1';
            parameters.oauth_token = '';
            parameters.oauth_consumer_key = '';

            oauth_signature = oauthSignature.generate('GET', url , parameters, "", "", { encodeSignature: true});
            console.log(oauth_signature);
            results = HTTP.call(httpVERB, "https://api.twitter.com/1.1/statuses/user_timeline.json?oauth_consumer_key", {headers: {"User-Agent": "Meteor/1.0"}});


        } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR JEKNOWLEDGE TWITTER PAGE BASIC INFO: ", e);
        }
        basicResults = JSON.parse(results.content);
        console.log(basicResults);
        return;

    },

    // UNIX TIMESTAMP TO DATE
    timestampToDate : function(timestamp){
        return (new Date(timestamp*1000));
    },

    // DATE TO UNIX TIMESTAMP
    dateToTimestamp : function(date){
        return date.getTime()/1000;
    },

    generateNonce : function(){
        var nonceLen = 32;
        return crypto.randomBytes(Math.ceil(nonceLen * 3 / 4))
            .toString('base64')   // convert to base64 format
            .slice(0, nonceLen)        // return required number of characters
            .replace(/\+/g, '0')  // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
    }
};

//TODO: EVERYTHING NEEDS TO BE MODULAR, INCLUDING THE USER AGENT TAG "Meteor/1.0" AND VERSIONS OF THE API ("1.1")
