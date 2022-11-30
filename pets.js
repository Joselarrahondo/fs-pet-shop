
import {readFile, writeFile} from "node:fs/promises";

const subcommand = process.argv[2];

if (subcommand === "read") {
  const petIndex = process.argv[3];
  readFile("./pets.json", "utf-8").then((text) => {
    const pets = JSON.parse(text);
    if (petIndex === undefined) {
      console.log(pets)
    } else if(petIndex > pets.length -1 ){
        console.error("Usage: node pets.js read INDEX")
    } else {
      console.log(pets[petIndex]);
    }
  });

  
} else if ( subcommand === "create"){
    const age = process.argv[3];
    const name = process.argv[4];
    const type = process.argv[5];
    const pet = {age, name, type};
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        pets.push(pet);
       return writeFile("./pets.json", JSON.stringify(pets));
    });


} else if (subcommand === "destroy"){
    const petIndex = process.argv[3]
    readFile("./pets.json", "utf-8").then((text) => {
        const pets = JSON.parse(text);
        if(petIndex !== undefined){
            return delete(pets[petIndex])
        }

    })


}else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}

