window.onload = function() {
  var socket = io.connect('http://' + document.domain + ':' + location.port);
  var firstConnect = true;
  var myName = "";

  addSubmitButtonListener(socket);

  socket.on('connect', function() {
    socket.emit('connection event');
    console.log("emiting connection event")
  });

  socket.on('incoming message', function(msg, author, avatar){
    if (author == myName){
      $("#messages-div").append('<div class = "my-messages">' + msg + '</div>')
    } else {
      addMessageFromOtherUser(avatar, author, msg);
    }
  })

  socket.on('someone connected', function(displayName, avatar, usersOnlineDisplayNames, usersOnlineAvatars) {
    if (firstConnect){
      myName = displayName;
      firstConnect = false;
      for (var i = 0; i < usersOnlineAvatars.length; i++){
        addUserToOnlineDiv(usersOnlineDisplayNames[i], usersOnlineAvatars[i])
      }
    } else {
      addUserToOnlineDiv(displayName, avatar)
    }
  }); // end someone connected

  socket.on( 'disconnect event',  function(userWhoLeft) {
    let divToRemove = "." + userWhoLeft + "-user-online-div";
    $(divToRemove).remove();
  });

} //end onload

// helper methods
function addSubmitButtonListener(socket){
  $('#myMessage').on('keyup', function (e) {
    var message = $('#myMessage').val()
    if(e.which === 13 && message != ""){
      socket.emit('message', message);
      $('#myMessage').val('')
    }
  });

  $('#sendButton').on('click', function(){
    var message = $('#myMessage').val()
    if (message != ""){
      socket.emit('message', message);
      $('#myMessage').val('')
    }
  })
}

function addMessageFromOtherUser(avatar, author, msg){
  $("#messages-div").append('<div class = "other-messages">' +
  "<img class = 'messages-avatar' src = static/images/jeff" + avatar + ".jpg>" +
  author +
  ": " +
  msg +
  '</div>'
)};

function addUserToOnlineDiv(displayName, avatar){
  $("#online-users-div").append(
    '<div class = "' + displayName + '-user-online-div">' +
    '<img class = "avatar-sidebar-img" src=static/images/jeff' + avatar + ".jpg>" +
    displayName +
    '</div>')
  }