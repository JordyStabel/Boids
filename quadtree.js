class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
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
    let w = this.boundary.w;
    let h = this.boundary.h;

    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northEast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northWest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southEast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
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
    } else {
      if (!this.divided) {
        this.subDivide();
      }

      if (this.northEast.insert(point)) {
        return true;
      } else if (this.northWest.insert(point)) {
        return true;
      } else if (this.southEast.insert(point)) {
        return true;
      } else if (this.southWest.insert(point)) {
        return true;
      }
    }
  }

  query(range, foundPoints, searchedPoints, trees) {
    if (!this.boundary.intersects(range)) {
      return;
    } else {
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
