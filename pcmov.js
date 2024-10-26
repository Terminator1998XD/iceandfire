var pcmovmentInit = function() {

  function getKey(name){
    return $('<div class="key">').append($('<img>').attr('src','keys/'+name+'.png'));
  }

  const key_a = getKey('key_a');
  const key_w = getKey('key_w');
  const key_d = getKey('key_d');

  const key_left = getKey('key_left');
  const key_up = getKey('key_up');
  const key_right = getKey('key_right');

  function getGroup(id, arr){
    return $('<div id="'+id+'">').append(arr);
  }

  const hMv = $('<span>').append([
    getGroup('leftpc',[key_a,key_w,key_d]),
    getGroup('rightpc',[key_left,key_up,key_right])
  ]);

  window.hmv_hide = function(){
    hMv.hide();
  }

  window.hmv_show = function(){
    hMv.show();
  }

  $('body').append(hMv);

  function ui_btn_eh(el){//включить подсветку кнопки
    if(el == null) return;
    el.style = 'filter: invert(100%)';
  }

  function ui_btn_dh(el){//выключить подсветку кнопки
    if(el == null) return;
    el.style = '';
  }

  const buttons = {
    'KeyA' : key_a[0],
    'KeyW' : key_w[0],
    'KeyD' : key_d[0],
    'ArrowLeft' : key_left[0],
    'ArrowUp' : key_up[0],
    'ArrowRight' : key_right[0]
  }

  document.addEventListener('keydown', function (e) {
      ui_btn_eh(buttons[event.code]);
  });

  document.addEventListener('keyup', function (e) {
      ui_btn_dh(buttons[event.code]);
  });

  window.addEventListener('blur', function () {
      for(const key in buttons){
        ui_btn_dh(buttons[key]);
      }
  });
};
