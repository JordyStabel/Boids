let neighbours = [];
let noNeighour = true;

class Boid {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.size = size;
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.color = color(0);
    this.textfield = new Textfield("NaN");
    this.range = 50;
    this.id = -1;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    // Get the average velocity of all surrounding boids in a certain range from the 'main' boid\
    let trajectory = createVector();
    let inRange = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < this.range) {
        trajectory.add(other.velocity);
        inRange++;
      }
    }
    if (inRange > 0) {
      // Get the average trajectory
      trajectory.div(inRange);

      // Substract this trajectory from the average trajectory
      trajectory.setMag(this.maxSpeed);
      trajectory.sub(this.velocity);
      trajectory.limit(this.maxForce);
    }
    totalLoopCount++;
    return trajectory;
  }

  cohesion(boids) {
    let trajectory = createVector();
    let inRange = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < this.range) {
        trajectory.add(other.position);
        inRange++;
      }
    }
    if (inRange > 0) {
      trajectory.div(inRange);
      trajectory.sub(this.position);
      trajectory.setMag(this.maxSpeed);
      trajectory.sub(this.velocity);
      trajectory.limit(this.maxForce);
    }
    totalLoopCount++;
    return trajectory;
  }

  separation(boids) {
    let trajectory = createVector();
    let inRange = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < this.range) {
        let difference = p5.Vector.sub(this.position, other.position);
        difference.div(pow(distance, 2));
        trajectory.add(difference);
        inRange++;
        if (!noNeighour) {
          neighbours.push(other);
        }
      } else {
        neighbours.splice(neighbours.indexOf(other), 1);
        this.noNeighour = true;
        //this.setColor(0);
      }
    }
    if (inRange > 0) {
      trajectory.div(inRange);
      trajectory.setMag(this.maxSpeed);
      trajectory.sub(this.velocity);
      trajectory.limit(this.maxForce);

      this.size = 5 + inRange / 4;

      //this.color = color(inRange * 10);

      //this.setColor(this.color);
    }
    totalLoopCount++;
    return trajectory;
  }

  setColor(color) {
    this.color = color;
  }

  setId(id) {
    this.id = id;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let seperation = this.separation(boids);

    seperation.mult(seperationSlider.value());
    cohesion.mult(cohesionSlider.value());
    alignment.mult(alignSlider.value());

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(seperation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(
      this.position.x,
      this.position.y,
      tiny ? 1 : Math.pow(this.size, 1.5)
    );

    // Show id
    this.textfield.update(this.id, this.position.x, this.position.y);
    this.textfield.show();
  }
}
