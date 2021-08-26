var defaultScreen = 16 / 9;
var video;
var volumeSlider;
var loopImage;
var progressBar;

var container;

var miniPlayerImage;
var isMiniScreen;

var theaterImage;
var isTheater;

var fullScreenImage;
var isFullScreen;

window.onload = function () {
    //Inicialize the variables
    video = document.getElementById("video");
    volumeSlider = document.getElementsByClassName("volume-slider")[0];
    loopImage = document.getElementById("loopImg");
    progressBar = document.getElementById("progress_bar");
    progressBar.value = video.currentTime;
    progressBar.max = video.duration;
    
    
    container = document.getElementsByClassName("container")[0];
    
    miniPlayerImage = document.getElementsByClassName("mini-player")[0];
    isMiniScreen = miniPlayerImage.getAttribute("miniScreenMone");
    
    theaterImage = document.getElementById("theater");
    isTheater = theaterImage.getAttribute("theaterMode");
    
    fullScreenImage = document.getElementById("full_screen");
    isFullScreen = fullScreenImage.getAttribute("fullScreenMode");

    setProperties();
}

// On video loaded format and set a value for the duration time span tag
function onVideoLoad() {
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration % 60);
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    document.getElementsByClassName("duration-time")[0].innerHTML = minutes + ":" + seconds;
}

function setProperties() { //Fill or change the div properties values
    document.getElementById("volume").innerHTML = video.volume;
    document.getElementById("muted").innerHTML = video.muted;
    document.getElementById("loop").innerHTML = video.loop;

    let playButtonImageSrc = document.getElementById("play_button").src;

    //If there is pause inside image button src ...
    if (playButtonImageSrc.search("pause") > -1) {
        document.getElementById("playing").innerHTML = "true";
    } else if (playButtonImageSrc.search("play") > -1) {
        document.getElementById("playing").innerHTML = "false";
    } else {
        alert("error on muted image")
    }
}

function onProgressSliderInputted() { // Change the video's current time by dragging the progress bar
    video.currentTime = progressBar.value;
    setProperties();
}

function onVolumeSliderInputted() { // Change the video's volume by dragging the volume slider
    video.volume = volumeSlider.value;
    setProperties();
}

function timeupdate() { // While the video is playing show current time 
    let currentTimeText = document.getElementsByClassName("current-time")[0];
    let currentTimeVideo = video.currentTime.toFixed(0);
    progressBar.value = currentTimeVideo;
    // let hours = (currentTimeVideo % (3600 * 60) / 3600).toFixed(0);


    let minutes = Math.floor((currentTimeVideo / 60) % 60);
    let seconds = (currentTimeVideo % 60).toFixed(0);
    let formattedTimeText;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    formattedTimeText = minutes + ":" + seconds;

    currentTimeText.innerHTML = formattedTimeText;
}

function playVideo() { //Play or pause the video
    let playButton = document.getElementById("play_button");

    //If video is paused...
    if (video.paused) { // ... play it, change play button title and play button image
        video.play();
        playButton.title = "Pause (k)";
        playButton.setAttribute("src", "./assets/icons/round_pause_black.png");

    } else { // ... pause it, change play button title and play button image
        video.pause();
        playButton.title = "Play (k)";
        playButton.setAttribute("src", "./assets/icons/round_play_arrow_black.png");
    }
    setProperties();
}

function muteVideo() { // Mutes or un-mutes the volume
    let muteButton = document.getElementById("mute_button");

    //If video's volume is 0...
    if (video.muted) { //... change image and set muted as false
        if (video.volume == 0) {
            video.volume = 1;
            setVolumeImage();
            video.muted = false;
            return
        }
        setVolumeImage();
        video.muted = false;

    } else { //... change image and set muted as true
        muteButton.src = "./assets/icons/round_volume_off_black.png";
        video.muted = true;
    }
    setProperties();
    setVolumeRangeByVolumeMuted(video.muted);

}

function adjustVolume(direction) {
    //If user press arrow up and video's volume is lower than 1...
    if (direction == "up" && video.volume.toFixed(1) < 1) {
        video.volume = (video.volume + 0.1).toFixed(1);
    }

    //If user press arrow down and video's volume is greater than 1...
    if (direction == "down" && video.volume.toFixed(1) > 0) {
        video.volume = (video.volume - 0.1).toFixed(1);
    }

    setVolumeImage();
    setVolumeRange();
}

function setVolumeImage() { //Define volume image depending to video's volume level
    let muteButton = document.getElementById("mute_button");

    if (video.volume == 0) {
        muteButton.src = "./assets/icons/round_volume_off_black.png";
        video.muted = true;
    } else if (video.volume <= 0.5) {
        muteButton.src = "./assets/icons/round_volume_down_black.png";
    } else {
        muteButton.src = "./assets/icons/round_volume_up_black.png";
    }
    video.muted = false;
    setProperties();

}

function setVolumeRange() {
    volumeSlider.value = video.volume;
}

function setVolumeRangeByVolumeMuted(isVideoMuted) {
    if (isVideoMuted) {
        volumeSlider.value = 0;
        return;
    }
    volumeSlider.value = video.volume;
}

window.onkeydown = function () { //Depending to which key was pressed down, it'll control different properties of the video.
    const keyDown = event.keyCode;
    //alert(keyDown)
    switch (keyDown) {
        case 32: playVideo(); // Case "K" is pressed
            break;
        case 75: playVideo(); // Case Space bar is pressed
            break;
        case 37: video.currentTime -= 5; // Case Arrow left is pressed
            break;
        case 39: video.currentTime += 5; // Case Arrow right is pressed
            break;
        case 38: adjustVolume("up"); // Case Arrow up is pressed
            break;
        case 40: adjustVolume("down"); // Case Arrow down is pressed
            break;
        case 65: setLoop(); // Case "A" is pressed
            break;
        case 70: setFullScreen(); // Case "F" is pressed
            break;
        case 77: muteVideo(); // Case "M" is pressed
            break;
        case 27: // Case "Esc" is pressed
            break;
    }
};

function setLoop() { //Turn on or turn off the video's loop
    // If video loop is true ...
    if (video.loop == true) { // ...make it false, change loop image and it's title.
        video.loop = false;
        loopImage.src = "./assets/icons/round_play_circle_filled_black.png";
        loopImage.title = "Loop off (a)";
    } else { // ...make it true, change loop image and it's title.
        video.loop = true;
        loopImage.src = "./assets/icons/round_pause_circle_filled_black.png";
        loopImage.title = "Loop on (a)";
    }
    setProperties();
}

function setMiniScreen() { // Turn in or out in mini screen mode
    isMiniScreen = miniPlayerImage.getAttribute("miniScreenMode");
    if (isMiniScreen == "true") {
        alert("mini true")
        // Enable the display of some images of the control
        theaterImage.style.display = "initial";
        fullScreenImage.style.display = "initial";
        //change the icon of the mini screen image inside the controls when turn this screen mode in and out
        miniPlayerImage.src = "./assets/icons/round_fullscreen_exit_black.png"
        miniPlayerImage.setAttribute("miniScreenMode", false);

        container.style.width = "64%";
        container.style.height = "36vw";

    } else if (isMiniScreen == "false") {
        alert("mini false")


        // Disable the display of some images of the control
        theaterImage.style.display = "none";
        fullScreenImage.style.display = "none"
        miniPlayerImage.setAttribute("miniScreenMode", true);

        container.style.width = "100%";
        container.style.height = "100%";
        miniPlayerImage.src = "./assets/icons/round_fullscreen_exit_black.png"
    }
}

function setTheater() { // Turn in or out in theater mode
    isTheater = theaterImage.getAttribute("theaterMode");

    // If is theater screen...
    if (isTheater == "true") {
        // Enable the display of some images of the control
        miniPlayerImage.style.display = "initial";
        theaterImage.src = "./assets/icons/round_crop_landscape_black.png"

        theaterImage.setAttribute("theaterMode", false);
        // Return video to normal size
        container.style.width = "64%";

    // If isn't theater screen
    } else if (isTheater == "false") {
        // Disable the display of some images of the control
        miniPlayerImage.style.display = "none";
        theaterImage.src = "./assets/icons/round_crop_7_5_black.png"

        theaterImage.setAttribute("theaterMode", true);
        // Make video to fill total width of the window
        container.style.width = "100%";

    }
    // Redefine de variable's value after has changed
    isTheater = theaterImage.getAttribute("theaterMode");
}

function setFullScreen() { // Turn in or out in full screen mode
    isFullScreen = fullScreenImage.getAttribute("fullScreenMode");
    // If is full screen...
    if (isFullScreen == "true") {
        // Enable the display of some images of the control
        miniPlayerImage.style.display = "initial";
        theaterImage.style.display = "initial";
        fullScreenImage.src = "./assets/icons/round_fullscreen_exit_black.png"

        fullScreenImage.setAttribute("fullScreenMode", false);
        // Return video to normal size
        container.style.width = "64%";
        container.style.height = "36vw";

        // If isn't full screen...
    } else if (isFullScreen == "false") {
        // If is theater screen...        
        if (isTheater == "true") { // Exit theater screen mode and reset theater screen control image
            theaterImage.setAttribute("theaterMode", false);
            theaterImage.src = "./assets/icons/round_crop_landscape_black.png"
        }

        // Disable the display of some images of the control
        miniPlayerImage.style.display = "none";
        theaterImage.style.display = "none";
        fullScreenImage.src = "./assets/icons/round_fullscreen_exit_black.png"

        fullScreenImage.setAttribute("fullScreenMode", true);
        // Make video to fill the window
        container.style.width = "100%";
        container.style.height = "100%";
    }
}