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
    this.totalLikes = 0;
    this.ourVideos = [];      //ALREADY IN ORDER OF UPLOADING
    this.likedByJek = [];
    this.totalAppearances = 0;
    this.appearances = [];
    this.totalVideos = 0;


    //TODO: to be extracted
    this.collections = {};
    this.lastLiked = {};
    this.lastComment = {};
    this.totalComments = 0;
    this.totalShares = 0;

  }
}

//CLASS THAT HOLDS ALL THE INFO ABOUT A VIDEO
class Video {
  constructor() {
    this.name = new String();
    this.link = new String();
    this.description = new String();
    this.lengthInSecs = 0;
    this.uploadedAt = new Date();
    this.likes = [];
    this.plays = [];
    this.tags = [];
    //TODO: to be extracted
    this.comments = [];
  }
}

//-----------------------------------------------------   METHODS  ------------------------------------------------------------------//
Vimeo = {

  callStats : function(){
    //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
    let vimeoInfo = new VimeoBucket();

    //LETS EXTRACT THE BASIC INFO ----------------------------------------------------------------------
    let results;
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
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

    //LETS EXTRACT THE APPEARANCES ----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/appearances?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    appearancesResults = JSON.parse(results.content);

    vimeoInfo.totalAppearances = appearancesResults.total;
    vimeoInfo.totalVideos = appearancesResults.total;

    for(let i = 0; i < appearancesResults.data.length; i++){
      vimeoInfo.appearances[i] = {};
      vimeoInfo.appearances[i].name = appearancesResults.data[i].name;
      vimeoInfo.appearances[i].link = appearancesResults.data[i].uri;
      vimeoInfo.appearances[i].description = appearancesResults.data[i].description;
      vimeoInfo.appearances[i].lengthInSecs = appearancesResults.data[i].duration;
      vimeoInfo.appearances[i].likes = appearancesResults.data[i].metadata.connections.likes.total;

      vimeoInfo.appearances[i].uploadedAt = new Date(appearancesResults.data[i].created_time).toUTCString();
      for (var l = 0; l < appearancesResults.data[i].tags.length; l++) {
        vimeoInfo.appearances[i].tags.push(appearancesResults.data[i].tags[l].tag);
      }
      vimeoInfo.appearances[i].plays = appearancesResults.data[i].stats.plays;
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

    //LETS EXTRACT THE LIKES ----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/activities?access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    likesResults = JSON.parse(results.content);
    for (var i = 0; i < likesResults.data.length; i++) {
      vimeoInfo.likedByJek[i] = {};
      vimeoInfo.likedByJek[i].url = likesResults.data[i].uri;
      vimeoInfo.likedByJek[i].name = likesResults.data[i].name;
    }

    //LETS EXTRACT INFO ABOUT EACH UPLOADED VIDEO ----------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/videos?per_page=100&access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    videoResults = JSON.parse(results.content);

    vimeoInfo.totalOurVideos = videoResults.data.length;
    vimeoInfo.totalVideos += videoResults.data.length;
    for(let i = 0; i < videoResults.data.length; i++){
      let newVideo = new Video();
      vimeoInfo.ourVideos.push(newVideo);
      vimeoInfo.ourVideos[i].name = videoResults.data[i].name;
      vimeoInfo.ourVideos[i].description = videoResults.data[i].description;
      vimeoInfo.ourVideos[i].link = videoResults.data[i].link;
      vimeoInfo.ourVideos[i].lengthInSecs = videoResults.data[i].duration;
      vimeoInfo.totalLengthVideos += videoResults.data[i].duration;

      vimeoInfo.ourVideos[i].uploadedAt = new Date(videoResults.data[i].created_time).toUTCString();
      for (var l = 0; l < videoResults.data[i].tags.length; l++) {
        vimeoInfo.ourVideos[i].tags.push(videoResults.data[i].tags[l].tag);
      }
      vimeoInfo.ourVideos[i].plays = videoResults.data[i].stats.plays;
      vimeoInfo.totalPlays = videoResults.data[i].stats.plays;

      //EXTRACTING LIKES
      vimeoInfo.ourVideos[i].likes.total = 0;
      vimeoInfo.ourVideos[i].likes = [];
      try{
        results = HTTP.call('GET', "https://api.vimeo.com" + videoResults.data[i].uri + "/likes?per_page=100&access_token=" + Meteor.settings.TOKEN_JEK_VIMEO, {headers: {"User-Agent": "Meteor/1.0"}});
      } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
      }
      let likesResults = JSON.parse(results.content);

      vimeoInfo.ourVideos[i].likes.total += likesResults.total;
      vimeoInfo.totalLikes += likesResults.total;
      if (likesResults.total > 0){
        for (let i = 0; i < likesResults.data.length; i++) {
          vimeoInfo.ourVideos[i].likes[i] = {};
          vimeoInfo.ourVideos[i].likes[i].name = likesResults.data[i].name;
          vimeoInfo.ourVideos[i].likes[i].link = likesResults.data[i].link;
        }
      }
    }
    vimeoInfo.totalLengthVideos = vimeoInfo.totalLengthVideos/60;

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
    //totalDownloads
*/
