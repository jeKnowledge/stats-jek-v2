//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT SLACK STATS
class SlackBucket {
    constructor() {
        this.timestamp = new Date().getTime()/1000;

        this.numberMembers = 0;
        this.members = {};
        this.numberChannels = 0;
        this.channels = {};

        this.channelsArchived = {};
        this.numberChannelsArchived = 0;
        this.channelsActive = {};
        this.numberChannelsActive = 0;

        this.totalMessagesPerDay = 0;
        this.totalMessagesPerWeek = 0;
        this.totalMessagesPerMonth = 0;
        this.totalMessagesPerYear = 0;
        this.totalMessages = 0;

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

        this.messagesPerDay = 0;
        this.messagesPerWeek = 0;
        this.messagesPerMonth = 0;
        this.messagesPerYear = 0;
        this.totalMessages = 0;

        //-- TODO: --
        this.filesPerDay = 0;
        this.filesPerWeek = 0;
        this.filesPerMonth = 0;
        this.filesPerYear = 0;
        this.totalFiles = 0;

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
        //"-1" because of the slackbot
        for (var i = 0; i < membersResults.members.length-1; i++) {
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

            //calculating messages frequency of each channel
            let messagesFrequency = this.messagesChannelFrequency(channelID);
            newChannel.messagesPerDay = messagesFrequency.messagesPerDay;
            newChannel.messagesPerWeek = messagesFrequency.messagesPerWeek;
            newChannel.messagesPerMonth = messagesFrequency.messagesPerMonth;
            newChannel.messagesPerYear = messagesFrequency.messagesPerYear;
            newChannel.totalMessages = messagesFrequency.totalMessages;

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
            slackInfo.channels[channelID] = newChannel;
        }

        //calculating totals of messages frequency
        let messagesTotal = this.messagesTotalFrequency(slackInfo);
        slackInfo.totalMessagesPerDay += messagesTotal.totalMessagesPerDay;
        slackInfo.totalMessagesPerMonth += messagesTotal.totalMessagesPerMonth;
        slackInfo.totalMessagesPerYear += messagesTotal.totalMessagesPerYear;
        slackInfo.totalMessagesPerWeek += messagesTotal.totalMessagesPerWeek;
        slackInfo.totalMessages += messagesTotal.totalMessages;

        SlackCollection.insert(slackInfo);

    },

    messagesChannelFrequency : function(channelID){
        let yearInSeconds = 60*60*24*365;
        let monthInSeconds = 60*60*24*30;
        let weekInSeconds = 60*60*24*7;
        let dayInSeconds = 60*60*24;
        let messagesFrequency = {};

        messagesFrequency.messagesPerDay = 0;
        messagesFrequency.messagesPerWeek = 0;
        messagesFrequency.messagesPerMonth = 0;
        messagesFrequency.messagesPerYear = 0;
        messagesFrequency.totalMessages = 0;

        let latestTimestamp = new Date().getTime()/1000;

        do {
            try{
                results = HTTP.call('GET', "https://slack.com/api/channels.history?latest=" + latestTimestamp  + "&channel=" + channelID + "&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
                console.log("AN ERROR OCURRED WHILE CALLING FOR SLACK API: ", e);
            }
            historyResults = JSON.parse(results.content);
            let currentTimestamp = new Date().getTime()/1000;
            if (historyResults.messages.length >= 1) {
                let m;
                for (m = 0; m < historyResults.messages.length; m++) {
                    //lets exclude warnings like "albert joined channel xpto" or "lisa left channel xyz"
                    if(typeof(historyResults.messages[m].subtype) === 'undefined' || historyResults.messages[m].subtype === 'file_share' ){
                        messagesFrequency.totalMessages++;
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - dayInSeconds) ){
                            messagesFrequency.messagesPerDay++;
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - weekInSeconds) ){
                            messagesFrequency.messagesPerWeek++;
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - monthInSeconds) ){
                            messagesFrequency.messagesPerMonth++;
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - yearInSeconds) ){
                            messagesFrequency.messagesPerYear++;
                        }
                    }
                }
                latestTimestamp = historyResults.messages[m-1].ts;
            }
        } while(historyResults.has_more);

        return messagesFrequency;
    },

    messagesTotalFrequency : function (slackInfo){
        let myBucket = {};
        myBucket.totalMessagesPerDay = 0;
        myBucket.totalMessagesPerWeek = 0;
        myBucket.totalMessagesPerMonth = 0;
        myBucket.totalMessagesPerYear = 0;
        myBucket.totalMessages = 0;

        for (var key in slackInfo.channels) {
          if (slackInfo.channels.hasOwnProperty(key)) {
            myBucket.totalMessagesPerDay += slackInfo.channels[key].messagesPerDay;
            myBucket.totalMessagesPerWeek += slackInfo.channels[key].messagesPerWeek;
            myBucket.totalMessagesPerMonth += slackInfo.channels[key].messagesPerMonth;
            myBucket.totalMessagesPerYear += slackInfo.channels[key].messagesPerYear;
            myBucket.totalMessages += slackInfo.channels[key].totalMessages;
          }
        }
        return myBucket;
    },

    // SLACK TIMESTAMP TO UNIX TIMESTAMP
    parseSlackTimestamp : function (slackTimestamp){
        return slackTimestamp.substring(0, slackTimestamp.indexOf('.'));
        /* Hours
        //let hours = date.getHours();

        // Minutes
        let minutes = "0" + date.getMinutes();

        // Seconds
        let seconds = "0" + date.getSeconds();
        */
    },

    // UNIX TIMESTAMP TO DATE
    timestampToDate : function(timestamp){
        return (new Date(timestamp*1000));
    },

    // DATE TO UNIX TIMESTAMP
    dateToTimestamp : function(date){
        return date.getTime()/1000;
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
//TODO: Be carefull when slack resets slack history
