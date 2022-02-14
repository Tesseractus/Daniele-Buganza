async function loadAmministrationStatus(name){
    //PRESENTER
    let presenter=document.getElementById("presenter");
    //FORM
    let form=createForm();
    //DIV GROUP
    let group=document.createElement("div");
    group.className="form-group";
    //BUTTON
    let confirmButton=createButtonSubmit("submit","btn btn-primary","Conferma");
    //TYPE
    let typeRequest=createHiddenRequest("typeRequest",name);
    form.appendChild(typeRequest);
    //-----------------------------------------------------------------------------------------
    //READ JSON Categories
    let jsonCategories= await fetch("data/Categories.json").then(e=> e.json());
    //READ JSON Subcategories
    let jsonSubCategories= await fetch("data/Subcategories.json").then(e=> e.json());
    //-----------------------------------------------------------------------------------------
    //DEFINERS
    let selectCategory,nameSubcategory,nameCategory,containerSelSubcategory;

    switch(name){
        case 'addCategory':
            //RESPONSE
            document.getElementById("response").innerHTML="<p>Aggiungi categoria</p>"; 
            //INPUT TEXT
            nameCategory=createInput("text","nameCategory","Nome categoria","form-control","nameCategory");
            //ADD TO HTML
            group.appendChild(nameCategory);
            group.appendChild(confirmButton);
            break;
        case 'modifyCategory':
            //RESPONSE
            document.getElementById("response").innerHTML="<p>Modifica Categoria</p>";
            //INPUT TEXT
            let newNameCategory=createInput("text","newNameCategory","Nuovo Nome","form-control","newNameCategory");
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            //ADD TO HTML
            group.appendChild(selectCategory);
            group.appendChild(newNameCategory);
            group.appendChild(confirmButton);
            break;
        case 'removeCategory':
            //RESPONSE
            document.getElementById("response").innerHTML="<p>Rimuovi categoria</p>";
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            //ADD TO HTML
            group.appendChild(selectCategory);
            group.appendChild(confirmButton);
            break;
        case 'addSubcategory':
            document.getElementById("response").innerHTML="<p>Aggiungi Sottocategoria</p>";
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            nameSubcategory=createInput("text","nameSubcategory","Nome sottocategoria","form-control","nameSubcategory");
            group.appendChild(selectCategory);
            group.appendChild(nameSubcategory);
            group.appendChild(confirmButton);
            break;
        case 'modifySubcategory':
            //RESPONSE
            document.getElementById("response").innerHTML="<p>Modifica sottocategoria</p>";
            //INPUT TEXT
            let newNameSubcategory=createInput("text","newNameSubcategory","Nuovo Nome","form-control","newNameCategory");
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            selectCategory.id=selectCategory.name;
            containerSelSubcategory=document.createElement("div");
            containerSelSubcategory.id="containerSelSubcategory";
            selectCategory.setAttribute("onchange","filterSubSelectionAdmin()");
            selectCategory.setAttribute("subs",JSON.stringify(jsonSubCategories));
            //ADD TO HTML
            group.appendChild(selectCategory);
            group.appendChild(containerSelSubcategory);
            group.appendChild(newNameSubcategory);
            group.appendChild(confirmButton);
            break;
        case 'removeSubcategory':
            //RESPONSE
            document.getElementById("response").innerHTML="<p>Rimuovi sottocategoria</p>";
            //INPUT
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            selectCategory.id=selectCategory.name;
            let container2SelSubcategory=document.createElement("div");
            container2SelSubcategory.id="containerSelSubcategory";
            selectCategory.setAttribute("onchange","filterSubSelectionAdmin()");
            selectCategory.setAttribute("subs",JSON.stringify(jsonSubCategories));
            //ADD TO HTML
            group.appendChild(selectCategory);
            group.appendChild(container2SelSubcategory);
            group.appendChild(confirmButton);
            break;
        case 'addArt':
            //RESPONSE
            document.getElementById("response").innerHTML="<p>Aggiungi opera</p>";
            let inputImage=createInput('file','Opera','Carica opera','form-control','Opera');
            form.setAttribute('enctype','multipart/form-data');
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            selectCategory.id=selectCategory.name;
            containerSelSubcategory=document.createElement("div");
            containerSelSubcategory.id="containerSelSubcategory";
            selectCategory.setAttribute("onchange","filterSubSelectionAdmin()");
            selectCategory.setAttribute("subs",JSON.stringify(jsonSubCategories));
            let nameArt=createInput('text','nameArt','Nome','form-control','nameArt');
            nameArt.required=true;

            group.appendChild(inputImage);
            group.appendChild(selectCategory);
            group.appendChild(containerSelSubcategory);
            group.appendChild(nameArt);
            group.appendChild(confirmButton);


            break;
        case 'removeArt':
            let menu=document.getElementById("indexcolumn");
            selectCategory=createDropDownSelect("form-select w-100","categorySelected",jsonCategories);
            selectCategory.style.marginTop="20px";
            document.getElementById("response").innerHTML="<p>Seleziona una categoria dal menu</p>";
            let containerSub=document.createElement("div");
            containerSub.id="containerSelSubcategory";
            selectCategory.id="categorySelected";
            selectCategory.onchange=function(){
                let someExist=false; //in case not exists subcategories with a specify category
                let select=document.createElement("select");
                select.className="form-select w-100";
                select.name="subcategorySelected";
                select.id="subcategorySelected";
                let subcategories= jsonSubCategories;
                containerSub=document.getElementById("containerSelSubcategory");
                SelectorCat=document.getElementById("categorySelected");
                ButtonConfirm=document.getElementById("confirm");
                let first=true;
                containerSub.innerHTML="";
               
                for(const x of subcategories){
                    console.log(x.category,SelectorCat.value);
                    if(x.category==SelectorCat.value){ 
                        
                        someExist = ((someExist = false) ? false : true);
                        var option=document.createElement("option");
                        option.text=x.name;
                        option.value=x.name;
                        if (first){option.selected=true; first=false;}
                        select.add(option);
                    }
                    if(someExist){
                        containerSub.appendChild(select);
                        ButtonConfirm.disabled=false;
                    }else{
                        ButtonConfirm.disabled=true;
                        containerSub.innerHTML="";
                        
                    }

                }
                select.required=true;
                
            };
            confirmButton.onclick=async function(){
                document.getElementById("container").style.alignItems="flex-start";
                let cat=document.getElementById("categorySelected");
                let subCat=document.getElementById("subcategorySelected");
                group.innerHTML="";
                presenter.id="presenterPhotos";
                presenter.innerHTML="";
                let arts=await fetch("data/Works.json").then(e=>e.json());
                group.className="card-deck";
                console.log("category:",cat.value);
                console.log("subcategory:",subCat.value);
                for(const x of arts){
                    if(x.category==cat.value && x.subcategory==subCat.value){
                        console.log(x.category,cat.value," - ",x.subcategory,subCat.value)
                        let deleteButton= createButtonSubmit("submit","btn-danger",'<span class="bi bi-trash"></span> Elimina');
                        deleteButton.id=x.source;
                        deleteButton.onclick=function(){
                            console.log("SUCCESSSOOOOOOOOOOOOOOO");
                            let toDelete=createHiddenRequest('artToDelete',x.source);
                            group.appendChild(toDelete);
                        };
                        let cardArt=createCard("gallery/"+x.source,x.name,"",deleteButton);
                        group.appendChild(cardArt);
                    }
                }
                form.appendChild(group);
                presenter.appendChild(form);
                
            }
            menu.appendChild(selectCategory);
            menu.appendChild(containerSub);
            confirmButton.disabled=true;
            confirmButton.innerText="Cerca";
            menu.append(confirmButton);
            break;
        case 'addPhotoBiography':
            document.getElementById("response").innerHTML="<p>Aggiungi immagine nella biografia</p>";
            let inputPhoto=createInput('file','Opera','Carica Foto','form-control','Opera');
            form.setAttribute('enctype','multipart/form-data');
            group.appendChild(inputPhoto);
            group.appendChild(confirmButton);
                break;
        case 'removePhotoBiography':
            //RESPONSE
            document.getElementById("container").style.alignItems="flex-start";
            presenter.id="presenterPhotos";
            presenter.innerHTML="";
            let pics= await fetch("data/Pics.json").then(e=>e.json());
            group.className="card-deck";
            for(const x of pics){
                let deleteButton= createButtonSubmit("submit","btn-danger",'<span class="bi bi-trash"></span> Elimina');
                deleteButton.id=x;
                deleteButton.onclick=function(){
                    let toDelete=createHiddenRequest('photoToDelete',x);
                    group.appendChild(toDelete);
                };
                let cardPhoto=createCard("pics/"+x,"","",deleteButton);
                group.appendChild(cardPhoto);
            }
            break;
    }
    form.appendChild(group);
    presenter.appendChild(form);
}

//---------------------Utility functions----------------------------
function createForm(){
    let form=document.createElement("form");
    form.action="/adminAction";
    form.autocomplete="off";
    form.method="post";
    return form;
}
function createInput(type,name,placeholder,cls,id){
    let input=document.createElement("input");
    input.type=type;
    input.name=name;
    input.placeholder=placeholder;
    input.className=cls;
    input.id=id;
    input.required=true;
    return input;
}
function createDropDownSelect(cls,name,elements){
    let select=document.createElement("select");
    select.className=cls;
    select.name=name;


    var option=document.createElement("option");
        option.text="Seleziona";
        option.value="";
        option.selected=true;
        select.add(option);

    for(const x of elements){
        option=document.createElement("option");
        option.text=x.name;
        option.value=x.name;
        select.add(option);
    }
    select.required=true;
    return select;
}
function createHiddenRequest(nameRequest,name){
    let type=document.createElement("input");
    type.name=nameRequest;
    type.type="hidden";
    type.value=name;
    return type;
}
function createButtonSubmit(type,cls,text){
    let button=document.createElement("button");
    button.type=type;
    button.className=cls;
    button.innerHTML=text;
    button.id="confirm";
    return button;
}
function createCard(image,title,text,button){
    let card= document.createElement("div");
    card.className="card tex-white bg-dark mb-3";
    let cardImg=document.createElement("img");
    cardImg.className="card-img-top";
    cardImg.src=image;
    cardImg.alt=title;

    let cardBody=document.createElement("div");
    cardBody.className=("card-body");

    let cardTitle=document.createElement("h5");
    cardTitle.className=("card-title");
    cardTitle.text=title;
    let cardText=document.createElement("div");
    cardText.className=("card-text");
    cardText.text=text;
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(button);
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    return card;
}