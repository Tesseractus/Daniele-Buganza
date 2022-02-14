//Is used to create every time the links into the menu to redirect into the gallery with a specific category name
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
//Is used to create every time the links into the menu to redirect into the gallery with a specific subcategory, but maintaining the same category
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
//Is used to create link for the pubblications into the menu
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
//Is used to load images based on the category and subcategory into the gallery section
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
//Is used to populate the homepage gallery
async function loadHomeGallery(){
    let jsnHGData=await fetch("data/HomeGallery.json").then(e => e.json());
    let jsnWorks=await fetch("data/Works.json").then(e => e.json());
    let SelectedW=[];
    for(const x of jsnHGData){
        SelectedW.push(jsnWorks[x]);
    }
    createHomeGalleryDiv(SelectedW);
}
//Is used to load the pubblication content and show it on the section pubblication
async function loadSelectedPubblication(name){
    let jsnPubblications=await fetch("data/Pubblications.json").then(e => e.json());
    createPubblicationDiv(jsnPubblications.find(element => element.name=name));
}
//Is used to randomize the biography picture every time we load the page
async function loadRandomPic(){
    let randomPic= await fetch("data/Pics.json").then(e=> e.json()).then(e => e[e.length*Math.random() | 0]);
    let image=document.createElement("img");
    image.setAttribute("id","image");
    image.setAttribute("src","pics/"+randomPic);
    let container= document.getElementById("frontface");
    container.appendChild(image);

}