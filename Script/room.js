$(document).ready(function() {
   var name, nickName;
   id = -1;  

   setInterval(getMessages, 3000);
   var messageForm = $('#messageForm').submit(sendMessage);
   $('#submitName').click(function() {
      name = $('#name').val();
      nickName = $('#nicknameEntry').val();
      $('#hidden-form').hide()
      $('#nicknameField').val(nickName)
   });

   function meta(name) {
      var tag = document.querySelector('meta[name=' + name + ']');
      if (tag != null){
         return tag.content;
      }
      return '';
   }

   function sendMessage(event) {
      // prevent the page from redirecting
      event.preventDefault();

      // get the parameters
      var nickname = $('#nicknameField').val();
      var message = $('#messageField').val();


      // send it to the server
      $.post('/' + meta('roomID') + '/messages', {nickname : nickname, message : message}, function(res){
         if(res.statusR != "success"){
            alert("could not send message to serve");
         } else{
            $('#messageField').val('');
            getMessages();
         }
      });
   }

   function getMessages(){
      var ul = $('#message-list');
      $.get('/'+meta('roomID')+'/messages', function(res){
         var messages = res.messages;
         for(var i = 0; i < (messages.length); i++){
            var li = $('<li></li>');
            if(messages[i]["id"] > id){
               id = messages[i]["id"]
               li.append("<div class='user-response'><div class='message-text'><p>" + messages[i]["body"]+"</p></div><div class='message-nickname'><h3>"+messages[i]["nickname"]+"</h3></div></div>");
            ul.prepend(li);
            }
         }
      });
   }



   $('#submitName').mouseover(function(){
      $(this).css('background-color', '#D1820B');
   });

   $('#submitName').mouseleave(function(){
      $(this).css('background-color', '#FF9E0D');
   });



//Socket SHIT
   var socket = io.connect();

   socket.on('messageName', function(param1, param2){

   });
   var users = [];
   io.sockets.on('connection', function(socket){
      users.push(socket);
      //clients emit this when they join new rooms
      socket.on('join', function(roomName, nickname, callback){
         //this is a socket.io method
         socket.join(roomName);
         //
         socket.nickname = nickname;
      });

      socket.on('disconnect', function(){
         var idx = users.indexOf(socket);
         users.splice(idx, 1);
      })

   });

//sending events in the reverse works the exact same way just call socket.emit()







// <li>
// <div class="user-response">
// <div class="message-text">
// <p>Text</p>
// </div>
// <div class="message-nickname">
// <h3>Username</h3>
// </div>
// </div>
// </li>

});