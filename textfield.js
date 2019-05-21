class Textfield {
  constructor(x, y) {
    this.position = createVector(x, y);
  }

  update(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  show() {
    fill(255);
    textSize(12);
    text(
      `[${int([this.position.x])},${int([this.position.y])}]`,
      this.position.x,
      this.position.y
    );
  }
}
