//Desenvolvido por Leandro M. Loureiro -->
//Linkedin - www.linkedin.com/in/leandro-loureiro-9921b927

//Script monta a página interna de uma única notícia
//Possui funções de gostei (curtir), comentário e compartilhar a exemplo do Facebook

//URL do Site
var URL = _spPageContextInfo.webAbsoluteUrl;


//Função busca usuário logado
function UsuarioLogado() {

    var idUsuarioLogado = "";

    $.ajax({
        url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/currentuser",
        type: "GET",
        headers: { "Accept": "application/json;odata=verbose" },

        async: false,

        success: function (data) {

            idUsuarioLogado = data.d.Id;

        },


        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }
    });

    //Retona o Id do Usuário logado
    return idUsuarioLogado;

}


function Noticia() {

    var parametro = '?$filter=ID eq ' + idNoticia;

    var categoria = CarregarNoticia('Noticias', parametro);

    parametro = "?$filter=Categoria_x0020_noticia eq " + "'" + categoria + "'" + "&$top=5";

    CarregarNoticiaRelacionadas('Noticias', parametro, idNoticia);

    CarregarEditorias();

    carregarGostei(idNoticia);
}



function CarregarNoticia(listName, parametro) {

    //URL Site Superior
    //var URL = _spPageContextInfo.webAbsoluteUrl;

    var categoria = "";

    var htmlNoticia = [];

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
        //Preenchimento de scopes
        success: function (data) {
            //$scope.noticias = data.d.results

            $.each(data.d.results, function (index, item) {

                if(item.allowComments === true)
                {
                    var htmlBotaoComenatrio = []
                    htmlBotaoComenatrio.push('<a id="btn-comentar" class="comentar" href="#">Comentar</a>');

                    document.getElementById("permitir-comentario").innerHTML = htmlBotaoComenatrio.join();


                }
            
                var dataNoticia = item.Data_x0020_e_x0020_hora_x0020_de.split('T')[0].split('-').reverse().join('/');

                htmlNoticia.push('<h1>' + item.Title + '</h1>');
                htmlNoticia.push('<span>' + item.Categoria_x0020_noticia + ' - </span>');
                htmlNoticia.push('<span> ' + dataNoticia + ' </span>');

                htmlNoticia.push('<p>' + item.Conteudo + '</p>');
                categoria = item.Categoria_x0020_noticia;
            })

            document.getElementById('noticia').innerHTML = htmlNoticia.join('');

            if(data.d.results.length === 1)
            {
                
               
                CarregarComentarios('Comentários sobre Notícias',parametroComentario)

            }


        },

    });
    return categoria;
}


function CarregarNoticiaRelacionadas(listName, parametro, idNoticia) {

    //URL Site Superior
    //var URL = _spPageContextInfo.webAbsoluteUrl;

    var htmlNoticia = [];

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
        //Preenchimento de scopes
        success: function (data) {
            //$scope.noticias = data.d.results

            if (data.d.results.length == 0 || data.d.results.length == 1) {
                htmlNoticia.push('<span>* Nenhuma notícia relacionada.</span>');


            }

            if (data.d.results.length > 0) {

                $.each(data.d.results, function (index, item) {

                    if (item.ID != idNoticia) {

                        htmlNoticia.push('<li class="row">');
                        htmlNoticia.push('<div class="col-md-4">');
                        htmlNoticia.push('<a href="#">');
                        var ulrImagem = CarregaImagem(item.ID, "Noticias");
                        htmlNoticia.push(ulrImagem);
                        htmlNoticia.push('</a>');
                        htmlNoticia.push('</div>');
                        var dataNoticia = item.Data_x0020_e_x0020_hora_x0020_de.split('T')[0].split('-').reverse().join('/');
                        htmlNoticia.push('<div class="col-md-8">');
                        htmlNoticia.push('<h2>' + item.Title + ' </h2>');

                        htmlNoticia.push('<span>' + item.Categoria_x0020_noticia + ' - ' + dataNoticia + '</span>');
                        htmlNoticia.push('<p>' + item.Resumo + '</p>');
                        htmlNoticia.push('<a href="Noticia-interna.aspx?NoticiaID=' + item.ID + '"" class="leia-mais">Leia mais</a>');
                        htmlNoticia.push('</div>');
                        htmlNoticia.push('</li>');
                    }


                })

            }

            document.getElementById('noticias-relacionadas').innerHTML = htmlNoticia.join('');

        },

    });


}


function CarregaImagem(idNoticia, listName) {

    //URL Site Superior
    //var URL = _spPageContextInfo.webAbsoluteUrl;

    var ulrImagem = "";

    //noticias.forEach(function (a) {

    $.ajax({

        //URL REST e API
        //url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items("+a.Id+")/FieldValuesAsHtml",
        url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items(" + idNoticia + ")/FieldValuesAsHtml",

        //Operação GET
        method: "GET",
        contentType: "application/json;odata=verbose",
        //Tipo de retorno JSON
        headers: { "Accept": "application/json;odata=verbose" },
        //sincrona
        async: false,
        //Preenchimento de scopes
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

function controlesRedesSociais() {
    var htmlComponentesRedesSociais = [];

    var htmlGostei = [];

    var liControlesRedesSociais = document.getElementById("controles-redes-sociais");

    var queryStringNoticia = location.search;
    var idNoticia = parseInt(queryStringNoticia.split("NoticiaID=").pop());

    htmlComponentesRedesSociais.push('<a href="#" id="link-compartilhar" class="compartilhar" data-social-action="share" data-social-noticiaId="' + idNoticia + '" data-social-value="">Compartilhar</a>');

    liControlesRedesSociais.innerHTML = htmlComponentesRedesSociais.join('');



}

function carregarGostei() {

    var parametro = '?$filter=noticiaId eq ' + idNoticia;

    var htmlGostei = [];

    var coutCurtidas = [];

    var liGostei = document.getElementById("gostei");

    liGostei.innerHTML = "";

    $.ajax({

        //URL REST e API
        url: URL + "/_api/web/lists/getbytitle('Curtidas Sobre Notícias')/items" + parametro,
        //Operação GET
        method: "GET",
        contentType: "application/json;odata=verbose",
        //Tipo de retorno JSON
        headers: { "Accept": "application/json;odata=verbose" },
        //sincrona
        async: false,
        //Preenchimento de scopes
        success: function (data) {


            if (data.d.results.length > 0) {


                htmlGostei.push('<a class="gostei" title="curtir" href="#" value="' + data.d.results[0].curtidas + '" id="' + data.d.results[0].Id + '">Gostei (' + data.d.results[0].curtidas + ')</a>');
                liGostei.innerHTML = htmlGostei.join('');

            }

            if (data.d.results.length === 0) {


                htmlGostei.push('<a class="gostei" title="curtir" href="#" value="0" id="' + idNoticia + '">Gostei (0)</a>');
                liGostei.innerHTML = htmlGostei.join('');

            }



        },

    });


}

//Atualiza a contagem da quantidade de gostei (curtidas) e inseri na lista um novo item a cada curtida
function AtualizarGostei(idGostei, curtir, countGostei) {

    //Id do item gostei relacionada a noticai
    var idNoticiaGostei = parseInt(idGostei);

    var parametro = '?$filter=noticiaId eq ' + idNoticia;
    
    //Quantidade de gostei (curtidas)
    var contagemCurtir = parseInt(countGostei);

    
    //Não contém nenhuma curtida
    if (contagemCurtir === 0) {

        //Função incluil a primeira curtida
        IncluirPrimeiraCurtida(idNoticia);

        //Altera o botão gostei
        $(".gostei").attr("title", "descurtir");

        //Função carrega a curtida
        carregarGostei();

    }

    if (contagemCurtir > 0) {

        //Possui nenhuma curtida
        if (curtir === "curtir") {
            contagemCurtir = contagemCurtir + 1;
            $(".gostei").attr("title", "descurtir");

        }

        //Já vem carregada com a quantidade de curtidas
        if (curtir === "descurtir") {
            contagemCurtir = contagemCurtir - 1;
            $(".gostei").attr("title", "curtir");


        }


        $.ajax({
            url: URL + "/_api/web/lists/getbytitle('Curtidas Sobre Notícias')/items(" + idNoticiaGostei + ")",
            //Metódo Post inclui o gostei (curtida) na lista
            type: "POST",
            data: JSON.stringify({
                '__metadata': { 'type': 'SP.Data.AcoesRestaurantesListItem' },
                //ID da notícia que recebeu gostei
                'noticiaId': idNoticia,
                //Atualiza o quantidade de curitdas
                'curtidas': contagemCurtir,
                //Id do usuário logado que clicou em gostei
                'usuarioId': idUsuarioLogado


            }),

            headers: {
                "Accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"

            },

            success: function (data) {
                //Grava em log do navegador caso a curtida seja atualizada
                console.log("Curtida atualizada com sucesso.");

                carregarGostei();

            },

            error: function (err) {
                alert("Ocorreu um erro" + JSON.stringify(err));
            }

        })

    }


}

//Função para incluir a primeira curtida (botão gostei)
function IncluirPrimeiraCurtida(idNoticia) {



    $.ajax({
        url: URL + "/_api/web/lists/getbytitle('Curtidas Sobre Notícias')/items",
        type: "POST",
        data: JSON.stringify({
            '__metadata': { 'type': 'SP.Data.AcoesRestaurantesListItem' },
           //ID da notícia que recebeu gostei
           'noticiaId': idNoticia,
           //Atualiza o quantidade de curitdas
           'curtidas': contagemCurtir,
           //Id do usuário logado que clicou em gostei
           'usuarioId': idUsuarioLogado



        }),

        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },

        success: function (data) {
            //Grava em log do navegador caso a curtida seja inserida
            console.log("Curtida enviada sucesso com sucesso.");


        },

        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }



    })


}


//Função responsável por adiconar o comentário da notícia na lista 
function AdicionarComentario(listName) {

    var comentario = $("#comentario").val();
    
    var parametro = "?$filter=ID eq " +idNoticia;

    var idUsuarioLogado = parseInt(UsuarioLogado());

    $.ajax({
        url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items"+parametro,
        type: "POST",
        data: JSON.stringify({
            '__metadata': { 'type': 'SP.Data.ComentariosNoticiasListItem' },
            //Cometário digitado pelo usuário
            'comentario': comentario,
            //Id da notícia que recebeu o comentário
            'noticiaId': idNoticia,
            //Id do usuário logado que digitou o comentário
            'usuarioId': idUsuarioLogado
           
        }),

        headers: {
            "Accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },

        success: function (data) {
            //Grava no logo caso comentário seja enviado
            console.log("Comentário enviado com sucesso.");

            //Logo após realizar o comentário, são exibidos todos os comentários da respectiva notícia
            CarregarComentarios('Comentários sobre Notícias', parametroComentario);

            $("#comentario").val("");
            


        },

        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }



    })

}

//Função carrega todos os comentários da rescpectiva notícias
function CarregarComentarios(listName, parametro) {

    var htmlCardapioRJ = [];

    $.ajax({

        //URL REST e API
        url: URL + "/_api/web/lists/getbytitle('" + listName + "')/items" + parametro,
        //Operação GET
        method: "GET",
        contentType: "applicati/_api/web/listson/json;odata=verbose",
        //Tipo de retorno JSON
        headers: { "Accept": "application/json;odata=verbose" },
        
        async: false,

        success: function (data) {

            //Se o resultado da lista não tiver nenhum comentário, inseri a mensagem
            if (data.d.results.length === 0) {
                htmlCardapioRJ.push('<span>* Nenhum comentário.</span>');
            }

            if (data.d.results.length > 0) {
                htmlCardapioRJ.push('<div class="comentarios">');
                htmlCardapioRJ.push('<ul>');


                $.each(data.d.results, function (index, item) {

                    //Converte a data do comentário. Trata para o padrão Brasil-PT (Ex: 20/10/2019)
                    var dataComentario = item.datacomentario.split('T')[0].split('-').reverse().join('/');
    
                    htmlCardapioRJ.push('<li>');
                    htmlCardapioRJ.push('<p>');
                    //Nome do usuário que fez o comentário
                    htmlCardapioRJ.push('<strong>' + item.usuario.Title + '</strong>');

                    htmlCardapioRJ.push('<br>');

                    //Concatenda data do comentário e o comentário em si
                    htmlCardapioRJ.push('<span class="data-comentario">Comentou em ' + dataComentario + '</span> <strong>' + item.comentario + '</strong>');
                    htmlCardapioRJ.push('</p>');
                    htmlCardapioRJ.push('</li>');


                })


                htmlCardapioRJ.push('</ul>');

            }

            
            document.getElementById('comentarios').innerHTML = htmlCardapioRJ.join('');


        },

        //Exibe alerta caso ocorra algum erro
        error: function (err) {
            alert("Ocorreu um erro" + JSON.stringify(err));
        }


    });


    return htmlCardapioRJ;

}






