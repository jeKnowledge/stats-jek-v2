//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT SLACK STATS
class SlackBucket {
    constructor() {
        this.numberMembers = 0;
        this.members = {};
        this.numberChannels = 0;
        this.channels = {};
    }
 }





//-----------------------------------------------------   METHODS  ------------------------------------------------------------------//
Slack = {

    callStats : function(){
        //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
        let slackInfo = new SlackBucket();

        //LETS EXTRACT INFO ABOUT MEMBERS ----------------------------------------------------------------------
        let results;
        try{
        results = HTTP.call('GET', "https://slack.com/api/users.list?token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
        }
        let membersResults = JSON.parse(results.content);
        let userID;
        for (var i = 0; i < membersResults.members.length; i++) {
            slackInfo.numberMembers++;
            userID = membersResults.members[i].id;
            slackInfo.members[userID] = {};
            slackInfo.members[userID].username =  membersResults.members[i].name;
            slackInfo.members[userID].name =  membersResults.members[i].profile.real_name_normalized;
        }

        //LETS EXTRACT INFO ABOUT CHANNELS ----------------------------------------------------------------------
        try{
        results = HTTP.call('GET', "https://slack.com/api/channels.list?token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
        }
        let channelsResults = JSON.parse(results.content);
        let channelID;
        for (var i = 0; i < channelsResults.channels.length; i++) {
            slackInfo.numberChannels++;
            channelID = channelsResults.channels[i].id;
            slackInfo.channels[channelID] = {};
            slackInfo.channels[channelID].name = channelsResults.channels[i].name;
            slackInfo.channels[channelID].members = channelsResults.channels[i].members;
            slackInfo.channels[channelID].is_archived = channelsResults.channels[i].is_archived;
            slackInfo.channels[channelID].num_members = channelsResults.channels[i].num_members;
            slackInfo.channels[channelID].purpose = channelsResults.channels[i].purpose.value;
            slackInfo.channels[channelID].topic = channelsResults.channels[i].topic.value;
            slackInfo.channels[channelID].created_at = channelsResults.channels[i].created_at; //TODO: Parse data
        }
        console.log(slackInfo.channels);
        SlackCollection.insert(slackInfo);

    },

    updateDatabase : function(){
      db.slack.remove({});
    }

};

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A JEKNOWLEDGE'S MEMBERS
    this.id = {username = "", name = ""};
*/

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A JEKNOWLEDGE'S MEMBERS
    this.id = {name = "", is_active = "", members = [], num_members = 0, topic = "", purpose = "", created_at = timestamp};
*/
