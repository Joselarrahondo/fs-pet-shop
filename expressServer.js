import express from "express";
import { writeFile } from "node:fs";
import {readFile} from "node:fs/promises"

const server = express();
const port = 3000; 
server.use(express.json()); 
server.use(logger)

function logger(req, res, next){
    console.log('Log')
    next()
    }
     
    

//////////// accessing pets from server ///////////
server.get("/pets", (req, res) => {
    readFile('./pets.json', "utf-8").then((text) => {
    res.json(JSON.parse(text));
    });
 });

 ////////////// getting pet at index selected  ///////////////

server.get("/pets/:index", (req, res) => {
    const index = req.params.index;
    readFile('./pets.json', "utf-8").then((text) => {
        const pets = JSON.parse(text);
        const selectedPet = pets[index];
     if(selectedPet !== undefined) {
            res.json(selectedPet);
        console.log(selectedPet, index)
     }else{
        res.status(404);
        res.set("Content-type", "application/json");
        res.send("Not Found");
        }
    });
});

/////////////  post request to create info on server  //////////

server.post("/pets", (req, res, next) => {
    const pet = req.body;
   const reqFields = ["name", "kind", "age"]
    const errors =[];
    for(let field of reqFields){
        if (pet[field] === undefined){
            errors.push(`Missing pet, ${field}`)
        };
    }
         if(pet.age && typeof pet.age !== "number"){
            errors.push("Pet age must be a number")
    }
        if(errors.lenght > 0){
            res.status(422);
            res.send(errors.join(" "))
    }   
        else{  
            readFile("./pets.json", "utf-8") .then((text) => {
            const pets = JSON.parse(text);
            pets.push(pet);
            return writeFile("./pets.json", JSON.stringify(pets), next)
        }).then(() => {
            res.status(201)
            res.send(JSON.stringify(pet))
        })
        .catch((error) => {
            next(error);
        });
    }
    
});


server.listen(port, () =>{
    console.log(`Example app listining on port ${port}`)
 })


 