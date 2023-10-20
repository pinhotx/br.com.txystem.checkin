
$(document).ready(function(){
    $('.datepicker').datepicker({
        format: 'yyyy-mm-dd'
    });
    var data,tipo,etiqueta;
    if($("#inicial").length){
        tipo=2;
        etiqueta=0;

    }else{
        tipo=0;
        etiqueta=0;
    getEtiqueta(tipo);

    }
    grafico(data,tipo,etiqueta);
    $('select').formSelect();

});

$('#DT').change(function(){
    var date=$('#DT').val();
    var tipo=$('#TP').val();
    var etiqueta=$('#ET').val();
    grafico(date,tipo,etiqueta);
});
$('#TP').change(function(){
    var date=$('#DT').val();
    var tipo=$('#TP').val();
    var etiqueta=$('#ET').val();
    $("#ET").html('');
    $("#ET").append("<option value='0'>Geral</option>")
    getEtiqueta(tipo);
    $('select').formSelect();
    grafico(date,tipo,etiqueta);
});
$('#ET').change(function(){
    var date=$('#DT').val();
    var tipo=$('#TP').val();
    var etiqueta=$('#ET').val();
    grafico(date,tipo,etiqueta);
});





function grafico(data,tipo,etiqueta){
    var dat=[];
    var bg=[];
    var black=[];
    var lab=[];
    var id=[];
    var cont;
    if(data==null){

        data= '2000-01-01 00:00:00';
    }else{
        data=data.toString();
        data=data.concat(' 00:00:00');
    };
    var db = abrirBanco();
    // var db = openDatabase('Contas', '1.0', 'Lista Contas', 2*1024*1024);
    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM usernow",[],function(tx,resu){
            tx.executeSql("SELECT * FROM (SELECT nome, valor, etiquetaID, idUser, data FROM despesa UNION ALL SELECT nome, valor, etiquetaID, idUser, data FROM receita) WHERE data>=? AND idUser=? GROUP BY data ORDER BY data ",[data,resu.rows.item(0).id],function(tx,results){
                cont = results.rows.length;
    
                tx.executeSql("SELECT * FROM etiquetas",[],function(tx,res){
                    if(etiqueta==0){
                        var i,c;
                        if(tipo==0){
                            lab[0]='Receitas';
                            lab[1]='Despesas';
                            bg[0]='blue';
                            bg[1]='red';
                            black[0]='black';
                            black[1]='black';
                            black[2]='black';
                            dat[0]=0;
                            dat[1]=0;
    
                        }else{
                            if(tipo==1){
                                var t1=0;
                                black[0]='black';
                            }else{
                            if(tipo==2){
                                var t2=0;
                                black[0]='black';
                            };};
    
                        }
    
                        for(i=0;i<res.rows.length;i++){
                            if((tipo==0)){
                                for(c=0;c<cont;c++){
    
                                    if(results.rows.item(c).etiquetaID==res.rows.item(i).id){
                                        if(results.rows.item(c).valor>=0){
                                            dat[0]+=results.rows.item(c).valor;
    
                                            id[c]=c;
    
                                        }else{
                                            dat[1]+=results.rows.item(c).valor;
                                            id[c]=c;
    
                                        };
                                    };
                                };
                            }else{
                                if((tipo==1)&&((res.rows.item(i).tipo==tipo)||(res.rows.item(i).tipo==0))){
                                    dat[t1]=0;
                                    lab[t1]=res.rows.item(i).nome;
                                    bg[t1]=cor[t1];
                                    black[t1+1]='black';
                                    for(c=0;c<cont;c++){
                                        if((res.rows.item(i).tipo==tipo)&&(results.rows.item(c).etiquetaID==res.rows.item(i).id)||(res.rows.item(i).tipo==0)&&(results.rows.item(c).etiquetaID==res.rows.item(i).id)){
                                            if(results.rows.item(c).valor>=0){
                                                dat[t1] +=results.rows.item(c).valor;
                                                id[c]=c;
    
                                            };
                                        };
                                    };
                                    t1++;
    
                                }else{
                                    if((tipo==2)&&((res.rows.item(i).tipo==tipo)||(res.rows.item(i).tipo==0))){
                                        dat[t2]=0;
                                        lab[t2]=res.rows.item(i).nome;
                                        bg[t2]=cor[t2];
                                        black[t2+1]='black';
                                        for(c=0;c<cont;c++){
                                            if((res.rows.item(i).tipo==tipo)&&(results.rows.item(c).etiquetaID==res.rows.item(i).id)||(res.rows.item(i).tipo==0)&&(results.rows.item(c).etiquetaID==res.rows.item(i).id)){
    
                                                if(results.rows.item(c).valor<0){
                                                    dat[t2]+=results.rows.item(c).valor;
                                                    id[c]=c;
    
                                                };
                                            };
                                        }
                                        t2++
                                    }
                                }
                            };
                        };
                    }else{
    
                        var contador=0;
                        black[0]='black';
    
                        for(var c=0;c<res.rows.length;c++){
    
    
                            if(res.rows.item(c).id==etiqueta){
                                if((res.rows.item(c).tipo!=tipo)&&(tipo!=0)){
                                    M.toast({html:"Etiqueta não correspondente ao tipo selecionado!!"});
                                }else{
                                    for(var c2=0;c2<cont;c2++){
                                        if(results.rows.item(c2).etiquetaID==etiqueta){
                                                dat[contador]=0;
                                                dat[contador]=results.rows.item(c2).valor
                                                lab[contador]=results.rows.item(c2).nome;
                                                bg[contador]=cor[contador];
                                                black[contador+1]='black';
                                                contador++;
                                                id[c2]=c2;
    
                                        };
                                    };
                                };
                            };
                        };
    
                    };
    
                    $('#historico').html("");
    
                    for(var i=0;i<cont;i++){
    
    
                        if(id[i]==i){
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
                        };
    
                    };
    
                });
            });
        });
        
    },null,function(){


        $(".apagar").html("");
        $(".apagar").append("<canvas class='center' id='myChart'></canvas>")
        var ctx = document.getElementById("myChart").getContext('2d');

        data = {
            datasets: [{
                data: dat,
                backgroundColor: bg,
                borderColor: black
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: lab
        };


        var myPieChart = new Chart(ctx,{
            type: 'pie',
            data: data
        });
    });


}
