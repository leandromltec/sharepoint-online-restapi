// Desenvolvido por Leandro M. Loureiro -->
//Linkedin - www.linkedin.com/in/leandro-loureiro-9921b927
//Paginação já usada em projetos anteriores


function InicializarPaginacao()
{
     $( ".pagination li" ).each( function( index, element ){
       $( this ).css("display","block");
        
     if(  parseInt($( this ).text()) >9)
     {
     $( this ).css("display","none");
   
     }
     });
	

}

function carregarPaginacao(arrHTML)
{
    //Limite em 5 itens por paginação
    pageSize = 5;
    pagesCount =$(".content").length;
    
    if(pagesCount ==0)
    	pagesCount =arrHTML.length
    		
    var currentPage = 1;
    $(".contents").html(arrHTML.join(''));
    $(".numeros-paginacao").remove()
    
    var nav = '';
    var totalPages = Math.ceil(pagesCount / pageSize);
     
    
   
    for (var s=0; s<totalPages; s++){
        //Numperação da paginação
        nav += "<li class='numeros-paginacao page-item'><a class='page-link' href='#'>"+(s+1)+"</a></li>";
    }
    $(".pag_prev").after(nav);
    $(".numeros-paginacao").first().addClass("active");
    

    showPage = function() {
        $(".content").hide().each(function(n) {
            if (n >= pageSize * (currentPage - 1) && n < pageSize * currentPage)
                $(this).show();
        });
    }
    showPage();


    $(".pagination li.numeros-paginacao").click(function() {
        $(".pagination li").removeClass("active");
        $(this).addClass("active");
        currentPage = parseInt($(this).text());
        showPage();
    });

    $(".pagination li.pag_prev").click(function() {
        if($(this).next().is('.active')) return;
        $('.numeros-paginacao.active').removeClass('active').prev().addClass('active');
        currentPage = currentPage > 1 ? (currentPage-1) : 1;
        showPage(); 
               	var desincremetador = 8;
        
	     $( ".pagination li" ).each( function( index, element ){
			$( this ).css("display","block");	
			
			if((currentPage -6 ) >  parseInt($( this ).text()) ||  currentPage < parseInt($( this ).text()) )     
				$( this ).css("display","none");
			    
			if( currentPage <=9 &&  parseInt($( this ).text()) <=9)
	      {
	      	$( this ).css("display","block");		      
	      }
	     
		});  
    });

    $(".pagination li.pag_next").click(function() {
        if($(this).prev().is('.active')) return;
        $('.numeros-paginacao.active').removeClass('active').next().addClass('active');
        currentPage = currentPage < totalPages ? (currentPage+1) : totalPages;
        showPage();
        
         $( ".pagination li" ).each( function( index, element ){
        	$( this ).css("display","block");															
	    
	     if((currentPage +6) <  parseInt($( this ).text()))
	     	$( this ).css("display","none");
		     
		 }); 
    });
}
