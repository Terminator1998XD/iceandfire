function storage(loadcallback){
  if(window.ndk != null){

    window.ndk.getPlayer().then(player => {

    player.getData().then(data => {
      console.log("data load");
      console.log(data);

      var ist = false;
      storage.get = function(key){
        return data[key];
      }
      storage.set = function(key,value){
        data[key] = value;
      }
      storage.push = function(){
        player.setData(data).then(() => {
          console.log('yandexsdk cloud push seccuss');
        });
        ist = false;
        ScoreToLead(data.Record);
      }

      storage.type = 1;

      storage.getraw = function(){
        return data;
      }

      loadcallback();
      console.log("storage bind yandexsdk cloud");
    }).catch(err => {
      lssave();
    });

    }).catch(err => {
      lssave();
   });
  } else {
    lssave();
  }

  function lssave(){
    console.log("storage bind localStorage");
    storage.get = function(key){
      return localStorage[key];
    }
    storage.set = function(key,value){
      localStorage[key] = value;
    }
    storage.push = function(){

    }
    storage.getraw = function(){
      var obj = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        obj[key] = value;
      }
      return obj;
    }
    storage.type = 0;
    loadcallback();
  }
}
