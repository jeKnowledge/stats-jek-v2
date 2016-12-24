//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT FACEBOOK STATS
class FacebookBucket {
    constructor() {
        this.pageLikes = 0;
        this.starRating = 0.0;
        this.talkingAbout = 0;
        this.Events = {};
        this.totalPhotos = 0;
        this.totalVideos = 0;

        this.postsPerDay = 0;
        this.postsPerWeek = 0;
        this.postsPerMonth = 0;
        this.postsPerThreeMonths = 0;
        this.postsPerSixMonths = 0;
        this.postsPerNineMonths = 0;
        this.postsPerYear = 0;
        this.totalPosts = 0;

        //TODO: -------
        this.totalLoves = 0;
        this.totalLaughs = 0;
        this.totalSads = 0;
        this.totalAnger = 0;
        this.totalReactions = 0

        this.likesPerDay = 0;
        this.likesPerWeek = 0;
        this.likesPerMonth = 0;
        this.likesPerThreeMonths = 0;
        this.likesPerSixMonths = 0;
        this.likesPerNineMonths = 0;
        this.likesPerYear = 0;
        this.totalLikes = 0;

        this.sharesPerDay = 0;
        this.sharesPerWeek = 0;
        this.sharesPerMonth = 0;
        this.sharesPerThreeMonths = 0;
        this.sharesPerSixMonths = 0;
        this.sharesPerNineMonths = 0;
        this.sharesPerYear = 0;
        this.totalShares = 0;

        this.eventsPerDay = 0;
        this.eventsPerWeek = 0;
        this.eventsPerMonth = 0;
        this.eventsPerThreeMonths = 0;
        this.eventsPerSixMonths = 0;
        this.eventsPerNineMonths = 0;
        this.eventsPerYear = 0;

        this.growthPageLikesPerWeek = 0.0;
        this.growthPageLikesPerMonth = 0.0;
        this.growthPageLikesPerThreeMonths = 0.0;
        this.growthPageLikesPerSixMonths = 0.0;
        this.growthPageLikesPerNineMonths = 0.0;
        this.growthPageLikesPerYear = 0.0;

    }
 }

Facebook = {

    callStats : function(){
        //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
        let FacebookInfo = new FacebookBucket();

        //LETS EXTRACT INFO ABOUT EVENTS ----------------------------------------------------------------------
        let results;
        let before = "";
        let eventsResults;
        FacebookInfo.Events.totalNumberEvents = 0;
        FacebookInfo.Events.totalNumberAttendees = 0;
        while(true){
            try{
                results = results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/events?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK + "&before=" + before, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
                console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK EVENTS: ", e);
            }
            eventsResults = JSON.parse(results.content);

            if(typeof(eventsResults.paging) === 'undefined'){
                break;
            }

            FacebookInfo.Events.eventsIDs = {};
            for (var i = 0; i < eventsResults.data.length; i++) {
                let beforeCursor = "";
                let eventID = eventsResults.data[i].id;
                FacebookInfo.Events.totalNumberEvents = eventsResults.data.length;
                FacebookInfo.Events.eventsIDs[eventID] = {};
                FacebookInfo.Events.eventsIDs[eventID].name = eventsResults.data[i].name;
                FacebookInfo.Events.eventsIDs[eventID].startTime = eventsResults.data[i].start_time;
                FacebookInfo.Events.eventsIDs[eventID].attending = 0;

                while(true){
                    try{
                        results = results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + eventID + "/attending?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK + "&before=" + beforeCursor, {headers: {"User-Agent": "Meteor/1.0"}});
                    } catch(e) {
                        console.log("AN ERROR OCURRED WHILE CALLING FOR DETAILS OF THE EVENT WITH THE ID: " + eventID, e);
                    }
                    eventAttending = JSON.parse(results.content);

                    if(typeof(eventAttending.paging) === 'undefined'){
                        break;
                    }
                    for (var l = 0; l < eventAttending.data.length; l++) {
                        if (eventAttending.data[l].rsvp_status === 'attending') {
                            FacebookInfo.Events.eventsIDs[eventID].attending++;
                            FacebookInfo.Events.totalNumberAttendees++;
                        }
                    }
                    beforeCursor = eventAttending.paging.cursors.before;

                }
            }
            before = eventsResults.paging.cursors.before;
        }

        //LETS EXTRACT THE BASIC INFO
        try{
            results = results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/?fields=fan_count, members, overall_star_rating, talking_about_count&access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK, {headers: {"User-Agent": "Meteor/1.0"}});
        } catch(e) {
            console.log("AN ERROR OCURRED WHILE CALLING FOR JEKNOWLEDGE PAGE BASIC INFO: ", e);
        }
        basicResults = JSON.parse(results.content);
        FacebookInfo.pageLikes = basicResults.fan_count;
        FacebookInfo.starRating = basicResults.overall_star_rating;
        FacebookInfo.talkingAbout = basicResults.talking_about_count;

        before = "";
        while(true){
            try{
                results = results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/photos?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK + "&before=" + before, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
                console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK PHOTOS: ", e);
            }
            photosResults = JSON.parse(results.content);

            if(typeof(photosResults.paging) === 'undefined'){
                break;
            }
            FacebookInfo.totalPhotos++;

            before = photosResults.paging.cursors.before;
        }

        before = "";
        while(true){
            try{
                results = results = HTTP.call('GET', "https://graph.facebook.com/v2.8/" + Meteor.settings.JEKNOWLEDGE_FACEBOOK_ID + "/videos?access_token=" + Meteor.settings.TOKEN_JOEL_FACEBOOK + "&before=" + before, {headers: {"User-Agent": "Meteor/1.0"}});
            } catch(e) {
                console.log("AN ERROR OCURRED WHILE CALLING FOR FACEBOOK VIDEOS: ", e);
            }
            videosResults = JSON.parse(results.content);

            if(typeof(videosResults.paging) === 'undefined'){
                break;
            }
            FacebookInfo.totalVideos++;

            before = videosResults.paging.cursors.before;
        }

        //LETS EXTRACT INFO ABOUT POSTS

    }
};

/*EXAMPLE AN OF OBJECT THAT HOLDS ALL THE INFO ABOUT EVENTS
    this.eventsIDs = { this.id1 = {name = "",
                                    attendees = ""
                                },
                    this.id2 = { name = "",
                                attendees = ""
                                },
                    ...,
                },
    this.totalEvents = 0;
    this.totalAttendees = 0;
*/

//TODO: Refresh token automatically
