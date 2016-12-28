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
        this.totalMessagesPerThreeMonths = 0;
        this.totalMessagesPerSixMonths = 0;
        this.totalMessagesPerNineMonths = 0;
        this.totalMessagesPerYear = 0;
        this.totalMessages = 0;

        this.totalFilesPerDay = 0;
        this.totalFilesPerWeek = 0;
        this.totalFilesPerMonth = 0;
        this.totalFilesPerThreeMonths = 0;
        this.totalFilesPerSixMonths = 0;
        this.totalFilesPerNineMonths = 0;
        this.totalFilesPerYear = 0;
        this.totalFiles = 0;

        this.rankingMostActiveChannelsDay = [];
        this.rankingMostActiveChannelsWeek = [];
        this.rankingMostActiveChannelsMonth = [];
        this.rankingMostActiveChannelsPerThreeMonths = [];
        this.rankingMostActiveChannelsPerSixMonths = [];
        this.rankingMostActiveChannelsPerNineMonths = [];
        this.rankingMostActiveChannelsYear = [];
        this.rankingMostActiveChannels = [];

        this.rankingMostActiveUsersPerDay = [];
        this.rankingMostActiveUsersPerWeek = [];
        this.rankingMostActiveUsersPerMonths = [];
        this.rankingMostActiveUsersPerThreeMonths = [];
        this.rankingMostActiveUsersPerSixMonths = [];
        this.rankingMostActiveUsersPerNineMonths = [];
        this.rankingMostActiveUsersPerYear = [];
        this.rankingMostActiveUsers = [];

        this.rankingMemberOfMoreChannels = [];

        //TODO: ---------------------------
        this.growthTotalMessagesPerDay = 0.0;
        this.growthTotalMessagesPerWeek = 0.0;
        this.growthTotalMessagesPerMonth = 0.0;
        this.growthTotalMessagesPerYear = 0.0;

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
        this.messagesPerThreeMonths = 0;
        this.messagesPerSixMonths = 0;
        this.messagesPerNineMonths = 0;
        this.messagesPerYear = 0;
        this.messages = 0;

        this.filesPerDay = 0;
        this.filesPerWeek = 0;
        this.filesPerMonth = 0;
        this.filesPerThreeMonths = 0;
        this.filesPerSixMonths = 0;
        this.filesPerNineMonths = 0;
        this.filesPerYear = 0;
        this.files = 0;

        //TODO:-----
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
        console.log("AN ERROR OCURRED WHILE CALLING FOR THE USERS LIST: ", e);
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
            slackInfo.members[userID].totalMessagesPerDay = 0;
            slackInfo.members[userID].totalMessagesPerWeek = 0;
            slackInfo.members[userID].totalMessagesPerMonth = 0;
            slackInfo.members[userID].totalMessagesPerThreeMonths = 0;
            slackInfo.members[userID].totalMessagesPerSixMonths = 0;
            slackInfo.members[userID].totalMessagesPerNineMonths = 0;
            slackInfo.members[userID].totalMessagesPerYear = 0;
            slackInfo.members[userID].totalMessages = 0;
        }

        //LETS EXTRACT INFO ABOUT CHANNELS ----------------------------------------------------------------------
        try{
        results = HTTP.call('GET', "https://slack.com/api/channels.list?count=500&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR THE CHANNELS LIST: ", e);
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
            console.log("AN ERROR OCURRED WHILE CALLING FOR INFO OF THE CHANNELID "+ channelID + ": ", e);
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

            //calculating messages and files stats of each channel & each user
            let newBucket = this.statsChannel(channelID, slackInfo);
            let statsChannel = newBucket.statsChannel;
            slackInfo = newBucket.slackInfo;

            newChannel.messagesPerDay = statsChannel.messagesPerDay;
            newChannel.messagesPerWeek = statsChannel.messagesPerWeek;
            newChannel.messagesPerMonth = statsChannel.messagesPerMonth;
            newChannel.messagesPerThreeMonths = statsChannel.messagesPerThreeMonths;
            newChannel.messagesPerSixMonths = statsChannel.messagesPerSixMonths;
            newChannel.messagesPerNineMonths = statsChannel.messagesPerNineMonths;
            newChannel.messagesPerYear = statsChannel.messagesPerYear;
            newChannel.totalMessages = statsChannel.totalMessages;

            newChannel.filesPerDay = statsChannel.filesPerDay;
            newChannel.filesPerWeek = statsChannel.filesPerWeek;
            newChannel.filesPerMonth = statsChannel.filesPerMonth;
            newChannel.filesPerThreeMonths = statsChannel.filesPerThreeMonths;
            newChannel.filesPerSixMonths = statsChannel.filesPerSixMonths;
            newChannel.filesPerNineMonths = statsChannel.filesPerNineMonths;
            newChannel.filesPerYear = statsChannel.filesPerYear;
            newChannel.totalFiles = statsChannel.totalMessages;

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

        //calculating totals of messages frequency & uploaded files
        slackInfo = this.totalFrequency(slackInfo);

        //Calculating Most Active channels
        slackInfo = this.rankingChannels(slackInfo);

        //Calculating Most Active Users
        slackInfo = this.rankingUsers(slackInfo);

        console.log(slackInfo.rankingMemberOfMoreChannels);

        SlackCollection.insert(slackInfo);

    },

    statsChannel : function(channelID, slackInfo){
        let yearInSeconds = 60*60*24*365;
        let monthInSeconds = 60*60*24*30;
        let weekInSeconds = 60*60*24*7;
        let threeMonthsInSeconds = monthInSeconds*3;
        let sixMonthsInSeconds = monthInSeconds*6;
        let nineMonthsInSeconds = monthInSeconds*9;
        let dayInSeconds = 60*60*24;
        let statsChannel = {};

        let newBucket = {};
        newBucket.statsChannel = {};

        statsChannel.messagesPerDay = 0;
        statsChannel.messagesPerWeek = 0;
        statsChannel.messagesPerMonth = 0;
        statsChannel.messagesPerThreeMonths = 0;
        statsChannel.messagesPerSixMonths = 0;
        statsChannel.messagesPerNineMonths = 0;
        statsChannel.messagesPerYear = 0;
        statsChannel.totalMessages = 0;

        statsChannel.filesPerDay = 0;
        statsChannel.filesPerWeek = 0;
        statsChannel.filesPerMonth = 0;
        statsChannel.filesPerThreeMonths = 0;
        statsChannel.filesPerSixMonths = 0;
        statsChannel.filesPerNineMonths = 0;
        statsChannel.filesPerYear = 0;
        statsChannel.totalFiles = 0;

        let latestTimestamp = new Date().getTime()/1000;

        do {
            try{
                results = HTTP.call('GET', "https://slack.com/api/channels.history?latest=" + latestTimestamp  + "&channel=" + channelID + "&token=" + Meteor.settings.TOKEN_SLACK, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
                console.log("AN ERROR OCURRED WHILE CALLING FOR THE HISTORY OF THE CHANNELID "+ channelID +": ", e);
            }
            historyResults = JSON.parse(results.content);
            let currentTimestamp = new Date().getTime()/1000;

            if (historyResults.messages.length >= 1) {
                let m;
                for (m = 0; m < historyResults.messages.length; m++) {
                    //lets exclude warnings like "albert joined channel xpto" or "lisa left channel xyz"
                    if(typeof(historyResults.messages[m].subtype) === 'undefined' || historyResults.messages[m].subtype === 'file_share' ){
                        if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                            slackInfo.members[historyResults.messages[m].user].totalMessages++;
                        }
                        statsChannel.totalMessages++;
                        if(historyResults.messages[m].subtype === 'file_share'){
                            statsChannel.totalFiles++;
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - dayInSeconds) ){
                            statsChannel.messagesPerDay++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerDay++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerDay++;
                            }
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - weekInSeconds) ){
                            statsChannel.messagesPerWeek++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerWeek++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerWeek++;
                            }
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - monthInSeconds) ){
                            statsChannel.messagesPerMonth++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerMonth++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerMonth++;
                            }
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - threeMonthsInSeconds) ){
                            statsChannel.messagesPerThreeMonths++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerThreeMonths++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerThreeMonths++;
                            }
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - sixMonthsInSeconds) ){
                            statsChannel.messagesPerSixMonths++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerSixMonths++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerSixMonths++;
                            }
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - nineMonthsInSeconds) ){
                            statsChannel.messagesPerNineMonths++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerNineMonths++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerNineMonths++;
                            }
                        }
                        if(this.parseSlackTimestamp(historyResults.messages[m].ts) >= (currentTimestamp - yearInSeconds) ){
                            statsChannel.messagesPerYear++;
                            if(slackInfo.members.hasOwnProperty(historyResults.messages[m].user)){
                                slackInfo.members[historyResults.messages[m].user].totalMessagesPerYear++;
                            }
                            if(historyResults.messages[m].subtype === 'file_share'){
                                statsChannel.filesPerYear++;
                            }
                        }
                    }
                }
                latestTimestamp = historyResults.messages[m-1].ts;
            }
        } while(historyResults.has_more);

        newBucket.slackInfo = slackInfo;
        return newBucket;
    },

    totalFrequency : function (slackInfo){
        let myBucket = {};
        slackInfo.totalMessagesPerDay = 0;
        slackInfo.totalMessagesPerWeek = 0;
        slackInfo.totalMessagesPerMonth = 0;
        slackInfo.totalMessagesPerThreeMonths = 0;
        slackInfo.totalMessagesPerSixMonths = 0;
        slackInfo.totalMessagesPerNineMonths = 0;
        slackInfo.totalMessagesPerYear = 0;
        slackInfo.totalMessages = 0;

        slackInfo.totalFilesPerDay = 0;
        slackInfo.totalFilesPerWeek = 0;
        slackInfo.totalFilesPerMonth = 0;
        slackInfo.totalFilesPerThreeMonths = 0;
        slackInfo.totalFilesPerSixMonths = 0;
        slackInfo.totalFilesPerNineMonths = 0;
        slackInfo.totalFilesPerYear = 0;
        slackInfo.totalFiles = 0;

        for (var key in slackInfo.channels) {
          if (slackInfo.channels.hasOwnProperty(key)) {
            slackInfo.totalMessagesPerDay += slackInfo.channels[key].messagesPerDay;
            slackInfo.totalMessagesPerWeek += slackInfo.channels[key].messagesPerWeek;
            slackInfo.totalMessagesPerMonth += slackInfo.channels[key].messagesPerMonth;
            slackInfo.totalMessagesPerThreeMonths += slackInfo.channels[key].messagesPerThreeMonths;
            slackInfo.totalMessagesPerSixMonths += slackInfo.channels[key].messagesPerSixMonths;
            slackInfo.totalMessagesPerNineMonths += slackInfo.channels[key].messagesPerNineMonths;
            slackInfo.totalMessagesPerYear += slackInfo.channels[key].messagesPerYear;
            slackInfo.totalMessages += slackInfo.channels[key].totalMessages;

            slackInfo.totalFilesPerDay += slackInfo.channels[key].filesPerDay;
            slackInfo.totalFilesPerWeek += slackInfo.channels[key].filesPerWeek;
            slackInfo.totalFilesPerMonth += slackInfo.channels[key].filesPerMonth;
            slackInfo.totalFilesPerThreeMonths += slackInfo.channels[key].filesPerThreeMonths;
            slackInfo.totalFilesPerSixMonths += slackInfo.channels[key].filesPerSixMonths;
            slackInfo.totalFilesPerNineMonths += slackInfo.channels[key].filesPerNineMonths;
            slackInfo.totalFilesPerYear += slackInfo.channels[key].filesPerYear;
            slackInfo.totalFiles += slackInfo.channels[key].totalFiles;
          }
        }
        return slackInfo;
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


    statsUser : function(){

    },
    rankingUsers : function (slackInfo){
        let rankingMostActiveUsersPerDay = [];
        let rankingMostActiveUsersPerWeek = [];
        let rankingMostActiveUsersPerMonth = [];
        let rankingMostActiveUsersPerThreeMonths = [];
        let rankingMostActiveUsersPerSixMonths = [];
        let rankingMostActiveUsersPerNineMonths = [];
        let rankingMostActiveUsersPerYear = [];
        let rankingMostActiveUsers = [];
        let rankingMemberOfMoreChannels = [];

        for (var key in slackInfo.members) {
            if (slackInfo.members.hasOwnProperty(key)) {
                rankingMemberOfMoreChannels.push({
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].channelsParticipates.length
                });
                rankingMostActiveUsersPerDay.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerDay,
                });
                rankingMostActiveUsersPerWeek.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerWeek
                });
                rankingMostActiveUsersPerMonth.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerMonth
                });
                rankingMostActiveUsersPerThreeMonths.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerThreeMonths
                });
                rankingMostActiveUsersPerSixMonths.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerSixMonths
                });
                rankingMostActiveUsersPerNineMonths.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerNineMonths
                });
                rankingMostActiveUsersPerYear.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessagesPerYear
                });
                rankingMostActiveUsers.push( {
                    name: slackInfo.members[key].name,
                    totalMessages : slackInfo.members[key].totalMessages
                });
            }
        }

        rankingMemberOfMoreChannels.sort(this.compare);
        rankingMostActiveUsersPerDay.sort(this.compare);
        rankingMostActiveUsersPerWeek.sort(this.compare);
        rankingMostActiveUsersPerMonth.sort(this.compare);
        rankingMostActiveUsersPerThreeMonths.sort(this.compare);
        rankingMostActiveUsersPerSixMonths.sort(this.compare);
        rankingMostActiveUsersPerNineMonths.sort(this.compare);
        rankingMostActiveUsersPerYear.sort(this.compare);
        rankingMostActiveUsers.sort(this.compare);

        slackInfo.rankingMemberOfMoreChannels = rankingMemberOfMoreChannels;
        slackInfo.rankingMostActiveUsersPerDay = rankingMostActiveUsersPerDay;
        slackInfo.rankingMostActiveUsersPerWeek = rankingMostActiveUsersPerWeek;
        slackInfo.rankingMostActiveUsersPerMonth = rankingMostActiveUsersPerMonth
        slackInfo.rankingMostActiveUsersPerThreeMonths = rankingMostActiveUsersPerThreeMonths;
        slackInfo.rankingMostActiveUsersPerSixMonths = rankingMostActiveUsersPerSixMonths;
        slackInfo.rankingMostActiveUsersPerNineMonths = rankingMostActiveUsersPerNineMonths;
        slackInfo.rankingMostActiveUsersPerYear = rankingMostActiveUsersPerYear;
        slackInfo.rankingMostActiveUsers = rankingMostActiveUsers;

        return slackInfo;
    },

    rankingChannels : function (slackInfo){
        let rankingMostActiveChannelsDay = [];
        let rankingMostActiveChannelsWeek = [];
        let rankingMostActiveChannelsMonth = [];
        let rankingMostActiveChannelsPerThreeMonths = [];
        let rankingMostActiveChannelsPerSixMonths = [];
        let rankingMostActiveChannelsPerNineMonths = [];
        let rankingMostActiveChannelsYear = [];
        let rankingMostActiveChannels = [];

        for (var key in slackInfo.channels) {
            if (slackInfo.channels.hasOwnProperty(key)) {
              rankingMostActiveChannelsDay.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerDay,
              });
              rankingMostActiveChannelsWeek.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerWeek,
              });
              rankingMostActiveChannelsMonth.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerMonth,
              });
              rankingMostActiveChannelsPerThreeMonths.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerThreeMonths,
              });
              rankingMostActiveChannelsPerSixMonths.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerSixMonths,
              });
              rankingMostActiveChannelsPerNineMonths.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerNineMonths,
              });
              rankingMostActiveChannelsYear.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].messagesPerYear,
              });
              rankingMostActiveChannels.push( {
                name: slackInfo.channels[key].name,
                totalMessages : slackInfo.channels[key].totalMessages,
              });
            }
        }

        rankingMostActiveChannelsDay.sort(this.compare);
        rankingMostActiveChannelsWeek.sort(this.compare);
        rankingMostActiveChannelsMonth.sort(this.compare);
        rankingMostActiveChannelsPerThreeMonths.sort(this.compare);
        rankingMostActiveChannelsPerSixMonths.sort(this.compare);
        rankingMostActiveChannelsPerNineMonths.sort(this.compare);
        rankingMostActiveChannelsYear.sort(this.compare);
        rankingMostActiveChannels.sort(this.compare);

        slackInfo.rankingMostActiveChannelsDay = rankingMostActiveChannelsDay;
        slackInfo.rankingMostActiveChannelsWeek = rankingMostActiveChannelsWeek;
        slackInfo.rankingMostActiveChannelsMonth = rankingMostActiveChannelsMonth
        slackInfo.rankingMostActiveChannelsPerThreeMonths = rankingMostActiveChannelsPerThreeMonths;
        slackInfo.rankingMostActiveChannelsPerSixMonths = rankingMostActiveChannelsPerSixMonths;
        slackInfo.rankingMostActiveChannelsPerNineMonths = rankingMostActiveChannelsPerNineMonths;
        slackInfo.rankingMostActiveChannelsYear = rankingMostActiveChannelsYear;
        slackInfo.rankingMostActiveChannels = rankingMostActiveChannels;

        return slackInfo;
    },

    //COMPARE AUXILIAR FUNCTION
    compare : function (a,b){
        if (a.totalMessages > b.totalMessages)
            return -1;
        if (a.totalMessages < b.totalMessages)
            return 1;
        return 0;
    },

    // UPDATING DATABASE
    updateDatabase : function(){
      db.slack.remove({});
    }

};

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT A SLACK USER
    this.id = { username = "",
                name = "",
                channelsCreated = channelID;
                channelsParticipates = [];

                this.totalMessagesPerDay = 0;
                this.totalMessagesPerWeek = 0;
                this.totalMessagesPerMonth = 0;
                this.totalMessagesPerThreeMonths = 0;
                this.totalMessagesPerSixMonths = 0;
                this.totalMessagesPerNineMonths = 0;
                this.totalMessagesPerYear = 0;
                this.totalMessages = 0;

                //TODO: -------------------------
                growthTotalMessagesPerDay = 0.0;
                growthTotalMessagesPerWeek = 0.0;
                growthTotalMessagesPerMonth = 0.0;
                growthTotalMessagesPerYear = 0.0;
            };
*/
//TODO: Be carefull when slack resets slack history
