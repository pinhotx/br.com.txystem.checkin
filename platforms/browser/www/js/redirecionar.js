
$(document).ready(function(){
   Usernow();
  });




function Usernow(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    if($("#index").length){
      loged();
    }else{
    db.transaction(function(tx){
      tx.executeSql("CREATE TABLE IF NOT EXISTS usernow(id INTEGER, nome VARCHAR, datanasc VARCHAR, email VARCHAR)",[],function(tx,results){
        tx.executeSql('SELECT * FROM usernow',[], function(tx, results){
          var resul = results.rows.length;
          if(resul == 0){
            window.location.href = "index.html";
          }
        });
      });

      });
    }
}

$('.sair').click(function(){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql('DELETE FROM usernow');
    location.reload();
  });
});

function loged(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
      tx.executeSql("CREATE TABLE IF NOT EXISTS usernow(id INTEGER, nome VARCHAR, datanasc VARCHAR, email VARCHAR)",[],function(tx,results){
        tx.executeSql('SELECT * FROM usernow',[], function(tx, results){
          var resul = results.rows.length;
          if(resul != 0){
            window.location.href = "inicio.html";
          }
        });
      });

      });
}