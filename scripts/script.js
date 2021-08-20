var defaultScreen = 16 / 9;
var video;
var volumeSlider;

var autoplayImage;

window.onload = function () {
    //Inicialize the variables
    video = document.getElementById("video");
    volumeSlider = document.getElementsByClassName("volume_slider")[0];
    autoplayImage = document.getElementById("autoplayImg");
    setProperties();
}

function setProperties() { //Fill or change the div properties values


    document.getElementById("volume").innerHTML = video.volume;
    document.getElementById("muted").innerHTML = video.muted;
    document.getElementById("autoplay").innerHTML = video.autoplay;
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

function onSliderInputted() {
    video.volume = volumeSlider.value;
    setProperties();
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
    // alert(keyDown)
    switch (keyDown) {
        case 32: playVideo(); // When "K" is pressed
            break;
        case 75: playVideo(); // When Space bar is pressed
            break;
        case 37: video.currentTime -= 5; //When Arrow left is pressed
            break;
        case 39: video.currentTime += 5; //When Arrow right is pressed
            break;
        case 38: adjustVolume("up"); //When Arrow up is pressed
            break;
        case 40: adjustVolume("down"); //When Arrow down is pressed
            break;
        case 65: setAutoPlay(); //When "A" is pressed
            break;
        case 70: setFullScreen(); //When "F" is pressed
            break;
        case 77: muteVideo(); //When "M" is pressed
            break;
    }
};

function setAutoPlay() {

    // If video autoplay is true ...
    if (video.autoplay) { // ...make it false, change autoplay image and it's title.
        video.autoplay = false;
        autoplayImage.src = "./assets/icons/round_play_circle_filled_black.png";
        autoplayImage.title = "Auto play off (a)";
    } else { // ...make it true, change autoplay image and it's title.
        video.autoplay = true;
        autoplayImage.src = "./assets/icons/round_pause_circle_filled_black.png";
        autoplayImage.title = "Auto play on (a)";
    }
    setProperties();
}

function setTheater() { // Turn in or out in theater mode
    let container = document.getElementsByClassName("container")[0];
    let theaterImage = document.getElementById("theater");
    let isTheater = theaterImage.getAttribute("theaterMode");

    if (isTheater == "true") {
        theaterImage.setAttribute("theaterMode", false);
        container.style.width = "64%";

        theaterImage.src = "./assets/icons/round_crop_landscape_black.png"

    } else if (isTheater == "false") {
        theaterImage.setAttribute("theaterMode", true);
        container.style.width = "100%";

        theaterImage.src = "./assets/icons/round_crop_7_5_black.png"
    }
}

function setFullScreen() { // Turn in or out in full screen mode
    let container = document.getElementsByClassName("container")[0];
    let fullScreenImage = document.getElementById("full_screen");
    let isFullScreen = fullScreenImage.getAttribute("fullScreenMode");

    if (isFullScreen == "true") {
        fullScreenImage.setAttribute("fullScreenMode", false);
        container.style.width = "64%";
        container.style.height = "36vw";
        fullScreenImage.src = "./assets/icons/round_fullscreen_exit_black.png"

    } else if (isFullScreen == "false") {
        fullScreenImage.setAttribute("fullScreenMode", true);
        container.style.width = "100%";
        container.style.height = "100%";
        fullScreenImage.src = "./assets/icons/round_fullscreen_exit_black.png"
    }
}