import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import morgan from "morgan";
import postgres from "postgres";

const sql = postgres({database: "petshop",});

const server = express();
const port = 3001;

server.use(express.json());
server.use(morgan("tiny"))
// accept get request to /pets, return pets and 200
server.get("/pets", (req, res) => {
    sql`SELECT * FROM PETS`.then(pets => {
        res.json(pets);
    })
});

                                     ///////// USING A GET REQUEST/////////////

server.get("/pets/:id", (req, res) => {
    const id = req.params.id;
    sql`SELECT * FROM pets WHERE id = ${id}`.then((result) => {
        if(result.length === 0){
            res.set("Content-type", "text/plain");
            res.status(404);
            res.end("Not Found");
        }else {
            res.json(result[0]);
        }
    });
});
                                           ////////// USING A POST REQUEST////////////
server.post("/pets", (req, res, next) => {
    const pet = req.body;
    
    const reqFields = ["name", "kind", "age"];
    const errors = [];
    for (let field of reqFields) {
        if (pet[field] === undefined) {
            errors.push(`Missing pet ${field}`);
        }
    }
    if (pet.age && typeof pet.age !== "number") {
        errors.push("Pet age must be a number");
    }
    
    const {name, kind, age} = pet;
    
    if (errors.length > 0) {
        res.status(422);
        res.send(errors.join(" "));

    } else {
        sql `INSERT INTO pets (age, name, kind) VALUES (${age}, ${name}, ${kind}) RETURNING *`.then(
            (result) => {
                res.status(201);
                res.json(result);
         }
        );  
    }
});


                                        ///////////// USING A PATCH REQUEST/////////

server.patch("/pets/:id", (req, res) => {
    const {id} = req.params;
    const {age, name, kind} = req.body;
   
        sql `UPDATE pets SET 
        age=COALESCE(${age || null}, age), 
        name=COALESCE(${name || null}, name), 
        kind=COALESCE(${kind || null}, kind)  
        WHERE id = ${id} RETURNING *
        `.then((result) => {
            res.send(result[0]);
        });
    });
  


   
                                            ////////////USING A DELETE REQUEST////////////

        server.delete("/pets/:index", (req, res) => {
        const {index} = req.params;
        sql `DELETE FROM pets WHERE id = ${index} RETURNING *`.then((result) => {
            res.status()
            res.send(result[0]);
        })
    });


server.use((req, res) => {
    res.status(500);
    res.send("Internal Server Error");
})


server.listen(port, () => {
    console.log(`listening on ${port}`)
});

