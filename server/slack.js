//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT SLACK STATS
class SlackBucket {
    constructor() {
        this.numberMembers = 0;
        this.members = {};
        this.numberChannels = 0;
        this.channels = {};

        this.channelsArchived = {};
        this.numberChannelsArchived = 0;
        this.channelsActive = {};
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

        this.newChannelsPerMonth = {};
        this.amountChannelsPerMonth = 0;
        this.newChannelsPerYear = {};
        this.amountChannelsPerYear = 0;

    }
 }

//CLASS THAT HOLDS ALL THE INFO ABOUT A SLACK CHANNEL
class SlackChannel {
    constructor() {
        this.name = "",
        this.is_active = "",
        this.members = [],
        this.num_members = 0,
        this.topic = "",
        this.purpose = "",
        this.created_at = "",
        this.creator = "",
        this.latest = {};

        //-- TODO: --
        this.messagesPerDay = 0;
        this.messagesPerWeek = 0;
        this.messagesPerMonth = 0;
        this.messagesPerYear = 0;

        this.filesPerDay = 0;
        this.filesPerWeek = 0;
        this.filesPerMonth = 0;
        this.filesPerYear = 0;

        this.growthTotalMessagesPerDay = 0.0;
        this.growthTotalMessagesPerWeek = 0.0;
        this.growthTotalMessagesPerMonth = 0.0;
        this.growthTotalMessagesPerYear = 0.0;
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

            newChannel = new SlackChannel();

            channelID = channelsResults.channels[i].id;
            newChannel.name = channelsResults.channels[i].name;
            newChannel.members = channelsResults.channels[i].members;
            newChannel.is_archived = channelsResults.channels[i].is_archived;
            newChannel.num_members = channelsResults.channels[i].num_members;
            newChannel.purpose = channelsResults.channels[i].purpose.value;
            newChannel.topic = channelsResults.channels[i].topic.value;
            newChannel.created = channelsResults.channels[i].created;
            try{
            results = HTTP.call('GET', "https://slack.com/api/channels.info?count=500&channel=" + channelID + "&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
            }
            let channelResult = JSON.parse(results.content);
            let creatorID = channelResult.channel.creator;

            newChannel.creator = creatorID;
            //calculating channels that members created
            if (slackInfo.members.hasOwnProperty(creatorID)){
                slackInfo.members[creatorID].channelsCreated.push(channelID);
            }

            newChannel.latest = {};
            if(typeof(channelResult.channel.latest) !== 'undefined') {
                newChannel.latest.type = channelResult.channel.latest.type;
                newChannel.latest.user = channelResult.channel.latest.user;
                newChannel.latest.text = channelResult.channel.latest.text;
                newChannel.latest.ts = channelResult.channel.latest.ts;
            }

            slackInfo.channels[channelID] = newChannel;
            if(newChannel.is_archived){
                slackInfo.numberChannelsArchived++;
                slackInfo.channelsArchived[channelID] = newChannel;
            } else {
                slackInfo.numberChannelsActive++;
                slackInfo.channelsActive[channelID] = newChannel;
                //calculating channels that members are involved in
                for (var l = 0; l < slackInfo.channelsActive[channelID].members.length; l++) {
                    let memberID = slackInfo.channelsActive[channelID].members[l];
                    if (slackInfo.members.hasOwnProperty(memberID)){
                        slackInfo.members[memberID].channelsParticipates.push(channelID);
                    }
                }
            }
            return;
        }
        //LETS ANALYZE CHANNELS HISTORY ----------------------------------------------------------------------

        let yearInSeconds = 60*60*24*365;
        let monthInSeconds = 60*60*24*30;
        let weekInSeconds = 60*60*24*7;
        let dayInSeconds = 60*60*24;
        let currentTimeStamp = new Date().getTime()/1000;
        for (var i = 0; i < array.length; i++) {
            array[i]
        }
        try{
        results = HTTP.call('GET', "https://slack.com/api/channels.history?latest=" + currentTimeStamp + "&oldest=" + (currentTimeStamp - dayInSeconds) + "&channel=" + channelID + "&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
        }
        historyResults = JSON.parse(results.content);

        if(historyResults.messages.length){
            //Calculating number of messages per day in each channel






            //console.log(historyResults.messages[0].ts);

            // SLACK TIMESTAMP TO DATE: multiplied by 1000 so that the argument is in milliseconds, not seconds.
            //let date = new Date(historyResults.messages[0].ts.substring(0, historyResults.messages[0].ts.indexOf('.'))*1000);

            /* Hours
            //let hours = date.getHours();

            // Minutes
            let minutes = "0" + date.getMinutes();

            // Seconds
            let seconds = "0" + date.getSeconds();
            */

            //DATE TO TIMESTAMP
            //new Date().getTime()/1000;



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

                growthTotalMessagesPerDay = 0.0;
                growthTotalMessagesPerWeek = 0.0;
                growthTotalMessagesPerMonth = 0.0;
                growthTotalMessagesPerYear = 0.0;
            };
*/
