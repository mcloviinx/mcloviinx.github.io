var inputParticlesCount, inputMinDist, inputStrokeWeight, inputParticleRadius;
var mouseRepusionRadius, checkbox, lineAlpha;
var particles = [];

/****DOM elements****/
function startup(){
    inputParticlesCount = createInputRange('10', '300', '50', '#content--options_particles', 'particleslength');
    inputParticlesCount.addEventListener('input', function(){
        if (this.value > particles.length){
            var dif = this.value - particles.length;
            for (var i = 0; i < dif; i++){
                particles.push(new Particle());
            }
        } else if (this.value != particles.length){
            particles.length = this.value;
        }
    });
    inputMinDist = createInputRange('10', '100', '60', '#content--options_mindist', 'mindistinfo');
    inputStrokeWeight = createInputRange('1', '15', '2', '#content--options_strokeweight', 'strokeweightinfo');
    lineAlpha = createInputRange('1','255','150', '#content--options_linealpha','linealpha');
    inputParticleRadius = createInputRange('1', '30', '2','#content--options_particleradius', 'particleradius');
    mouseRepusionRadius = createInputRange('50', '200', '150', '#content--options_repulsionradius', 'repulsionradius');
    checkbox = createInputCheckBox();
    var button = document.getElementById('hidebutton').addEventListener('click', function(){
        var content = document.getElementById('menu-opc');
        if (content.style.display == "none"){
            content.style.display = "flex";
            this.innerText = "Hide menu";
        } else {
            content.style.display = "none";
            this.innerText = "Show menu";
        }
        windowResized();
    });
}

function createInputCheckBox(){
    var parent = document.getElementById('content--options_limitvelocity');
    var cb = document.createElement('input');
    var attributes = ['type','class']
    var values = ['checkbox', 'content--options__checkbox']
    for (var i in attributes){cb.setAttribute(attributes[i], values[i])};
    cb.checked = true;
    parent.append(cb);
    return cb;
}

function createInputRange(min, max, value, idParent, idInfo){
    var parent = document.querySelector(idParent);
    var input = document.createElement('input');
    var attributes = ['type','class','min','value','max']
    var values = ['range', 'input--label-option', min, value, max];
    for (var i in attributes){input.setAttribute(attributes[i], values[i])}
    var span = document.createElement('span');
    span.setAttribute('id', idInfo);
    span.innerText = input.value;
    input.addEventListener('input', function(){
        var s = document.getElementById(idInfo);
        s.innerText = input.value;
    });
    parent.append(input);
    parent.append(span);
    return input;
}

/****p5.js canvas****/
function setup(){
    //startup();
    var element = document.getElementById("anim-content");
    var myCanvas = createCanvas(element.offsetWidth, element.clientHeight);
    myCanvas.parent("anim-content");
    mainCanvas = myCanvas.canvas;
    for (var i = 0; i < inputParticlesCount.value; i++) {
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
    var element = document.getElementById("animation");
    resizeCanvas(element.offsetWidth, element.offsetHeight);
}
class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector();
        this.acc = createVector();
        this.par = 3;
        this.pac = this.randomColor();
    }
    show() {
        fill(this.pac.r, this.pac.g, this.pac.b);
        noStroke();
        ellipse(this.pos.x, this.pos.y, inputParticleRadius.value * 2, inputParticleRadius.value * 2);
    }
    drawLines(others, j){
        var sqrMinDist = Math.pow(inputMinDist.value, 2);
        for (var i = j + 1; i < others.length; i++) {
            var ot = others[i];
            var dx = ot.pos.x - this.pos.x;
            var dy = ot.pos.y - this.pos.y;
            var sqrDist = dx * dx + dy * dy;
            if (sqrDist < sqrMinDist){
                stroke(this.pac.r, this.pac.g, this.pac.b, Number(lineAlpha.value));//, map(sqrDist, 0, sqrMinDist, 255, 0));
                strokeWeight(inputStrokeWeight.value)
                line(this.pos.x, this.pos.y, ot.pos.x, ot.pos.y);
            }
        }
    }
    addMouseForce(){
        var mouse = createVector(mouseX, mouseY);
        var target = p5.Vector.sub(this.pos, mouse);
        if (target.magSq() < Math.pow(mouseRepusionRadius.value, 2)) {
            target.normalize();
            this.acc.add(target);
            this.vel.add(this.acc);
            if (checkbox.checked) this.vel.limit(6);
        } else {
            this.addRandomForce()
            this.vel.add(this.acc);
            if (checkbox.checked) this.vel.limit(1);
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