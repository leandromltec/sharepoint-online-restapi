
//Desenvolvido por Leandro M. Loureiro -->
//Linkedin - www.linkedin.com/in/leandro-loureiro-9921b927

//Script responsável por carregar uma página retornando a um comunicado e abaixo dele uma lista de 
//comunicados que possui a mesma categoria


//URL Site Superior
var URL = _spPageContextInfo.webAbsoluteUrl;


function CarregarComunicado(listName, parametro) {

    var categoria = "";

    var htmlComunicado = [];

    $.ajax({

        //listname = Nome da Lista no site SharePoint
        //parametro = possui o id do comunicado 

        //URL REST e API
        url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items" + parametro,
        //Operação GET (retorna os dados da lista confome a consulta)
        method: "GET",
        contentType: "application/json;odata=verbose",
        //Tipo de retorno JSON
        headers: { "Accept": "application/json;odata=verbose" },
        
        async: false,
        

        success: function (data) {

            $.each(data.d.results, function (index, item) {


                htmlComunicado.push('<h1>'+item.Title+'</h1>');
                htmlComunicado.push('<span class="info-noticia">'+item.categoriaComunicado+'</span>');
                htmlComunicado.push('<p>'+item.dataComunicado+'</p>');
                htmlComunicado.push('<p>'+item.Conteudo+'</p>');
                
                //Variavel recebe a categoria do comunicado
                categoria = item.categoriaComunicado;
              
            })

            //Inseri o html concatenado do array htmlComunciado no componete div com ID comunicado
            document.getElementById('comunicado').innerHTML = htmlComunicado.join('');

            parametro = '?$filter=categoriaComunicado eq ' + categoria;

            //Busca Comunicados que sejam da mesma categoria
            CarregarComunicadoRelacionado('Comunicados', parametro)


        },
    
    });
  
}

//Função carrega comunicados que possuem a mesma categoria do comunicado atual
function CarregarComunicadoRelacionado(listName, parametro) {

    var htmlComunicado = [];

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
           
            if(data.d.results.length > 0)
            {

            $.each(data.d.results, function (index, item) {

                //Evita que o comunicado exibido seja listado novamente
                if(item.ID != idComunicado)
                {

                htmlComunicado.push('<li class="row">');
                htmlComunicado.push('<div class="col-md-4">');
                htmlComunicado.push('<a href="#">');

                //Busca a imagem do comunicado e exibe um thumbnail (miniatura de imagem relacionado o comunicado)
                var ulrImagem = CarregaImagem(item.ID, "Comunicados");

                htmlComunicado.push(ulrImagem);
                htmlComunicado.push('</a>');
                htmlComunicado.push('</div>');
                htmlComunicado.push('<div class="col-md-8">');
                htmlComunicado.push('<h2>'+item.Title+'</h2>');
                
                htmlComunicado.push('<span>'+item.dataComunicado+'</span>');
                htmlComunicado.push('<p>'+item.resumo+'</p>');
                htmlComunicado.push('<a href="Comunicado-interna.aspx?ComunicadoID='+item.ID+'"" class="leia-mais">Leia mais</a>');
                htmlComunicado.push('</div>');
                htmlComunicado.push('</li>');
                }


            })

        }

        //Caso não existe nenhum comunicado, exibe a mensagem
        if(htmlComunicado.length == 0)
        {
            htmlComunicado.push('<div class="col-md-8">');
            htmlComunicado.push('<span>* Nenhum Comunicado relacionado.</span>');
            htmlComunicado.push('</li>');

        }

            document.getElementById('comunicados').innerHTML = htmlComunicado.join('');

        },

         //Exibe um alert caso ocorra um erro
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


