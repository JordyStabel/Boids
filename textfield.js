class Textfield {
  constructor(x, y) {
    this.position = createVector(x, y);
  }

  update(id, x, y) {
    this.id = id;
    this.position.x = x;
    this.position.y = y;
  }

  show() {
    fill(0);
    textSize(4);
    text(`${this.id}`, this.position.x, this.position.y);
  }
}
