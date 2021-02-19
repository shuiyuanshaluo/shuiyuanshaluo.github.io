/*
* File Name / .js
* Created Date / Dec 12, 2020
* Aurhor / Toshiya Marukubo
* Twitter / https://twitter.com/toshiyamarukubo
*/

/*
  Common Tool.
*/

class Tool {
  // random number.
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      "rgb(" +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ")"
    );
  }
  // random color hsl.
  static randomColorHSL(hue, saturation, lightness) {
    return (
      "hsl(" +
      hue +
      ", " +
      saturation +
      "%, " +
      lightness +
      "%)"
    );
  }
  // gradient color.
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = cr + "," + cg + "," + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + ", " + (ca * 1) + ")");
    g.addColorStop(0.5, "rgba(" + col + ", " + (ca * 0.5) + ")");
    g.addColorStop(1, "rgba(" + col + ", " + (ca * 0) + ")");
    return g;
  }
  // framerate
  static calcFPS() {
    const now = (+new Date());
    const fps = 1000 / (now - lastTime);
    lastTime = now;
    return fps.toFixed();
  }
}

/*
  When want to use angle.
*/

class Angle {
  constructor(angle) {
    this.a = angle;
    this.rad = this.a * Math.PI / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = this.a * Math.PI / 180;
    return this.rad;
  }
}

let canvas;
let lastTime = 0; // to use framerate.

class Canvas {
  constructor(bool) {
    // create canvas.
    this.canvas = document.createElement("canvas");
    // if on screen.
    if (bool === true) {
      this.canvas.style.position = 'relative';
      this.canvas.style.display = 'block';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      document.getElementsByTagName("body")[0].appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // mouse infomation.
    this.mouseX = null;
    this.mouseY = null;
    this.mouseZ = null;
    // shape
    this.shapeNum = 12;
    this.shapes = [];
  }
  
  // init, render, resize
  init() {
    for (let i = 0; i < this.shapeNum; i++) {
      const s = new Shape(this.ctx, this.width / 2, this.height / 2, i);
      this.shapes.push(s);
    }
  }

  render() {
    var that = this;
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render();
    }
    this.drawFPS();
    requestAnimationFrame(function() {
      that.render();
    });
  }

  drawFPS() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '16px sans-selif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(Tool.calcFPS() + ' FPS', this.width, this.height);
    ctx.restore();
  }
  
  resize() {
    this.shapes = [];
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.init();
  }
}

/*
  Shape class.
*/

class Shape {
  constructor(ctx, x, y, i) {
    this.ctx = ctx;
    this.init(x, y, i);
  }

  init(x, y, i) {
    this.i = i + 1;
    this.num = this.i * 10;
    this.a = new Angle(15);
    this.r = 50 * this.i;
    this.ri = this.r;
    this.s = (this.r * 2 * Math.PI / this.num) / 2;
    this.si = this.s;
    this.c = 'white';
    this.x = x;
    this.y = y;
    this.rad = Math.PI / 5 * 4;
    this.a1 = new Angle(360 / this.num);
    this.a2 = new Angle(180);
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.a2.rad);
    ctx.scale(Math.sin(this.a2.rad) * 2 + 3, Math.sin(this.a2.rad) * 2 + 3);
    ctx.translate(-this.x, -this.y);
    for (let i = 0; i < this.num; i++) {
      ctx.save();
      ctx.translate(Math.cos(i * this.a1.rad) * this.r + this.x, Math.sin(i * this.a1.rad) * this.r + this.y);
      ctx.rotate(i * this.a1.rad);
      ctx.translate(-(Math.cos(i * this.a1.rad) * this.r + this.x), -(Math.sin(i * this.a1.rad) * this.r + this.y));
      ctx.fillStyle = 'hsl(' + this.a1.a * i + ', 80%, 60%)';
      ctx.globalCompositeOperation = 'xor';
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const x = Math.cos(j * this.rad) * this.s + Math.cos(i * this.a1.rad) * this.r + this.x;
        const y = Math.sin(j * this.rad) * this.s + Math.sin(i * this.a1.rad) * this.r + this.y;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  
  updateParams() {
    if (Math.sin(Date.now() / 3000) < 0) {
      this.s = Math.sin(Date.now() / 3000) * 200 + this.si;
    } else {
      this.s = -Math.sin(Date.now() / 3000) * 200 + this.si;
    }
    this.a2.incDec(0.1);
  }
  
  render() {
    this.draw();
    this.updateParams();
  }
}

(function () {
  "use strict";
  window.addEventListener("load", function () {
    canvas = new Canvas(true);
    canvas.init();
    canvas.render();
    // event
    window.addEventListener("resize", function() {
      canvas.resize();
    }, false);
  });
})();