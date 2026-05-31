let bgm;
let press;
let dull;
let entities=[];
let entitie_count=8;
let kimo_img;
let bon=44;

let ms_x=0.0010;
let ms_y=0.0025;
let click_count=0; 
let is_fre=false;

let drops=[];
let drop_count=50;
let wind_force=4;
let base_length=10;
function preload(){
  kimo_img=loadImage('kkiki.png');
  sank_img=loadImage('sabnk.png');
  bgm = loadSound('bowa.mp3');
  press= loadSound('press.mp3');
  dull= loadSound('dull.mp3');
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup(){
  //createCanvas(400, 400);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  kimo_img.resize(300, 0); 
  sank_img.resize(200, 0);
  userStartAudio(); 
  if (!bgm.isPlaying()) {
    bgm.loop();
  }
  bgm.setVolume(0.3);
  press.setVolume(0.2);
  dull.setVolume(0.7);
  noSmooth();
  imageMode(CENTER);
  angleMode(DEGREES);
  colorMode(HSB,360,100,100);
  for (let i=0;i<entitie_count;i++){
    entities.push({
      tx: random(0,10000),
      ty: random(0,10000),
      angle: random(0,360),
      rotSpeed: random(-3,3),
      tHue: random(0,10000)
    });
  }
  for(let i=0;i<drop_count;i++){
    drops.push({
      x: random(-200,width+200),
      y: random(-400,height),
      length: random(base_length, 50),
      speed: random(5,15)
    });
  }
}

function draw(){
  fill(255,20,20, 3);
  rect(0,0,width,height);
  if (random() < 0.002){
    background(0,0,0); 
  }
  let interval=200;
  let offset =frameCount%interval;
  tint(0,0,50);
  //はいけい
  for(let y=-interval;y<height+interval;y+=interval){
    for(let x=-interval;x<width+interval;x+=interval){
      if(random()<0.001)offset=0;
      push();
      translate(x+offset,y+offset);
      rotate(frameCount *1.2);
      //image(sank_img,x+offset,y+offset,100,100);
      image(sank_img,0,0,200,200);
      pop();
    }
  }
  noTint();
  
  // 雨粒
  if(frameCount%120==0)wind_force=random(-50,50);
  stroke(random(0,255),random(0,255),random(0,255),255);
  strokeWeight(1); 
  for (let i=0; i<drops.length;i++){
    let d=drops[i];
    line(d.x,d.y,d.x+wind_force*(d.length/base_length),d.y+d.length);
    d.y=d.y+d.speed;
    d.x=d.x+wind_force;
    if(d.y>height){
      d.y=random(-100,-10);
      d.x=random(0, width);
    }
  }
  noStroke();
  
  for (let i=0;i<entities.length;i++){
    let e=entities[i];
    let x,y;
    if(is_fre){
      let r=i%3;
      //y=(r===0)?height*0.3:height*0.7;
      if(r===0){
          y=height*0.2;
      }else if(r===1){
          y=height*0.5;
      }else{
          y=height*0.8;
      }
      loop_width=width+300;
      x=((floor(i/3)*130+frameCount*2)%loop_width)-100;
      e.angle=frameCount;
    }else{
      x=map(noise(e.tx),0.2,0.8,0,width);
      y=map(noise(e.ty),0.2,0.8,0,height);
      e.angle=e.angle+e.rotSpeed;
    }
    let currentHue=(e.tHue*1000)%360;
    push();
    translate(x,y);
    rotate(e.angle);
    tint(currentHue, 100, 100);
    if(random()>0.6)blendMode(ADD);
    let size_rand=map(noise(e.tx+1000),0.2,0.8,130,300);
    image(kimo_img,0,0,size_rand,size_rand);
    blendMode(BLEND);
    noTint();
    pop();
    e.tx=e.tx+ms_x;
    e.ty=e.ty+ms_y;
    e.tHue=e.tHue+0.005;
  }
    push();
    rectMode(CENTER);
    if (random()>0.3){
       fill(0,0,100,random(50,150));
        let noise_x=random(0,width);
        let noise_y=random(0,height);
        let noise_width=random(50,300);
        let noise_height=random(10,50);
        fill(random(0,150),random(0,150),random(0,150),random(50,150));
        if(random()<0.6)rect(noise_x,noise_y,noise_width,noise_height);
        fill(random(0,150),random(0,150),random(0,150),random(50,150));
        if(random()<0.2)circle(random(0,width),random(0,height),random(20,75));
    }
    pop();
}



function mousePressed() {
  if(is_fre)return;
  userStartAudio(); 
  ms_x+=0.001;
  ms_y+=0.001;
  click_count+=1;
  press.play();
  if(click_count>=bon){
    dull.play();
    is_fre=true;
  }
  if(!bgm.isPlaying()){
    bgm.loop();
  }
  return false;
}