//Usato solamente per leggere lo stato degli attributi nel URL, in base al nome
function getUrlVariable(name){
    const box= new URLSearchParams(window.location.search);
    return box.get(name);
}
//Funzione che permette di accedere all'area nascosta login
function goToLogin(title){
    if (title.getAttribute("steps")=="0000"){
        window.location.href ="/login";
    }else{
        title.setAttribute("steps", title.getAttribute("steps")+0);
    }

}
//Funzione che attiva i dropdown disattivati a causa di un bug
function contactsActivation(){
    $(document).ready(function() {
        $(".dropdown-toggle").dropdown();
        console.log("--> Dropdown Activated");
    });
}
//Funzione che reindirizza alla pagina instagram
function redirectToInstagram (){
    window.location.href = "https://www.instagram.com/sydbughi/";
}
//Funzione che cambia il nome al titolo del menù in base al constesto
function changeMenuName(){
    let menuTitle=document.getElementById("menuTitle");
    if(getUrlVariable("subcategories")==null){
        menuTitle.innerText=getUrlVariable("categories");
    }else{
        menuTitle.innerText=getUrlVariable("subcategories");
    }
   
}
//Funzione intermedia che popola la galleria nelle pagine categorie e sottocategorie
//Prende un array di immagini già filtrate in base a categoria e sottocategoria
function patternGallery(arrayImages){
     /* populate the page with works */
     VDCounter=[];
     for(var x of arrayImages){
        
        if(x.orientation=="vertical"){
            if(VDCounter.length==3){
                createVDiv(VDCounter);
                VDCounter=[];
            }
            VDCounter.push(x);
        }else{
            createHDiv(x);
        }
        
    }
    createVDiv(VDCounter);
}
//Funzione che permette l'anteprima a tutto schermo delle opere su cui ci si clicca
function OpenModal(a){
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("modalImg");
    var captionText = document.getElementById("caption");
    modal.style.display = "flex";
    modalImg.src = a.src;
    captionText.innerHTML = a.getAttribute('a');
}
//Funzione che chiude l'anteprima a tutto schermo
function CloseModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = 'none';
}


/*-------------------------DIV CREATORS-----------------------------*/
//popola i div con immagini verticali nella galleria
function createVDiv(verticalImages){
    let presenter=document.getElementById('presenter');
    VerticalDiv=document.createElement("div");
    VerticalDiv.setAttribute('class','VDiv');
    for(const x of verticalImages){
        let work=document.createElement("img");
        work.setAttribute('src', "gallery/"+x.source);
        work.setAttribute('class',"verticalWork");
        work.setAttribute("a",x.name);
        work.setAttribute("onClick","OpenModal(this)");
        work.setAttribute("load","lazy");
        VerticalDiv.appendChild(work);
    }
    presenter.appendChild(VerticalDiv);
}

//Popola i div con un'immagine verticale nella galleria
function createHDiv(horizontalImage){
    let presenter=document.getElementById('presenter');
    HorizontalDiv=document.createElement("div");
    HorizontalDiv.setAttribute('class','HDiv');
    let work=document.createElement("img");
    work.setAttribute('src', "gallery/"+horizontalImage.source);
    work.setAttribute('class',"horizontalWork");
    work.setAttribute("a",horizontalImage.name);
    work.setAttribute("onClick","OpenModal(this)");
    work.setAttribute("load","lazy");
    HorizontalDiv.appendChild(work);
    presenter.appendChild(HorizontalDiv);
}
//Popola il div della pubblicazione prendendo in entrata il nome della pubblicazione
function createPubblicationDiv(pubblication){
    let presenter=document.getElementById('presenter');
    pubblicationDiv=document.createElement("div");
    pubblicationDiv.setAttribute("id","pubblicationDiv");
    pubblicationDiv.setAttribute("class","d-flex justify-content-center");
    let cover=document.createElement("img");
    cover.setAttribute("id","coverPubblication");
    cover.setAttribute("src","pubblications/"+pubblication.cover);
    let title=document.createElement("h1");
    title.innerHTML=pubblication.name;

    let containerDescription=document.createElement("div");
    containerDescription.setAttribute("id","containerDescription");
    
    let textDescritpion=document.createElement("p");
    textDescritpion.setAttribute("id","textDescription");
    textDescritpion.innerHTML=pubblication.description;
    containerDescription.appendChild(title);
    containerDescription.appendChild(textDescritpion);

    let linkShop=document.createElement("a");
    linkShop.setAttribute("id","linkShop");
    linkShop.setAttribute("href",pubblication.linkShop);
    linkShop.innerHTML="Acquista";

    presenter.appendChild(pubblicationDiv);
    pubblicationDiv.appendChild(cover);
    pubblicationDiv.appendChild(containerDescription);
    pubblicationDiv.appendChild(linkShop);

    let backface=document.getElementById("backface");
    backface.innerHTML=pubblication.description;

}
//Popola il mosaico con le immagini della homepage
function createHomeGalleryDiv(selectedW){
    let contenitor=document.getElementById("Mosaic");
    let counter=1;
    for(const x of selectedW){
        let block=document.createElement("div");
        block.setAttribute("class","ph"+counter++);
        let work=document.createElement("img");
        work.setAttribute("src",'gallery/'+x.source);
        work.setAttribute("class","Art");
        work.setAttribute("a",x.name);
        work.setAttribute("onClick","OpenModal(this)");
        work.setAttribute("load","lazy");

        block.appendChild(work);
        contenitor.appendChild(block);
    }
}