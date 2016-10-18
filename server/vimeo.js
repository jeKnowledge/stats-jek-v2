//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT VIMEO STATS
class VimeoBucket {
  constructor() {
    this.createdAt = new Date();
    this.myLink = new String();
    this.mybio = new String();
    this.numberFollowers = 0;
    this.followersNames = [];
    this.lastEvent = {};
    this.totalLengthVideos = 0;
    this.totalOurVideos = 0;
    this.totalPlays = 0;

    //TODO: to be extracted
    this.totalOurVideos = 0;
    this.ourVideos = [];      //ALREADY IN ORDER OF UPLOADING??


    this.totalAppearances = 0;
    this.appearances = [];

    this.collections = {};
    this.totalVideos = 0;

    this.lastUploadVideo = {};
    this.lastComment = {};
    this.lastLiked = {};

    this.totalLikes = 0;
    this.totalComments = 0;
    this.totalShares = 0;
  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A VIDEO
class Video {
  constructor() {
    this.name = new String();
    this.link = new String();
    this.description = new String();                                            //"null" in this case means that it has not any description at all
    this.lengthInSecs = 0;
    this.uploadedAt = new Date();
    this.comments = [];                                                         //"null" in this case means that it was not commented
    this.likes = [{total : 0, names : [], links: []}];                          //"null" in this case means that it was not liked
    this.plays = [];
    this.tags = [];
  }
}

//-----------------------------------------------------   METHODS  ------------------------------------------------------------------//
Vimeo = {

  callStats : function(){
    //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
    let vimeoInfo = new VimeoBucket();

    //LETS EXTRACT THE BASIC INFO ----------------------------------------------------------------------
    try{
      let results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    let generalResults = JSON.parse(results.content);

    vimeoInfo.createdAt = new Date(generalResults.created_time).toUTCString();
    vimeoInfo.myLink = generalResults.link;
    vimeoInfo.mybio = generalResults.bio;


    //LETS EXTRACT THE FOLLOWERS ----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/followers?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    followersResults = JSON.parse(results.content);

    vimeoInfo.numberFollowers = followersResults.data.length;

    for(let i = 0; i < followersResults.data.length; i++){
      vimeoInfo.followersNames[i] = {};
      vimeoInfo.followersNames[i].name = followersResults.data[i].name;
      vimeoInfo.followersNames[i].link = followersResults.data[i].link;
    }

    //LETS EXTRACT THE LAST EVENT ----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/activities?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    eventsResults = JSON.parse(results.content);
    vimeoInfo.lastEvent.type = eventsResults.data[0].type;
    vimeoInfo.lastEvent.date = eventsResults.data[0].time;
    vimeoInfo.lastEvent.video = eventsResults.data[0].clip.name;


    //LETS EXTRACT INFO ABOUT EACH UPLOADED VIDEO ----------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/videos?per_page=100&access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    videoResults = JSON.parse(results.content);

    vimeoInfo.totalOurVideos = videoResults.data.length;
    vimeoInfo.totalVideos = videoResults.data.length;
    for(let i = 0; i < videoResults.data.length; i++){
      let newVideo = new Video();
      vimeoInfo.ourVideos.push(newVideo);
      vimeoInfo.ourVideos[i].name = videoResults.data[i].name;                      //TODO: Some names might not appear in utf8 format -.-'
      vimeoInfo.ourVideos[i].description = videoResults.data[i].description;
      vimeoInfo.ourVideos[i].link = videoResults.data[i].link;
      vimeoInfo.ourVideos[i].lengthInSecs = videoResults.data[i].duration;
      vimeoInfo.totalLengthVideos += videoResults.data[i].duration;

      vimeoInfo.ourVideos[i].uploadAt = new Date(videoResults.data[i].created_time).toUTCString();
      for (var l = 0; l < videoResults.data[i].tags.length; l++) {
        vimeoInfo.ourVideos[i].tags.push(videoResults.data[i].tags[l].tag);
      }
      vimeoInfo.ourVideos[i].plays = videoResults.data[i].stats.plays;
      vimeoInfo.totalPlays = videoResults.data[i].stats.plays;

      //EXTRACTING LIKES
      try{
        let results = HTTP.call('GET', "https://api.vimeo.com" + videoResults.data[i].uri + "/likes?per_page=100&access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
      } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
      }
      let likesResults = JSON.parse(results.content);

      vimeoInfo.ourVideos[i].likes.total = likesResults.total;

      if (likesResults.total > 0){
        vimeoInfo.totalLikes++;
        for (let i = 0; i < likesResults.data.length; i++) {
          vimeoInfo.ourVideos[i].likes.names[i] = likesResults.data[i].name;
          vimeoInfo.ourVideos[i].likes.links[i] = likesResults.data[i].link;
        }
      }
    }

    //LETS EXTRACT THE COLLECTIONS ----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/albums?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    collectionsResults = JSON.parse(results.content);
    for (var i = 0; i < collectionsResults.data.length; i++) {
      vimeoInfo.collections[collectionsResults.data[i].name] = {};
      vimeoInfo.collections[collectionsResults.data[i].name].createdAt = new Date(collectionsResults.data[i].created_time).toUTCString();
      vimeoInfo.collections[collectionsResults.data[i].name].updatedAt = new Date(collectionsResults.data[i].modified_time).toUTCString();
      //TODO:
      //list of videos
      //vimeoInfo.collections[collectionsResults.data[i].name].total;
     }



    VimeoCollection.insert(vimeoInfo);

  },

updateDatabase : function(){
  db.vimeo.remove({});
}

};

/*OTHER STATISTICS MIGHT BE AVAILABLE IN THE NEXT VERSION OF VIMEO API:
    //totalFinishes
    //totalShares
    //totalDownloads
*/
