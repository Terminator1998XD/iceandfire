function getOverlay(){
  const overlay = $('<div class="overlay">').css({
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'color':'white',
    'width': '100%',
    'height': '100%',
    'background': 'rgba(0,0,0,0.9)',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'z-index': 9999
  });

  const content = $('<div>').css({'text-align':'center'});//блок content, чтобы центрировать

  $('body').append(overlay.append(content));

  return content;
}

function ayouReadyScreen(overlay, callback){
  __lockplay__ = true;
  overlay.empty().click(callback).append([
    $('<p>').append($('<img>').attr('src','finger.png'))
  ]).addClass('no_p_events').css({'cursor':'pointer','font-size':'2vh'});

  $('.overlay').click(callback).css({'cursor':'pointer'});
}
