//Desenvolvido por Leandro M. Loureiro -->
//Linkedin - www.linkedin.com/in/leandro-loureiro-9921b927

//Script responsável por carregar uma lista de comunicados em um página de webparts
    
    function CarregaComunicados(listName, parametro){

        //URL Site 
        var URL = _spPageContextInfo.webAbsoluteUrl;
    
        var htmlComunicados = [];
    
        $.ajax({
    
            //URL REST e API
            url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items" + parametro,
            //Operação GET
            method: "GET",
            contentType: "application/json;odata=verbose",
            //Tipo de retorno JSON
            headers: { "Accept": "application/json;odata=verbose" },
            //sincrona
            async: false,
    
            success: function (data) {
                $.each(data.d.results, function (index, item) {
    
                htmlComunicados.push('<li class="row link content">'); 
                htmlComunicados.push('<div class="col-md-4">');
                htmlComunicados.push('<a href="#"></a>');
                //Retrona URL da imagem do comunicado
                var ulrImagem = CarregaImagem(item.ID, "Comunicados");

                htmlComunicados.push(ulrImagem);
                htmlComunicados.push('</a>');
                htmlComunicados.push('</div>');
    
                htmlComunicados.push('<div class="col-md-8">');
                htmlComunicados.push('<h2>'+item.Title+'</h2>');
                htmlComunicados.push('<span>'+item.categoriaComunicado+'</span>');
                htmlComunicados.push('<p>'+item.Resumo+'</p>');
                htmlComunicados.push('<a href="Comunicado-interno.aspx?ComunicadoID='+item.ID+'"" class="leia-mais">Leia mais</a>');
                htmlComunicados.push('</div>');
    
            })
    
            document.getElementById('comunicados').innerHTML = htmlComunicados.join('');
             
            //Carrega Paginação
            carregarPaginacao(htmlComunicados);
            
            //Inicializa Paginação
            InicializarPaginacao();
    
            },
    
            //Exibe alert caso ahaja algum erro
            error: function (err) {
                alert("Ocorreu um erro" + JSON.stringify(err));
            }
    
    
        });

    }
    
//Função retorna a imagem do comunicado, que é armazenada em um campo de Publicação
function CarregaImagem(idNoticia, listName) {

    var ulrImagem = "";

        $.ajax({

            //URL REST e API
            url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items("+idNoticia+")/FieldValuesAsHtml",
            
            //Operação GET
            method: "GET",
            contentType: "application/json;odata=verbose",
            //Tipo de retorno JSON
            headers: { "Accept": "application/json;odata=verbose" },
            //sincrona
            async: false,
            
            success: function (data) {
                
                //Informa a url da imagem do comunicado
                ulrImagem = data.d.Imagem;

            },


            //Exibe um alert caso ocorra um erro
            error: function (err) {
                alert("Ocorreu um erro" + JSON.stringify(err));
            }


        });

    //Retorna a URL da Imagem
    return ulrImagem;
}
    