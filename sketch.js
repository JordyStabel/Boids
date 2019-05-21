const flock = [];
let paused = false;
let webSocket;

let alignSlider, cohesionSlider, seperationSlider;

let fps = 0;

function setup() {
  createCanvas(900, 720);
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  seperationSlider = createSlider(0, 2, 1, 0.1);
  for (let i = 0; i < 5; i++) {
    flock.push(new Boid(random(width), random(height)));
  }
  this.fpsCounter = new FPS();

  // Quadtree stuff
  let boundary = new Rectangle(200, 200, 200, 200);
  let qt = new QuadTree(boundary, 4);
  console.log(qt);

  for (let i = 0; i < 4; i++) {
    let p = new Point(random(400), random(400));
    console.log(p);

    qt.insert(p);
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

  background(70, 130, 180);

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
