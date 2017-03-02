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