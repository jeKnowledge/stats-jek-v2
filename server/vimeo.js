//-----------------------------------------------------  STRUCTS  ------------------------------------------------------------------
//CLASS THAT HOLDS ALL THE INFO ABOUT VIMEO STATS
class VimeoBucket {
  constructor() {
    this.createdAt = new Date();
    this.myLink = new String();
    this.mybio = new String();

    this.numberFollowers = 0;
    this.followersNames = [];

    this.totalOurVideos = 0;
    this.ourVideos = [];

    this.totalAppearances = 0;
    this.appearances = [];

    this.Albums = [];

    this.totalPlays = 0;               //????
    this.totalFinishes = 0;
    this.totalLikes = 0;
    this.totalVideos = 0;
    this.totalComments = 0;
    this.totalShares = 0;
    this.totalDownloads = 0;
    this.totalLengthVideos = 0;
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
    this.shares = [];                                                           //"null" in this case means that it was not shared
    this.downloads = [];                                                        //"null" in this case means that it was not downloaded
    this.comments = [];                                                         //"null" in this case means that it was not commented
    this.likes = [{total : 0, names : [], links: []}];                          //"null" in this case means that it was not liked
    this.finishes = [];
    this.plays = [];
  }
}

//-----------------------------------------------------   METHODS  ------------------------------------------------------------------//
Vimeo = {

  callStats : function(){
    //BUCKET THAT CONTAINS ALL THE DATA -------------------------------------------------------------------
    var vimeoInfo = new VimeoBucket();

    //LETS EXTRACT THE BASIC INFO ----------------------------------------------------------------------
    try{
      var results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054?access_token=f94522e3eda6b5f53f27ac90206e3add", {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    var results1 = JSON.parse(results.content);

    vimeoInfo.createdAt = new Date(results1.created_time).toUTCString();
    vimeoInfo.myLink = results1.link;
    vimeoInfo.mybio = results1.bio;


    //LETS EXTRACT THE FOLLOWERS ----------------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/followers?access_token=f94522e3eda6b5f53f27ac90206e3add", {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    results1 = JSON.parse(results.content);

    vimeoInfo.numberFollowers = results1.total;

    for(var i = 0; i < results1.data.length; i++){
      vimeoInfo.followersNames[i] = results1.data[i].name;
    }

    //LETS EXTRACT INFO ABOUT OUR UPLOADED VIDEOS ----------------------------------------------------------------
    try{
      results = HTTP.call('GET', "https://api.vimeo.com/users/user6792054/videos?per_page=100&access_token=f94522e3eda6b5f53f27ac90206e3add", {headers: {"User-Agent": "Meteor/1.0"}});
    } catch(e) {
      console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
    }
    results1 = JSON.parse(results.content);

    vimeoInfo.totalOurVideos = results1.total;
    for(var i = 0; i < results1.data.length; i++){
      var newVideo = new Video();
      vimeoInfo.ourVideos.push(newVideo);
      vimeoInfo.ourVideos[i].name = results1.data[i].name;                      //TODO: Some names might not appear in utf8 format -.-'
      vimeoInfo.ourVideos[i].description = results1.data[i].description;
      vimeoInfo.ourVideos[i].link = results1.data[i].link;
      vimeoInfo.ourVideos[i].lengthInSecs = results1.data[i].duration;
      vimeoInfo.ourVideos[i].uploadAt = new Date(results1.data[i].created_time).toUTCString();
      try{
        var results2 = HTTP.call('GET', "https://api.vimeo.com" + results1.data[i].uri + "/likes?per_page=100&access_token=f94522e3eda6b5f53f27ac90206e3add", {headers: {"User-Agent": "Meteor/1.0"}});
      } catch(e) {
        console.log("AN ERROR OCURRED WHILE CALLING FOR VIMEO API: ", e);
      }
      var results3 = JSON.parse(results2.content);
      vimeoInfo.ourVideos[i].likes.total = results3.total;
      console.log("ESTE É O NUMERO DE LIKES QUE O VIDEO " + vimeoInfo.ourVideos[i].name + " TEM: " + results3.total);
      if (results3.total != 0){
        vimeoInfo.totalLikes++;
        for (var i = 0; i < results3.data.length; i++) {
          vimeoInfo.ourVideos[i].likes.names[i] = results3.data[i].name;
          vimeoInfo.ourVideos[i].likes.links[i] = results3.data[i].link;
        }
        console.log(vimeoInfo.ourVideos[i].likes);
      }
    }

    VimeoCollection.insert(vimeoInfo);

  },

updateDatabase : function(){
  db.vimeo.remove({});
}

};
