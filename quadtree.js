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

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
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
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
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
    stroke(255);
    strokeWeight(0.5);
    noFill();
    rectMode(CENTER);
    rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.w * 2,
      this.boundary.h * 2
    );

    if (this.divided) {
      this.northEast.show();
      this.northWest.show();
      this.southEast.show();
      this.southWest.show();
    }

    for (let p of this.points) {
      strokeWeight(4);
      point(p.x, p.y);
    }
  }
}
