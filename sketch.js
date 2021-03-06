let flock = [];

let alignSlider, cohesionSlider, seperationSlider;

let paused = false;
let fps = 0;
let quadtree;
let count = 0;
let tiny = false;
let useTree = true;
let showTree = true;
let showSearched = false;
let showIds = true;

let totalLoopCount = 0;
let prevCount = 0;
let treeCount = 0;

// Camera movement & scaling
let zoom = 1;
let xPan = 0;
let yPan = 0;
let zoomIn = false;
let zoomOut = false;
let panUp = false;
let panDown = false;
let panLeft = false;
let panRight = false;

function setup() {
  createCanvas(900, 900);

  console.log(
    "Controls:\nMove: WASD\nZoom: Q & E\nReset view: R\nTiny: F\nUse Quadtree: T\nSearched info: G\nHide tree: H\nShow ID's: I\nPause: SPACE\nAdd boid: ENTER"
  );

  xPan = width / 2;
  yPan = height / 2;

  alignSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  seperationSlider = createSlider(0, 2, 1, 0.1);

  for (let i = 0; i < 4; i++) {
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
  this.fpsCounter = new FPS(25, 40);
  this.boidCounter = new FPS(25, 80);
  this.totalLoopCounter = new FPS(25, 120);
  this.loopsPerSecond = new FPS(25, 160);
  this.info = new Textfield();
}

function mouseClicked() {
  if (!paused) {
    flock.push(new Boid(mouseX, mouseY, 5));
  }
}

function keyPressed() {
  if (keyCode == 82) {
    zoom = 1;
    xPan = width / 2;
    yPan = height / 2;
    zoomIn = false;
    zoomOut = false;
    panUp = false;
    panDown = false;
    panLeft = false;
    panRight = false;
    tiny = false;
    paused = false;
    useTree = true;
    showTree = true;
    showSearched = false;
    showIds = true;
  }
  // ENTER
  if (keyCode == 13) {
    flock.push(new Boid(mouseX, mouseY, 5));
  }
  // F
  if (keyCode == 70) {
    tiny = !tiny;
  }
  // H
  if (keyCode == 72) {
    showTree = !showTree;
  }
  // I
  if (keyCode == 73) {
    showIds = !showIds;
  }
  // G
  if (keyCode == 71) {
    showSearched = !showSearched;
  }
  // T
  if (keyCode == 84) {
    useTree = !useTree;
  }
  // SPACE
  if (keyCode == 32) {
    paused = !paused;
  }
  // A
  if (keyCode == 65) {
    panLeft = true;
    panRight = false;
  }
  // D
  if (keyCode == 68) {
    panLeft = false;
    panRight = true;
  }
  // W
  if (keyCode == 87) {
    panUp = true;
    panDown = false;
  }
  // S
  if (keyCode == 83) {
    panUp = false;
    panDown = true;
  }
  // Q
  if (keyCode == 81) {
    zoomIn = false;
    zoomOut = true;
  }
  // E
  if (keyCode == 69) {
    zoomIn = true;
    zoomOut = false;
  }
}

function keyReleased() {
  if (keyCode == 65) {
    panLeft = false;
  }
  if (keyCode == 68) {
    panRight = false;
  }
  if (keyCode == 87) {
    panUp = false;
  }
  if (keyCode == 83) {
    panDown = false;
  }
  if (keyCode == 81) {
    zoomOut = false;
  }
  if (keyCode == 69) {
    zoomIn = false;
  }
}

function draw() {
  translate(width / 2, height / 2);
  scale(zoom);
  translate(-xPan, -yPan);

  if (zoomIn) {
    zoom *= 1.02;
  }
  if (zoomOut) {
    zoom /= 1.02;
  }
  if (panUp) {
    yPan -= 4 / zoom;
  }
  if (panDown) {
    yPan += 4 / zoom;
  }
  if (panLeft) {
    xPan -= 4 / zoom;
  }
  if (panRight) {
    xPan += 4 / zoom;
  }

  background(255);
  // && flock.length < 500
  if (!paused) {
    if (mouseIsPressed) {
      flock.push(new Boid(mouseX, mouseY, 5));
    }

    if (useTree) {
      treeCount = 0;
      let boundary = new Rectangle(
        width / 2,
        height / 2,
        width / 2,
        height / 2
      );
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

        totalLoopCount++;
      }
    } else {
      for (let boid of flock) {
        boid.edges();
        boid.flock(flock);
        boid.update();
        totalLoopCount++;
      }
    }
  }

  for (let boid of flock) {
    boid.show();
    totalLoopCount++;
  }

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

  if (useTree) {
    if (showTree) {
      quadtree.show();
    }

    if (showSearched) {
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

      // Show info
      noStroke();
      this.info.update(
        `PF: ${points.length}, PS: ${searchedPoints.length} & T: ${
          trees.length
        }`,
        mouseX,
        mouseY - height / 8
      );
      fill(0);
      textSize(14);
      this.info.show();

      for (let p of searchedPoints) {
        strokeWeight(10);
        stroke(255, 0, 255);
        point(p.x, p.y);
        totalLoopCount++;
      }
      for (let p of points) {
        stroke(0, 255, 0);
        point(p.x, p.y);
        totalLoopCount++;
      }

      //Draw boundaries of searched quadtrees
      stroke(255, 255, 0);
      strokeWeight(2.5);
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
    }
  }

  noStroke();
  this.fpsCounter.show();
  this.boidCounter.update(`# ${flock.length}`);
  this.boidCounter.show();
  this.totalLoopCounter.update(`# ${totalLoopCount}`);
  this.totalLoopCounter.show();
  this.loopsPerSecond.show();
}
