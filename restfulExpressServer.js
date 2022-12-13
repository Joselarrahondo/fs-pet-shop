import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import morgan from "morgan";
import postgres from "postgres";

const sql = postgres({database: "petshop"});

const server = express();
const port = 3001;

server.use(express.json());

// accept get request to /pets, return pets and 200
server.get("/pets", (req, res) => {
    sql`SELECT * FROM PETS`.then(pets => {
        console.log("pets", pets);
        res.json(pets);
    })
    // readFile("./pets.json", "utf-8").then((text) => {
    //     res.setHeader("Content-type", "application/json");
    //     res.json(JSON.parse(text));
    // })
})

// USING A GET REQUEST
server.get("/pets/:index", (req, res, next) => {
    const index = req.params.index;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        const selectedPet = pets[index];
        if (index >= 0 && index <= pets.length -1) {
            res.json(selectedPet);
        } else {
            res.set("Content-type", "text/plain");
            res.status(404);
            res.end("Not Found");
        }
    })
    .catch((error) => {
        console.log("got error");
        next(error);
    });
});
// USING A POST REQUEST
server.post("/pets", (req, res, next) => {
    const pet = req.body;
    const reqFields = [name, kind, age];
    const errors = [];
    for (let field of reqFields) {
        if (pet[field] === undefined) {
            errors.push(`Missing pet ${field}`);
        }
    }
    if (pet.age && typeof pet.age !== "number") {
        errors.push("Pet age must be a number");
    }
    if (errors.length > 0) {
        res.status(422);
        res.send(error.join(" "));

    } else {
        readFile("./pets.json", "utf-8").then((text) => {
            const pets = JSON.parse(text);
            pets.push(pet);
            return writeFile("./pets.json", JSON.stringify(pets));
        }).then(() => {
            res.status(201);
            res.send(JSON.stringify(pet));
        }).catch(error => {
            next(error);
        })
    }
})

// USING A PATCH REQUEST
server.patch("/pets/:index", (req, res) => {
    const { index } = req.params;
    const updates = req.body;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        // const existingPet = pets[index];
        for (let key in updates) {
            pets[index][key] = updates[key];
        }
        return writeFile("./pets.json", JSON.stringify(pets)).then(() => {
            res.status(200);
            res.send(pets);
        })
    })
});

// USING A DELETE REQUEST
server.delete("/pets/:index", (req, res) => {
    const {index} = req.params;
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.splice(index, 1);
        return writeFile("./pets.json", JSON.stringify(pets)).then(() => {
            res.set("Content-type", "application/json");
            res.status(200);
            res.send(pets);
        })
    })
})


server.use((req, res) => {
    res.status(500);
    res.send("Internal Server Error");
})


server.listen(port, () => {
    console.log(`listening on ${port}`)
});

 