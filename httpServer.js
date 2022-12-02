import{readFile} from "node:fs/promises";
import http from "http"; 

const petRegExp = /^\/pets\/(.*)$/

const server = http.createServer((request, response) => {
    const {method, url} = request; 

if(method === "GET" && url === '/pets'){
   readFile('./pets.json', "utf-8").then((text) => {
    response.statusCode = 200; 
    response.setHeader("Content-Type", "application/json");
    response.end(text)
}); 
/////////////// create way to show specific pet slected at index///////////////

} else if(method === "GET" && petRegExp.test(url)){
    const choice = petRegExp.exec(url);
    const petIndex = choice[1];
    readFile('./pets.json', "utf-8").then((text) => {
    response.statusCode = 200; 
     const pets = JSON.parse(text)
     const selectedPets = pets[petIndex]

     //////////////// CREATE CONDITION TO READ DATA AND DETERMIND IF USER SLECTES UNAVAILABLE INDEX //////////     
 
if (petIndex >= 0 && petIndex <= pets.length -1){
     response.setHeader("Content-Type", "application/json");
     response.end(JSON.stringify(selectedPets))

 }

});   

}else {
    response.setHeader("Content-Type", "tex/plaintext");
    response.statusCode = 404;
    response.end("Not Found");
}
});
server.listen(3000, () => {
console.log(`server running on port 3000`)
});