// ==== VARIÁVEIS ====
let naveImg, inimigoImg, tiroImg, explosaoImg, inimigo2Img, inimigo3Img;
let musicaAbertura, musicaFundo, somTiro, somExplosao;

let naveX, naveY;
let naveW = 40, naveH = 60;
let pontos = 0;
let tempoUltimoTiro = 0;
let tempoSpawnInimigo = 0;
let tempoTiroInimigo = 0;

let jogoIniciado = false;
let jogoFinalizado = false;

let tiros = [];
let inimigos = [];
let tirosInimigos = [];
let explosoes = [];
let tempoExplosao = [];
let inimigosExtras = [];
let tiposExtras = [];

function preload() {
  naveImg = loadImage('nave.png');
  inimigoImg = loadImage('inimigo.png');
  tiroImg = loadImage('tiro.png');
  explosaoImg = loadImage('explosao.png');
  inimigo2Img = loadImage('inimigo2.png');
  inimigo3Img = loadImage('inimigo3.png');

  musicaAbertura = loadSound('musicaAbertura.mp3');
  musicaFundo = loadSound('musicaFundo.mp3');
  somTiro = loadSound('somTiro.mp3');
  somExplosao = loadSound('somExplosao.mp3');
}

function setup() {
  createCanvas(600, 600);
  naveX = width / 2;
  naveY = height - 80;
  textAlign(CENTER, CENTER);
  textSize(20);

  musicaAbertura.setLoop(true);
  musicaAbertura.play();
}

function draw() {
  background(0);

  // ==== ESTRELAS ====
  fill(255);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = (frameCount * 2 + i * 20) % height;
    ellipse(x, y, 2, 2);
  }

  if (!jogoIniciado) {
    fill(255);
    textSize(28);
    text('PRESSIONE ENTER PARA COMEÇAR', width / 2, height / 2);
    return;
  }

  // ==== TIROS DO JOGADOR ====
  for (let i = tiros.length - 1; i >= 0; i--) {
    let tiro = tiros[i];
    imageMode(CENTER);
    image(tiroImg, tiro.x, tiro.y, 8, 24);
    tiro.y -= 10;
    if (tiro.y < 0) tiros.splice(i, 1);
  }

  // ==== INIMIGOS ====
  if (millis() - tempoSpawnInimigo > 1000) {
    inimigos.push(createVector(random(20, width - 20), -40));
    tempoSpawnInimigo = millis();
  }

  for (let i = inimigos.length - 1; i >= 0; i--) {
    let inimigo = inimigos[i];
    image(inimigoImg, inimigo.x, inimigo.y, 40, 40);
    inimigo.y += 2;
    if (inimigo.y > height) inimigos.splice(i, 1);
  }

  // ==== COLISÃO TIRO x INIMIGO ====
  let tirosParaRemover = [];
  let inimigosParaRemover = [];

  for (let i = 0; i < tiros.length; i++) {
    let tiro = tiros[i];
    for (let j = 0; j < inimigos.length; j++) {
      let inimigo = inimigos[j];
      if (dist(tiro.x, tiro.y, inimigo.x, inimigo.y) < 20) {
        explosoes.push(createVector(inimigo.x, inimigo.y));
        tempoExplosao.push(millis());
        somExplosao.play();
        tirosParaRemover.push(i);
        inimigosParaRemover.push(j);
        pontos += 10;

        for (let k = 0; k < 2; k++) {
          let ex = random(20, width - 20);
          inimigosExtras.push(createVector(ex, -random(100, 300)));
          tiposExtras.push(random() < 0.6 ? 1 : 2);
        }
      }
    }
  }

  for (let i = tirosParaRemover.length - 1; i >= 0; i--) tiros.splice(tirosParaRemover[i], 1);
  for (let j = inimigosParaRemover.length - 1; j >= 0; j--) inimigos.splice(inimigosParaRemover[j], 1);

  // ==== INIMIGOS EXTRAS (tipo 1 atira) ====
  for (let i = inimigosExtras.length - 1; i >= 0; i--) {
    let inim = inimigosExtras[i];
    let tipo = tiposExtras[i];
    if (tipo === 1) image(inimigo2Img, inim.x, inim.y, 40, 40);
    else image(inimigo3Img, inim.x, inim.y, 40, 40);
    inim.y += 2.5;

    if (tipo === 1 && millis() - tempoTiroInimigo > 1000) {
      tirosInimigos.push(createVector(inim.x, inim.y));
      tempoTiroInimigo = millis();
    }

    if (dist(inim.x, inim.y, naveX, naveY) < 30) {
      jogoFinalizado = true;
      jogoIniciado = false;
    }

    if (inim.y > height) {
      inimigosExtras.splice(i, 1);
      tiposExtras.splice(i, 1);
    }
  }

  // ==== TIROS DOS INIMIGOS ====
  for (let i = tirosInimigos.length - 1; i >= 0; i--) {
    let tiro = tirosInimigos[i];
    image(tiroImg, tiro.x, tiro.y, 8, 24);
    tiro.y += 5;
    if (dist(tiro.x, tiro.y, naveX, naveY) < 20) {
      jogoFinalizado = true;
      jogoIniciado = false;
    }
    if (tiro.y > height) tirosInimigos.splice(i, 1);
  }

  // ==== EXPLOSÕES ====
  for (let i = explosoes.length - 1; i >= 0; i--) {
    let ex = explosoes[i];
    image(explosaoImg, ex.x, ex.y, 40, 40);
    if (millis() - tempoExplosao[i] > 300) {
      explosoes.splice(i, 1);
      tempoExplosao.splice(i, 1);
    }
  }

  // ==== NAVE ====
  image(naveImg, naveX, naveY, naveW, naveH);

  // ==== MOVIMENTO ====
  if (keyIsDown(LEFT_ARROW)) naveX -= 5;
  if (keyIsDown(RIGHT_ARROW)) naveX += 5;
  if (keyIsDown(UP_ARROW)) naveY -= 5;
  if (keyIsDown(DOWN_ARROW)) naveY += 5;

  naveX = constrain(naveX, naveW / 2, width - naveW / 2);
  naveY = constrain(naveY, naveH / 2, height - naveH / 2);

  // ==== HUD DE PONTOS ====
  fill(255);
  textAlign(LEFT);
  textSize(20);
  text('Pontos: ' + pontos, 10, 30);

  if (jogoFinalizado) {
    musicaFundo.stop();
    fill(255, 0, 0);
    textAlign(CENTER);
    textSize(40);
    text('GAME OVER', width / 2, height / 2 - 20);
    textSize(20);
    text('Pressione R para reiniciar', width / 2, height / 2 + 20);
  }
}

function keyPressed() {
  if (!jogoIniciado && keyCode === ENTER) {
    iniciarJogo();
  }

  if (jogoFinalizado && key === 'r') {
    iniciarJogo();
  }

  if (key === ' ' && jogoIniciado && !jogoFinalizado && millis() - tempoUltimoTiro > 250) {
    tiros.push(createVector(naveX, naveY - naveH / 2));
    tempoUltimoTiro = millis();
    somTiro.play();
  }
}

function iniciarJogo() {
  jogoIniciado = true;
  jogoFinalizado = false;
  pontos = 0;
  naveX = width / 2;
  naveY = height - 80;
  tiros = [];
  inimigos = [];
  tirosInimigos = [];
  explosoes = [];
  tempoExplosao = [];
  inimigosExtras = [];
  tiposExtras = [];
  tempoSpawnInimigo = millis();

  musicaAbertura.stop();
  musicaFundo.setLoop(true);
  musicaFundo.setVolume(0.2);
  musicaFundo.play();
}
