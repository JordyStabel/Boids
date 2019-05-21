const flock = [];
let paused = false;
let webSocket;

let alignSlider, cohesionSlider, seperationSlider;

let fps = 0;
let quadtree;
let count = 0;

let totalLoopCount = 0;
let prevCount = 0;

function setup() {
  createCanvas(900, 900);

  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  seperationSlider = createSlider(0, 2, 1, 0.1);

  // Create a flock of boids
  for (let i = 0; i < 5; i++) {
    flock.push(
      new Boid(
        randomGaussian(width / 2, width / 8),
        randomGaussian(height / 2, height / 8),
        5
      )
    );
    totalLoopCount++;
  }

  // Counter
  this.fpsCounter = new FPS(25, 50);
  this.boidCounter = new FPS(25, 100);
  this.totalLoopCounter = new FPS(25, 150);
  this.loopsPerSecond = new FPS(25, 200);
}

function mouseClicked() {
  flock.push(new Boid(mouseX, mouseY, 5));
}

function keyPressed() {
  paused = !paused;
}

function draw() {
  if (paused) {
    return;
  }

  background(70, 130, 180);

  if (mouseIsPressed && flock.length < 500) {
    flock.push(new Boid(mouseX, mouseY, 5));
  }

  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  quadtree = new QuadTree(boundary, 4);

  for (let boid of flock) {
    let p = new Point(boid.position.x, boid.position.y, boid);
    quadtree.insert(p);
    totalLoopCount++;
  }

  for (let boid of flock) {
    let range = new Circle(boid.position.x, boid.position.y, boid.range);

    let foundPoints = [];
    let searchedPoints = [];
    let trees = [];
    quadtree.query(range, foundPoints, searchedPoints, trees);

    let inRange = [];

    for (let point of foundPoints) {
      inRange.push(point.userData);
      totalLoopCount++;
    }

    boid.edges();
    boid.flock(inRange);
    boid.update();

    boid.show();
    totalLoopCount++;
  }

  quadtree.show();

  // 1/3 second timer
  if (frameCount % 20 == 0) {
    this.fpsCounter.update(`FPS: ${int(frameRate())}`);
  }

  // One second timer
  if (frameCount % 60 == 0) {
    this.loopsPerSecond.update(
      `${int((totalLoopCount - prevCount) / 60)} Loop/sec`
    );
    prevCount = totalLoopCount;
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
    totalLoopCount++;
  }
  for (let p of points) {
    stroke(0, 255, 0);
    point(p.x, p.y);
    totalLoopCount++;
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
    totalLoopCount++;
  }

  noStroke();
  this.fpsCounter.show();
  this.boidCounter.update(`# ${flock.length}`);
  this.boidCounter.show();
  this.totalLoopCounter.update(`# ${totalLoopCount}`);
  this.totalLoopCounter.show();
  this.loopsPerSecond.show();
}
