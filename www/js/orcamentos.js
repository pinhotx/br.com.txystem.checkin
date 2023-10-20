
$(document).ready(function(){
    getOrc();
    $('.money2').mask("##000000000.00", {reverse: true});
    $('select').formSelect();
    $('.dropdown-trigger').dropdown();
});

//exclusão de conta
$('#orcamentos').on("click", ".btn-del-item", function(){
  //pega o pai desse elemento onde está contida a flag que armazena o id do banco
    var id = $(this).parents().attr('flag');
    excluirOrcamento(id);

});

//Adicionar novo Orçamento
$('#addOrc').click(function(){

  //get data
  var nome=$('#nomeorc').val();
  var tipo = $('#tipoconta').val();
  var meta = $('#metaorc').val();
  var saldo = 0;

  var data=pegarData()

  var idEx = $(".tipoconta").val();

   //insert data
   if((nome=="")||(meta=="")||(tipo=="")){
    M.toast({html:"Todos os campos devem estar preenchidos!!"});
   }else{
    criarOrcamento(nome, tipo, meta, saldo, data, idEx);
   }
     
 });


//Detalhes orçameto e atualização
$('#orcamentos').on("click", ".card-content", function(){
  var id = $(this).attr('flag');
  $("#tipoOut").fadeOut(10);
  $("#attOrc").fadeOut(10);
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx ,results){

    var modalInstance = M.Modal.getInstance($('#modaldetalhes'));
    modalInstance.open();
    tx.executeSql("SELECT * FROM orcamentos WHERE id=?" ,[id], function(tx, results){
      $('#nomeatt').val(results.rows.item(0).nomeorc);
      $('#tipoatt').val(results.rows.item(0).tipo);
      $('#metaatt').val(results.rows.item(0).meta);
      $('#saldoatt').val(results.rows.item(0).saldo);


    });
  });

  $('#attOrc').click(function(){
    var nome = $('#nomeatt').val();
    var tipo = $('#tipoatt').val();
    var meta =$('#metaatt').val();
    var saldo=$('#saldoatt').val();
    var idExtra = $(".tipoatt").val();


  setOrcamento(id,nome,tipo,meta,saldo,idExtra);
  });
});
$('.editar').click(function(){
  $("#tipoOut").fadeIn();
  $("#attOrc").fadeIn();
});



$(".select").change((function(){

  var op=$(this).val();
  var id=$(this).attr('id');
  if(op==1){

    selectConta(id)
  }else{if(op==2){

    selectDesp(id)
  }else{

    $(".rm").html(" ");
    $(".rm").remove();
  }

  }
}));

$(".fechar").click(function(){

 location.reload();

});

//FUNÇÕES

function criarOrcamento(nome, tipo, meta, saldo, data, idExtra){
  var idEti, idConta;
  idEti=0;
  idConta=0;
  var porcentagem = saldo*100/meta;
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM usernow",[],function(tx,results){
     var idUs=results.rows.item(0).id;
     if(tipo==1){
      idConta = idExtra;

     }else{
       if(tipo==2){
        idEti = idExtra;
       }
     }

     tx.executeSql("INSERT INTO orcamentos(idUser,nomeorc,tipo,meta,saldo,porcentagem,data,idConta,idEti) VALUES(?,?,?,?,?,?,?,?,?)",[idUs,nome,tipo,meta,saldo,porcentagem,data,idConta,idEti],function(){
      if(idConta!=0){
          tx.executeSql("SELECT * FROM contas WHERE id=?",[idConta],function(tx,results){
            var eti,val;
            var att=1;
            attOrc(eti,results.rows.item(0).id,val,results.rows.item(0).saldo,att);


            M.toast({html:"Orçamento criado com sucesso"})
          });
        }else{

          location.reload(function(){});
          M.toast({html:"Orçamento criado com sucesso"})
      }
     });

   });
  });

}


//Altera os dados de um orçamento na tabela e retorna a mensagem de sucesso, também usado para atualizar o orçamentos
//quando uma despesa ou receita nova é adicionada envolvendo
function setOrcamento(id,nome,tipo,meta,saldo,idExtra){
  var idEti, idConta;
  idEti=0;
  idConta=0;

  if(tipo==1){
    idConta = idExtra;

   }else{
     if(tipo==2){
      idEti = idExtra;
     }
   }

  var porcentagem = saldo*100/meta;
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql("UPDATE orcamentos SET nomeorc=?, tipo=?, meta=?, saldo=?, porcentagem=?, idConta=?,idEti=? WHERE id=?", [nome, tipo,meta,saldo,porcentagem,idConta,idEti, id], function(tx, results){
      location.reload();
      M.toast({html:"Orçamento Atualizada com sucesso"});
      console.log(results);
      });
  });
}


//Cria a tabela se não existir e mostra os dados inseridos em forma de cards
function getOrc(){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);

  db.transaction(function(tx){
    tx.executeSql('SELECT * FROM usernow',[],function(tx, results){


    tx.executeSql("SELECT * FROM orcamentos WHERE idUser = ?",[results.rows.item(0).id], function(tx, results){

      var total = results.rows.length;
        var i=0;
        var type;
        var icone;

      for( i=0; i<total; i++){
        type = results.rows.item(i).tipo;

        switch(type) {
          case 1:
              icone = 'account_balance_wallet';
              break;
          case 2:
              icone = 'attach_money';
              break;
      }
        var conteudo;
        conteudo = '<div class= "col s12">';
        conteudo += '<div class="card">';
        conteudo += '<div href="#modaldetalhes" class="card-content" flag="'+results.rows.item(i).id+'">';
        conteudo += '<p><i class="waves-circle material-icons prefix">'+icone+'</i><b>'+results.rows.item(i).nomeorc+'  </b>';//</p>
        conteudo += '<b class="right">Meta: R$'+results.rows.item(i).meta+'     Saldo: R$'+results.rows.item(i).saldo+'</b></p>';
        var porcentagem = parseInt(results.rows.item(i).porcentagem)
        conteudo += '<b class="right ">'+porcentagem+'%</b>'
        conteudo += '<div class="progress">';
        conteudo += '<div class="determinate" style="width: '+results.rows.item(i).porcentagem+'%"></div>';
        conteudo += '</div>'
        conteudo += '<a href="#!" class="btn-floating halfway-fab red darken-1 btn-del-item"><i class="material-icons">delete</i></a>';
        conteudo += '</div>';
        conteudo += '</div>';
        conteudo += '</div>';
        $('#orcamentos').append(conteudo);
      }
    });
  });
});
}

//Deleta o Orçamento da tabela e retorna uma mensagem de êxito
function excluirOrcamento(id){
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
      tx.executeSql("DELETE FROM orcamentos WHERE id = ?", [id], function(){
        location.reload();
        M.toast({html:"Conta Deletada com sucesso"});
      })
  });
}

function selectConta(id){
  $(".rm").html(" ");
  $(".rm").remove();
  var db = abrirBanco();
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM contas",[],function(tx,results){
      var tot = results.rows.length
      var contador
      var conteudo= "<div class='rm input-field col s12 m6'>"
      conteudo += "<select class='"+id+"'>"
      conteudo += "<option disabled value=''></option>"
      for (contador=0;contador<tot;contador++){
        conteudo += "<option value="+results.rows.item(contador).id+">"+results.rows.item(contador).nomeconta+"</option>"

      }

    conteudo += "</select>"
    conteudo += "<label>Bancos</label>"
    conteudo += "</div>"
    if(id=='tipoconta'){
      $(".modCriar").append(conteudo);
    }else{
      $(".modAtt").append(conteudo);
    }

    $("."+id+"").formSelect();
  })

  })
  $("."+id+"").formSelect();
}

function selectDesp(id){

  $(".rm").html(" ");
  $(".rm").remove()
  // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  var db = abrirBanco();
  db.transaction(function(tx){
    tx.executeSql("SELECT * FROM etiquetas WHERE tipo=2",[],function(tx,results){
      var tot = results.rows.length
      var contador
      var conteudo= "<div class='rm input-field col s12 m6'>"
      conteudo += "<select class='"+id+"'>"
      conteudo += "<option value='0'>geral</option>"
      for (contador=0;contador<tot;contador++){
        conteudo += "<option value="+results.rows.item(contador).id+">"+results.rows.item(contador).nome+"</option>"

      }

    conteudo += "</select>"
    conteudo += "<label>Etiqueta</label>"
    conteudo += "</div>"

    if(id=='tipoconta'){
      $(".modCriar").append(conteudo);
    }else{
      $(".modAtt").append(conteudo);
    }
    $("."+id+"").formSelect();
  })

  })
  $("."+id+"").formSelect();
}
