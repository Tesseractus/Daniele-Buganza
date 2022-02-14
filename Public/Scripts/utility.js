function getUrlVariable(name){
    const box= new URLSearchParams(window.location.search);
    return box.get(name);
}

async function getImage(name){
    fetch(name).then(r=> r.blob()).then(i => { const iob = URL.createObjectURL(i); return iob});
}

function goToLogin(title){
    if (title.getAttribute("steps")=="0000"){
        window.location.href ="/login";
    }else{
        title.setAttribute("steps", title.getAttribute("steps")+0);
    }

}

function contactsActivation(){
    $(document).ready(function() {
        $(".dropdown-toggle").dropdown();
        console.log("--> Dropdown Activated");
    });
}

function redirectToInstagram (){
    window.location.href = "https://www.instagram.com/sydbughi/";
}

function changeMenuName(){
    let menuTitle=document.getElementById("menuTitle");
    if(getUrlVariable("subcategories")==null){
        menuTitle.innerText=getUrlVariable("categories");
    }else{
        menuTitle.innerText=getUrlVariable("subcategories");
    }
   
}

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
function CloseModal(){
    var modal = document.getElementById("myModal");
    modal.style.display = 'none';
}
function filterSubSelectionAdmin(){
        let someExist=false; //in case not exists subcategories with a specify category
        let select=document.createElement("select");
        select.className="form-select w-100";
        select.name="subcategorySelected";
        subcategories= JSON.parse(document.getElementById("categorySelected").getAttribute("subs"));
        container=document.getElementById("containerSelSubcategory");
        SelectorCat=document.getElementById("categorySelected");
        ButtonConfirm=document.getElementById("confirm");
        let first=true;
        container.innerHTML="";
        for(const x of subcategories){
            if(x.category==SelectorCat.value){ 
                someExist = ((someExist = false) ? false : true);
                var option=document.createElement("option");
                option.text=x.name;
                option.value=x.name;
                if (first){option.selected=true; first=false;}
                select.add(option);
            }
            if(someExist){
                container.appendChild(select);
                ButtonConfirm.disabled=false;
            }else{
                ButtonConfirm.disabled=true;
                container.innerHTML="";
                
            }

        }
        select.required=true;
}

/*-------------------------DIV CREATORS-----------------------------*/
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
        console.log(contenitor);
        contenitor.appendChild(block);
    }
}