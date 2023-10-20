$(document).ready(function(){
    $('.datepicker').datepicker({
        format : 'dd/mm/yyyy',
        setDefaultDate : true
    });
    $('select').formSelect();
    $('.dropdown-trigger').dropdown();


    $('#add-btn').click(function(){

     //get data
     var id = $('#id').val();
     var nome = $('#nome').val();
     var tipo = $('#tipo').val();

     var descricao = $('#descricao').val();

     //insert data
     var db = abrirBanco();
     // var db = openDatabase('Contas', '1.0', 'ListaContas', 2*1024*1024);
     db.transaction(function(tx){
       tx.executeSql("INSERT INTO contas(id, nome, tipo) VALUES(?,?,?)",[id, nome, tipo], function(){
         alert('Dados inseridos');
         // M.toast({html:"Tarefa adicionada com sucesso"});
       });
     });



   });

  });
