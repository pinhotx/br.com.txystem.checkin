$(document).ready(function(){
    calcularSaldo();
    calcularDespesas();
    getHist();
    $('.money2').mask("##0.00", {reverse: true});
   $('.dropdown-trigger').dropdown();
   var db = abrirBanco();
   // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM contas",[],function(tx,results){
            if(results.rows.length==0){
                var nome="Carteira";
                var tipo=8;
                var saldo=0;
                criarConta(nome, tipo, saldo);
            }
        });
    });
});


//funçõs

function calcularSaldo(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    var resul=0.00;
    $('#saldo').text('R$'+resul);
  db.transaction(function(tx){
      tx.executeSql('SELECT * FROM usernow',[],function(tx,results){
        tx.executeSql('SELECT * FROM contas WHERE idUser = ?',[results.rows.item(0).id],function(tx,results){
            var total=results.rows.length, i;

            for(i=0;i<total;i++){
                resul = resul + results.rows.item(i).saldo;
            }
            $('#saldo').text('R$'+resul);
        });
      });
  });

}

function calcularDespesas(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    var resul=0.00;
    $('#initDesp').text('R$'+resul);
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM usernow',[],function(tx,results){

          tx.executeSql('SELECT * FROM despesa WHERE idUser = ?',[results.rows.item(0).id],function(tx,results){
            var total=results.rows.length, i;

              for(i=0;i<total;i++){
                  resul = resul + results.rows.item(i).valor;
              }
              resul=resul*(-1);
              $('#initDesp').text('R$'+resul);
          });
        });
    });

}

function getHist(){
  var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("select * from receitas")
    })
}
