//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT FACEBOOK STATS
class FacebookBucket {
    constructor() {
        this.pageLikes = 0;
        this.starRating = 0.0;
        this.talkingAbout = 0;  //week period
        this.totalLikes = 0;
        this.totalShares = 0;
        this.totalPhotos = 0;

        this.Events = {};
        this.Videos = {};

        this.postsPerDay = 0;
        this.postsPerWeek = 0;
        this.postsPerMonth = 0;
        this.postsPerThreeMonths = 0;
        this.postsPerSixMonths = 0;
        this.postsPerNineMonths = 0;
        this.postsPerYear = 0;
        this.totalPosts = 0;

        this.totalLoves = 0;
        this.totalLaughs = 0;
        this.totalSads = 0;
        this.totalAngrys = 0;
        this.totalWows = 0;
        this.totalThankfuls = 0;
        this.totalReactions = 0;

        this.commentsPerDay = 0;
        this.commentsPerWeek = 0;
        this.commentsPerMonth = 0;
        this.commentsPerThreeMonths = 0;
        this.commentsPerSixMonths = 0;
        this.commentsPerNineMonths = 0;
        this.commentsPerYear = 0;
        this.totalComments = 0;

        this.eventsPerDay = 0;
        this.eventsPerWeek = 0;
        this.eventsPerMonth = 0;
        this.eventsPerThreeMonths = 0;
        this.eventsPerSixMonths = 0;
        this.eventsPerNineMonths = 0;
        this.eventsPerYear = 0;

        this.uploadedPhotosPerDay = 0;
        this.uploadedPhotosPerWeek = 0;
        this.uploadedPhotosPerMonth = 0;
        this.uploadedPhotosPerThreeMonths = 0;
        this.uploadedPhotosPerSixMonths = 0;
        this.uploadedPhotosPerNineMonths = 0;
        this.uploadedPhotosPerYear = 0;

        this.uploadedVideosPerDay = 0;
        this.uploadedVideosPerWeek = 0;
        this.uploadedVideosPerMonth = 0;
        this.uploadedVideosPerThreeMonths = 0;
        this.uploadedVideosPerSixMonths = 0;
        this.uploadedVideosPerNineMonths = 0;
        this.uploadedVideosPerYear = 0;

        //TODO: -------
        this.growthPageLikesPerWeek = 0.0;
        this.growthPageLikesPerMonth = 0.0;
        this.growthPageLikesPerThreeMonths = 0.0;
        this.growthPageLikesPerSixMonths = 0.0;
        this.growthPageLikesPerNineMonths = 0.0;
        this.growthPageLikesPerYear = 0.0;

        this.growthPageSharesPerWeek = 0.0;
        this.growthPageSharesPerMonth = 0.0;
        this.growthPageSharesPerThreeMonths = 0.0;
        this.growthPageSharesPerSixMonths = 0.0;
        this.growthPageSharesPerNineMonths = 0.0;
        this.growthPageSharesPerYear = 0.0;

        this.growthTalkingAboutPerWeek = 0.0;
        this.growthTalkingAboutPerMonth = 0.0;
        this.growthTalkingAboutPerThreeMonths = 0.0;
        this.growthTalkingAboutPerSixMonths = 0.0;
        this.growthTalkingAboutPerNineMonths = 0.0;
        this.growthTalkingAboutPerYear = 0.0;

    }
 }

Facebook = {

    callStats : function(){
        //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
        let FacebookInfo = new FacebookBucket();

        //LETS EXTRACT THE BASIC INFO
        try{
            results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/?fields=fan_count, members, overall_star_rating, talking_about_count&access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR JEKNOWLEDGE PAGE BASIC INFO: ", e);
        }
        basicResults = JSON.parse(results.content);
        FacebookInfo.pageLikes = basicResults.fan_count;
        FacebookInfo.starRating = basicResults.overall_star_rating;
        FacebookInfo.talkingAbout = basicResults.talking_about_count;

        //LETS EXTRACT INFO ABOUT PHOTOS -------------------------------
        let results;
        let albumsResults;
        for (var i = 0; ; i++) {
            if (i == 0) {
                try{
                    results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/albums?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK PHOTOS: ", e);
                    break;
                }
                albumsResults = JSON.parse(results.content);

            } else if (typeof(albumsResults.paging.next) !== 'undefined'){
                try{
                    results = HTTP.call('GET', albumsResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK PHOTOS: ", e);
                    break;
                }
                albumsResults = JSON.parse(results.content);

            } else {
                break;
            }

            for (var l = 0; l < albumsResults.data.length; l++) {
                let photosResults;
                let albumID = albumsResults.data[l].id;
                for (var r = 0; ; r++) {
                    if (r == 0) {
                        try{
                            results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + albumID + "/photos?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                        } catch(e) {
                            console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK ALBUM ID " + albumID + ": ", e);
                            break;
                        }
                        photosResults = JSON.parse(results.content);
                    } else if (typeof(photosResults.paging) === 'undefined') {
                        break;
                    } else if (typeof(photosResults.paging.next) !== 'undefined'){
                        try{
                            results = HTTP.call('GET', photosResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                        } catch(e) {
                            console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK ALBUM ID " + albumID + ": ", e);
                            break;
                        }
                        photosResults = JSON.parse(results.content);

                    } else {
                        break;
                    }

                    FacebookInfo.totalPhotos += photosResults.data.length;

                    for (var g = 0; g < photosResults.data.length; g++) {
                        let timestamp = this.dateToTimestamp(new Date(photosResults.data[g].created_time));

                        //count photos Frequency
                        FacebookInfo = this.photosFrequency(FacebookInfo, timestamp);
                    }
                }
            }
        }

        /*//LETS EXTRACT INFO ABOUT VIDEOS -------------------------------
        let videosResults;
        FacebookInfo.Videos.totalNumberVideos = 0;
        FacebookInfo.Videos.videosIDs = {};
        for (var i = 0; ; i++) {
            if (i == 0) {
                try{
                    results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/videos?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK VIDEOS: ", e);
                    break;
                }
                videosResults = JSON.parse(results.content);

            } else if (typeof(videosResults.paging.next) !== 'undefined'){
                try{
                    results = HTTP.call('GET', videosResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK VIDEOS: ", e);
                    break;
                }
                videosResults = JSON.parse(results.content);

            } else {
                break;
            }

            FacebookInfo.Videos.totalNumberVideos += videosResults.data.length;
            for (var l = 0; l < videosResults.data.length; l++) {
                let videoID = videosResults.data[l].id;
                FacebookInfo.Videos.videosIDs[videoID] = {};
                FacebookInfo.Videos.videosIDs[videoID].date = new Date(videosResults.data[l].updated_time);
            }
        }

        //LETS EXTRACT INFO ABOUT EVENTS ----------------------------------------------------------------------
        let eventsResults;
        let eventAttending;
        FacebookInfo.Events.totalNumberEvents = 0;
        FacebookInfo.Events.totalNumberAttendees = 0;
        FacebookInfo.Events.eventsIDs = {};

        for (var i = 0; ; i++) {
            if (i == 0) {
                try{
                    results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/events?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK EVENTS: ", e);
                    break;
                }
                eventsResults = JSON.parse(results.content);

            } else if (typeof(eventsResults.paging.next) !== 'undefined'){
                try{
                    results = HTTP.call('GET', eventsResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK EVENTS: ", e);
                    break;
                }
                eventsResults = JSON.parse(results.content);

            } else {
                break;
            }

            FacebookInfo.Events.totalNumberEvents += eventsResults.data.length;
            for (var y = 0; y < eventsResults.data.length; y++) {
                let eventID = eventsResults.data[y].id;
                FacebookInfo.Events.eventsIDs[eventID] = {};
                FacebookInfo.Events.eventsIDs[eventID].name = eventsResults.data[y].name;
                FacebookInfo.Events.eventsIDs[eventID].startTime = new Date (eventsResults.data[y].start_time);
                FacebookInfo.Events.eventsIDs[eventID].attending = 0;

                for (var r = 0; ; r++) {
                    if (r == 0) {
                        try{
                            results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + eventID + "/attending?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                        } catch(e) {
                            console.log("AN ERROR OCURRED WHILE CALLING FOR INFO FOR THE EVENT " + eventID + " : ", e);
                            break;
                        }
                        eventAttending = JSON.parse(results.content);

                    } else if (typeof(eventAttending.paging.next) !== 'undefined'){
                        try{
                            results = HTTP.call('GET', eventAttending.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                        } catch(e) {
                            console.log("AN ERROR OCURRED WHILE CALLING FOR INFO FOR THE EVENT " + eventID + " : ", e);
                            break;
                        }
                        eventAttending = JSON.parse(results.content);

                    } else {
                        break;
                    }

                    for (var m = 0; m < eventAttending.data.length; m++) {
                        if (eventAttending.data[m].rsvp_status === 'attending') {
                            FacebookInfo.Events.eventsIDs[eventID].attending++;
                            FacebookInfo.Events.totalNumberAttendees++;
                        }
                    }
                }
            }
        }

        //LETS EXTRACT INFO ABOUT POSTS
        let postsResults;
        for (var i = 0; ; i++) {
            if (i == 0) {
                try{
                    results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/posts?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK POSTS: ", e);
                    break;
                }
                postsResults = JSON.parse(results.content);

            } else if (typeof(postsResults.paging) !== 'undefined'){
                try{
                    results = HTTP.call('GET', postsResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK POSTS: ", e);
                    break;
                }
                postsResults = JSON.parse(results.content);

            } else {
                break;
            }
            FacebookInfo.totalPosts += postsResults.data.length;
            for (var z = 0; z < postsResults.data.length; z++) {
                let postsID = postsResults.data[z].id;
                let timestamp = this.dateToTimestamp(new Date(postsResults.data[z].created_time));

                //check relative time foreach post
                FacebookInfo = this.postsFrequency(FacebookInfo, postsID, timestamp);
                //count reactions
                FacebookInfo = this.countReactions(FacebookInfo, postsID);
                //count comments
                FacebookInfo = this.commentsFrequency(FacebookInfo, postsID);
                //count shares
                FacebookInfo = this.countShares(FacebookInfo, postsID);

            }

        }*/
        console.log(FacebookInfo);


    },

    countShares : function(FacebookInfo, key) {
        let sharesResults;
        try{
            results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + key + "?fields=shares&access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK SHARES TO THE POST " + key + ": ", e);
        }
        sharesResults = JSON.parse(results.content);
        console.log(sharesResults);
        if (typeof(sharesResults.shares) !== 'undefined') {
            FacebookInfo.totalShares += sharesResults.shares.count;
        }


        return FacebookInfo;
    },

    countReactions : function(FacebookInfo, key) {
        let reactionsResults;
        for (var l = 0; ; l++) {
            if (l == 0) {
                try{
                    results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + key + "/reactions?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK REACTIONS TO THE POST " + key + ": ", e);
                    break;
                }
                reactionsResults = JSON.parse(results.content);

            } else if (typeof(reactionsResults.paging) === 'undefined') {
                   break;
            } else if (typeof(reactionsResults.paging.next) !== 'undefined'){
                try{
                    results = HTTP.call('GET', reactionsResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK REACTIONS TO THE POST " + key + ": ", e);
                    break;
                }
                reactionsResults = JSON.parse(results.content);

            } else {
                break;
            }

            FacebookInfo.totalReactions += reactionsResults.data.length;
            for (var i = 0; i < reactionsResults.data.length; i++) {

                if(reactionsResults.data[i].type === 'LIKE'){
                    FacebookInfo.totalLikes++;
                } else if(reactionsResults.data[i].type === 'LOVE'){
                    FacebookInfo.totalLoves++;
                } else if(reactionsResults.data[i].type === 'WOW'){
                    FacebookInfo.totalWows++;
                } else if(reactionsResults.data[i].type === 'HAHA'){
                    FacebookInfo.totalLaughs++;
                } else if(reactionsResults.data[i].type === 'SAD'){
                    FacebookInfo.totalSads++;
                } else if(reactionsResults.data[i].type === 'ANGRY'){
                    FacebookInfo.totalAngrys++;
                } else if(reactionsResults.data[i].type === 'THANKFUL'){
                    FacebookInfo.totalThankfuls++;
                }
            }
        }
        return FacebookInfo;
    },

    commentsFrequency : function(FacebookInfo, key) {

        let commentsResults;
        let yearInSeconds = 60*60*24*365;
        let monthInSeconds = 60*60*24*30;
        let weekInSeconds = 60*60*24*7;
        let threeMonthsInSeconds = monthInSeconds*3;
        let sixMonthsInSeconds = monthInSeconds*6;
        let nineMonthsInSeconds = monthInSeconds*9;
        let dayInSeconds = 60*60*24;
        let currentTimestamp = new Date().getTime()/1000;

        for (var i = 0; ; i++) {
            if (i == 0) {
                try{
                    results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + key + "/comments?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK COMMENTS TO THE POST " + key + ": ", e);
                    break;
                }
                commentsResults = JSON.parse(results.content);

            } else if (typeof(commentsResults.paging) === 'undefined') {
                   break;
            } else if (typeof(commentsResults.paging.next) !== 'undefined'){
                try{
                    results = HTTP.call('GET', commentsResults.paging.next, {headers: {"User-Agent": "Meteor/1.0"}});
                } catch(e) {
                    console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK COMMENTS TO THE POST " + key + ": ", e);
                    break;
                }
                reactionsResults = JSON.parse(results.content);

            } else {
                break;
            }

            FacebookInfo.totalComments += commentsResults.data.length;
            for (var l = 0; l < commentsResults.data.length; l++) {
                let timestamp = this.dateToTimestamp(new Date(commentsResults.data[i].created_time));
                if(timestamp >= (currentTimestamp - dayInSeconds) ){
                    FacebookInfo.commentsPerDay++;
                }
                if(timestamp >= (currentTimestamp - weekInSeconds) ){
                    FacebookInfo.commentsPerWeek++;
                }
                if(timestamp >= (currentTimestamp - monthInSeconds) ){
                    FacebookInfo.commentsPerMonth++;
                }
                if(timestamp >= (currentTimestamp - threeMonthsInSeconds) ){
                    FacebookInfo.commentsPerThreeMonths++;
                }
                if(timestamp >= (currentTimestamp - sixMonthsInSeconds) ){
                    FacebookInfo.commentsPerSixMonths++;
                }
                if(timestamp >= (currentTimestamp - nineMonthsInSeconds) ){
                    FacebookInfo.commentsPerNineMonths++;
                }
                if(timestamp >= (currentTimestamp - yearInSeconds) ){
                    FacebookInfo.commentsPerYear++;
                }
            }
        }
        return FacebookInfo;
    },

    photosFrequency : function (FacebookInfo, timestamp){
        let yearInSeconds = 60*60*24*365;
        let monthInSeconds = 60*60*24*30;
        let weekInSeconds = 60*60*24*7;
        let threeMonthsInSeconds = monthInSeconds*3;
        let sixMonthsInSeconds = monthInSeconds*6;
        let nineMonthsInSeconds = monthInSeconds*9;
        let dayInSeconds = 60*60*24;
        let currentTimestamp = new Date().getTime()/1000;

        if(timestamp >= (currentTimestamp - dayInSeconds) ){
            FacebookInfo.uploadedPhotosPerDay++;
        }
        if(timestamp >= (currentTimestamp - weekInSeconds) ){
            FacebookInfo.uploadedPhotosPerWeek++;
        }
        if(timestamp >= (currentTimestamp - monthInSeconds) ){
            FacebookInfo.uploadedPhotosPerMonth++;
        }
        if(timestamp >= (currentTimestamp - threeMonthsInSeconds) ){
            FacebookInfo.uploadedPhotosPerThreeMonths++;
        }
        if(timestamp >= (currentTimestamp - sixMonthsInSeconds) ){
            FacebookInfo.uploadedPhotosPerSixMonths++;
        }
        if(timestamp >= (currentTimestamp - nineMonthsInSeconds) ){
            FacebookInfo.uploadedPhotosPerNineMonths++;
        }
        if(timestamp >= (currentTimestamp - yearInSeconds) ){
            FacebookInfo.uploadedPhotosPerYear++;
        }

        return FacebookInfo;
    },

    postsFrequency : function(FacebookInfo, key, timestamp){
        let yearInSeconds = 60*60*24*365;
        let monthInSeconds = 60*60*24*30;
        let weekInSeconds = 60*60*24*7;
        let threeMonthsInSeconds = monthInSeconds*3;
        let sixMonthsInSeconds = monthInSeconds*6;
        let nineMonthsInSeconds = monthInSeconds*9;
        let dayInSeconds = 60*60*24;
        let currentTimestamp = new Date().getTime()/1000;

        if(timestamp >= (currentTimestamp - dayInSeconds) ){
            FacebookInfo.postsPerDay++;
        }
        if(timestamp >= (currentTimestamp - weekInSeconds) ){
            FacebookInfo.postsPerWeek++;
        }
        if(timestamp >= (currentTimestamp - monthInSeconds) ){
            FacebookInfo.postsPerMonth++;
        }
        if(timestamp >= (currentTimestamp - threeMonthsInSeconds) ){
            FacebookInfo.postsPerThreeMonths++;
        }
        if(timestamp >= (currentTimestamp - sixMonthsInSeconds) ){
            FacebookInfo.postsPerSixMonths++;
        }
        if(timestamp >= (currentTimestamp - nineMonthsInSeconds) ){
            FacebookInfo.postsPerNineMonths++;
        }
        if(timestamp >= (currentTimestamp - yearInSeconds) ){
            FacebookInfo.postsPerYear++;
        }

        return FacebookInfo;
    },

    // UNIX TIMESTAMP TO DATE
    timestampToDate : function(timestamp){
        return (new Date(timestamp*1000));
    },

    // DATE TO UNIX TIMESTAMP
    dateToTimestamp : function(date){
        return date.getTime()/1000;
    }

};

//TODO: Refresh token automatically
//TODO: refactor everything to ECMA6
