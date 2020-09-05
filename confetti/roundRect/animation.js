var PI = Math.PI;
var DEG_TO_RAD = PI / 180;

function random(start, stop) {
  if (start > stop) {
    var temp = start;
    start = stop;
    stop = temp;
  }
  return Math.round(Math.random() * (stop - start) + start);
}

function constrain(num, min, max){
  const MIN = min || 1;
  const MAX = max || 20;
  const parsed = parseInt(num);
  return Math.min(Math.max(parsed, MIN), MAX);
}

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0
}

Vector.prototype = {
  get: function () {
    return new Vector(this.x, this.y);
  },
  set: function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },
  add: function (v) {
    this.x += v.x;
    this.y += v.y;
  },
  mult: function (n) {
    this.x *= n;
    this.y *= n;
  },
  div: function (n) {
    this.x /= n;
    this.y /= n;
  },
  mag: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  normalize: function () {
    var m = this.mag();
    if (m !== 0) {
      this.div(m);
    }
  },
  limit: function (max) {
    if (this.mag() > max) {
      this.normalize();
      this.mult(max);
    }
  }
};


var Particle = function(options) {
  this.ctx = options.ctx;
  this.wEdge = options.wEdge;
  this.hEdge = options.hEdge;
  this.width = options.width;
  this.height = options.height;
  this.position = options.position;
  this.cosA = 1.0;
  this.colors = [['#ffd700', '#8c7600'], ['#fb8988', '#894949'], ['#3dab52', '#23622f'], ['#42c9db', '#236b74']];
  this.color = this.colors[random(0, 3)];
  this.range = 1;
  this.rotation = DEG_TO_RAD * random(0, 360);
  this.velocity = new Vector();
  this.acceleration = new Vector();
  this.aVelocity = 0;
  this.aAcceleration = 0.01;
  this.corners = [];
  this.angle = -DEG_TO_RAD * 135;
  this.mass = 10;
  // this.mass = random(5, 10);

  for (var i = 0; i < 4; i++) {
    var dx = Math.cos(this.angle + (DEG_TO_RAD * i * 90));
    var dy = Math.sin(this.angle + (DEG_TO_RAD * i * 90));

    var v = new Vector(dx, dy);
    v.mult(this.mass);

    this.corners[i] = v;
  }
};

Particle.prototype = {
  applyForce: function(force) {
    var f = force.get();
    f.div(this.mass);
    this.acceleration.add(f);
  },
  update: function() {
    this.rotationSpeed = random(800, 1400) * 0.005;
    this.rotation += this.rotationSpeed;
    this.cosA = Math.cos(DEG_TO_RAD * this.rotation);

    if (this.velocity.x < -this.range) {
      this.velocity.x = -this.range;
      this.acceleration.x *= -1;
    } else if (this.velocity.x > this.range) {
      this.velocity.x = this.range;
      this.acceleration.x *= -1;
    }

    this.aAcceleration = this.acceleration.x * 10;
    this.aVelocity += this.aAcceleration;
    this.aVelocity = constrain(this.aVelocity, -0.1, 0.1);
    this.angle += this.aVelocity;

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.acceleration.mult(0);

    this.display();
  },
  display: function() {
    const width = 10;
    const height = 10;
    const x = this.position.x;
    const y = this.position.y;
    const absCosA = Math.abs(this.cosA);
    let radius = 5;
    radius = {tl: radius, tr: radius, br: radius, bl: radius};

    if (this.cosA > 0) {
      this.ctx.fillStyle = this.color[0];
    } else {
      this.ctx.fillStyle = this.color[1];
    }

    this.ctx.beginPath();

    this.ctx.save();

    this.ctx.translate(x, y);
    this.ctx.rotate(this.angle);
    this.ctx.translate(-x, -y);

    this.ctx.moveTo(x + radius.tl + this.corners[0].x, y + this.corners[0].y * absCosA );
    this.ctx.lineTo(x + width - radius.tr  + this.corners[1].x, y + this.corners[1].y * absCosA);
    this.ctx.quadraticCurveTo(x + width + this.corners[1].x, y + this.corners[1].y * absCosA, x + width + this.corners[1].x, y + radius.tr + this.corners[1].y * absCosA);

    this.ctx.lineTo(x + width + this.corners[2].x, y + height - radius.br + this.corners[2].y * absCosA);
    this.ctx.quadraticCurveTo(x + width + this.corners[2].x, y + height + this.corners[2].y * absCosA, x + width - radius.br + this.corners[2].x, y + height + this.corners[2].y * absCosA);

    this.ctx.lineTo(x + radius.bl + this.corners[3].x, y + height + this.corners[3].y * absCosA);
    this.ctx.quadraticCurveTo(x + this.corners[3].x, y + height + this.corners[3].y * absCosA, x + this.corners[3].x, y + height - radius.bl + this.corners[3].y * absCosA);

    this.ctx.lineTo(x + this.corners[0].x , y + radius.tl + this.corners[0].y * absCosA);
    this.ctx.quadraticCurveTo(x + this.corners[0].x, y + this.corners[0].y * absCosA, x + radius.tl + this.corners[0].x, y + this.corners[0].y * absCosA);

    this.ctx.restore();

    this.ctx.closePath();
    this.ctx.fill();
  },
  overEdge: function () {
    return this.position.y > this.hEdge || this.position.x > this.wEdge || this.position.x < 0;
  }
};

var SnowyParticle = function(canvas) {
  this.canvas = canvas;
  this.ctx = this.canvas.getContext('2d');

  this.init();
};

SnowyParticle.prototype = {
  init: function() {
    this.particleSize = 10;
    this.particles = [];

    this.setCanvasSize();
    this.addParticles();
  },
  setCanvasSize: function() {
    this.canvasWidth = $(window).width();
    this.canvasHeight = $(document).height();
    this.canvas.width =  this.canvasWidth;
    this.canvas.height =  this.canvasHeight;

    $(this.canvas).height( this.canvasHeight );
  },
  addParticles: function() {
    for (var i = 0; i < this.particleSize; i++) {
      this.makeParticle('init');
    }
  },
  makeParticle: function(s) {
    var particle = new Particle({
      ctx: this.ctx,
      wEdge: this.canvasWidth,
      hEdge: this.canvasHeight,
      position: new Vector(random(0, this.canvasWidth), s === 'init' ? random(0, this.canvasHeight) : 0)
    });

    this.particles.push(particle)
  },
  applyForce: function(f){
    for(var i = 0; i < this.particles.length; i++){
      this.particles[i].applyForce(f);
    }
  },
  update: function() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var gravity = new Vector(0, 0.01 * p.mass);
      var wind = new Vector(random(-1, 1), 0);

      var c = 0.01;
      var normal = 2;
      var frictionMag = c * normal;
      var friction = p.velocity.get();

      friction.mult(-1);
      friction.normalize();
      friction.mult(frictionMag);

      p.applyForce(friction);
      p.applyForce(wind);
      p.applyForce(gravity);

      if (p.overEdge()) {
        this.particles.splice(i, 1);
        this.makeParticle();
      }

      p.update();
    }
  }
};
