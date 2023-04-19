const express = require('express');
var cors = require('cors');
var fs = require('fs');
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post('/createClothe', (req, res) => {
    let nom = req.body.nom;
    let type = req.body.type;
    let couleur = req.body.couleur;
    let saison = req.body.saison;
    let marque = req.body.marque;
    let deOutfitNo = req.body.deOutfitNo;
    let img = req.body.img;
    let vetements = JSON.parse(fs.readFileSync("../public/vetements.json", "utf-8"));
    let id = Math.max(...vetements.map(e => e.id))+1;
    vetements.push({id:id,nom:nom, type:type, couleur:couleur, saison:saison, marque:marque, deOutfitNo:deOutfitNo, img:img, inBox:null});
    fs.writeFileSync("../public/vetements.json", JSON.stringify(vetements));
    res.status(200).send(vetements);
});

app.post("/transfer", (req, res) => {
    let clotheToPutIn = req.body.clotheToPutIn;
    let boxToPutIn = req.body.boxToPutIn;
    if(clotheToPutIn && boxToPutIn){
        console.log(clotheToPutIn, boxToPutIn);
        let vetements = JSON.parse(fs.readFileSync("../public/vetements.json", "utf-8"));
        vetements.find(cloth => cloth.id ==parseInt(clotheToPutIn)).inBox = parseInt(boxToPutIn);
        fs.writeFileSync("../public/vetements.json", JSON.stringify(vetements));
        res.send({status:200, data:vetements});
    }else res.send({status:400, error:"Please provide all arguments"});
});
app.post("/pullClothe", (req, res) => {
    let clotheToGetOut = req.body.clotheToGetOut;
    if(clotheToGetOut){
        let vetements = JSON.parse(fs.readFileSync("../public/vetements.json", "utf-8"));
        vetements.find(cloth => cloth.id ==parseInt(clotheToGetOut)).inBox = null;
        fs.writeFileSync("../public/vetements.json", JSON.stringify(vetements));
        res.send({status:200, data:vetements});
    }else res.send({status:400, error:"Please provide all arguments"});
});

app.listen(8000 || process.env.PORT, () => {
    console.log(`Listening on http://localhost:${8000 || process.env.PORT}`);
});