let numeroSecreto;
let vidas;
let maxRange; 
let totalVidas; 

let numeroChute = document.getElementById("num1");
let resultado = document.getElementById("txtResultado");
let btnIniciar = document.getElementById("btIniciar");
let btnChutar = document.getElementById("btChutar");
let txtStatus = document.getElementById("status");
let selectDificuldade = document.getElementById("selectDificuldade");
let pInstrucao = document.getElementById("pInstrucao"); 

btnIniciar.addEventListener("click", novoJogo);
btnChutar.addEventListener("click", chutou);

numeroChute.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    if (!btnChutar.disabled) {
      chutou();
    }
  }
});

btnChutar.disabled = true;
numeroChute.disabled = true;

function novoJogo() {
  let dificuldade = selectDificuldade.value;

  switch (dificuldade) {
    case 'facil':
      maxRange = 50;
      totalVidas = 10;
      break;
    case 'dificil':
      maxRange = 200;
      totalVidas = 5;
      break;
    case 'medio':
    default: 
      maxRange = 100;
      totalVidas = 7;
      break;
  }

  btnChutar.disabled = false;
  numeroChute.disabled = false;
  selectDificuldade.disabled = true; 
  btnIniciar.disabled = true; 

  numeroSecreto = parseInt(Math.random() * maxRange) + 1;
  vidas = totalVidas;
  
  pInstrucao.innerHTML = `Adivinhe um número entre 1 e ${maxRange}.`;
  resultado.innerHTML = ""; 
  
  numeroChute.value = "";
  
  atualizarStatusVidas();
  numeroChute.focus();
}

function chutou() {
  let palpite = parseInt(numeroChute.value);

  if (isNaN(palpite) || palpite < 1 || palpite > maxRange) {
    alert(`Por favor, digite um número válido entre 1 e ${maxRange}.`); 
    numeroChute.value = "";
    numeroChute.focus();
    return;
  }

  let feedback = "";

  if (palpite === numeroSecreto) {
    resultado.innerHTML += `<b>Parabéns! Você acertou! O número era ${numeroSecreto}.</b><br>`;
    encerrarJogo(true);
  } else {
    vidas--;
    
    feedback = (palpite > numeroSecreto)
      ? `Palpite: ${palpite} - O número é <b>Menor</b>!`
      : `Palpite: ${palpite} - O número é <b>Maior</b>!`;
    
    resultado.innerHTML += feedback + "<br>";
    atualizarStatusVidas();

    if (vidas === 0) {
      resultado.innerHTML += `<b>Você perdeu! O número secreto era ${numeroSecreto}.</b><br>`;
      encerrarJogo(false);
    }
  }

  numeroChute.value = "";
  numeroChute.focus();
}

function atualizarStatusVidas() {
  if (vidas > 0) {
    txtStatus.innerHTML = "❤️ ".repeat(vidas); 
  } else {
    txtStatus.innerHTML = "Sem vidas restantes 😢";
  }
}

function encerrarJogo(venceu) {
  btnChutar.disabled = true;
  numeroChute.disabled = true;

  selectDificuldade.disabled = false; 
  btnIniciar.disabled = false; 

  pInstrucao.innerHTML = "Escolha a dificuldade e clique em Iniciar.";

  if (venceu) {
    txtStatus.innerHTML = "Você Venceu! 🎉";
  }
}