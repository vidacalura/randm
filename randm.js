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

const videoExtensions = [ ".mp4", ".mp3", ".webm", ".mkv" ]; 

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

    console.log(musicas[randNum])

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

    // Validação
    if (musicaNome.includes(".")){
        const videoTipo = musicaNome.slice(musicaNome.lastIndexOf("."));

        if (!videoExtensions.includes(videoTipo)){
            musicaNome = getMusica(musicas);
        }
    }
    else{
        musicaNome = getMusica(musicas);
    }
        

    return musicaNome;

}

function mostrarInterface(musicaNome){

    // Limpar console
    console.log('\033[2J');

    rl.question(
        "\x1b[35mTocando agora: " + musicaNome + "\x1b[0m\n" +
        "\x1b[32m(r) Tocar novamente" + "\x1b[0m\n" +
        "\x1b[36m(t) Tocar outra música" + "\x1b[0m\n" + 
        "\x1b[31m(q) Sair" + "\x1b[0m\n"
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
                mostrarInterface(musicaNome);
                console.log("Comando inválido");
        }
    });

}

function validacaoEpica(){
    if(os.type() != "Linux"){
        console.log("Cringe.");
        process.exit();
    }
}