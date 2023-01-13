use std::fs;
use std::io;
use std::env;
use rand::Rng;
use std::process::Command;
use colored::Colorize;

fn main() {
    let mut music_folder = String::from("./");

    // Validação do OS
    match env::consts::OS {
        "linux" => print!(""),
        _ => {
            println!("Cringe.");
            ()
        }
    }

    // Pega pasta
    let args: Vec<String> = env::args().collect();
    if args.len() > 1 {
        music_folder = args[1].clone();

        if music_folder.chars().last().unwrap() != '/'{
            music_folder = music_folder.to_owned() + "/";
        }    
    }

    // Coloca arquivos da pasta em Vector
    let arquivos = fs::read_dir(music_folder).unwrap();
    let mut arquivos_nomes: Vec<String> = vec![];

    for a in arquivos {
        arquivos_nomes.push(a.unwrap().path().display().to_string());
        //println!("{}", a.unwrap().path().display());
    } 
    
    // Roda música aleatória
    let mut musica = pegar_musica(&arquivos_nomes);
    tocar_musica(&musica);

    loop {
        print!("{}[2J", 27 as char);

        // Mostra menu
        println!(
            "{}\n{}\n{}\n{}\n", 
            format!("Tocando agora: {}", musica).purple().bold(),
            format!("(r) Tocar novamente").green().bold(),
            format!("(t) Tocar outra música").blue().bold(),
            format!("(q) Sair").red().bold()
        );

        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Erro. Encerrando processo.");

        match input.trim() {
            "t" => {
                musica = pegar_musica(&arquivos_nomes);
                tocar_musica(&musica);
                continue;
            }
            "r" => {
                tocar_musica(&musica);
                continue;
            }
            "q" => break,
            _ => {
                continue;
            }
        }
    }
}

fn pegar_musica(arqs: &Vec<String>) -> String {
    let rand_num = rand::thread_rng().gen_range(0..arqs.len());
    let mut arq_tipo = arqs[rand_num].clone().to_owned();

    let arq_tamanho = arq_tipo.char_indices().rev().nth(4-1).map_or(0, |(idx, ch)| idx);
    arq_tipo.drain(0..arq_tamanho);

    if arq_tipo == ".mp3"[..]
    || arq_tipo == ".mp4"[..]
    || arq_tipo == "webm"[..]
    || arq_tipo == ".mkv"[..]
    || arq_tipo == ".m3u"[..] { 
        return arqs[rand_num].clone();
    }
    
    return pegar_musica(&arqs);
}

fn tocar_musica(mus: &String) {
   
    Command::new("celluloid")
        .arg(&mus)
        .spawn()
        .expect("Erro ao rodar música :(");

}
