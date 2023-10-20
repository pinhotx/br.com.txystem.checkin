var att=1;
$(document).ready(function(){
    getDespesa();
    getContaDesp();
    var tipo = 2;
    getEtiqueta(tipo)
    $('.money2').mask("##0.00", {reverse: true});

   $('.dropdown-trigger').dropdown();
   $('select').formSelect();
});
//ADICIONAR DESPESA

$('#add-btn-despesa').click(function(){
 //get data

 var nome = $('#nomedespesa').val();
 var valor = $('#valordespesa').val();
 valor = valor*(-1);
 var etiqueta = $('.eti2').val();
 var conta = $('#contaDesp').val();

 var data=pegarData()


//insert data
if((nome=="")||(valor=="")){
  M.toast({html:"Todos os campos devem estar preenchidos!!"});
 }else{
  criarDespesa(nome,valor,etiqueta,conta,data);
 }


});



$("#adicionar").click(function(){
  $('select').formSelect();

});


$('#despesas').on("click", ".btn-del-item", function(){
  //pega o pai desse elemento onde está contida a flag que armazena o id do banco
    var idDesp = $(this).parents().attr('flag');
    excluirDespesa(idDesp);
});

$(".editar").click(function(){
  $("#att-btn-despesa").fadeIn();
  $(".desaparecer").fadeIn();

});

//Atualizar contas
$('#despesas').on("click", ".card-content", function(){
  $("#att-btn-despesa").fadeOut(10);
  $(".desaparecer").fadeOut(10);

  var contaAnt;
  var valorAnt;
  var id = $(this).attr('flag');
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);

  db.transaction(function(tx ,results){


    tx.executeSql("SELECT * FROM despesa WHERE id=?" ,[id], function(tx, results){
      console.log(results.rows.item(0).nome);
      $('#valordespatt').val(results.rows.item(0).valor);
      $('#nomedespatt').val(results.rows.item(0).nome);
      contaAnt=results.rows.item(0).contaID
      valorAnt=results.rows.item(0).valor

    });
  });
  $('#att-btn-despesa').click(function(){
    var valor=$('#valordespatt').val();
    var nome = $('#nomedespatt').val();
    var conta = $('#contaDespatt').val();
    var eti = $('#etiquetadespatt').val();
  setDespesa(id,nome,valor,eti,conta,contaAnt,valorAnt);
  });

});

$(".fechar").click(function(){
  location.reload();
})


//FUNÇÕES

function criarDespesa(nome,valor,etiqueta,conta,data){
  var total, saldo;
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
   db.transaction(function(tx){
  if(etiqueta==0){
    var nomeEti=$(".et2").val();
    tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES (?,2)",[nomeEti],function(){
      tx.executeSql("SELECT * FROM etiquetas WHERE nome=?",[nomeEti],function(tx,results){
        etiqueta=results.rows.item(0).id;
        tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
          var idUser=results.rows.item(0).id;
         tx.executeSql("INSERT INTO despesa(nome, idUser, valor, etiquetaID, contaID, data) VALUES(?,?,?,?,?,?)",[nome,idUser, valor, etiqueta, conta, data], function(){
           console.log('Despesa cadastrada com sucesso');
            M.toast({html:"Nova despesa adicionada a conta"});
            tx.executeSql("SELECT * FROM contas WHERE id = ?",[conta], function(tx, results){
              total = results.rows.item(0).saldo;
              total = total+valor;

          tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[total,conta],function(){


            saldo=valor*(-1)

            attOrc(etiqueta,conta,saldo,saldo,att);



          });
        });


         });
       });
      });

    })
  }else{
    tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
      var idUser=results.rows.item(0).id;
     tx.executeSql("INSERT INTO despesa(nome, idUser, valor, etiquetaID, contaID, data) VALUES(?,?,?,?,?,?)",[nome,idUser, valor, etiqueta, conta, data], function(){
       console.log('Despesa cadastrada com sucesso');
        M.toast({html:"Nova despesa adicionada a conta"});
        tx.executeSql("SELECT * FROM contas WHERE id = ?",[conta], function(tx, results){
          total = results.rows.item(0).saldo;
          total = total+valor;
          
      tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[total,conta],function(){
       
      
        saldo=valor*(-1)
  
        attOrc(etiqueta,conta,saldo,saldo,att);
        

        
      });
    });


     });
   });
  }
  


  });


}



function excluirDespesa(idDesp){
  var valor,etiqueta,conta,total;
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM despesa WHERE id = ?',[idDesp],function(tx,results){
      etiqueta = results.rows.item(0).etiquetaID
      var val = results.rows.item(0).valor;
      valor = val * (-1);

      tx.executeSql("SELECT * FROM contas WHERE id = ?",[results.rows.item(0).contaID], function(tx, results){
        total = results.rows.item(0).saldo;
        conta=results.rows.item(0).id
        total=total+valor;

    tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[total,results.rows.item(0).id],);
  });
      tx.executeSql("DELETE FROM despesa WHERE id = ?", [idDesp], function(){
        saldo=valor*(-1)

        attOrc(etiqueta,conta,saldo,total,att);



        M.toast({html:"Despesa retirada"});


      });
  });
});

}
function setDespesa(id,nome,valor,eti,conta,contaAnt,valorAnt){
  var saldo1,saldo2;
  valor=parseInt(valor)
  if(valor>0){
    valor=valor*(-1)
  }

  valorAnt=parseInt(valorAnt)
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql("UPDATE despesa SET nome=?, valor=?, etiquetaID=?, contaID=? WHERE id=?", [nome,valor,eti,conta, id], function(){
      var val;
      val= valorAnt;

      //dar update

      tx.executeSql("SELECT * FROM contas WHERE id = ?",[contaAnt],function(tx,resu){


        saldo1=resu.rows.item(0).saldo-valorAnt;
        tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[saldo1,contaAnt],function(){
        tx.executeSql("SELECT * FROM contas WHERE id=?",[conta],function(tx,resul){

          saldo2=resul.rows.item(0).saldo+valor;

          tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[saldo2,conta],function(){

            att=0;
            attOrc(eti,conta,valor,saldo2,att);
            att=1;
            attOrc(eti,contaAnt,val,saldo1,att);
            M.toast({html:"Conta Atualizada com sucesso"});

          });
        });
      });
      });


      });
  });
}

function getDespesa(){
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx){
      tx.executeSql("CREATE TABLE IF NOT EXISTS despesa(id INTEGER NOT NULL, idUser INTEGER, nome VARCHAR, valor numeric(10,2), etiquetaID INTEGER, contaID INTEGER, data DATETIME, CONSTRAINT PK_DESPESA PRIMARY KEY(id), CONSTRAINT UN_DESPESA UNIQUE(id))");

  });

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
    tx.executeSql("SELECT * FROM despesa WHERE idUser = ?",[results.rows.item(0).id], function(tx, results){
        var total = results.rows.length, i;
      for( i=0; i<total; i++){

        var conteudo;
        conteudo = '<div class= "col s12 m4">';
        conteudo += '<div class="card">';
        conteudo += '<div href="#modaldespesaatt" class="card-content modal-trigger" flag="'+results.rows.item(i).id+'">';
        conteudo += '<p><b>'+results.rows.item(i).nome+'</b>';//<i class="waves-circle prefix material-icons">restaurant</i>
        conteudo += '<b class="right">R$'+results.rows.item(i).valor+'</b></p>';
        conteudo += '<a href="#!" class="btn-floating halfway-fab red darken-1 btn-del-item"><i class="material-icons">delete</i></a>';
        conteudo += '</div>';
        conteudo += '</div>';
        conteudo += '</div>';
        $('#despesas').append(conteudo);
      }
    });
  });
  });
}

function getContaDesp(){
  var c=0;
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM usernow',[],function(tx, results){
    tx.executeSql("SELECT * FROM contas WHERE idUser = ?",[results.rows.item(0).id], function(tx, results){
        var total = results.rows.length, i;
      for( i=0; i<total; i++){
        c=i+1;
        var conteudo;
        conteudo = '<option value="'+results.rows.item(i).id+'">'+results.rows.item(i).nomeconta+'</option>';
        $(conteudo).appendTo(".contaDesp");
      }
    });
  });
  });
}
