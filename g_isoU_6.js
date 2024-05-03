/* constants :) */
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


var ghostSpeed = 2;
var ghostSizeMultiplier = .2;

var ghostImgWidths = 500; // need to be obtained manually
var ghostSize = ghostSizeMultiplier*ghostImgWidths; 
var booeyX = (canvas.width / 2) - ghostSizeMultiplier*(ghostImgWidths / 2);
var booeyY = (canvas.height*.66) - ghostSizeMultiplier*(ghostImgWidths / 2);

var bgSize = .5;

var levelChangeInterval = 300; // The time interval at which opacity changes (in milliseconds)
var levelMax = 4;
var levelMin = 0;   

var partyGuests = ["Jamahat", "Kawely", "Mogleun", "Natiqn", "Sugulny"];
var guestProfs = ['./art/JamahatU1.png', './art/KawelyU1.png', './art/MogleunU1.png', './art/NatiqnU1.png', './art/SugulnyU1.png'];
var instructionContainer;
var mingled = [0, 0, 0, 0, 0]

function getRandomInt(max, min=0) {
    return Math.floor(Math.random() * max) + min;
  }
function initializeGhost(imgArr, pathBaseString, x=booeyX, y=booeyY, dx=1, dy=0){
    for (var i = 0; i < imgArr.length; i++) {
        temp = new Image();
        w = i + 1
        temp.src = './art/' + pathBaseString + "U" + w + '.png';
        imgArr[i] = temp;
    }
    return {
        "currentImg": null,
        "x": x, 
        "y": y, 
        "dx": dx, 
        "dy": dy,
        "distanceMoved": 0,
        "currentImgIndex": 0
    }
}

function dialogue(guestIndex, imageSrc, text, stay, leave) {
    text = text.replace(/\n/g, "<br>");
    var level6Container = document.createElement("div");
    level6Container.id = "level6-dialogue";

    // Create a new p element for the text
    var ghostPicture = document.createElement("img");
    ghostPicture.src = imageSrc;
    ghostPicture.style.width, ghostPicture.style.height = "60px";
    level6Container.appendChild(ghostPicture);

    var textElement = document.createElement("p");
    textElement.innerHTML = text;
    textElement.style.margin = "10px";  // Add margin to the text
    level6Container.appendChild(textElement);

    var stayButton = document.createElement("button");
    stayButton.innerHTML = stay;
    stayButton.style.margin = "10px";  // Add margin to the button1
    level6Container.appendChild(stayButton);

    var leaveButton = document.createElement("button");
    leaveButton.innerHTML = leave;
    leaveButton.style.margin = "10px";  // Add margin to the button2
    level6Container.appendChild(leaveButton);

    // Add the container to the body
    document.body.appendChild(level6Container);

    // Add event listener to button2
    stayButton.addEventListener("click", function() {
        if (mingled.reduce((a, b) => a + b, 0) < 4){
            alert("Mingle with everyone first before choosing " + partyGuests[guestIndex] + "!");
            partyGuestMovingStats[guestIndex]["dx"] = 0.5;
            mingled[guestIndex] = 1;

            // Remove the container from the body
            document.body.removeChild(level6Container);
            instruction();
        } else {
            document.body.removeChild(level6Container);
            endGame(guestIndex);
        }
    });
    leaveButton.addEventListener("click", function() {
        partyGuestMovingStats[guestIndex]["dx"] = 0.5;
        mingled[guestIndex] = 1;

        // Remove the container from the body
        document.body.removeChild(level6Container);
        instruction();
    });
}

function endGame(guest){
    for (var i = 0; i < partyGuests.length; i++) {
        partyGuestMovingStats[i]["dx"] = 0;
    } 
    var endGameContainer = document.createElement("div");
    endGameContainer.id = "endGame";

    var textElement = document.createElement("p");
    textElement.innerHTML = "Congralutations! You and " + partyGuests[guest] + " are now engaged! (Game over.)";
    textElement.style.margin = "40px";  // Add margin to the text

    document.body.appendChild(endGameContainer);
    endGameContainer.appendChild(textElement);
    endGameContainer.appendChild(button1);
    endGameContainer.appendChild(button2);
    

}
function instruction() {
    instructionContainer = document.createElement("div");
    instructionContainer.id = "instruction-Container";

    var textElement = document.createElement("p");
    textElement.innerHTML = "Welcome to the party! It's time for Booey to mingle. Navigate through the crowd using your arrow keys to meet everyone here. Press the space bar when Booey is within the vicinity of a guest to talk to them.";
    textElement.style.margin = "10px";  // Add margin to the text
    instructionContainer.appendChild(textElement);

    // Loop over each guest
    for (var i = 0; i < partyGuests.length; i++) {
        // Create a new div for the guest
        var guestDiv = document.createElement("div");
        guestDiv.style.display = "flex";
        guestDiv.style.alignItems = "center";

        // Create an img element for the guest's image
        var guestImage = document.createElement("img");
        guestImage.src = guestProfs[i];
        guestImage.style.width, guestImage.style.height = "40px";
        guestDiv.appendChild(guestImage);

        // Create a p element for the guest's name
        var guestName = document.createElement("p");
        guestName.innerHTML = partyGuests[i];
        guestName.style.fontSize = "20px";
        guestDiv.appendChild(guestName);

        var check = document.createElement("img");
        if (mingled[i] == 1){
            check.src = './art/check.png';
        } else {
            check.src = './art/noCheck.png';
        }
        check.style.width, check.style.height = "10px";
        guestDiv.appendChild(check);


        // Add the guest div to the instruction container
        instructionContainer.appendChild(guestDiv);
    }

    // Add the container to the body
    document.body.appendChild(instructionContainer);
}



/* load images!*/
// GHOSTS
var booeyImages = [0, 0, 0, 0];
var booeyStats = initializeGhost(booeyImages, "ghost", booeyX, booeyY, 0);
booeyStats["currentImg"] = booeyImages[0];

var partyGuestImages = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
var partyGuestMovingStats = [];
var movingStats, u;
for (var i = 0; i < 3; i++) {
    u = Math.random() < 0.5 ? -1 : 1;
    movingStats = initializeGhost(partyGuestImages[i], partyGuests[i], getRandomInt(400, 100), booeyY, u);
    movingStats["currentImg"] = partyGuestImages[i][0];
    partyGuestMovingStats.push(movingStats);
}
for (var i = 3; i < 5; i++) {
    u = Math.random() < 0.5 ? -1 : 1;
    if (i == 3){
        movingStats = initializeGhost(partyGuestImages[i], partyGuests[i], booeyX + 50, getRandomInt(300, 250), 0, u);
    } else if (i==4) {
        movingStats = initializeGhost(partyGuestImages[i], partyGuests[i], booeyX - 50, getRandomInt(300, 250), 0, u);
    } else {
        movingStats = initializeGhost(partyGuestImages[i], partyGuests[i], booeyX, getRandomInt(300, 250), 0, u);
    }
    movingStats["currentImg"] = partyGuestImages[i][0];
    partyGuestMovingStats.push(movingStats);
}


// BG
var bg = new Image()
bg.src = './art/iso1-bg L6.png';


var level = 0;
/* draw images!*/
instruction();
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas
    ctx.drawImage(bg, 0, canvas.height/4 -50, canvas.width, (bg.height/bg.width)*canvas.width); //bg

    /* GUESTS BEFORE BOOEY */
    for (var i = 0; i < partyGuests.length; i++) {
        var thisGhost = partyGuestMovingStats[i];
        ctx.drawImage(thisGhost["currentImg"], thisGhost["x"], thisGhost["y"], ghostSize, ghostSize);
    }

    /* BOOEY */     
    ctx.drawImage(booeyStats["currentImg"], booeyStats["x"], booeyStats["y"], ghostSize, ghostSize); // Draw the ghost
        
    /* GHOST ANIMATIONS */
    booeyStats["x"] += booeyStats["dx"];
    booeyStats["y"] += booeyStats["dy"];
    booeyStats["distanceMoved"] += Math.abs(booeyStats["dx"]) + Math.abs(booeyStats["dy"]);
    if (booeyStats["distanceMoved"] >= 20) { // changes image if ghost moves 20 pixels
        booeyStats["distanceMoved"] = 0;
        booeyStats["currentImg"] = booeyImages[(booeyImages.indexOf(booeyStats["currentImg"]) + 1) % booeyImages.length];
    }
    for (var i = 0; i < 3; i++){
        w = partyGuestMovingStats[i];
        if (w["x"] > canvas.width-100){
            w["dx"] = -1;
        } else if (w["x"] < -100) {
            w["dx"] = 1;
        }
        w["x"] += w["dx"];
        w["distanceMoved"] += Math.abs(w["dx"]) + Math.abs(w["dy"]);
        if (w["distanceMoved"] >= 20) { // changes image if ghost moves 20 pixels
            w["distanceMoved"] = 0;
            w["currentImg"] = partyGuestImages[i][(partyGuestImages[i].indexOf(w["currentImg"]) + 1) % partyGuestImages[i].length];
        }
    }
    for (var i = 3; i < 5; i++){
        w = partyGuestMovingStats[i];
        if (w["y"] > canvas.width-100){
            w["dy"] = -1;
        } else if (w["y"] < 200) {
            w["dy"] = 1;
        }
        w["y"] += w["dy"];
        w["distanceMoved"] += Math.abs(w["dx"]) + Math.abs(w["dy"]);
        if (w["distanceMoved"] >= 20) { // changes image if ghost moves 20 pixels
            w["distanceMoved"] = 0;
            w["currentImg"] = partyGuestImages[i][(partyGuestImages[i].indexOf(w["currentImg"]) + 1) % partyGuestImages[i].length];
        }
    }
}
setInterval(draw, 10);

/* listen for user input!*/
var keyDownTime = null;
document.onkeydown = function(e) {
    var shiftPressed = e.shiftKey; // Check if the shift key is pressed
    switch (e.keyCode) {
        case 37:
            booeyStats["dx"] = -ghostSpeed;
            booeyStats["dy"] = 0;
            break;
        case 38:
            booeyStats["dy"] = -ghostSpeed;
            break;
        case 39:
            booeyStats["dx"] = ghostSpeed;
            booeyStats["dy"] = 0;
            break;
        case 40:
            booeyStats["dy"] = ghostSpeed;
            break;
        case 32: // Space bar
        var dist;
        for (let i = 0; i < partyGuests.length; i++) {
            dist = (Math.abs((partyGuestMovingStats[i]["x"] - booeyStats["x"])^2) + Math.abs((partyGuestMovingStats[i]["y"] - booeyStats["y"])^2))^(1/2)
            // alert((partyGuestMovingStats[i]["x"] - booeyStats["x"])^2);
            if (dist <= 50) {
                document.body.removeChild(instructionContainer);
                partyGuestMovingStats[i]["dx"] = 0;
                if (i == 0){
                    dialogue(i, './art/Jamahat1.png', "Here's a bit of poetry I've been working on. \n \n At twilight, the turtle watches the dance of the tiger. In the roar, silence echoes. \n \n I wrote it for you. Do you like it?", "Woah! Can I hear the whole poem? (stay)", "Wow...sounds great...(leave)");
                } else if (i == 1){
                    dialogue(i, './art/Kawely1.png', "Wanna get out of here and hang out in my basement? I love bringing back my victi--- my dates and turning on a nice, relaxing movie and falling asleeo together.", "Heck yeah! What movie are we watching? (stay)", "I'll get back to you on that.. (leave)");
                } else if (i==2){
                    dialogue(i, './art/Mogleun1.png', "...", "(Mew back.) (stay)", "Sorry, I'm just trying to reach the drinks behind you...(leave)");
                } else if (i == 3) {
                    dialogue(i, './art/Natiqn1.png', "Did you know? Monaco ith incredibly thmall! Only about 2 thquare kilometerth! The Monaco-Monte Carlo thtation, opened in 1866, ith therved by the Martheille Ventimiglia railway line. Ath for airportth, while Monaco itthelf doethnt have one due to itth thize, the Nithe Côte dAzur Airport in neighboring Franthe ith only a thort dithtance away and therveth ath the main air gateway for Monacos rethidentth and vithitorth. Additionally, Monaco hath a heliport, Monaco Heliport, which provideth regular therviceth to and from Nithe airport. Tho, dethpite itth thmall thize, Monaco ith quite well connected!", "Actually, the Monaco-Monte Carlo station opened in 1867, not 1866! (stay)", "Great...(leave)");
                } else if (i == 4){
                    dialogue(i, './art/Sugulny1.png', "Sometimes, I take stuff off the store shelves to the return counter and pretend to try to return it. When they ask for the reciept I say I forgot it and take the stuff home.", "Wait, I should try that. (stay)", "That's crazy. (leave)");
                }
            }

        }
        break;
    }
};

document.onkeyup = function(e) {
    booeyStats["dx"] = 0;
    booeyStats["dy"] = 0;
    keyDownTime = null;
};

function decreaseLevel() {
    if (level <= levelMin) { // If level is already at the minimum, return without changing level
        return;
    }
    if (keyDownTime !== null && level <= levelMax) {
        level -= 1;
        setTimeout(decreaseLevel, levelChangeInterval);
    }
}

function increaseLevel() {
    if (level >= levelMax) { // If level is already at the maximum, return without changing level
        return;
    }
    if (keyDownTime !== null && level >= levelMin) {
        level += 1;
        setTimeout(increaseLevel, levelChangeInterval);
    }
}

function createImage(src) {
    var img = new Image();
    img.src = src;
    return img;
}