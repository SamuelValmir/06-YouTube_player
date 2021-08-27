// Global variables
var container;
var videoContainer;
var video;
var progressBar;

// Left controls
var volumeSlider;
var muteButton;

// Right controls
var loopButton;

var miniPlayerButton;
var isMiniPlayer;
var miniPlayerButtonTooltip;

var theaterButton;
var isTheater;
var theaterButtonTooltip

var fullScreenButton;
var isFullScreen;
var fullScreenButtonTooltip;

window.onload = function () {
    //Inicialize the variables
    container = document.getElementsByClassName("video-container")[0];
    videoContainer = document.getElementsByClassName("video-container")[0];
    video = document.getElementById("video");
    progressBar = document.getElementById("progress_bar");
    progressBar.value = video.currentTime;
    progressBar.max = video.duration;

    // Left controls
    volumeSlider = document.getElementsByClassName("volume-slider")[0];
    muteButton = document.getElementById("mute_button");

    // Right controls
    loopButton = document.getElementById("loop_button");

    miniPlayerButton = document.getElementsByClassName("mini-player")[0];
    isMiniPlayer = miniPlayerButton.getAttribute("miniScreenMone");
    miniPlayerButtonTooltip = document.querySelector(".mini-player + span");

    theaterButton = document.getElementById("theater_button");
    isTheater = theaterButton.getAttribute("theaterScreenMode");
    theaterButtonTooltip = document.querySelector("#theater_button + span");

    fullScreenButton = document.getElementById("full_screen_button");
    isFullScreen = fullScreenButton.getAttribute("fullScreenMode");
    fullScreenButtonTooltip = document.querySelector("#full_screen_button + span");

    setProperties();
}

function onVideoLoad() { // On video loaded format and set a value for the duration time span tag
    let minutes = Math.floor(video.duration / 60);
    let seconds = Math.floor(video.duration % 60);
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    document.getElementsByClassName("duration-time")[0].innerHTML = minutes + ":" + seconds;
}

function setProperties() { // Fill or change the div properties values
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
        alert("Error on muted image!")
    }
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

function onProgressSliderInputted() { // Change the video's current time by dragging the progress bar
    video.currentTime = progressBar.value;
    setProperties();
}

function onVolumeSliderInputted() { // Change the video's volume by dragging the volume slider
    video.volume = volumeSlider.value;
    setProperties();
}

function playVideo() { //Play or pause the video
    let playButton = document.getElementById("play_button");
    let playButtonTooltip = document.querySelector("#play_button + span");

    //If video is paused...
    if (video.paused) { // ... play it, change play button title and play button image
        video.play();
        playButtonTooltip.innerHTML = "Pause (k)";

        playButton.setAttribute("src", "./assets/icons/round_pause_black.png");

    } else { // ... pause it, change play button title and play button image
        video.pause();
        playButtonTooltip.innerHTML = "Play (k)";
        playButton.setAttribute("src", "./assets/icons/round_play_arrow_black.png");
    }
    setProperties();
}

function muteVideo() { // Mutes or un-mutes the volume
    let muteButtonTooltip = document.querySelector("#mute_button + span");
    //If video's volume is 0...
    if (video.muted) { //... change image and set muted as false
        muteButtonTooltip.innerHTML = "Mute (m)";
        if (video.volume == 0) {
            video.volume = 1;
            setVolumeImage();
            video.muted = false;
            return;
        }
        setVolumeImage();
        video.muted = false;

    } else { //... change image and set muted as true
        muteButtonTooltip.innerHTML = "Unmute (m)";
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
    switch (keyDown) {
        // Keys responsible for the left controls
        case 32: playVideo(); // Case "K" is pressed
            break;
        case 75: playVideo(); // Case Space bar is pressed
            break;
        case 77: muteVideo(); // Case "M" is pressed
            break;
        case 37: video.currentTime -= 5; // Case Arrow left is pressed
            break;
        case 39: video.currentTime += 5; // Case Arrow right is pressed
            break;
        case 38: adjustVolume("up"); // Case Arrow up is pressed
            break;
        case 40: adjustVolume("down"); // Case Arrow down is pressed
            break;

        // Keys responsible for the right controls
        case 65: setLoop(); // Case "A" is pressed
            break;
        case 83: ; // Case "s" is pressed;
            break;
        case 73: setMiniPlayer(); // Case "i" is pressed
            break;
        case 84: setTheater(); // Case "t" is pressed
            break;
        case 70: setFullScreen(); // Case "F" is pressed
            break;
        case 27: returnToNormalScreen();// Case "Esc" is pressed
            break;
    }
};

function setLoop() { //Turn on or turn off the video's loop
    let loopButtonTooltip = document.querySelector("#loop_button + span");
    // If video loop is true ...
    if (video.loop == true) { // ...make it false, change loop image and it's title.
        video.loop = false;
        loopButton.src = "./assets/icons/round_play_circle_filled_black.png";
        loopButtonTooltip.innerHTML = "Loop on (a)";
    } else { // ...make it true, change loop image and it's title.
        video.loop = true;
        loopButton.src = "./assets/icons/round_pause_circle_filled_black.png";
        loopButtonTooltip.innerHTML = "Loop off (a)";
    }
    setProperties();
}

function returnToNormalScreen() { // Return any screen mode to the normal one
    let miniScreenMode = miniPlayerButton.getAttribute("miniScreenMode");
    let theaterScreenMode = theaterButton.getAttribute("theaterScreenMode");
    let fullScreenMode = fullScreenButton.getAttribute("fullScreenMode");

    if (miniScreenMode == "true" ||
        theaterScreenMode == "true" ||
        fullScreenMode == "true") {

        // Return video to normal size
        container.style.width = "64%";
        container.style.height = "36vw";
        container.style.position = "relative";
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen()
        }

        // Disable every screen mode 
        miniPlayerButton.setAttribute("miniScreenMode", false);
        theaterButton.setAttribute("theaterScreenMode", false);
        fullScreenButton.setAttribute("fullScreenMode", false);

        // Enable the display of the images of the control
        miniPlayerButton.style.display = "initial";
        theaterButton.style.display = "initial";
        fullScreenButton.style.display = "initial";

        // Enable the display of the tooltips
        miniPlayerButtonTooltip.style.display = "initial";
        theaterButtonTooltip.style.display = "initial";
        fullScreenButtonTooltip.style.display = "initial";

        // Change the text of the tooltips
        miniPlayerButtonTooltip.innerHTML = "Mini player (i)";
        theaterButtonTooltip.innerHTML = "Theater mode (t)";
        fullScreenButtonTooltip.innerHTML = "Full screen (f)";

        // Change the image of the controls
        miniPlayerButton.src = "./assets/icons/round_branding_watermark_black.png";
        theaterButton.src = "./assets/icons/round_crop_landscape_black.png";
        fullScreenButton.src = "./assets/icons/round_fullscreen_exit_black.png";

        // Change the position of the tooltips
        miniPlayerButtonTooltip.style.left = "0%";
        theaterButtonTooltip.style.left = "-60%";
        fullScreenButtonTooltip.style.left = "-110%";
    }
}

function setMiniPlayer() { // Turn in or out in mini screen mode
    if (theaterButton.getAttribute("theaterScreenMode") == "false" && fullScreenButton.getAttribute("fullScreenMode") == "false") {
        isMiniPlayer = miniPlayerButton.getAttribute("miniScreenMode");
        if (isMiniPlayer == "true") {
            returnToNormalScreen();

        } else if (isMiniPlayer == "false") {
            miniPlayerButtonTooltip.innerHTML = "Exit mini player (i)";
            miniPlayerButtonTooltip.style.left = "-160%";
            // Disable the display of some images of the control
            theaterButton.style.display = "none";
            theaterButtonTooltip.style.display = "none";
            fullScreenButton.style.display = "none";
            fullScreenButtonTooltip.style.display = "none";
            miniPlayerButton.src = "./assets/icons/round_featured_video_black.png"
            miniPlayerButton.setAttribute("miniScreenMode", true);
            // Return video to normal location
            container.style.position = "absolute";
        }
    }
}

function setTheater() { // Turn in or out in theater mode
    if (fullScreenButton.getAttribute("fullScreenMode") == "false" && miniPlayerButton.getAttribute("miniScreenMode") == "false") {
        isTheater = theaterButton.getAttribute("theaterScreenMode");

        // If is theater screen...
        if (isTheater == "true") {
            returnToNormalScreen();

            // If isn't theater screen
        } else if (isTheater == "false") {
            theaterButtonTooltip.innerHTML = "Default visualization (t)";
            // Disable the display of some images of the control and it's tooltip
            miniPlayerButton.style.display = "none";
            miniPlayerButtonTooltip.style.display = "none";

            theaterButton.src = "./assets/icons/round_crop_7_5_black.png";

            theaterButton.setAttribute("theaterScreenMode", true);
            // Make video to fill total width of the window
            container.style.width = "100%";

        }
        // Redefine de variable's value after has changed
        isTheater = theaterButton.getAttribute("theaterScreenMode");
    }
}

function setFullScreen() { // Turn in or out in full screen mode
    // This conditional don't allow to turn full screen if is already in mini screen
    if (miniPlayerButton.getAttribute("miniScreenMode") == "false") {
        isFullScreen = fullScreenButton.getAttribute("fullScreenMode");

        // If is full screen...
        if (isFullScreen == "true") {
            returnToNormalScreen();

            // If isn't full screen...
        } else if (isFullScreen == "false") {
            fullScreenButtonTooltip.style.left = "-180%";
            fullScreenButtonTooltip.innerHTML = "Exit full screen (f)";
            // If is theater screen...        
            if (isTheater == "true") { // Exit theater screen mode and reset theater screen control image
                theaterButton.setAttribute("theaterScreenMode", false);
                theaterButton.src = "./assets/icons/round_crop_landscape_black.png";
            }

            // Disable the display of some images of the control  and it's tooltip
            miniPlayerButton.style.display = "none";
            miniPlayerButtonTooltip.style.display = "none";
            theaterButton.style.display = "none";
            theaterButtonTooltip.style.display = "none";
            fullScreenButton.src = "./assets/icons/round_fullscreen_exit_black.png";

            fullScreenButton.setAttribute("fullScreenMode", true);
            // Make video to fill the window
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) { // Safari
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) { // IE11
                videoContainer.msRequestFullscreen()
            }
        }
    }
}