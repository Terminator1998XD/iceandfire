function gpinit(gp){
  window.ndk = null;
  if(gp != null){

	  if(gp.platform.type == 'YANDEX'){
		  window.ndk = gp.platform.getNativeSDK();
	  }

    window.sharegame = function(){
      const st = window.lang == 'ru' ? 'Заходи и играй со мной в игру "Огонь и Лёд ОРИГИНАЛЬНАЯ ВЕРСИЯ"' : 'Come and play the game "Fire & Ice - Original Version" with me';
      gp.socials.share({text: st});
    }

		gp.ads.on('fullscreen:close', (success) => {
			if(window.adscb == null) return;
			window.adscb.onClose();
		});

		gp.ads.on('rewarded:close', (success) => {
			if(window.adscb == null) return;
			window.adscb.onRewarded();
			window.adscb.onClose();
		});
		// Получена награда
		gp.ads.on('rewarded:reward', () => {});
	}

  window.ysdk = {adv: {
	showFullscreenAdv: function(info){

		const cb = info.callbacks;

		if(gp == null){
			cb.onClose();
			return;
		}

		window.adscb = cb;

		gp.ads.showFullscreen();
	},
	showRewardedVideo: function(info){
		const cb = info.callbacks;

		if(gp == null){
			cb.onRewarded();
			cb.onClose();
			return;
		}

		window.adscb = cb;
		gp.ads.showRewardedVideo();
		// Показать rewarded video, возвращает промис
	}}};

  window.isMobile = gp == null ? true : gp.isMobile;
  if(window.isMobile)unityInstance.SendMessage('Main Camera', 'isMobile');
  else pcmovmentInit();
  window.lang = gp == null ? "ru" : gp.language;
  unityInstance.SendMessage('Main Camera', 'SetLang', lang);
  window.lb = null;

  if(window.ndk==null)unityInstance.SendMessage('Main Camera', 'SetMobileStore');

  document.addEventListener("visibilitychange", OnVisibleChanged);
  storage(() =>{
    unityInstance.SendMessage('Main Camera', 'SetRawSave', JSON.stringify(storage.getraw()));
    $('canvas').css({'width':'100%','height':'100%'});
	   unityInstance.SendMessage('Main Camera', 'LoadComplite');
  });
}

function InitSDK(){
  const apiurl = 'https://gs.eponesh.com/sdk/gamepush.js?projectId=17792&publicToken=fBFyrV5Tu2DU5lXHGPYxRF9zhPCJiwuh&callback=gpinit';
  const initFunc = function(){
	console.log("gp init");
  }

  const t = document.getElementsByTagName('script')[0];
  const s = document.createElement('script');
  s.src = apiurl;
  s.async = true;
  t.parentNode.insertBefore(s, t);
  s.onload = initFunc;

  s.onerror = function() {
		gpinit(null);
  }
}

function OnVisibleChanged() {
	  if (document.visibilityState === "hidden") {
      unityInstance.SendMessage('Interop', 'PreBanner');
    } else if(!advscr) {
      unityInstance.SendMessage('Interop', 'PostBanner');
    }
}

var lbc = null;

function showleads(){
  if(window.lb != null){
	if(showleads.showleadsLock)return;
	showleads.showleadsLock = true;
    if(lbc != null){
      showlb(lbc);
      return;
    }

    lb.getLeaderboardEntries('lead', {quantityTop:20}).then(result => {
      lbc = result;
      showlb(lbc);
      setTimeout(()=>{
        window.lbc = null;
      },16000);
    });
  }
}

function showlb(result){
  const lb_data = $('<div class="leaderbord_data_rows">');
  const players = result.entries;

  if(players.length == 0){
    lb_data.html(lang == 'ru' ? "<p><center>Пусто</center></p>" : "<p><center>Empty</center></p>")
  }

  for(let i = 0; i < players.length; i++){
    const p = players[i];

    const avatar = p.player.getAvatarSrc();
    let nick = p.player.publicName;
    if(nick == ''){
      nick = lang == 'ru' ? "Аноним" : "Anonymous";
    }
    const score = p.score;

    lb_data.append(getRow([
      getColumn('<span>№'+parseInt(i+1)+'</span>'),
      getColumn("<img src='"+avatar+"'>"),
      getColumn('<span>'+nick+'</span>'),
      getColumn('<span>'+score+'</span>')
    ]));
  }

  const o = getOverlay();
  o.append(
    $('<div class="leaderbords">').append(getCurlb()),
    $('<p>').append(
      $('<button>').text(lang == 'ru' ? "Назад" : "Back").click(function(){
        $('.overlay').remove();
        showleads.showleadsLock = false;
      })
    )
  ).hide().show(200);

  function getCurlb(){
    return $('<div class="leaderbord">').append([
      $('<h3>').text(lang == 'ru' ? 'Лучшие игроки' : 'The best players'),
      $('<div class="leaderbord_data">').append(lb_data)
    ]);
  }

  function getRow(data){
    return $('<div class="row">').append(data);
  }

  function getColumn(data){
    return $('<div class="col">').append(data);
  }
}

function PushSave(json){
  const js = JSON.parse(json);
  for(key in js){
    storage.set(key, js[key]);
  }
  storage.push();
}

var advscr = false;

function yabanner(){
  if(advscr)return;
 advscr = true;
 unityInstance.SendMessage('Interop', 'PreBanner');
  ysdk.adv.showFullscreenAdv({callbacks: {onClose: function(){
    unityInstance.SendMessage('Interop', 'PostBanner');
	advscr = false;
	}}});
}

function yarbanner() {
  if(advscr)return;
  advscr = true;
  var RWW = false;
  unityInstance.SendMessage('Interop', 'PreBanner');
  ysdk.adv.showRewardedVideo({
    callbacks: {
      onClose: function() {
        advscr = false;
        unityInstance.SendMessage('Interop', 'PostBanner');
		if(RWW)unityInstance.SendMessage('Interop', 'REWARDCOMPLITE');
      },
      onRewarded: function(){
		RWW = true;
      }
    }
  });
}

function WorldLoaded() {

	if(ndk == null) return;

   ndk.getLeaderboards().then(lb => {
       window.lb = lb;
   });

   ndk.features.LoadingAPI?.ready();

   window.WorldLoaded = function(){}
}

function promptStars(){
  ndk.feedback.requestReview().then(({ feedbackSent }) => {});
}

function ScoreToLead(score){
  if(window.lb!=null){
	  score = parseInt(score);
	lb.setLeaderboardScore('lead', score);
  }
}
