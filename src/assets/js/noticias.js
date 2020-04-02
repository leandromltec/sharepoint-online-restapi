//Desenvolvido por Leandro M. Loureiro -->
//Linkedin - www.linkedin.com/in/leandro-loureiro-9921b927

//Script responsável por carregar uma lista de notícias em um página de webparts

//URL do site
var URL = _spPageContextInfo.webAbsoluteUrl;


/* Carrega as Notícias no carregamento da página */
function CarregarNoticias(listName, parametro) {

   
    var htmlNoticias = [];

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

                htmlNoticias.push('<li class="row link content">');
                htmlNoticias.push('<div class="col-md-4">');
                htmlNoticias.push('<a href="#"></a>');
                //Busca o campo Imagem Destaque (campo de Publicação)
                var ulrImagem = CarregaImagem(item.ID, "Noticias");
                htmlNoticias.push(ulrImagem);
                htmlNoticias.push('</a>');
                htmlNoticias.push('</div>');

                htmlNoticias.push('<div class="col-md-8">');
                htmlNoticias.push('<h2>' + item.Title + '</h2>');
                //Formata campo Data de Publicação
                var dataNoticia = item.Data_x0020_e_x0020_hora_x0020_de.split('T')[0].split('-').reverse().join('/');
                htmlNoticias.push('<span>' + item.Categoria_x0020_noticia + ' ' + dataNoticia + '</span>');
                htmlNoticias.push('<p>' + item.Resumo + '</p>');
                htmlNoticias.push('<a href="Noticia-interna.aspx?NoticiaID=' + item.ID + '"" class="leia-mais">Leia mais</a>');
                htmlNoticias.push('</div>');
                htmlNoticias.push('</li>');



            })

          
             document.getElementById('noticias').innerHTML = htmlNoticias.join('');
             
            carregarPaginacao(htmlNoticias);
            InicializarPaginacaoEmMemoria();

            


        },

        //Grava no log do navegador o erro constatado
        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }


    });



}

/* Carrega imagem do campo "Imagem Destaque " da Notícias */
function CarregaImagem(idNoticia, listName) {

    //var URL = _spPageContextInfo.webAbsoluteUrl;

    var ulrImagem = "";

    $.ajax({

        //URL REST e API
        url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items(" + idNoticia + ")/FieldValuesAsHtml",

        //Operação GET
        method: "GET",
        contentType: "application/json;odata=verbose",
        //Tipo de retorno JSON
        headers: { "Accept": "application/json;odata=verbose" },
        //sincrona
        async: false,
        success: function (data) {
            ulrImagem = data.d.Imagem_x005f_x0020_x005f_destaque;

        },



        //Grava no log do navegador o erro constatado
        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }


    });

    return ulrImagem;
}

/* Função do Campo de Busca de Notícias */
function BuscarNoticias(listName, parametro, tituloNoticia) {


    //URL Site Superior
    var URL = _spPageContextInfo.webAbsoluteUrl;

    var htmlNoticias = [];

    $.ajax({

        //URL REST e API
        url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items" + parametro,
        //Operação GET
        method: "GET",
        contentType: "application/json;odata=verbose",
        //Tipo de retorno JSON
        headers: { "Accept": "application/json;odata=verbose" },
       
        async: false,
        
        success: function (data) {

            var resultNoticias = data.d.results;

            //Campo busca a notícia conforme o texto digitado pelo usuário
            //Verifica se contém o texto no título da notícia em alguma posição sendo letras maíusculas ou minúsculas
            var noticiasEncontradas = [];
            resultNoticias.filter(function (noticia) {
                var textoNoticia = noticia.Title.search(tituloNoticia);
                if (textoNoticia != 0) {
                    if (noticia.Title.toLowerCase().search(tituloNoticia.toLowerCase()) !== -1 || noticia.Title.toUpperCase().search(tituloNoticia.toUpperCase()) !== -1) {

                        noticiasEncontradas.push(noticia);
                    }
                }
                
            })

            //Caso existe alguma notícia com o texto digitado, preenche o array com html e valores das notícias
            if (noticiasEncontradas.length > 0) {

                $.each(noticiasEncontradas, function (index, item) {

                    htmlNoticias.push('<li class="row link content">');
                    htmlNoticias.push('<div class="col-md-4">');
                    htmlNoticias.push('<a href="#"></a>');

                    //Busca o campo Imagem Destaque (campo de Publicação)
                    var ulrImagem = CarregaImagem(item.ID, "Noticias");
                    htmlNoticias.push(ulrImagem);
                    htmlNoticias.push('</a>');
                    htmlNoticias.push('</div>');

                    htmlNoticias.push('<div class="col-md-8">');
                    htmlNoticias.push('<h2>' + item.Title + '</h2>');

                    //Formata campo Data de Publicação
                    var dataNoticia = item.dataNoticia.split('T')[0].split('-').reverse().join('/');
                    htmlNoticias.push('<span>' + item.dataNoticia + ' ' + dataNoticia + '</span>');
                    htmlNoticias.push('<p>' + item.Resumo + '</p>');
                    htmlNoticias.push('<a href="Noticia-interna.aspx?NoticiaID=' + item.ID + '"" class="leia-mais">Leia mais</a>');
                    htmlNoticias.push('</div>');

                })

            }

            //Caso não tenha nenhuma notícia com o texto digita, exibe a mensagem e esconde a paginação
            if (noticiasEncontradas.length === 0) {
                htmlNoticias.push('<span style="margin-top:3%">* Nenhuma Notícia encontrada.</span>');
                $("#paginacao").hide();
                
            }

            //Inseri o array com html no ul de notícias na página noticias.html
            document.getElementById('noticias').innerHTML = htmlNoticias.join('');

            //Monta a paginação (paginacao.js)
            carregarPaginacao(htmlNoticias);
            InicializarPaginacaoEmMemoria();


        },



        //Exibe alert caso ocorra um erro
        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }


    });

}