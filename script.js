//canvas 
const canvas=document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width =800;
canvas.height=500;

let score = 0 ;
let gameFrame =0 ;
ctx.font='50px Georgia';

//mouse m
let canvasPosition = canvas.getBoundingClientRect();
const mouse={
    x:canvas.width/2,
    y:canvas.height/2,
    click:false
}
canvas.addEventListener('mousedown',function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;    
});
canvas.addEventListener('mouseup',function(){
    mouse.click = false;

});

//player
const playerIMG=new Image();
playerIMG.src='PLAYER.png';
class Player{
    constructor(){
        this.x = canvas.width/2;
        this.y = canvas.height;
        this.radius= 50;
        this.angle=0;
        this.frameX=0;
        this.frameY=0;
        this.frame=0;
        this.spriteWidth=513;
        this.spriteHeight=512;
    }
    update(){
        const dx=this.x - mouse.x;
        const dy=this.y - mouse.y;
        if(mouse.x !=this.x){
            this.x -=dx/30;
        }
        if(mouse.y !=this.y){
            this.y -=dy/30;
        }
    }
    draw(){
        if(mouse.click){
            ctx.lineWidth=0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.drawImage(playerIMG, this.frameX *this.spriteWidth, this.frameY*this.spriteHeight,this.spriteWidth, this.spriteHeight, this.x-65, this.y-65,this.spriteWidth/4,this.spriteHeight/4);

    }
}
const player = new Player();

//virus
const VirusArray=[];
const VirusImage = new Image();
VirusImage.src = 'Virus.png';
class Virus{
    constructor(){
        this.x = Math.random()*canvas.width;
        this.y = canvas.height+100;
        this.radius = 50;
        this.speed =Math.random() *5+1;
        this.distance;
        this.counted=false;
        this.sound = Math.random()<=0.5 ? 'sound1':'sound2';
    }
    update(){
        this.y -=this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance= Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        ctx.fillStyle='blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.drawImage(VirusImage,this.x -85,this.y -85, this.radius*3.5, this.radius*3.5);

        
    }
}

const VirusPOP = document.createElement('audio');
VirusPOP.src='stepdirt_1.wav'

const VirusPOP2 = document.createElement('audio');
VirusPOP2.src='stepdirt_1.wav'


function KontrolVirus(){
    if(gameFrame % 50 == 0){
        VirusArray.push(new Virus());
        
    }
    for (let i=0; i<VirusArray.length;i++){
        VirusArray[i].update();
        VirusArray[i].draw();
        if(VirusArray[i].y<0 - this.radius*2){
            VirusArray.splice(i, 1);
            i--;
        }
        else if(VirusArray[i].distance < VirusArray[i].radius + player.radius){
            if(!VirusArray[i].counted){
                if(VirusArray[i].sound=='sound1'){
                    VirusPOP.play();
                }else{
                    VirusPOP2.play();
                }
                score++;
                VirusArray[i].counted=true;
                VirusArray.splice(i, 1);
                i--;

            }
            
        }
    }
}
// Background
const background = new Image();
background.src = 'background1.png';


function handleBackground(){
 
  
    ctx.drawImage(background,0,0, canvas.width, canvas.height);
   

}





//looping animation
function animate(){
    ctx.clearRect(0, 0,canvas.width,canvas.height);
    handleBackground();
    KontrolVirus();
    player.update();
    player.draw();
    ctx.fillStyle='white';
    ctx.fillText('Terbunuh : ' + score,10,50);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize',function(){
    canvasPosition = canvas.getBoundingClientRect();

});
