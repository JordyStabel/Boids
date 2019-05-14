const flock = [];
let paused = false;

let alignSlider, cohesionSlider, seperationSlider;

function setup() {
  createCanvas(900, 600);
  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  seperationSlider = createSlider(0, 2, 1, 0.1);
  for (let i = 0; i < 5; i++) {
    flock.push(new Boid(random(width), random(height)));
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

  if (mouseIsPressed && flock.length < 100) {
    flock.push(new Boid(mouseX, mouseY));
  }

  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}
