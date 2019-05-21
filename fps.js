class FPS {
  constructor() {
    this.fps = 0;
  }

  update(fps) {
    this.fps = fps;
  }

  show() {
    textSize(36);
    text(`${int(this.fps)}`, 25, 50);
  }
}
