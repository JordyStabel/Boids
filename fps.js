class FPS {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.fps = 0;
  }

  update(fps) {
    this.fps = fps;
  }

  show() {
    fill(0);
    textSize(25);
    text(this.fps, this.x, this.y);
  }
}
