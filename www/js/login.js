

$("#btnLogin").click(function(){
    //get data
    var name = $('#nomeLog').val();
    var pass = $('#senhaLog').val();

    //insert data

login(name,pass);
});

function login(name,pass){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
     db.transaction(function(tx){
       tx.executeSql("SELECT * FROM usuario WHERE nome = ? OR email = ?",[name,name], function(tx, results){
        var dbsenha = results.rows.item(0).senha;
        var resul = results.rows.item(0);

        if(pass == dbsenha){
            tx.executeSql('INSERT INTO usernow (id,nome,email,datanasc) VALUES(?,?,?,?)',[resul.id,resul.nome,resul.email,resul.datanasc]);
            window.location.href = "inicio.html";
        }
        else{
            M.toast({html: "Usuário ou Senha Incorreto"});
        }

       });
  });
}
