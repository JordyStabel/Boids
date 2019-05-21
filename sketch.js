const flock = [];
let paused = false;
let webSocket;

let alignSlider, cohesionSlider, seperationSlider;

let fps = 0;
let quadtree;

function setup() {
  createCanvas(900, 900);
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  seperationSlider = createSlider(0, 2, 1, 0.1);
  for (let i = 0; i < 5; i++) {
    flock.push(new Boid(random(width), random(height)));
  }
  this.fpsCounter = new FPS();

  // Quadtree stuff
  let boundary = new Rectangle(450, 450, 450, 450);
  quadtree = new QuadTree(boundary, 4);

  for (let i = 0; i < 300; i++) {
    let x = randomGaussian(width / 2, width / 8);
    let y = randomGaussian(height / 2, height / 8);
    let p = new Point(x, y);
    quadtree.insert(p);
  }
}

function mouseClicked() {
  flock.push(new Boid(mouseX, mouseY));
}

function keyPressed() {
  paused = !paused;
}

function draw() {
  if (paused) {
    return;
  }

  if (
    mouseIsPressed &&
    mouseX < quadtree.boundary.w * 2 &&
    mouseX > 0 &&
    mouseY < quadtree.boundary.h * 2 &&
    mouseY > 0
  ) {
    for (let i = 0; i < 5; i++) {
      let m = new Point(mouseX, mouseY);
      quadtree.insert(m);
    }
  }

  background(70, 130, 180);

  quadtree.show();

  if (mouseIsPressed && flock.length < 80) {
    flock.push(new Boid(mouseX, mouseY));
  }

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }

  if (frameCount % 20 == 0) {
    this.fpsCounter.update(frameRate());
  }

  noStroke();
  this.fpsCounter.show();

  // noStroke();
  // textSize(36);
  // text(`${int(frameRate())}`, 25, 55);
}
