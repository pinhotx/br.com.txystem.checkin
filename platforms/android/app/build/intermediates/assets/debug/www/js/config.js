$(document).ready(function(){
   $('.modal').modal();
   $('.dropdown-trigger').dropdown();
});

$('#notify-config').click(function(){
  var $val_check = $('#notify-checkbox');
  if($val_check.attr('checked')){
    $val_check.removeAttr('checked');

  }else{
    $('#notify-checkbox').attr('checked', 'checked');
    alert("Você ativou as notificações");
    alert($val_check.attr("checked"));
  }

});
