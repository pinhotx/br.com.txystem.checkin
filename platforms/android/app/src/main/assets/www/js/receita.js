$(document).ready(function(){
    bdReceita();
    getConta();
   var tipo=1
   getEtiqueta(tipo)
});
var flagConta;
//ADICIONAR receita
$('#add-btn-receita').click(function(){
    //get data

    var nome = $('#nomereceita').val();
    var valor = $('#valorreceita').val();
    var etiqueta = $('.eti1').val();
    var conta = $('#contaRec').val();

    var data=pegarData();

     //insert data
     if((nome=="")||(valor=="")){
      M.toast({html:"Todos os campos devem estar preenchidos!!"});
     }else{
      criarReceita(nome,valor,etiqueta,conta,data);
     }
   

   });
   $("#btnReceita").click(function(){
    $('select').formSelect();
  });
  $("#btnTransf").click(function(){
    $('select').formSelect();
  });
  $("#btnConta").click(function(){
    $('select').formSelect();
  });

  $('#contas').on("click", ".card-content", function(){
    flagConta=$(this).attr('flag');
  });
  //receitas
  $("#btnReceitas").click(function(){
    mostrarReceitas(flagConta);
  });

  //excluir receitas do modal
  $(".fechar").click(function(){
    $("#receitas").html("");
  });

  //excluir a receita
  $("#receitas").on("click",".btn-del-item",function(){
    var idRec=$(this).parents().attr('flag');
    excluirReceita(idRec);
  });


  $(".editar").click(function(){
    $("#att-btn-receita").fadeIn();
  });

  //Atualizar contas
  $('#receitas').on("click", ".card-content", function(){
    $("#att-btn-receita").fadeOut(10);
    var contaAnt;
    var valorAnt;
    var id = $(this).attr('flag');
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    M.Modal.getInstance($('#modalatualizar')).close();
    db.transaction(function(tx ,results){


      tx.executeSql("SELECT * FROM receita WHERE id=?" ,[id], function(tx, results){
        console.log(results.rows.item(0).nome);
        $('#valorrecatt').val(results.rows.item(0).valor);
        $('#nomerecatt').val(results.rows.item(0).nome);
        contaAnt=results.rows.item(0).contaID
        valorAnt=results.rows.item(0).valor

      });
    });
    $('#att-btn-receita').click(function(){
      var valor=$('#valorrecatt').val();
      var nome = $('#nomerecatt').val();
      var conta = $('#contaRecatt').val();
      var eti = $('#etiquetarecatt').val();
    setReceita(id,nome,valor,eti,conta,contaAnt,valorAnt);
    });

  });

  $(".fechar").click(function(){
    location.reload();
  })

//FUNÇÕES


function bdReceita(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS receita(id INTEGER NOT NULL, idUser INTEGER, nome VARCHAR, valor numeric(10,2), etiquetaID INTEGER, contaID INTEGER, data DATETIME, CONSTRAINT PK_DESPESA PRIMARY KEY(id), CONSTRAINT UN_DESPESA UNIQUE(id))");

    });
}

function criarReceita(nome,valor,etiqueta,conta,data){
  var tot;
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
 if(etiqueta==0){
   var nomeEti=$(".et1").val();
   tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES (?,1)",[nomeEti],function(){
     tx.executeSql("SELECT * FROM etiquetas WHERE nome=?",[nomeEti],function(tx,results){
       etiqueta=results.rows.item(0).id;
       tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
        var idUser=results.rows.item(0).id;
       tx.executeSql("INSERT INTO receita(nome, idUser, valor, etiquetaID, contaID, data) VALUES(?,?,?,?,?,?)",[nome,idUser, valor, etiqueta, conta, data], function(){
         console.log('Receita cadastrada com sucesso');
          M.toast({html:"Nova despesa adicionada a conta"});
          tx.executeSql("SELECT * FROM contas WHERE id = ?",[conta], function(tx, results){
            var total = results.rows.item(0).saldo;

            tot = parseFloat(total);
            totv = parseFloat(valor);
            tot = tot+totv;
        tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[tot,conta],function(){
          etiqueta=null
          valor=null
          var att=1;
          attOrc(etiqueta,conta,valor,tot,att);
        });
      });


       });
     });
      })
    })
  }else{
    tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
      var idUser=results.rows.item(0).id;
     tx.executeSql("INSERT INTO receita(nome, idUser, valor, etiquetaID, contaID, data) VALUES(?,?,?,?,?,?)",[nome,idUser, valor, etiqueta, conta, data], function(){
       console.log('Receita cadastrada com sucesso');
        M.toast({html:"Nova despesa adicionada a conta"});
        tx.executeSql("SELECT * FROM contas WHERE id = ?",[conta], function(tx, results){
          var total = results.rows.item(0).saldo;
          
          tot = parseFloat(total);
          totv = parseFloat(valor);
          tot = tot+totv;
      tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[tot,conta],function(){
        etiqueta=null
        valor=null
        var att=1;
        attOrc(etiqueta,conta,valor,tot,att);
      });
    });
       

     });
   });
  }
});

}

function getConta(){
    var c=0;
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM usernow',[],function(tx, results){
      tx.executeSql("SELECT * FROM contas WHERE idUser = ?",[results.rows.item(0).id], function(tx, results){
          var total = results.rows.length, i;
        for( i=0; i<total; i++){
          c=i+1;
          var conteudo;
          conteudo = '<option value="'+results.rows.item(i).id+'">'+results.rows.item(i).nomeconta+'</option>';
          $(conteudo).appendTo("#contaRec");
          $(conteudo).appendTo("#contaRecatt");
          $(conteudo).appendTo("#contatransf1");
          $(conteudo).appendTo("#contatransf2");
        }
      });
    });
    });
  }

function mostrarReceitas(flagConta){
  
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
      tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
      tx.executeSql("SELECT * FROM receita WHERE idUser = ?",[results.rows.item(0).id], function(tx, results){
          var total = results.rows.length, i,tem;
          tem=0;
          for( i=0; i<total; i++){
          if(flagConta==results.rows.item(i).contaID){
            tem=1;

            var conteudo;
            conteudo = '<div class= "col s12 m4">';
            conteudo += '<div class="card">';
            conteudo += '<div href="#modalreceitaatt" class="card-content modal-trigger" flag="'+results.rows.item(i).id+'">';
            conteudo += '<p><b>'+results.rows.item(i).nome+'</b>';//<i class="waves-circle prefix material-icons">restaurant</i>
            conteudo += '<b class="right">R$'+results.rows.item(i).valor+'</b></p>';
            conteudo += '<a href="#!" class="btn-floating halfway-fab red darken-1 btn-del-item"><i class="material-icons">delete</i></a>';
            conteudo += '</div>';
            conteudo += '</div>';
            conteudo += '</div>';
            $('#receitas').append(conteudo);
            

          }
        }
        if(tem==0){
          M.toast({html:"Esta conta não possui receitas"})
        }

      });
    });
    });

}

function excluirReceita(idRec){
  var valor,etiqueta,conta,total;
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM receita WHERE id = ?',[idRec],function(tx,results){
      etiqueta = results.rows.item(0).etiquetaID
      valor = results.rows.item(0).valor;

      tx.executeSql("SELECT * FROM contas WHERE id = ?",[results.rows.item(0).contaID], function(tx, results){
        total = results.rows.item(0).saldo;
        conta  =results.rows.item(0).id
        total=total-valor;

    tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[total,results.rows.item(0).id],);
  });
      tx.executeSql("DELETE FROM receita WHERE id = ?", [idRec], function(){
        saldo=valor*(-1)
        var att=1;
        attOrc(etiqueta,conta,saldo,total,att);



        M.toast({html:"Receita retirada"});


      });
  });
});

}

function setReceita(id,nome,valor,eti,conta,contaAnt,valorAnt){
  var saldo1,saldo2;
  valor=parseInt(valor)
  valorAnt=parseInt(valorAnt)
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql("UPDATE receita SET nome=?, valor=?, etiquetaID=?, contaID=? WHERE id=?", [nome,valor,eti,conta, id], function(){
      var val;
      val= valorAnt*(-1)

      //dar update

      tx.executeSql("SELECT * FROM contas WHERE id = ?",[contaAnt],function(tx,resu){


        saldo1=resu.rows.item(0).saldo-valorAnt;
        tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[saldo1,contaAnt],function(){
        tx.executeSql("SELECT * FROM contas WHERE id=?",[conta],function(tx,resul){

          saldo2=resul.rows.item(0).saldo+valor;

          tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[saldo2,conta],function(){

            var att=0;
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
