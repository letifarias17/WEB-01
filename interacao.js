
const VIDAS_INICIAIS = 6;
const TEMPO_INICIAL = 60; 


let vidas;
let palavras = [];      
let palavraAtual;       
let numPalavra = 0;     
let exibicao = [];      
let jogoAtivo = false;  


let cronometroInterval; 
let tempoRestante;


const btnIniciar = document.getElementById("btn-iniciar");
const palavraDisplay = document.getElementById("palavra");
const boxTeclado = document.getElementById("box-teclado");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("message-text");
const vidasDisplay = document.getElementById("vidas-display");
const cronometroDisplay = document.getElementById("cronometro-display");

document.addEventListener("DOMContentLoaded", iniciar);

async function iniciar() {
    criarTeclado(); 
    
    
    vidasDisplay.textContent = `Vidas: ${VIDAS_INICIAIS}`;
    cronometroDisplay.textContent = `Tempo: ${TEMPO_INICIAL}s`;

    await carregarFase(); 

    
    btnIniciar.disabled = false;
    btnIniciar.textContent = "Iniciar Jogo";
    btnIniciar.addEventListener("click", novoJogo);
}


async function carregarFase() {
    try {
        const response = await fetch("fases.json");
        const data = await response.json();
        palavras = data.frutas; 
    } catch (error) {
        console.error("Erro ao carregar fases.json:", error);
        messageText.textContent = "Erro ao carregar palavras.";
        messageBox.classList.remove("hidden");
    }
}


function criarTeclado() {
    boxTeclado.innerHTML = ""; 
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (const letra of letras) {
        let botao = document.createElement("button");
        botao.textContent = letra;
        botao.classList.add("tecla");
        botao.addEventListener("click", () => verificarLetra(letra, botao));
        boxTeclado.appendChild(botao);
    }
}


function novoJogo() {
    if (numPalavra >= palavras.length) {
        mostrarMensagem("🎉 Parabéns! Você completou todas as palavras!", "sucesso");
        btnIniciar.disabled = true;
        btnIniciar.textContent = "Fim de Jogo";
        return;
    }

    jogoAtivo = true;
    vidas = VIDAS_INICIAIS;
    esconderMensagem();
    atualizarVidasDisplay(); 
    
    
    iniciarCronometro();

    
    palavraAtual = String(palavras[numPalavra]).toUpperCase();
    exibicao = [];
    for (let i = 0; i < palavraAtual.length; i++) {
        exibicao[i] = '_';
    }
    palavraDisplay.textContent = exibicao.join(" ");
    
    resetarTeclado();
    btnIniciar.textContent = "Novo Jogo"; 
}


function verificarLetra(letra, botao) {
    if (!jogoAtivo) return; 

    botao.disabled = true;
    let acertou = false;

    for (let i = 0; i < palavraAtual.length; i++) {
        if (palavraAtual[i] === letra) {
            exibicao[i] = letra;
            acertou = true;
        }
    }

    palavraDisplay.textContent = exibicao.join(" ");
    
    if (acertou) {
        botao.classList.add("correta");
    } else {
        botao.classList.add("incorreta");
        vidas--;
        atualizarVidasDisplay(); 
    }

    checarEstadoJogo();
}


function checarEstadoJogo() {
    
    if (vidas === 0) {
        jogoAtivo = false;
        pararCronometro();
        mostrarMensagem(`😢 Fim de jogo! A palavra era: ${palavraAtual}`, "erro");
        desativarTeclado();
    } 
    
    else if (!exibicao.includes("_")) {
        jogoAtivo = false;
        pararCronometro();
        mostrarMensagem("🎉 Parabéns! Você acertou!", "sucesso");
        numPalavra++; 
        desativarTeclado();
        btnIniciar.textContent = "Próxima Palavra"; 
    }
}


function resetarTeclado() {
    const botoes = document.querySelectorAll("#box-teclado .tecla");
    botoes.forEach(botao => {
        botao.disabled = false;
        botao.classList.remove("correta", "incorreta");
    });
}



 
function desativarTeclado() {
    const botoes = document.querySelectorAll("#box-teclado .tecla");
    botoes.forEach(botao => botao.disabled = true);
}



function atualizarVidasDisplay() {
    vidasDisplay.textContent = `Vidas: ${vidas}`;
}

function mostrarMensagem(texto, tipo) {
    messageText.textContent = texto;
    messageBox.className = tipo; 
    messageBox.classList.remove("hidden");
}

function esconderMensagem() {
    messageBox.classList.add("hidden");
}



function iniciarCronometro() {
    clearInterval(cronometroInterval); 
    tempoRestante = TEMPO_INICIAL;
    atualizarCronometroDisplay();

    cronometroInterval = setInterval(tickCronometro, 1000); 
}

function pararCronometro() {
    clearInterval(cronometroInterval);
}

function tickCronometro() {
    tempoRestante--;
    atualizarCronometroDisplay();

    // Verifica se o tempo acabou
    if (tempoRestante <= 0) {
        pararCronometro();
        jogoAtivo = false;
        mostrarMensagem(`⏰ Tempo esgotado! A palavra era: ${palavraAtual}`, "erro");
        desativarTeclado();
        vidas = 0; 
        atualizarVidasDisplay();
    }
}

function atualizarCronometroDisplay() {
    cronometroDisplay.textContent = `Tempo: ${tempoRestante}s`;
}