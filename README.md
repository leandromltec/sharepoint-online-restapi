# sharepoint-online-restapi

O código possui páginas em html (parte do html) que eram apontadas para webparts do SharePoint online. 
O objetivo era carregar página com notícias e comunicados e mostrar título, resumo, data e imagem. A clicar nas informações, eram
redirecionados para uma nova página interna que possui informações da respectiva notícia ou comunicado.
As informações estão armazenadas em listas Sharepoint e os dados são retornados em REST API que o próprio SharePoint oferece, 
através do metódo GET.

Para construção das páginas foram utilizados HTML e Boostrap, Javascript para tratamento das informações junto do framework JQquery e
os dados são acessados utilizando o REST API.

Na página de notícia interna, é também utilizado o método POST no REST API para que informações pudessem ser incluídas e atualizadas em
determinadas listas. Como exemplo, temos o botão gostei (exemplo do curtir do Facebook) e comentário que utilizam do POST para realizar
ações nas listas.

No código pode ser encontrado:

- REST API SharePoint (GET e Post)
- API SharePoint retorna a informações do usuário logado
- Funções Javascript e JQuery
- Partes de HTML e Boostrap



