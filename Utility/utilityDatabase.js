var fs= require("fs");
var sharp = require('sharp');

const IMAGEQUALITY=80;
//Used to check categories
function checkInDbCatName(nameDb,toSearch){
    let db=JSON.parse(fs.readFileSync('Public/data/'+nameDb));
    if(db.find(e => e.name === toSearch.name)){
        return true;
    }
    return false;
} 
function checkInDbSubCatName(nameDb,toSearch){
    let db=JSON.parse(fs.readFileSync('Public/data/'+nameDb));
    if(db.find(e => e.name === toSearch.name && e.category===toSearch.category)){
        return true;
    }
    return false;
}
//Universal -- input Object
function addInDataDb(nameDb,toAdd){
    let db=JSON.parse(fs.readFileSync('Public/data/'+nameDb));
    db.push(toAdd);
    db=JSON.stringify(db, null, 2);
    fs.writeFile('Public/data/'+nameDb,db, function(err){
        if (err){
            throw console.error("Aggiunta nel "+nameDb+" non avvenuta");
        }
    });
}
//Used to modify name for all DB which contains the attribute name
function modifyNameInDb(nameDb,toModify,newValue){
    let db=JSON.parse(fs.readFileSync('Public/data/'+nameDb));
    for(const x of db){
        if(x.name==toModify){
            x.name=newValue;
            break;
        }
    }
    db=JSON.stringify(db, null, 2);
    fs.writeFile('Public/data/'+nameDb,db, function(err){
        if (err){
            throw console.error("Modifica nel "+nameDb+" non avvenuta");
        }
    });
}
//Used into all Db which contains the name attribute
function deleteByNameInDb(nameDb,name){
    let db=JSON.parse(fs.readFileSync('Public/data/'+nameDb));
    let filtered=db.filter(function(obj){
        return obj.name != name;
    });
    filtered=JSON.stringify(filtered,null,2);
    fs.writeFile('Public/data/'+nameDb,filtered, function(err){
        if (err){
            throw console.error("Eliminazione nel "+nameDb+" non avvenuta");
        }
    });
};
function deleteInDbSubca(category,name){
    let dbSub=JSON.parse(fs.readFileSync('Public/data/Subcategories.json'));
    let filtered=dbSub.filter(function(obj){
        return (obj.name != name || obj.category != category);
    });
    console.log(filtered);
    filtered=JSON.stringify(filtered,null,2);
    fs.writeFile('Public/data/Subcategories.json',filtered, function(err){
        if (err){
            throw console.error("Aggiunta nel Subcategories.json non avvenuta");
        }
    });
};
function checkFolder(folder){
    fs.access(folder, (error) => {
        if (error) {
          fs.mkdirSync(folder);
        }
      });
};
function randomName(length){
    return require('crypto').randomBytes(length).toString('hex');
};
function addImage(pathSave,nameFile,file){
    var image= sharp(file.buffer);
    image.metadata().then(function(metadata){
        return image.jpeg({quality: ((metadata.size>3145728)? IMAGEQUALITY : 100)}).toFile(pathSave+nameFile,(err,info)=>{
            if(err){
                return false;
            }
        })});
    return true;
}

//--------------------------------------------------------------------------------------------------
//functions used externally
module.exports ={
    createCategory: function(name){
        //Check if is empty
        if(name==""){
            return "Inserisci un nome valido";
        }
        //Append new element
        let box={'name':name};
        if(!checkInDbCatName("Categories.json",box)){
            
            addInDataDb('Categories.json',box);
            return "Nuova categoria aggiunta";
        }else{
            return "Esiste già questa categoria";
        }

    },
    modifyCategory: function(name,newName){
        //Check if new name is valid
        if (!newName==""){
            modifyNameInDb("Categories.json",name,newName);
            return "Nome categoria modificato";
            
        }else{
            return "Inserisci un nome valido";
        }    
    },
    removeCategory: function(name){
        //Check category dependencies
        let dbSub=JSON.parse(fs.readFileSync('Public/data/Subcategories.json'));
        if(dbSub.some(obj => obj.category===name)){
            return "Non è possibile cancellare la categoria, cancella prima le sottocategorie connesse";
        }else{
            deleteByNameInDb("Categories.json",name);
            return "Cancellazione della categoria avvenuta";
        }
    },
    createSubcategory: function(category,name){
        //Check if is empty
        if(name==""){
            return "Inserisci un nome valido";
        }
        //Append new element
        let box={'name':name, 'category':category};
        if(!checkInDbSubCatName("Subcategories.json",box)){
            
            addInDataDb('SubCategories.json',box);
            return "Nuova sottocategoria aggiunta";
        }else{
            return "Esiste già questa sottocategoria";
        }
    },
    modifySubcategory: function(category,name,newName){
        if(newName==""){
            return "Inserisci un nome valido";
        }
        let box={'name':name, 'category':category};
        let db=JSON.parse(fs.readFileSync('Public/data/Subcategories.json'));
        for(const x of db){
            if(x.name==box.name && x.category==box.category){
                x.name=newName;
                break;
            }
        }
        db=JSON.stringify(db, null, 2);
        fs.writeFileSync('Public/data/Subcategories.json',db);
        return "Modifica della sottocateogria avvenuta con successo";

    },
    removeSubcategory: function(category,name){
        //Check subcategory dependecies
        let dbArt=JSON.parse(fs.readFileSync('Public/data/Works.json'));
        if(dbArt.some(obj => obj.subcategory===name && obj.category===category)){
            return "Non è possibile cancellare la sottocategoria, cancella prima le immagini con questa sottocategoria";
        }else{
            deleteInDbSubca(category,name);
            return "Cancellazione della categoria avvenuta";
        }
    },
    addArt: async function(body,operaBuffer){
        const artFolder="./Public/gallery/";
        checkFolder(artFolder);
        const newName= randomName(10)+".jpg";
        console.log(artFolder+newName);
        const metadata =await sharp(operaBuffer.buffer).jpeg({quality:IMAGEQUALITY}).toFile(artFolder+newName, (err,info) => {
            return "Qualcosa è andato storto con il salvataggio dell'Opera";
        }).metadata();
        let newArtData={
            "name":body.nameArt,
            "category":body.categorySelected,
            "subcategory":body.subcategorySelected,
            "source":newName,
            "orientation":((metadata.width>metadata.height)? 'horizontal' : 'vertical'),
            "format":metadata.format
        }
        addInDataDb('Works.json',newArtData);
        return "Immagina caricata con successo";
    },
    addPhotoBiography: async function(photoBuffer){
        const photoDestination="./Public/pics/";
        checkFolder(photoDestination);
        const newName=randomName(10)+".jpeg";
        if(addImage(photoDestination,newName,photoBuffer)){
            addInDataDb('Pics.json',newName);
            return "Salvataggio riuscito";
        }else{
            return "Qualcosa è andato storto";
        }
    },
    removePhotoBiography: async function(photoToDelete){
        if(photoToDelete === undefined){
            return "Eliminazione non avvenuta";
        }
        let pathDB="Public/data/Pics.json";
        let pathPhoto="Public/pics/"+photoToDelete;
        let DB=JSON.parse(fs.readFileSync(pathDB));
        DB=DB.filter(function(obj){
            return obj != photoToDelete;
        });
        DB=JSON.stringify(DB,null,2);
        fs.writeFile(pathDB,DB, function(err){
            if (err){
                return "Eliminazione del database del file non avvenuta";
            }
        });
        fs.unlink(pathPhoto,(err)=>{
            if(err){
                return "Eliminazione del file non avvenuta";
            }
            
        });
        return "Eliminazione avvenuta!";
    },
    removeArt: async function(artToDelete){
        if(artToDelete === undefined){
            return "Eliminazione non avvenuta";
        }
        let pathDB="Public/data/Works.json";
        let pathArt="Public/gallery/"+artToDelete;
        let DB=JSON.parse(fs.readFileSync(pathDB));
        DB=DB.filter(function(obj){
            return obj.source != artToDelete;
        });
        DB=JSON.stringify(DB,null,2);
        fs.writeFile(pathDB,DB, function(err){
            if (err){
                return "Eliminazione del database del file non avvenuta";
            }
        });
        fs.unlink(pathArt,(err)=>{
            if(err){
                return "Eliminazione del file non avvenuta";
            }
            
        });
        return "Eliminazione avvenuta!";
    }

}