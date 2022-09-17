const fs = require("fs");
const os = require("os");
const { exec } = require("child_process");
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

validacaoEpica();

const musicFolder = __dirname + "/Music/";
const musicas = fs.readdirSync(musicFolder);

try {
    const musicaNome = getMusica(musicas);

    rodarMusica(musicFolder, musicaNome);
    mostrarInterface(musicaNome);
}
catch(err){
    console.log("Lembre-se de rodar o código em ~/ (/home/user/)");
}


async function rodarMusica(musicFolder, musicaNome){

    exec(`celluloid ${musicFolder}${musicaNome}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
    });

}

function getMusica(musicas){

    const randNum = Math.floor(Math.random() * musicas.length - 1);
    let musicaNome = "";

    for (let i = 0; i < musicas[randNum].length; i++){
        if (musicas[randNum][i] == " "){
            musicaNome += "\u005C ";
        }
        else if (musicas[randNum][i] == "(" || musicas[randNum][i] == ")" || musicas[randNum][i] == "'"){
            musicaNome += "\u005C";
            musicaNome += musicas[randNum][i];
        }
        else{
            musicaNome += musicas[randNum][i];
        }
    }

    return musicaNome;

}

function mostrarInterface(musicaNome){

    rl.question(
        "Tocando agora: " + musicaNome + "\n" +
        "(r) Tocar novamente" + "\n" +
        "(t) Tocar outra música" + "\n" + 
        "(q) Sair" + "\n"
    , (char) => {
        switch (char){
            case "r":
                rodarMusica(musicFolder, musicaNome);
                mostrarInterface(musicaNome);
                break;
            case "t":
                const randMusica = getMusica(musicas);
                rodarMusica(musicFolder, randMusica);
                mostrarInterface(randMusica);
                break;
            case "q":
                process.exit();
            default:
                console.log("Comando inválido");
                mostrarInterface(musicaNome);
        }
    });

}

function validacaoEpica(){
    if(os.type() != "Linux"){
        console.log("Cringe.");
        process.exit();
    }
}