(function() {
    'use strict';

    let autoScrollActive = false;
    let scrollDirection = "left";
    let scrollTimeout = null; // Store timeout ID to clear on manual click

    // Function to simulate clicking the left or right swipe button
    function scrollMedia() {
        if (!autoScrollActive) return;

        const leftButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-prev-button');
        const rightButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-next-button');

        if (scrollDirection === "left" && leftButton) {
            leftButton.click();
            console.log("[Auto Scroll] Scrolled left...");
        } else if (scrollDirection === "right" && rightButton) {
            rightButton.click();
            console.log("[Auto Scroll] Scrolled right...");
        } else {
            console.log("[Auto Scroll] Scroll button not found! Stopping auto-scroll.");
            stopAutoScroll();
            return;
        }

        setTimeout(detectMedia, 1000); // Wait for DOM update before detecting new media
    }

    // Function to detect media and decide timing
    function detectMedia() {
        if (!autoScrollActive) return;

        const imageElement = document.querySelector('.media-viewer-aspecter img.thumbnail');
        const videoElement = document.querySelector('.media-viewer-aspecter video');

        console.log("[Debug] Image Element:", imageElement);
        console.log("[Debug] Video Element:", videoElement);

        clearTimeout(scrollTimeout); // Clear any previous timeout before setting a new one

        if (imageElement) {
            console.log("[Auto Scroll] Image detected. Scrolling in 5 seconds...");
            scrollTimeout = setTimeout(scrollMedia, 5000);
        } 
        else if (videoElement) {
            waitForVideoDuration(videoElement);
        } 
        else {
            console.log("[Auto Scroll] No media detected. Scrolling in 10 seconds...");
            scrollTimeout = setTimeout(scrollMedia, 10000);
        }
    }

    // Function to handle video duration properly
    function waitForVideoDuration(videoElement) {
        console.log("[Auto Scroll] Video detected. Waiting for duration...");

        function checkDuration() {
            const videoDuration = videoElement.duration;
            if (videoDuration && !isNaN(videoDuration)) {
                const scrollTime = videoDuration * 1000;
                console.log(`[Auto Scroll] Video Duration: ${videoDuration.toFixed(2)} seconds. Scrolling in ${scrollTime / 1000} seconds...`);
                scrollTimeout = setTimeout(scrollMedia, scrollTime);
            } else {
                setTimeout(checkDuration, 500);
            }
        }

        checkDuration();
    }

    // Function to stop auto-scrolling
    function stopAutoScroll() {
        autoScrollActive = false;
        clearTimeout(scrollTimeout);
        console.log("[Auto Scroll] Stopped successfully.");
    }

    // Function to restart auto-scrolling
    function startAutoScroll(direction = "left") {
        if (!autoScrollActive) {
            autoScrollActive = true;
            scrollDirection = direction;
            console.log(`[Auto Scroll] Started in "${scrollDirection}" direction.`);
            detectMedia();
        }
    }
    
//    document.addEventListener("click", function () {
//     const switcherLeft = document.querySelector(".media-viewer-switcher-left");
//     const switcherRight = document.querySelector(".media-viewer-switcher-right");
//     if (switcherLeft) {
//         switcherLeft.addEventListener("click", function () {
//             console.log("[Manual Click] Resetting auto-scroll and fetching current media...");
//             clearTimeout(scrollTimeout); // Clear existing timeout
//             setTimeout(detectMedia, 1000); // Detect new media after the manual click
//         });
//     }
// }, true);

document.addEventListener("click", function (event) {
    const switcherLeft = document.querySelector(".media-viewer-switcher-left");
    const switcherRight = document.querySelector(".media-viewer-switcher-right");

    if (switcherLeft && switcherRight) {
        if (event.target.closest(".media-viewer-switcher-left") || event.target.closest(".media-viewer-switcher-right")) {
            console.log("[Manual Click] Resetting auto-scroll and fetching current media...");
            clearTimeout(scrollTimeout); // Clear existing timeout
            setTimeout(detectMedia, 1000); // Detect new media after the manual click
        }
    }
}, true);

    // Expose functions to window for manual control
    window.startAutoScroll = startAutoScroll;
    window.stopAutoScroll = stopAutoScroll;

    console.log("[Auto Scroll] Script loaded. Use startAutoScroll('left') or startAutoScroll('right') to begin.");
})();
