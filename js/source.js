var rngParticles, 
    rngParticlesSize,
    rngStrokeWeight,
    rngStrokeMinDist,
    rngStrokeAlpha,
    rngMouseRepulsion;

var sqrStrokeMinDist;
var sqrMouseRepulsion;

var particles = [];

function loadInputs(){
    rngParticles = configInputRange('i-particles', 'r-particles', '10', '75', '300');
    rngParticlesSize = configInputRange('i-particles-size', 'r-particles-size', '1', '4', '20');
    rngStrokeWeight = configInputRange('i-stroke-weight', 'r-stroke-weight', '1', '4', '20');
    rngStrokeMinDist = configInputRange('i-stroke-mindist', 'r-stroke-mindist', '5', '75', '200');
    rngStrokeAlpha = configInputRange('i-stroke-alpha', 'r-stroke-alpha', '1', '150', '255');
    rngMouseRepulsion = configInputRange('i-mouse-repulsion', 'r-mouse-repulsion', '10', '50', '200');
    rngParticles.addEventListener('input', function(){
        if (this.value > particles.length){
            for (var i = 0; i < this.value - particles.length; i++){
                particles.push(new Particle());
            }
        } else if (particles.length != this.value){
            particles.length = this.value;
        }
    })
    rngStrokeMinDist.addEventListener('input', function(){
        sqrStrokeMinDist = Math.pow(this.value, 2);
    });
    rngMouseRepulsion.addEventListener('input', function(){
        sqrMouseRepulsion = Math.pow(this.value, 2);
    })
    sqrStrokeMinDist = Math.pow(rngStrokeMinDist.value, 2);
    sqrMouseRepulsion = Math.pow(rngMouseRepulsion.value, 2);
}
function configInputRange(id, pId, min, value, max){
    var input = document.getElementById(id);
    var attributes = ['min', 'value', 'max'];
    var values = [min, value, max];
    for (i in attributes){
        input.setAttribute(attributes[i], values[i]);
    }
    var parent = document.getElementById(pId);
    var td = document.createElement('td');
    td.innerText = input.value;
    parent.append(td);
    input.addEventListener('input', function(){
        td.innerText = this.value;
    });
    return input;
}
function setup(){
    loadInputs();
    var element = document.getElementById("anim-content");
    var myCanvas = createCanvas(element.offsetWidth, element.clientHeight);
    myCanvas.parent("anim-content");
    mainCanvas = myCanvas.canvas;
    for (var i = 0; i < rngParticles.value; i++) {
        particles.push(new Particle());
    }
}
function draw(){
    background(10);
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.show();
        p.drawLines(particles, i);
        p.addMouseForce();
        p.checkEdges();
    }
}
function windowResized() {
    var element = document.getElementById("anim-content");
    resizeCanvas(element.offsetWidth, element.offsetHeight);
}
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector();
        this.acc = createVector();
        this.pac = this.randomColor();
    }
    show() {
        fill(this.pac.r, this.pac.g, this.pac.b);
        noStroke();
        ellipse(this.pos.x, this.pos.y, rngParticlesSize.value, rngParticlesSize.value);
    }
    drawLines(others, j){
        for (var i = j + 1; i < others.length; i++) {
            var ot = others[i];
            var dx = ot.pos.x - this.pos.x;
            var dy = ot.pos.y - this.pos.y;
            var sqrDist = dx * dx + dy * dy;
            if (sqrDist < sqrStrokeMinDist){
                stroke(this.pac.r, this.pac.g, this.pac.b, Number(rngStrokeAlpha.value))
                strokeWeight(rngStrokeWeight.value)
                line(this.pos.x, this.pos.y, ot.pos.x, ot.pos.y);
            }
        }
    }
    addMouseForce(){
        var mouse = createVector(mouseX, mouseY);
        var target = p5.Vector.sub(this.pos, mouse);
        if (target.magSq() < sqrMouseRepulsion) {
            target.normalize();
            this.acc.add(target);
            this.vel.add(this.acc);
            this.vel.limit(6);
        } else {
            this.addRandomForce()
            this.vel.add(this.acc);
            this.vel.limit(1);
        }
        this.update();
    }
    addRandomForce(){
        this.acc = p5.Vector.random2D();
        this.acc.mult(.1);
    }
    update(limit){
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
    checkEdges(){
        if (this.pos.x > width){
            this.pos.x = 0;
        } else if (this.pos.x < 0){
            this.pos.x = width;
        }
        if (this.pos.y > height){
            this.pos.y = 0;
        } else if (this.pos.y < 0){
            this.pos.y = height;
        }
    }
    randomColor(){
        return {
            r: random(255),
            g: random(255),
            b: random(255)
        }
    }
}