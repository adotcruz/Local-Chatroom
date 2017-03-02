

$(document).ready(function() {

   $('#crtRm').click(function() {
      $.get('/newRoom', function(res) {
         window.location = "/" + res.roomId;
      });
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