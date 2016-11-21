//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT SLACK STATS
class SlackBucket {
    constructor() {
        this.numberMembers = 0;
        this.members = {};
        this.numberChannels = 0;
        this.channels = {};

        this.channelsArchived = 0;
        this.numberChannelsArchived = 0;
        this.channelsActive = 0;
        this.numberChannelsActive = 0;

        //-- TODO: --
        this.rankingMostActiveUsersDay = [];
        this.rankingMostActiveUsersWeek = [];
        this.rankingMostActiveUsersMonth = [];
        this.rankingMostActiveUsersYear = [];
        this.rankingMostActiveUsers = [];

        this.rankingMostActiveChannelsDay = [];
        this.rankingMostActiveChannelsWeek = [];
        this.rankingMostActiveChannelsMonth = [];
        this.rankingMostActiveChannelsYear = [];
        this.rankingMostActiveChannels = [];


        this.rankingCreatedMoreChannels = {};
        this.rankingMemberOfMoreChannels = {};
        this.rankingSentMoreMessagesPerDay = {};
        this.rankingSentMoreMessagesPerWeek = {};
        this.rankingSentMoreMessagesPerMonth = {};

        this.totalMessagesPerDay = 0;
        this.totalMessagesPerWeek = 0;
        this.totalMessagesPerMonth = 0;
        this.totalMessagesPerYear = 0;
        this.totalMessages = 0;

        this.growthTotalMessagesPerDay = 0.0;
        this.growthTotalMessagesPerWeek = 0.0;
        this.growthTotalMessagesPerMonth = 0.0;
        this.growthTotalMessagesPerYear = 0.0;

        this.totalFilesPerDay = 0;
        this.totalFilesPerWeek = 0;
        this.totalFilesPerMonth = 0;
        this.totalFilesPerYear = 0;
        this.totalFiles = 0;

        this.newChannelsPerMonth = {};
        this.amountChannelsPerMonth = 0;
        this.newChannelsPerYear = {};
        this.amountChannelsPerYear = 0;

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
        results = HTTP.call('GET', "https://slack.com/api/users.list?count=500&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
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
            slackInfo.members[userID].channelsParticipates = [];
            slackInfo.members[userID].channelsCreated = [];
        }

        //LETS EXTRACT INFO ABOUT CHANNELS ----------------------------------------------------------------------
        try{
        results = HTTP.call('GET', "https://slack.com/api/channels.list?count=500&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
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

            for (var l = 0; l < slackInfo.channels[channelID].members.length; l++) {
                let memberID = slackInfo.channels[channelID].members[l];
                if (slackInfo.members.hasOwnProperty(memberID)){
                    slackInfo.members[memberID].channelsParticipates.push(channelID);
                }
            }

            slackInfo.channels[channelID].is_archived = channelsResults.channels[i].is_archived;
            slackInfo.channels[channelID].num_members = channelsResults.channels[i].num_members;
            slackInfo.channels[channelID].purpose = channelsResults.channels[i].purpose.value;
            slackInfo.channels[channelID].topic = channelsResults.channels[i].topic.value;
            slackInfo.channels[channelID].created_at = channelsResults.channels[i].created_at;

            try{
            results = HTTP.call('GET', "https://slack.com/api/channels.info?count=500&channel=" + channelID + "&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
            }
            let channelResult = JSON.parse(results.content);
            slackInfo.channels[channelID].creator = channelResult.channel.creator;
            let creatorID = channelResult.channel.creator;
            if (slackInfo.members.hasOwnProperty(creatorID)){
                slackInfo.members[creatorID].channelsCreated.push(channelID);
            }

            slackInfo.channels[channelID].latest = {};
            slackInfo.channels[channelID].latest = channelResult.channel.latest;

            //LETS ANALYZE CHANNELS HISTORY ----------------------------------------------------------------------
            try{
            results = HTTP.call('GET', "https://slack.com/api/channels.history?channel=" + channelID + "&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
            }
            historyResults = JSON.parse(results.content);
            if(historyResults.messages.length){

                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                let date = new Date(historyResults.messages[0].ts.substring(0, historyResults.messages[0].ts.indexOf('.'))*1000);

                /* Hours
                //let hours = date.getHours();

                // Minutes
                let minutes = "0" + date.getMinutes();

                // Seconds
                let seconds = "0" + date.getSeconds();
                */


            }




            if(channelsResults.channels[i].is_archived){
                slackInfo.numberChannelsArchived++;
                slackInfo.channelsArchived[channelID] = slackInfo.channels[channelID];
            } else {
                slackInfo.numberChannelsActive++;
                slackInfo.channelsActive[channelID] = slackInfo.channels[channelID];
            }
        }


        SlackCollection.insert(slackInfo);

    },

    updateDatabase : function(){
      db.slack.remove({});
    }

};

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A SLACK USER
    this.id = { username = "",
                name = "",
                channelsCreated = channelID;
                channelsParticipates = [];

                //-- TODO: ---
                messagesPerDay = 0;
                messagesPerWeek = 0;
                messagesPerMonth = 0;
                messagesPerYear = 0;

                filesPerDay = 0;
                filesPerWeek = 0;
                filesPerMonth = 0;
                filesPerYear = 0;

                growthTotalMessagesPerDay = 0.0;
                growthTotalMessagesPerWeek = 0.0;
                growthTotalMessagesPerMonth = 0.0;
                growthTotalMessagesPerYear = 0.0;
            };
*/

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A SLACK CHANNEL
    this.id = { name = "",
                is_active = "",
                members = [],
                num_members = 0,
                topic = "",
                purpose = "",
                created_at = timestamp,
                creator = "",
                latest = {type = "", user = "", text = "", ts = 0}

                -- TODO: --
                messagesPerDay = 0;
                messagesPerWeek = 0;
                messagesPerMonth = 0;
                messagesPerYear = 0;

                filesPerDay = 0;
                filesPerWeek = 0;
                filesPerMonth = 0;
                filesPerYear = 0;

                growthTotalMessagesPerDay = 0.0;
                growthTotalMessagesPerWeek = 0.0;
                growthTotalMessagesPerMonth = 0.0;
                growthTotalMessagesPerYear = 0.0;
    };
*/

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A SLACK FILE
    this.id = {

    }

*/
