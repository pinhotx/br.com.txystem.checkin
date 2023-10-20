
$('#btnConfTransf').click(function(){
    var valor = $('#valortransf').val();
    var conta1 = $('#contatransf1').val();
    var conta2= $('#contatransf2').val();


     //insert data
   transferir(valor,conta1,conta2);
});

function transferir(valor,conta1,conta2){
    var total,tot,totv;
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
  db.transaction(function(tx ,results){
      tx.executeSql('SELECT * FROM contas WHERE id = ?',[conta1],function(tx,results){
          total=results.rows.item(0).saldo;

          tot = parseFloat(total);
          totv = parseFloat(valor);
          tot=tot-totv;
        tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[tot,conta1],function(){
            tx.executeSql('SELECT * FROM contas WHERE id = ?',[conta2],function(tx,results){
            total = results.rows.item(0).saldo;

            tot = parseFloat(total);
            totv = parseFloat(valor);
            tot=tot+totv;
              tx.executeSql('UPDATE contas SET saldo = ? WHERE id = ?',[tot,conta2],function(){
                location.reload(function(){

                });
              });
      });
  });

});
});
}
