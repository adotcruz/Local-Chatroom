

$(document).ready(function() {

   $('#crtRm').click(function() {
      $.get('/newRoom', function(res) {
         window.location = "/" + res.roomId;
      });
   });

   $('#crtRm').mouseover(function(){
      $(this).css('background-color', '#94D699');
   });

   $('#crtRm').mouseleave(function(){
      $(this).css('background-color', '#a5efab');
   });


   $('#submitFindRm').mouseover(function(){
      $(this).css('background-color', '#4E17EB');
   });

   $('#submitFindRm').mouseleave(function(){
      $(this).css('background-color', '#5519FF');
   });

   $('#submitFindRm').click(function() {
   		var roomNum = $('#findRm').val();
   		roomNum.toUpperCase();
   		$.post('/checkRoom', {roomId : roomNum}, function(res){
   			if(res.room === true){
   				window.location = "/" + $('#findRm').val();
   			} else{
   				alert("this room does not exist, try another room id");
   			}
   		})
   });

});