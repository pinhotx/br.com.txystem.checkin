$(document).ready(function(){
    formarHistorico();
})


function formarHistorico(){
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM usernow",[],function(tx,resu){
            tx.executeSql("SELECT * FROM (SELECT nome, valor, idUser,data FROM despesa UNION ALL SELECT nome, valor,idUser , data FROM receita) WHERE idUser=? GROUP BY data ORDER BY data ",[resu.rows.item(0).id],function(tx,results){
                var i;
                var conteudo;
                i=results.rows.length
                for(i=results.rows.length-1;i>=0;i--){
    
                    conteudo = "<div class='col s12'>";
                    conteudo += "<div class='card'>";
                    conteudo += "<div class='card-content'"
    
                    if(results.rows.item(i).valor>=0){
                        conteudo += "<p> <b class='flow-text'>Nome: "+results.rows.item(i).nome+"</b>";
                        conteudo += "<b class='right flow-text blue-text text-darken-4'>R$ "+results.rows.item(i).valor+"</b></p>";
                    }else{
                        conteudo += "<p> <b class='flow-text'>Nome: "+results.rows.item(i).nome+"</b>";
                        conteudo += "<b class='right flow-text red-text text-darken-4'>R$ "+results.rows.item(i).valor+"</b></p>";
                    }
    
                    conteudo += "</div></div></div>"
    
                    $('#historico').append(conteudo);
                }
    
            });
        });
        
    })
}//SELECT despesa.valor,despesa.id,despesa.contaID,receita.id,receita.valor,receita.contaID,contas.id,contas.nomeconta FROM contas, d=despesa, r=receita WHERE despesa.contaID = contas.id AND receita.contaID = conta.id GROUP BY data",[],function(tx,results){
