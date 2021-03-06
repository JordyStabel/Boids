class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = r * r;
  }

  contains(point) {
    // Check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rSquared;
  }

  intersects(range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    let r = this.r;
    let w = range.w;
    let h = range.h;

    let edges = Math.pow(xDist - w, 2) + Math.pow(yDist - h, 2);

    // No intersection
    if (xDist > r + w || yDist > r + h) return false;

    // Intersection within the circle
    if (xDist <= w || yDist <= h) return true;

    // Intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

let colors = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#7f8c8d",
  "#f39c12"
];

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.color =
      colors[
        treeCount
          .toString()
          .split("")
          .pop()
      ];
    this.divided = false;
    this.id = treeCount;
    treeCount++;
  }

  subDivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    let ne = new Rectangle(x + w, y - h, w, h);
    this.northEast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w, y - h, w, h);
    this.northWest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w, y + h, w, h);
    this.southEast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w, y + h, w, h);
    this.southWest = new QuadTree(sw, this.capacity);
    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      point.userData.setColor(this.color);
      point.userData.setId(this.id);
      return;
    }

    if (!this.divided) {
      this.subDivide();
    }

    return (
      this.northEast.insert(point) ||
      this.northWest.insert(point) ||
      this.southEast.insert(point) ||
      this.southWest.insert(point)
    );
  }

  query(range, foundPoints, searchedPoints, trees) {
    if (!foundPoints) {
      foundPoints = [];
    }

    if (!range.intersects(this.boundary)) {
      return { foundPoints, searchedPoints, trees };
    }

    trees.push(this);
    for (let p of this.points) {
      count++;
      searchedPoints.push(p);

      totalLoopCount++;
      if (range.contains(p)) {
        foundPoints.push(p);
      }
    }

    if (this.divided) {
      this.northWest.query(range, foundPoints, searchedPoints, trees);
      this.northEast.query(range, foundPoints, searchedPoints, trees);
      this.southWest.query(range, foundPoints, searchedPoints, trees);
      this.southEast.query(range, foundPoints, searchedPoints, trees);
    }

    return { foundPoints, searchedPoints, trees };
  }

  show() {
    let x = this.boundary.x;
    let y = this.boundary.y;

    stroke(this.color);
    strokeWeight(
      tiny ? 0.1 : this.points.length <= 0 ? 0.5 : this.points.length
    );
    noFill();
    rectMode(CENTER);
    rect(x, y, this.boundary.w * 2, this.boundary.h * 2);

    // Show id
    noStroke();
    fill(this.color);
    textSize(16);
    text(this.id, x, y);

    if (this.divided) {
      this.northEast.show();
      this.northWest.show();
      this.southEast.show();
      this.southWest.show();
    }
  }
}
