$(document).ready(function(){
    getContas();
    var tipo = 3;
    getEtiqueta(tipo)

    $('.money2').mask("##000000000.00", {reverse: true});
   $('select').formSelect();
   $('.dropdown-trigger').dropdown();
});




//exclusão de conta
$('#contas').on("click", ".btn-del-item", function(){
  //pega o pai desse elemento onde está contida a flag que armazena o id do banco
    var id = $(this).parents().attr('flag');
    excluirContas(id);
});

$(".editar").click(function(){
  $("#att-btn").fadeIn();
  $("#btnReceitas").fadeOut();
})

//Atualizar contas
$('#contas').on("click", ".card-content", function(){
  $("#att-btn").fadeOut(10);
  $("#btnReceitas").fadeIn(10);
  var id = $(this).attr('flag');
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx ,results){

    var modalInstance = M.Modal.getInstance($('#modalatualizar'));
    modalInstance.open();
    tx.executeSql("SELECT * FROM contas WHERE id=?" ,[id], function(tx, results){
      console.log(results.rows.item(0).nomeconta);
      $('#nomeatt').val(results.rows.item(0).nomeconta);
      $('#tipoatt').val(results.rows.item(0).tipo);
      $('#saldoatt').val(results.rows.item(0).saldo);

    });
  });
  $('#att-btn').click(function(){
    var saldo=$('#saldoatt').val();
  var nome = $('#nomeatt').val();
  var tipo = $('#tipoatt').val();

  setContas(id,nome,tipo,saldo);
  });

});

//Adicionar nova Conta
$('#add-btn').click(function(){

  //get data
  var saldo=$('#saldoconta').val();
  var nome = $('#nomeconta').val();
  var tipo = $('#tipoconta').val();

   //insert data
   if((saldo=="")||(nome=="")){
    M.toast({html:"Todos os campos devem estar preenchidos!!"});
   }else{
    criarConta(nome, tipo, saldo);
   }

     //criarConta(nome, tipo, saldo);
 });

//Funções

 //Insere uma conta na tabela e retorna a mensagem de sucesso
function criarConta(nome, tipo, saldo){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
 if(tipo==0){
   var nomeEti=$(".et3").val();
   tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES (?,3)",[nomeEti],function(){
     tx.executeSql("SELECT * FROM etiquetas WHERE nome=?",[nomeEti],function(tx,results){
       tipo=results.rows.item(0).id;
       tx.executeSql("SELECT * FROM usernow",[],function(tx,results){
        var idUs=results.rows.item(0).id;
       tx.executeSql("INSERT INTO contas(idUser, nomeconta, tipo, saldo) VALUES(?,?,?,?)",[idUs,nome, tipo, saldo], function(){
         location.reload();
         M.toast({html:"Conta criada com sucesso"});
       });
      });
     });
    });
  }else{
    tx.executeSql("SELECT * FROM usernow",[],function(tx,results){
      var idUs=results.rows.item(0).id;
     tx.executeSql("INSERT INTO contas(idUser, nomeconta, tipo, saldo) VALUES(?,?,?,?)",[idUs,nome, tipo, saldo], function(){
       location.reload();
       M.toast({html:"Conta criada com sucesso"});
     });
    });
  }
});



}

//Altera os dados de uma conta na tabela e retorna a mensagem de sucesso
function setContas(id,nome,tipo,saldo){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql("UPDATE contas SET nomeconta=?, tipo=?, saldo=? WHERE id=?", [nome, tipo,saldo, id], function(tx, results){
      var etiqueta,valor
      var att=1;
      attOrc(etiqueta,id,valor,saldo,att)
      M.toast({html:"Conta Atualizada com sucesso"});
      console.log(results);
      });
  });
}

//Cria a tabela se não existir e mostra os dados inseridos em forma de cards
function getContas(){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
      tx.executeSql("CREATE TABLE IF NOT EXISTS contas(id INTEGER NOT NULL, idUser INTEGER, nomeconta VARCHAR, tipo INTEGER, saldo numeric(10,2), CONSTRAINT PK_CONTAS PRIMARY KEY(id), CONSTRAINT UN_CONTAS UNIQUE(id))");

  });

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM usernow',[],function(tx, results){

    tx.executeSql("SELECT * FROM contas WHERE idUser = ?",[results.rows.item(0).id], function(tx, results){
        var total = results.rows.length, i;
        var type;
        var icone;
      for( i=0; i<total; i++){
        type = results.rows.item(i).tipo;

        switch(type) {
          case 1:
              icone = 'account_balance_wallet';
              break;
          case 2:
              icone = 'account_balance';
              break;
          case 3:
              icone = 'work';
              break;
      }
        var conteudo;
        conteudo = '<div class= "col s12 m4">';
        conteudo += '<div class="card">';
        conteudo += '<div href="#modalatualizar" class="card-content" flag="'+results.rows.item(i).id+'">';
        conteudo += '<p><b>'+results.rows.item(i).nomeconta+'</b>';//</p>
        conteudo += '<b class="right">R$'+results.rows.item(i).saldo+'</b></p>';
        conteudo += '<a href="#!" class="btn-floating halfway-fab red darken-1 btn-del-item"><i class="material-icons">delete</i></a>';
        conteudo += '</div>';
        conteudo += '</div>';
        conteudo += '</div>';
        $('#contas').append(conteudo);
      }
    });
  });
});
}

//Deleta a Conta da tabela e retorna uma mensagem de êxito
function excluirContas(id){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
      tx.executeSql("DELETE FROM contas WHERE id = ?", [id], function(){
        excluirOrcConta(id)
        M.toast({html:"Conta Deletada com sucesso"});
      })
  });
}
