const flock = [];
let paused = false;
let webSocket;

let alignSlider, cohesionSlider, seperationSlider;

let fps = 0;
let quadtree;
let count = 0;

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
  // let boundary = new Rectangle(450, 450, 450, 450);
  // quadtree = new QuadTree(boundary, 4);

  // for (let i = 0; i < 300; i++) {
  //   let x = randomGaussian(width / 2, width / 8);
  //   let y = randomGaussian(height / 2, height / 8);
  //   let p = new Point(x, y);
  //   quadtree.insert(p);
  // }
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

  // if (
  //   mouseIsPressed &&
  //   mouseX < quadtree.boundary.w * 2 &&
  //   mouseX > 0 &&
  //   mouseY < quadtree.boundary.h * 2 &&
  //   mouseY > 0
  // ) {
  //   for (let i = 0; i < 5; i++) {
  //     let m = new Point(mouseX, mouseY);
  //     quadtree.insert(m);
  //   }
  // }

  background(70, 130, 180);

  let boundary = new Rectangle(450, 450, 450, 450);
  quadtree = new QuadTree(boundary, 4);

  quadtree.show();

  if (mouseIsPressed && flock.length < 200) {
    flock.push(new Boid(mouseX, mouseY));
  }

  for (let boid of flock) {
    let range = new Rectangle(boid.position.x, boid.position.y, 2, 2);
    let points = [];
    let searchedPoints = [];
    let trees = [];
    let others = quadtree.query(range, points, searchedPoints, trees);
    boid.edges();
    boid.flock(others);
    boid.update();

    let p = new Point(boid.position.x, boid.position.y, boid);
    quadtree.insert(p);

    boid.show();
  }

  // One second timer
  if (frameCount % 20 == 0) {
    this.fpsCounter.update(frameRate());
  }

  count = 0;

  noFill();
  stroke(0, 255, 0);
  strokeWeight(2);
  rectMode(CENTER);
  let range = new Rectangle(mouseX, mouseY, width / 8, height / 8);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  let points = [];
  let searchedPoints = [];
  let trees = [];
  quadtree.query(range, points, searchedPoints, trees);
  for (let p of searchedPoints) {
    strokeWeight(6);
    stroke(255, 0, 255);
    point(p.x, p.y);
  }
  for (let p of points) {
    stroke(0, 255, 0);
    point(p.x, p.y);
  }
  // console.log(count);
  // console.log(trees);
  // console.log(searchedPoints);
  // console.log(points);

  // Draw boundaries of searched quadtrees
  stroke(255, 255, 0);
  strokeWeight(1.5);
  noFill();
  rectMode(CENTER);
  for (let tree of trees) {
    rect(
      tree.boundary.x,
      tree.boundary.y,
      tree.boundary.w * 2,
      tree.boundary.h * 2
    );
  }

  noStroke();
  this.fpsCounter.show();
}
