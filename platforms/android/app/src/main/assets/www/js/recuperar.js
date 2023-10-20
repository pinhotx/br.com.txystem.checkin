$("#proximo").click(function(){
    var name=$("#nomeRecu").val();
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
     db.transaction(function(tx){
       tx.executeSql("SELECT * FROM usuario WHERE email = ?",[name], function(tx, results){
            if(results.rows.length!=0){
                $("#divRecuperar").html("");
                $("#banner").html("");
                $("#botoes").html("");
                var id=results.rows.item(0).id;
                var user=results.rows.item(0).nome;
                var pergunta=results.rows.item(0).pergunta;
                var respostaBD =results.rows.item(0).resposta;
                var resposta,senha;

                var conteudo = "Responda a questão de segurança corretamente:";
                $("#banner").append(conteudo);
                conteudo=pergunta;
                $("#pergunta").append(conteudo);

                conteudo = '<div class="input-field col s12">'
                conteudo += '<i class="material-icons prefix">account_circle</i>'
                conteudo += '<input id="respostaRecu" type="text" class="validate">'
                conteudo += '<label for="respostaRecu">Resposta</label></div>'
                $("#divRecuperar").append(conteudo);

                conteudo = '<button id="proximo2" class="btn img-responsive modal-trigger green darken-4 black-text"><b class="white-text">Próximo</b></button>'
                $("#botoes").append(conteudo);

                $("#botoes").on('click','#proximo2',function(){
                    resposta=$("#respostaRecu").val();

                    if(resposta==respostaBD){
                        $("#divRecuperar").html("");
                        $("#banner").html("");
                        $("#pergunta").html("");
                        $("#botoes").html("");

                        conteudo="Digite uma nova senha:";
                        $("#banner").append(conteudo);

                        conteudo = '<div class="input-field col s12 m6">'
                        conteudo +='<input id="senhaRecu" type="password" class="validate">'
                        conteudo +='<label for="senhaRecu">Senha</label></div>'
                        $("#divRecuperar").append(conteudo);

                        conteudo = "Seu usuário é: "+user+""
                        $("#pergunta").append(conteudo);
                        conteudo = '<button id="salvar" class="btn img-responsive modal-trigger green darken-4 black-text"><b class="white-text">Salvar</b></button>'
                        $("#botoes").append(conteudo);

                    }else{
                        M.toast({html: "Resposta incorreta"});
                    }
                });

                $("#botoes").on('click','#salvar',function(){
                    senha=$("#senhaRecu").val();
                    novaSenha(senha,id);
                });



            }else{
                M.toast({html: "Email não Cadastrado"});
            }
       });
    });
});

function novaSenha(senha,id){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("UPDATE usuario SET senha=? WHERE id=?",[senha,id],function(){
            history.back();
        });
    });
}
