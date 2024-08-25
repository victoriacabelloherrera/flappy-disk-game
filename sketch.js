//////////////////////////////////////
// UNA - Multimediales
// Materia: Informática Aplicada 1
// Cátedra Bedoian
// Alumnx: Victoria Cabello Herrera
//////////////////////////////////////

// inicio de variables
let disco;
let obstaculos = [];
let puntaje = 0;
let velocidadBase = 5;
let juegoTerminado = false;
let juegoIniciado = false;
let botonInicio;
let fuente;
let fondo;
let imgDisco;
let imgRoto;
let intro;
let obstaculosPasados = 0;
let indiceObstaculos = 0;

// carga de imagenes y fuente
function preload() {
  fuente = loadFont("VCR_OSD_MONO_1.001.ttf"); // fuente estilo videogame
  fondo = loadImage("estrella.jpg");
  imgDisco = loadImage("disco.png");
  imgRoto = loadImage("roto.png");
  intro = loadImage("intro.jpg"); // Cargar la imagen de introducción
  instrucciones = loadImage("instrucciones.jpg");
  creditos = loadImage("creditos.jpg");
}

function setup() {
  createCanvas(600, 600);
  disco = new configuracionDisco();
  mostrarPantallaInicio();
}

function draw() {
  if (juegoIniciado && !juegoTerminado) {
    dibujarFondo();
    actualizarObstaculos();
    actualizarDisco();
    mostrarDisco();
    mostrarPuntaje();

    // Frecuencia con la que aparecen los obstáculos
    if (frameCount % 30 == 0) {
      obstaculos.push(new Obstaculo());
    }
  }
}

/////////////////////////////

// dibujo de pantalla de inicio, introduccion del juego
function mostrarPantallaInicio() {
  image(intro, 0, 0, width, height); // Mostrar la imagen de introducción

  textFont(fuente);
  textSize(30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(32);

  // estilos para el botón comenzar
  botonInicio = createButton("Comenzar");
  botonInicio.position(width / 2 - 60, height - 180);
  botonInicio.style("background-color", "#5e548e");
  botonInicio.style("border", "2px solid #fff");
  botonInicio.style("color", "#fff");
  botonInicio.style("padding", "10px 18px");
  botonInicio.style("font-family", "Courier New");
  botonInicio.style("font-size", "16px");
  botonInicio.style("border-radius", "8px");
  botonInicio.mousePressed(iniciarJuego);
  botonInicio.style("position", "absolute");

  // botón de instrucciones
  botonInstrucciones = createButton("Instrucciones");
  botonInstrucciones.position(width / 2 - 85, height - 120);
  botonInstrucciones.style("background-color", "#5e548e");
  botonInstrucciones.style("border", "2px solid #fff");
  botonInstrucciones.style("color", "#fff");
  botonInstrucciones.style("padding", "10px 18px");
  botonInstrucciones.style("font-family", "Courier New");
  botonInstrucciones.style("font-size", "16px");
  botonInstrucciones.style("border-radius", "8px");
  botonInstrucciones.mousePressed(mostrarInstrucciones);
  botonInstrucciones.style("position", "absolute");

  // botón de créditos
  botonCreditos = createButton("Créditos");
  botonCreditos.position(width / 2 - 60, height - 70);
  botonCreditos.style("background-color", "#5e548e");
  botonCreditos.style("border", "2px solid #fff");
  botonCreditos.style("color", "#fff");
  botonCreditos.style("padding", "10px 18px");
  botonCreditos.style("font-family", "Courier New");
  botonCreditos.style("font-size", "16px");
  botonCreditos.style("border-radius", "8px");
  botonCreditos.mousePressed(mostrarCreditos);
  botonCreditos.style("position", "absolute");
}

// boton para volver al inicio
function mostrarBotonVolver() {
  botonVolver = createButton("Volver al inicio");
  botonVolver.position(width / 2 - 90, height - 90);
  botonVolver.style("background-color", "#5e548e");
  botonVolver.style("border", "2px solid #fff");
  botonVolver.style("color", "#fff");
  botonVolver.style("padding", "10px 18px");
  botonVolver.style("font-family", "Courier New");
  botonVolver.style("font-size", "16px");
  botonVolver.style("border-radius", "8px");
  botonVolver.mousePressed(volverAlInicio);
  botonVolver.style("position", "absolute");
}

//////////////////

// INICIO DE JUEGOO
function iniciarJuego() {
  juegoIniciado = true;
  botonInicio.remove();
  botonInstrucciones.remove();
  botonCreditos.remove();
  obstaculos.push(new Obstaculo());
}

// pantalla de instrucciones
function mostrarInstrucciones() {
  image(instrucciones, 0, 0, width, height);
  botonInicio.remove();
  botonInstrucciones.remove();
  botonCreditos.remove();
  mostrarBotonVolver();
}

// pantalla de creditos
function mostrarCreditos() {
  image(creditos, 0, 0, width, height);
  botonInicio.remove();
  botonInstrucciones.remove();
  botonCreditos.remove();
  mostrarBotonVolver();
}

// volver al incio, se saca el boton de pantalla
function volverAlInicio() {
  botonVolver.remove();
  mostrarPantallaInicio();
}

// dibujo de fondo en sus momentos correspondientes, de intro y fondo de juego
function dibujarFondo() {
  if (juegoIniciado) {
    image(fondo, 0, 0, width, height); // mostrar el fondo de estrellas solo cuando el juego ha iniciado
  } else {
    image(intro, 0, 0, width, height); // mostrar la imagen de introducción si no se ha iniciado el juego
  }
}

// creacion de obstaculos
function actualizarObstaculos() {
  // se recorre la lista de obstaculos en un orden inverso para eliminar elementos de la lista durante la iteracion
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    obstaculos[i].mostrar(); // dibuja los obstaculos 
    obstaculos[i].mover(); // mueve los obstaculos

    // verifica colision y si es asi termina el juego mostrandio la pantalla de game over
    if (obstaculos[i].colision(disco)) {
      juegoTerminado = true;
      pantallaGameOver();
    }

    // verifica si el obstaculo salio del canva y lo elimina con un splice, el puntaje incrementa si el disco pasa el obstaculo
    if (obstaculos[i].fueraDePantalla()) {
      obstaculos.splice(i, 1);
    } else if (obstaculos[i].contarPuntaje(disco)) {
      obstaculosPasados++;
      velocidadBase += 0.5; // aumenta la dificultad
      if (velocidadBase > 10) {
        // limite maximo de velocidad
        velocidadBase = 10;
      }
      
      if (obstaculosPasados % 3 === 0) {
        puntaje++;
      }
    }
  }

  // generar nuevo obstáculo cada 60 frames, usando un índice para la secuencia
  if (frameCount % 60 == 0) {
    obstaculos.push(new Obstaculo(indiceObstaculos));
    indiceObstaculos++;
  }
}

function actualizarDisco() {
  disco.actualizar();
  if (disco.y > height || disco.y < 0) {
    disco.limitar();
  }
}

// funcion para mostrar el disco correspondiente, sea el roto o el disco normal
function mostrarDisco() {
  if (juegoTerminado) {
    image(imgRoto, disco.x, disco.y, 60, 50);
  } else {
    image(imgDisco, disco.x, disco.y, 50, 50);
  }
}

// puntaje
function mostrarPuntaje() {
  fill(255);
  textSize(32);
  textFont(fuente);
  textAlign(LEFT, TOP);
  text("Score: " + puntaje, 10, 10);
}

// teclas flechita up and down, ENTER para el restart
function keyPressed() {
  if (keyCode === UP_ARROW) {
    disco.arriba();
  } else if (keyCode === DOWN_ARROW) {
    disco.abajo();
  } else if (keyCode === ENTER) {
    if (juegoTerminado) {
      reiniciarJuego();
    }
  }
}

// al soltar la tecla se para el disco
function keyReleased() {
  if (keyCode === UP_ARROW) {
    disco.flechaArriba = false;
  } else if (keyCode === DOWN_ARROW) {
    disco.flechaAbajo = false;
  }
}

// pantalla game over, aparece un boton para reiniciar juego
function pantallaGameOver() {
  fill(0, 150); // transparencia
  rect(0, 0, width, height);

  textFont(fuente);
  textSize(64);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Game Over", width / 2, height / 2 - 50);

  // estilos del boton
  botonReinicio = createButton("Restart");
  botonReinicio.position(width / 2 - 50, height / 2 + 20);
  botonReinicio.style("background-color", "#5e548e");
  botonReinicio.style("border", "2px solid #fff");
  botonReinicio.style("color", "#fff");
  botonReinicio.style("padding", "10px 18px");
  botonReinicio.style("font-family", "Courier New");
  botonReinicio.style("font-size", "16px");
  botonReinicio.style("border-radius", "8px");
  botonReinicio.mousePressed(reiniciarJuego);
  botonReinicio.style("position", "absolute");
}

// RESTART
function reiniciarJuego() {
  puntaje = 0;
  velocidadBase = 6;
  disco = new configuracionDisco();
  obstaculos = [];
  obstaculos.push(new Obstaculo());
  juegoTerminado = false;
  obstaculosPasados = 0;
  botonReinicio.remove();
}

// disco propiedades
class configuracionDisco {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.velocidad = 0;
    this.velocidadArriba = -6; // velocidad hacia arriba cuando se mantiene presionada la flecha
    this.velocidadAbajo = 6; // velocidad hacia abajo cuando se mantiene presionada la flecha
    this.flechaArriba = false; // estado de la tecla de flecha hacia arriba
    this.flechaAbajo = false; // estado de la tecla de flecha hacia abajo
  }

  arriba() {
    this.flechaArriba = true; //  la flecha hacia arriba está presionada
  }

  abajo() {
    this.flechaAbajo = true; // la flecha hacia abajo está presionada
  }

    // velocidad de disco por parte de presionar las teclas
  actualizar() {
    this.velocidad *= 0.9;
    if (this.flechaArriba) {
      this.y += this.velocidadArriba; // aumentar la posición hacia arriba si la flecha está presionada
    } else if (this.flechaAbajo) {
      this.y += this.velocidadAbajo; // aumentar la posición hacia abajo si la flecha está presionada
    } else {
      this.y += this.velocidad; // movimiento normal
    }
  }

  limitar() {
    this.y = constrain(this.y, 0, height);
    this.velocidad = 0;
    this.flechaArriba = false; // Asegurarse de restablecer el estado cuando se limita la posición
    this.flechaAbajo = false; // Asegurarse de restablecer el estado cuando se limita la posición
  }
}

class Obstaculo {
  constructor(indice) {
    this.obsAlturas = [100, 200, 150, 250, 180]; // array de alturas predeterminada
    this.obsEspacio = 150; // espacio entre los obstáculos
    this.obsAncho = 70; // ancho de los obstáculos
    this.velocidad = velocidadBase; 
    this.puntajeContado = false;

    // determina la altura del obstáculo superior según la secuencia
    this.arriba = this.obsAlturas[indice % this.obsAlturas.length];
    this.abajo = height - (this.arriba + this.obsEspacio);
    this.x = width;
  }

  // metodo para el dibujo de rectangulo
  mostrar() {
    fill(255);
    rect(this.x, 0, this.obsAncho, this.arriba);
    rect(this.x, height - this.abajo, this.obsAncho, this.abajo);
  }

  // mueve el obstaculo a la izquierda del canva en relacion de la velocidad
  mover() {
    this.x -= this.velocidad; 
  }

  // evaluacion de si el disco esta siendo colisionado o no
  colision(disco) {
    // se verifica si el disco esta en el rango vertical del obstaculo
    if (disco.y < this.arriba || disco.y > height - this.abajo) {
      // se verifica si el disco esta en el rango horizontal del obstaculo, si lo esta hay colision
      if (disco.x > this.x && disco.x < this.x + this.obsAncho) {
        return true;
      }
    }
    return false;
  }

  fueraDePantalla() {
    return this.x < -this.obsAncho;
  }

  // si el jugador ya paso el obstaculo se cuenta el puntaje
  contarPuntaje(disco) {
    if (!this.puntajeContado && this.x < disco.x) {
      this.puntajeContado = true;
      return true;
    }
    return false;
  }
}
