var id,senhaUser;
$(document).ready(function(){
  $('input#input_text, textarea#textarea2').characterCounter();
  pegarInfos();
   
});

$("#config").on("click",".nome",function(){
  $("#nome").html("");
  var conteudo='<div class="col s12">'
  conteudo+='<div class="input-field col s12">'
  conteudo+='<input id="nomeatt" type="text" class="validate">'
  conteudo+='<a class="waves-effect waves-light right btn nomeatt">Confirmar</a></div>'
  $("#nome").append(conteudo);
  
});
$("#config").on("click",".email",function(){
  $("#email").html("");
  var conteudo='<div class="col s12">'
  conteudo+='<div class="input-field col s12">'
  conteudo+='<input id="emailatt" type="text" class="validate">'
  conteudo+='<a class="waves-effect waves-light right btn emailatt">Confirmar</a></div>'
  $("#email").append(conteudo);
  
});
$("#config").on("click",".senha",function(){
  $("#senha").html("");
  var conteudo='<div class="col s12">'
  conteudo+='<div class="input-field col s12">'
  conteudo+='<input placeholder="senha atual" id="senha-atual" type="password" class="validate"></div>'
  conteudo+='<div class="input-field col s12">'
  conteudo+='<input placeholder="nova senha" id="senha-nova" type="password" class="validate"></div>'
  conteudo+='<div class="input-field col s12">'
  conteudo+='<input placeholder="confirmar senha" id="senha-nova-confirm" type="password" class="validate">'
  conteudo+='<a class="waves-effect waves-light right btn senhaatt">Confirmar</a></div></div>'
  $("#senha").append(conteudo);
  
});

$("#config").on("click",".nomeatt",function(){
  var nome=$("#nomeatt").val();
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql("UPDATE usuario SET nome=? WHERE id=?",[nome,id],function(){
      tx.executeSql("UPDATE usernow SET nome=? WHERE id=?",[nome,id],function(){
        location.reload();
      });
      
    });
  });
  
});

$("#config").on("click",".emailatt",function(){
  var email=$("#emailatt").val();
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql("UPDATE usuario SET email=? WHERE id=?",[email,id],function(){
      tx.executeSql("UPDATE usernow SET email=? WHERE id=?",[email,id],function(){
        location.reload();
      });
      
    });
  });
  
});


$('#config').on("click",".senhaatt",function(){
  //ENTRADAS
  var senhaAtual = $('#senha-atual').val();
  var senhaNova = $('#senha-nova').val();
  var senhaNovaConfirm = $('#senha-nova-confirm').val();
  
  if(senhaAtual==senhaUser){
      if(senhaNova == senhaNovaConfirm){
              //alterarSenha(senhaNova);
              //M.toast({html:"Senha Alterada com Sucesso"});var db = abrirBanco();
              var db = abrirBanco();
              db.transaction(function(tx){
                tx.executeSql("UPDATE usuario SET senha=? WHERE id=?",[senhaNova,id],function(){
                  location.reload();
                });
              });
              
      }else{
          M.toast({html: "As senhas não correspondem"});
      }
  }else{
      M.toast({html: "A senha atual está incorreta"});
  }
});

//FUNÇÕES
function pegarInfos(){
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM usernow",[],function(tx,results){
      tx.executeSql("SELECT * FROM usuario WHERE id=?",[results.rows.item(0).id],function(tx,results){
        var nome=results.rows.item(0).nome;
        var email=results.rows.item(0).email;
        var qtdsenha=results.rows.item(0).senha.length;
        var senha=" ";
        senhaUser=results.rows.item(0).senha;
        id=results.rows.item(0).id;

        var conteudo ='<div class="col s12" id="nome">'
        conteudo+='<p> '+nome+' <a class="waves-effect waves-light right nome btn">Trocar</a></p></div>'

        $('#config').append(conteudo);

        conteudo = '<div class="col s12" id="email">'
        conteudo+='<p> '+email+' <a class="waves-effect waves-light right email btn">Trocar</a></p></div>'

        $('#config').append(conteudo);
        var str="*";
        
        senha=senha.toString();
        
        for(var i=0;i<qtdsenha;i++){
          senha=senha.concat(str)
        }
        
        conteudo='<div class="col s12" id="senha">'
        conteudo+='<p> '+senha+' <a class="waves-effect waves-light right senha btn">Trocar</a></p></div>'

        $('#config').append(conteudo);


      });
    });
  });
}

