import express from "express";
import {readFile} from "node:fs/promises"

const server = express();
const port = 3000; 
server.use(express.json()); 

server.get("/pets", (req, res) => {
    readFile('./pets.json', "utf-8").then((text) => {
    res.json(JSON.parse(text));
    });
 });

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


server.post("/pets" , (req, res) => {
    const pet = req.body;
    console.log(pet)
    res.json(pet)
})


 server.listen(port, () =>{
    console.log(`Example app listining on port ${port}`)
 })


 