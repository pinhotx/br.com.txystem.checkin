$(document).ready(function(){
    dbCadastro();
    dbUsernow();
    $("#datanasc").mask("99/99/9999");
  });

  function dbCadastro(){
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    var db = abrirBanco();
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS usuario(id INTEGER NOT NULL, nome VARCHAR NOT NULL, datanasc VARCHAR NOT NULL, email VARCHAR NOT NULL, senha VARCHAR NOT NULL, pergunta VARCHAR NOT NULL, resposta VARCHAR NOT NULL, CONSTRAINT UN_USUARIO UNIQUE(id), CONSTRAINT PK_USUARIO PRIMARY KEY(id))");
        // , CONSTRAINT UN_USUARIO UNIQUE(id), CONSTRAINT PK_USUARIO PRIMARY KEY(id) NOT NULL IDENTITY(1,1)
    });
}

function dbUsernow(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS usernow(id INTEGER, nome VARCHAR, datanasc VARCHAR, email VARCHAR)");

      });
}

//CADASTRO
$('#btnCadastro').click(function(){

    //get data
    var nome = $('#nomeconta').val();
    var datanasc = $('#datanasc').val();
    var email = $('#email').val();
    var senha = $('#senha').val();
    var pergunta = $("#pergunta").val();
    var resposta = $("#resposta").val();
    //insert data

cadastro(nome,datanasc,email,senha,pergunta,resposta);
});


function cadastro(nome,datanasc,email,senha,pergunta,resposta){
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
     db.transaction(function(tx){
       tx.executeSql("INSERT INTO usuario(nome, datanasc, email, senha, pergunta, resposta) VALUES(?,?,?,?,?,?)",[nome,datanasc,email,senha,pergunta,resposta], function(){

        console.log('Conta cadastrada com sucesso');
          M.toast({html:"Nova conta adicionada a conta"});
         location.reload(function(){

         });

       });
     });
  }
