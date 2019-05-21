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
    fill(255, 255, 0);
    textSize(36);
    text(this.fps, this.x, this.y);
  }
}
