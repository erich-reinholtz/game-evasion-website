function removeButton(){

            let instr = document.getElementById("instr");
            let buton = document.getElementById("buton");
            
            instr.remove();
            buton.remove();

            return false;
        }
        
var isChrome = !!window.chrome;


class Virus {

    constructor(note){

        this.y = -32;
        this.note = note;

        this.x = 0;

        if(note == 1)
            this.x = 27;
        if(note == 2)
            this.x = 157;
        if(note == 3)
            this.x = 282;
        if(note == 4)
            this.x = 407;
        if(note == 5)
            this.x = 536;

    }

}

        
function game(){


let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// loading the images
let road = new Image();
road.src = "images/street.png";

let boom = new Image();
boom.src = "images/whiteboom.gif";

let spray = new Image();
spray.src = "images/spray.png";

let sprayc = new Image();
sprayc.src = "images/c.png";

let sprayv = new Image();
sprayv.src = "images/v.png";

let sprayb = new Image();
sprayb.src = "images/b.png";

let sprayn = new Image();
sprayn.src = "images/n.png";

let spraym = new Image();
spraym.src = "images/m.png";

let audio = new Audio();
audio.src = "music/track2.mp3";


let tiles = new Image();
tiles.src = "images/smallertile.png";

let virus =new Image();
virus.src = "images/virus.png";

let t0;
let t1;

let checkFirefox = 206707;
let checkEdge = 233000;


road.onload = function(){

    audio.play()
    t0 = audio.currentTime;
    requestAnimationFrame(gameLoop);
}

let yOffSet = 0;
let roadSpeed = 5;

var virusList = [];

var playedNotes = 0;

// note map
var noteList = [
                1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 3
                1, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 3
                1, 0, 0, 1, 0, 0, 1, 0, 3, 0, 0, 3, 0, 0, 3, 0, 4, 0, 0, 4, 0, 0, 4, 0, 4, 0, 0, 4, 0, 0, 4, 0, // 12
                1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 0, 5, 4, 3, 1, // 30 

                2, 0, 2, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25 
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 1, // 32

                2, 0, 2, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, // 28

                4, 0, 4, 0, 4, 0, 4, 0, 2, 0, 2, 0, 2, 0, 2, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, // 16
                4, 0, 4, 0, 4, 0, 4, 0, 5, 0, 5, 0, 5, 0, 5, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, 3, 0, // 16
                4, 1, 4, 1, 4, 1, 4, 1, 2, 1, 2, 1, 2, 1, 2, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, // 32
                1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 5, 4, 3, 1, // 29

                2, 0, 2, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 1, // 32

                2, 0, 2, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 0, 1, 5, 4, 0, 3, 0, 2, 0, 2, 2, 4, 0, 3, 2, 1, 0, 1, 5, 4, 5, 4, 5, 1, 0, 1, 5, 4, 5, 4, 5, // 25
                1, 1, 1, 1, 3, 3, 3, 3, 2, 2, 2, 2, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 1, // 32

                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                0, 0, 0, 0, 0
                ]

let noteIndex = 0;

let a, b, c, d, e;
a = b = c = d = e = false;
keyPressed = false;

let frameCount = 0;

function checkRightKey(k1, k2, k3, k4, k5, note) {

    if(k1 == true && note == 1)
        return true;
    if(k2 == true && note == 2)
        return true;
    if(k3 == true && note == 3)
        return true;
    if(k4 == true && note == 4)
        return true;
    if(k5 == true && note == 5)
        return true;

    return false;
}

let playerName = "undefined";

// fetching player name from database
fetch('/user')
        .then(data => {
            return data.json();
        })
        .then(data =>{
            playerName = data.name;
        });


function gameLoop(){

    frameCount += 1;

    // getting key input
    if(frameCount % 100 == 0){

        frameCount = 0;

        a = b = c = d = e = false;

        document.addEventListener('keydown', function(event) {
                // C
                if(event.keyCode == 67) {
                    a = true;
                    // console.log("C pressed");
                }
                // V
                else if(event.keyCode == 86) {
                    b = true;
                    // console.log("V pressed");
                }
                // B
                else if(event.keyCode == 66) {
                    c = true;
                    // console.log("B pressed");
                }
                // N
                else if(event.keyCode == 78) {
                    d = true;
                    // console.log("N pressed");
                }
                // M
                else if(event.keyCode == 77) {
                    e = true;
                    // console.log("M pressed");
                }
                
            });
    }


    // drawing the background

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    if(yOffSet <= -1384)
        yOffSet = 0;

    context.drawImage(tiles, -4, yOffSet, 648, 1384);
    context.drawImage(tiles, -4, yOffSet + 1384, 648, 1384);

    context.drawImage(sprayc, 28, 490, 50, 135.6);
    context.drawImage(sprayv, 158, 490, 50, 135.6);
    context.drawImage(sprayb, 283, 490, 50, 135.6);
    context.drawImage(sprayn, 408, 490, 50, 135.6);
    context.drawImage(spraym, 537, 490, 50, 135.6);



    // checking if new virus should appear

    t1 = audio.currentTime;

    let check = 233000;
    if(typeof InstallTrigger !== 'undefined') // browser is Firefox
        check = checkFirefox;
    if (/Edge/.test(navigator.userAgent)) 
        check = checkEdge;

    // adding new note if time threshold has been reached
       if((t1 - t0)*1000000 >= check){

        t0 = t1;
        virusList.push(new Virus(noteList[noteIndex]));
        noteIndex += 1;

        if(typeof InstallTrigger !== 'undefined') // browser is Firefox
            checkFirefox -= 0.35;

        if(/Edge/.test(navigator.userAgent))     
            if(noteIndex < 100)
                checkEdge += 3;
            else
            if(noteIndex < 400)  
                checkEdge -= 1;
            else
            if(noteIndex < 540)  
                checkEdge += 6;
            else
                checkEdge -=2;

        }

    
    for(let i = 0; i< virusList.length; i++){

        if(virusList[i].note != 0) {
            context.drawImage(virus, virusList[i].x, virusList[i].y, 80, 80);
        }

        virusList[i].y += roadSpeed;
        
        if(virusList[i].y > 900){
            virusList.splice(i, 1);
        }
        else
        if(virusList[i].y > 300 && virusList[i].y < 750 && virusList[i].note != 0 && checkRightKey(a,b,c,d,e,virusList[i].note) == true){
            context.drawImage(boom, virusList[i].x - 40, virusList[i].y - 40, 160, 160);
            playedNotes += 1;
            virusList.splice(i, 1);
            a = b = c = d = e = false;
        }
    }
    

    yOffSet -= roadSpeed * 2;

    if(audio.currentTime >= 187) {
        let accuracy= (playedNotes/565) * 100;
        Swal.mixin({
                confirmButtonText: 'Next &rarr;',
                background: '#F0F3BD',
                confirmButtonColor: '#05668D',
                showCancelButton: true
            }).queue([
                {
                title: 'You did great!',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                showCancelButton: false
                },
                {
                title: 'You\'ve played '+ playedNotes + ' correct notes! That is an accuracy of ' + accuracy.toFixed(2) + '%',
                text: 'Write your name if you want to save your score',
                input:'text',
                inputValue: playerName,
                showCancelButton: false
                }
            ]).then((result) => {
                if (result.value) {
                
                const data = {name: result.value[1], points: accuracy.toFixed(2)};
                const options = {
                       method: 'POST',
                      headers: {
                          'Content-Type' : 'application/json'
                      },
                      body: JSON.stringify(data)
                  }; 
                fetch('/beat-req', options);

                Swal.fire({
                  background: '#F0F3BD',
                  showCloseButton: true,
                  showCancelButton: true,
                  confirmButtonColor: '#05668D',
                  cancelButtonColor: '#00A896',
                  confirmButtonText:'Try again',      
                  cancelButtonText:'Go to menu',
                //   text: 'You were not careful enough'
                }).then((result) => {
                   if (result.value) {
                     window.location.href = `beatGame.html`
                   }
                   else {
                     window.location.href = `beatMenu.html`  
                   }
                  }); 
                }
            })
        
    }
    else
        requestAnimationFrame(gameLoop);
    
    }

}