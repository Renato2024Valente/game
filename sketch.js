let naveImg, inimigoImg, tiroImg, explosaoImg, inimigo2Img, inimigo3Img;
let musicaAbertura, musicaFundo, somTiro, somExplosao;

let naveX, naveY;
let naveW = 40, naveH = 60;
let pontos = 0;
let tempoUltimoTiro = 0;
let tempoSpawnInimigo = 0;

let jogoIniciado = false;
let jogoFinalizado = false;

let tiros = [];
let inimigos = [];

let botaoJogar;
let toquePermitido = false;

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
  createCanvas(windowWidth, windowHeight);
  naveX = width / 2;
  naveY = height - 80;
  textAlign(CENTER, CENTER);
  textSize(20);

  botaoJogar = createButton("JOGAR");
  botaoJogar.position(width / 2 - 50, height / 2 + 40);
  botaoJogar.size(100, 40);
  botaoJogar.style('font-size', '20px');
  botaoJogar.style('background-color', '#00ff00');
  botaoJogar.style('border', 'none');
  botaoJogar.style('border-radius', '10px');
  botaoJogar.mousePressed(() => {
    userStartAudio(); // <--- NECESSÁRIO para tocar som no celular
    iniciarJogo();
    botaoJogar.hide();
  });
}

function draw() {
  background(0);

  // Estrelas de fundo
  fill(255);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = (frameCount * 2 + i * 20) % height;
    ellipse(x, y, 2, 2);
  }

  if (!jogoIniciado) {
    fill(255);
    textSize(24);
    text('TOQUE NA TELA OU PRESSIONE ENTER PARA COMEÇAR', width / 2, height / 2);
    return;
  }

  // Tiros do jogador
  for (let i = tiros.length - 1; i >= 0; i--) {
    let tiro = tiros[i];
    imageMode(CENTER);
    image(tiroImg, tiro.x, tiro.y, 8, 24);
    tiro.y -= 10;
    if (tiro.y < 0) tiros.splice(i, 1);
  }

  // Inimigos
  for (let i = inimigos.length - 1; i >= 0; i--) {
    let inimigo = inimigos[i];
    image(inimigoImg, inimigo.x, inimigo.y, 40, 40);
    inimigo.y += 2;
    if (inimigo.y > height) inimigos.splice(i, 1);
  }

  if (millis() - tempoSpawnInimigo > 1000) {
    inimigos.push(createVector(random(20, width - 20), -40));
    tempoSpawnInimigo = millis();
  }

  // Colisão
  for (let i = inimigos.length - 1; i >= 0; i--) {
    for (let j = tiros.length - 1; j >= 0; j--) {
      let dx = inimigos[i].x - tiros[j].x;
      let dy = inimigos[i].y - tiros[j].y;
      if (sqrt(dx * dx + dy * dy) < 30) {
        inimigos.splice(i, 1);
        tiros.splice(j, 1);
        pontos++;
        if (somExplosao.isLoaded()) somExplosao.play();
        break;
      }
    }
  }

  // Nave
  imageMode(CENTER);
  image(naveImg, naveX, naveY, naveW, naveH);

  // Movimento por toque ou mouse
  if (touches.length > 0) {
    naveX = touches[0].x;
    naveY = touches[0].y;

    if (millis() - tempoUltimoTiro > 250) {
      tiros.push(createVector(naveX, naveY - naveH / 2));
      tempoUltimoTiro = millis();
      if (somTiro.isLoaded()) somTiro.play();
    }
  } else if (mouseIsPressed) {
    naveX = mouseX;
    naveY = mouseY;
  }

  // Pontuação
  fill(255);
  textSize(20);
  text("Pontos: " + pontos, width - 100, 30);
}

function keyPressed() {
  if (!jogoIniciado && keyCode === ENTER) {
    userStartAudio(); // Garantir que som funcione
    iniciarJogo();
    botaoJogar.hide();
  }

  if (key === ' ' && jogoIniciado && millis() - tempoUltimoTiro > 250) {
    tiros.push(createVector(naveX, naveY - naveH / 2));
    tempoUltimoTiro = millis();
    if (somTiro.isLoaded()) somTiro.play();
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
  tempoSpawnInimigo = millis();

  if (musicaAbertura.isPlaying()) musicaAbertura.stop();
  if (!musicaFundo.isPlaying()) {
    musicaFundo.setLoop(true);
    musicaFundo.setVolume(0.2);
    musicaFundo.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  naveX = width / 2;
  naveY = height - 80;
  if (botaoJogar) {
    botaoJogar.position(width / 2 - 50, height / 2 + 40);
  }
}
