
function removeButton(){
    let instr = document.getElementById("instr");
    let buton = document.getElementById("buton");

    instr.remove();
    buton.remove();

    return false;
}
        
function game(){


    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    // loading the images
    let road = new Image();
    road.src = "images/street.png";

    let character = new Image();
    character.src = "images/character.png";

    let money = new Image();
    money.src = "images/virus.png";

    let boom = new Image();
    boom.src = "images/explosion.gif";

    let audio = new Audio();
    audio.src = "music/track.mp3";
    audio.loop = true;

    let hit = new Audio();
    hit.src = "music/hit2.mp3";

    let lose = new Audio();
    lose.src = "music/lose.mp3";

    road.onload = function(){
        requestAnimationFrame(gameLoop);
    }


    let virusPos = [18, 140, 272, 400];

    let xOffSet = -165;
    let yOffSet = -512;

    let xOffSetVirus = virusPos[0];
    let yOffSetVirus = 0;

    let roadSpeed = 9;
    let charSpeed = 0;
    let charDiffSpeed = 0;
    let topSpeed = 3;

    let charX = 180;

    let left = false;
    let right = false;

    let isGameOver = false;
    let points = 0;
    let fails = 0;
    let maxFails = 3;

    let played = false;

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

        // getting key input
        document.addEventListener('keydown', function(event) {
            // left key pressed
            if(event.keyCode == 37) {
                left = true; right = false;
                //console.log("Left pressed");
            }
            // right key pressed
            else if(event.keyCode == 39) {
                left = false; right = true;
                //console.log("Right pressed");
            }
            // no key pressed
            else {
                left = false; right = false;
            }
        });

        // drawing the road
        if(yOffSet >= 0)
            yOffSet = -512;

       
        context.drawImage(road, xOffSet, yOffSet);
        context.drawImage(road, xOffSet, yOffSet + 512);
        context.drawImage(road, xOffSet, yOffSet + 1024);


        //drawing the virus

        // checking if player has been infected
        let caught = false;
        if( Math.abs(charX - xOffSetVirus) < 100 && yOffSetVirus <= 700 && yOffSetVirus >= 600)
            caught = true;

        if(yOffSetVirus >= 900 || caught){

            if(caught){
                context.drawImage(boom, xOffSetVirus - 100, yOffSetVirus - 280);
                fails += 1;
                hit.play();
            }
            else {
                points += 1;

                if(points % 5 == 0){
                    topSpeed += 1;
                    roadSpeed += 0.5;
                }
            }

            // reset virus y
            yOffSetVirus = 0;
            
            // change x offset to random variable
            while(true){

                let newid = Math.round(Math.random() * 3);
                xOffSetVirus = virusPos[newid];

                if( Math.abs(xOffSetVirus - charX) < 150 )
                    break;
            }

        }
        context.drawImage(money, xOffSetVirus, -150 + yOffSetVirus, 90, 90);


        // drawing the character
        // image size 504 x 360

        if(left == true) {
            // console.log("Moving character to left"); 
                charSpeed = -topSpeed;
            }
             
        if(right == true) {
            // console.log("Moving character to right"); 

                charSpeed = topSpeed;
            }
            

        charX += charSpeed;

        // 120
        // checking boundaries
        if(charX > 385) charX = 385;
        if(charX < -10) charX = -10;

        context.drawImage(character, charX - 10, 500, 173, 260);

        yOffSet += roadSpeed;
        yOffSetVirus += roadSpeed;

        if(!played){
            audio.play();
            played = true;
        }
        // UPDATE SCOREBOARD
        let scoreboard = document.getElementById("scoreboard");
        scoreboard.innerHTML = "<p id='points'><b>POINTS: " + points + "</b></p><p id='lives'><b>LIVES: " + (maxFails-fails) + "/" + maxFails + "</b></p>"

        // let sound = document.getElementById("sound");
        // sound.innerHTML = '<source src="music/track.mp3">';
        
        if(fails < maxFails)
            requestAnimationFrame(gameLoop);
        
        else {
            audio.pause();
            lose.play();


            Swal.mixin({
                confirmButtonText: 'Next &rarr;',
                background: '#D8F3DC',
                confirmButtonColor: '#40916C',
                showCancelButton: true
            }).queue([
                {
                icon: 'error',
                title: 'You got infected!',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                },
                showCancelButton: false
                },
                {
                title: 'You have a score of '+ points,
                text: 'Write your name if you want to save your score',
                input:'text',
                inputValue: playerName,
                showCancelButton: false
                }
            ]).then((result) => {
                if (result.value) {
                const data = {name: result.value[1], points: points};
                const options = {
                       method: 'POST',
                      headers: {
                          'Content-Type' : 'application/json'
                      },
                      body: JSON.stringify(data)
                  }; 
                fetch('/ev-req', options);

                Swal.fire({
                  background: '#D8F3DC',
                  showCloseButton: true,
                  showCancelButton: true,
                  confirmButtonColor: '#40916C',
                  cancelButtonColor: '#2D6A4F',
                  confirmButtonText:'Try again',      
                  cancelButtonText:'Go to menu',
                  text: 'You were not careful enough'
                }).then((result) => {
                   if (result.value) {
                     window.location.href = `evasionGame.html`
                   }
                   else {
                     window.location.href = `evasionMenu.html`  
                   }
                  }); 
                }
            })
            
        }
    }

}