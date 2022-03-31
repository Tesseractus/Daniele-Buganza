//Viene usato per caricare le categorie nel menù quando la funzione viene chiamata
//Necessità di un contenitore con id=categoriesLinks
async function loadCategories(){
    console.log("-> Category links loaded");
    let jsonCategories= await fetch("data/Categories.json").then(e=> e.json());
    for (const x of jsonCategories){
        let textIndex=document.getElementById('categoriesLinks');
        let a=document.createElement('a');
        let linkText=document.createTextNode(x.name);
        a.appendChild(linkText);
        a.href="galleria?categories="+x.name;
        a.className="nav-link";
        textIndex.appendChild(a);
    }
}
//Viene usata per caricare le sottocategorie nel menù quando la funzione viene chiamata.
//Necessità di un contenitore con id=subcategoriesLinks
//Necessitò in input della categoria 
async function loadSubCategories(category){
    console.log("-> Subcategory links loaded");
    let jsnSubcategories= await fetch("data/Subcategories.json").then(e=>e.json());
    for (const x of jsnSubcategories){
        let subLinks=document.getElementById('subcategoriesLinks');
        if(x.category==category){
        let a=document.createElement('a');
        let linkText=document.createTextNode(x.name);
        a.appendChild(linkText);
        a.href="galleria?categories="+x.category+"&subcategories="+x.name;
        a.className="nav-link";
        subLinks.appendChild(a);
        }
    }
}
//Viene usata per caricare nel menù i link che indirizzano alle pubblicazioni
//Necessità di un contenitore nel menù con id=pubblicationsLinks
async function loadPubblications(){
    console.log("-> Pubblications links loaded");
    let jsonPubblications= await fetch("data/Pubblications.json").then(e=> e.json());
    let pubLinks=document.getElementById("pubblicationsLinks");
    for(const x of jsonPubblications){
        let a=document.createElement('a');
        let linkText=document.createTextNode(x.name);
        a.appendChild(linkText);
        a.href="pubblicazioni?name="+x.name;
        a.className="nav-link";
        pubLinks.appendChild(a);
    }
}
//Viene usata per caricare le opere nella pagina galleria
//Necessità in input la categoria e la sottocategoria
//-- In caso non si specifica la sottocategoria carica in base alla categoria
async function loadGallery(category, subcategory){
    if(category != null){
        /* populate the page categories */
        let jsnWorks = await fetch("data/Works.json").then(e=>e.json());
        /* placing top the last works, and bottom the oldest */
        jsnWorks=jsnWorks.reverse();
        let imagesFiltered= [];

        if(subcategory == null){
            console.log("->Load images to categories");
            for(const x of jsnWorks){
                if(x.category==category){
                    imagesFiltered.push(x);
                }
            }
        }else{
            /* populte the page subcategories */
            console.log("->Load images to subcategories");
            for(const x of jsnWorks){
                if(x.subcategory==subcategory && x.category==category){
                    imagesFiltered.push(x);
                }
            }

        }
        patternGallery(imagesFiltered);
    }
}
//Usato per caricare le opere nella homePage
async function loadHomeGallery(){
    let jsnHGData=await fetch("data/HomeGallery.json").then(e => e.json());
    let jsnWorks=await fetch("data/Works.json").then(e => e.json());
    let SelectedW=[];
    for(const x of jsnHGData){
        SelectedW.push(jsnWorks[x]);
    }
    createHomeGalleryDiv(SelectedW);
}
//Usato per caricare la pubblicazione in base al nome
async function loadSelectedPubblication(name){
    let jsnPubblications=await fetch("data/Pubblications.json").then(e => e.json());
    createPubblicationDiv(jsnPubblications.find(element => element.name=name));
}
//Seleziona in modo casuale un immagine delle foto profilo e le carica nella biografia
async function loadRandomPic(){
    let randomPic= await fetch("data/Pics.json").then(e=> e.json()).then(e => e[e.length*Math.random() | 0]);
    let image=document.createElement("img");
    image.setAttribute("id","image");
    image.setAttribute("src","pics/"+randomPic);
    let container= document.getElementById("frontface");
    container.appendChild(image);

}