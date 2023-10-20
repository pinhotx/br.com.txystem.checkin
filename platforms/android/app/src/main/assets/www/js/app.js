
document.addEventListener('DOMContentLoaded', function() {
  options={
    startingTop: '0%',
    endingTop:"0.5%"
  }
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, options);
});

$(document).ready(function(){
  $("body").fadeOut(0);
    $("body").fadeIn(1000);

    pegarUsernow();
    criarEti();
    criarOrc();
    $('.sidenav').sidenav();
    $('.fixed-action-btn').floatingActionButton();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.datepicker').datepicker();
    
  });

  //Abre o banco -> WebSQL caso esteja no navegador, SQLite no celular
  function abrirBanco(){
    // if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //   var db = sqlitePlugin.openDatabase({name: 'Contas'});
    //   M.toast({html: "Banco aberto no celular"});
    // }else{
      var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
      console.log("Banco aberto no Navegador");
    // }
    return db;
  }

$("select").change(function(){
  $(".appendEti").html("");
  var op=$(this).val();
  if(op==0){

    var conteudo = '<div class="input-field col s12">'
    $(".appendEti1").append(conteudo);
    $(".appendEti2").append(conteudo);
    $(".appendEti3").append(conteudo);

    conteudo ='<input type="text" class="et1 validate">'
    $(".appendEti1").append(conteudo);
    conteudo ='<input type="text" class="et2 validate">'
    $(".appendEti2").append(conteudo);
    conteudo ='<input type="text" class="et3 validate">'
    $(".appendEti3").append(conteudo);


    conteudo ='<label for="nomeEti">Nome da Etiqueta</label></div>'
    $(".appendEti1").append(conteudo);
    $(".appendEti2").append(conteudo);
    $(".appendEti3").append(conteudo);

  }
});

$(".fechar").click(function(){
  $('.appendEti').html('');

});



$('.dropdown-button').dropdown();

function pegarUsernow(){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);


db.transaction(function(tx){

  tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
    if(results.rows.length!=0){
      var dbResultado = results.rows.item(0);
      var nome = dbResultado.nome;
      var email = dbResultado.email;
      $('#nomeUser').text(dbResultado.nome);
      $('#emailUser').text(dbResultado.email);
    }else{
      return;
    }


  });
});

}

function criarOrc(){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
      tx.executeSql("CREATE TABLE IF NOT EXISTS orcamentos(id INTEGER NOT NULL, idUser INTEGER, idEti INTEGER, idConta INTEGER, nomeorc VARCHAR, tipo INTEGER, meta numeric(10,2), saldo numeric(10,2), porcentagem numeric (10,2), data DATETIME, CONSTRAINT PK_ORCAMENTOS PRIMARY KEY(id), CONSTRAINT UN_ORCAMENTOS UNIQUE(id))");

  });
}

function pegarData(){
  var d = new Date;

  var dia = d.getDate();
  var mes = d.getMonth();
  var ano = d.getFullYear();
  var hora = d.getHours();
  var min = d.getMinutes();
  var sec = d.getSeconds();
  var str="0"

  mes = mes+1;
  dia=dia.toString();
  mes=mes.toString();
  hora=hora.toString();
  min=min.toString();
  sec=sec.toString();

  if(dia.length==1){
    dia=str.concat(dia)

  }
  if(mes.length==1){
    mes=str.concat(mes)
  }
  if(hora.length==1){
    hora=str.concat(hora)

  }
  if(min.length==1){
    min=str.concat(min)

  }
  if(sec.length==1){
    sec=str.concat(sec)

  }


  var data = ano+"-"+mes+"-"+dia+" "+hora+":"+min+":"+sec;


  return (data);
}

//atualização do saldo do orçamento
//*lembrar de atualizar despesas 2 vezes
function attOrc(etiqueta,idConta, valor, saldo, att){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){

    tx.executeSql("SELECT * FROM orcamentos",[],function(tx,results){
      var i,total,porcentagem;


      for(i=0;i<results.rows.length;i++){

          if(idConta==results.rows.item(i).idConta){


            porcentagem = saldo*100/results.rows.item(i).meta
            tx.executeSql("UPDATE orcamentos SET saldo=?, porcentagem=? WHERE id=?",[saldo,porcentagem ,results.rows.item(i).id], function(){

            });
          }

            if(etiqueta == results.rows.item(i).idEti){

              total = results.rows.item(i).saldo + valor
              porcentagem = total*100/results.rows.item(i).meta

              tx.executeSql("UPDATE orcamentos SET saldo=?, porcentagem=? WHERE id=?",[total,porcentagem,results.rows.item(i).id], function(){

              });
            }

      }

    })

  },null, function(){
    if(att==1){
    location.reload(function(){});
    }
  })



}

function getEtiqueta(tipo){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
      if(tipo==0){

        tx.executeSql("SELECT * FROM etiquetas",[],function(tx,results){

          var total = results.rows.length
          var i;

          for(i=1;i<total;i++){
            if(results.rows.item(i).tipo!=3){
              var conteudo;
              conteudo="<option value="+results.rows.item(i).id+">"+results.rows.item(i).nome+"</option>"
              $(".eti0").append(conteudo);
            };
          }
        });
      }else{
        tx.executeSql("SELECT * FROM etiquetas WHERE tipo=?",[tipo],function(tx,results){
          var total = results.rows.length
          var i;

          var conteudo;
          conteudo="<option value="+0+">"+'outros'+"</option>"
          conteudo+="<option selected value="+1+">"+'geral'+"</option>"
          switch(tipo){
            case 1:$(".eti1").append(conteudo); break;
            case 2:$(".eti2").append(conteudo); break;
            case 3:$(".eti3").append(conteudo); break;
          }


          for(i=0;i<total;i++){

            var conteudo;
            conteudo="<option value="+results.rows.item(i).id+">"+results.rows.item(i).nome+"</option>"
            $(".eti0").append(conteudo);
            switch(tipo){
              case 1:{$(".eti1").append(conteudo);break;}
              case 2:{$(".eti2").append(conteudo);break;}
              case 3:{$(".eti3").append(conteudo);break;}
            }

          }


        });
      };
    },null,function(){
      $('select').formSelect();
      return 0;
    })



}

function criarEti(){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS etiquetas (id INTEGER NOT NULL, nome VARCHAR, tipo INTEGER, CONSTRAINT PK_ETIQUETAS PRIMARY KEY(id), CONSTRAINT UN_ETIQUETAS UNIQUE(id))",[],function(tx){
      tx.executeSql("SELECT * FROM etiquetas",[],function(tx,results){
        if(results.rows.length==0){
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('comum', 0)")

          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('alimentação', 2)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('investimento', 1)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('salário', 1)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('presente', 1)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('lazer', 2)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('contas', 2)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('carteira', 3)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('conta corrente', 3)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('poupança', 3)")
          tx.executeSql("INSERT INTO etiquetas (nome, tipo) VALUES ('conta investimento', 3)")
        }
      })
    })
  })
}

function excluirOrcConta(id){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
      tx.executeSql("DELETE FROM orcamentos WHERE idConta = ?", [id], function(){
        location.reload();
        M.toast({html:"Conta Deletada com sucesso"});
      })
  });
}
