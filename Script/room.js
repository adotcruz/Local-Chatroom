$(document).ready(function() {
   var name, nickName;
   var socket = io.connect();

   // setInterval(getMessages, 3000);
   var messageForm = $('#messageForm').submit(sendMessage);
   $('#submitName').click(function() {
      name = $('#name').val();
      nickName = $('#nicknameEntry').val();
      $('#hidden-form').hide();
      $('#nickname-container').prepend("<h4>My nickname is  "+ nickName+ "</h4>")
      $('#nicknameField').val(nickName);
      $('#submitButtonRm').prop('disabled', false);
      socket.emit('join', meta('roomID'), nickName, function(messages){
         displayMessages(messages);
      });
      socket.emit('getUsers', meta('roomID'), nickName, function(users){
         displayUsers(users);
      })
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
      var message = $('#messageField').val();
      $('#messageField').val('')
      socket.emit('message', message);
   }


   function displayMessages(messages){
      var ul = $('#message-list');
      for(var i = 0; i < (messages.length); i++){
         var li = $('<li></li>');
         li.append("<div class='user-response'><div class='message-text'><p>" + 
            messages[i]["body"]+"</p></div><div class='message-nickname'><h5 id='messagetime'>" + messages[i]["time"]  +
            "</h5><h3 id='messagenick'>"+messages[i]["nickname"]+"</h3></div></div>");
         ul.prepend(li);
      }
   }

   function displayUsers(users){
      var ul = $('#nickname-list');
      for( var i = 0; i < (users.length); i++){
         if(users[i]["nickname"] != nickName){
            var li = $('<li id="nicknames-li"></li>');
            li.append("<p>"+ users[i]["nickname"]+"</p>");
            ul.append(li);
         }
      }
   }


   $('#submitName').mouseover(function(){
      $(this).css('background-color', '#D1820B');
   });

   $('#submitName').mouseleave(function(){
      $(this).css('background-color', '#FF9E0D');
   });



//Socket SHIT
   // socket.emit('nickname', nickname);

   socket.on('newMessage', function(nickname, message, time){
      var ul = $('#message-list');
      var li = $('<li></li>');
      if(nickname === nickName){
         li = $('<li id="currentuser"></li>');
         li.append("<div class='current-user-response'><div class='message-text'><p>" + 
         message+"</p></div><div class='message-nickname'><h5 id='messagetime'>"+ 
         time+ "</h5><h3 id='messagecurrnick'>"+nickname+"</h3></div></div>");
      } else {
         li.append("<div class='user-response'><div class='message-text'><p>" + 
         message+"</p></div><div class='message-nickname'><h5 id='messagetime'>"+ 
         time+ "</h5><h3 id='messagenick'>"+nickname+"</h3></div></div>");
      }
      ul.prepend(li);
   });

   socket.on('newUser', function(nickname){
      if(nickname != nickName){
         var ul = $('#nickname-list');
         var li = $('<li id="nicknames-li"></li>');
         li.append("<p>"+ nickname +"</p>");
         ul.append(li);
      }
   });


   socket.on('removeUser', function(nickname){
      var listItems = $('#nicknames-li p');
      listItems.each(function(idx, li){
         var current = $(li);
         var nameToDelete = current.html();
         // console.log(current.html());
         if(nickname === nameToDelete){
            current.remove();
         }
      });
   });
   // socket.on('membershipChanged', function(members){

   // });


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