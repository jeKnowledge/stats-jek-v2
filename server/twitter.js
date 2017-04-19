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
            parameters.owner_screen_name = 'nickfixe';
            parameters.oauth_timestamp = '1486740634';
            parameters.oauth_nonce = '3081383485';
            parameters.oauth_version = '1.0';
            parameters.oauth_signature_method = 'HMAC-SHA1';
            parameters.oauth_token = '822427976688173056-P1HeGRnc4AKZZhsOB8hTDcVjOgTyKXx';
            parameters.oauth_consumer_key = 'DC0sePOBbQ8bYdC8r4Smg';

            oauth_signature = oauthSignature.generate('GET', url , parameters, "gvVd30LM0rBlMxFLfaLP5YAI9CXsWiGF9rOeQwOIPcRIK1wkB", "axF3ErCJ0PsyUzqOFRmI4LRJGgyGFEzWyGgc4wCQZ9d7m", { encodeSignature: true});
            console.log(oauth_signature);
            results = HTTP.call(httpVERB, "https://api.twitter.com/1.1/statuses/user_timeline.json?oauth_consumer_key=DC0sePOBbQ8bYdC8r4Smg&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1486740634&oauth_nonce=3081383485&oauth_version=1.0&oauth_token=822427976688173056-P1HeGRnc4AKZZhsOB8hTDcVjOgTyKXx&oauth_signature=Sbohos30EKbmXKuCxRJsgLmH%2B4c%3D", {headers: {"User-Agent": "Meteor/1.0"}});


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
