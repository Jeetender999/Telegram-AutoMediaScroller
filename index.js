(function() {
    'use strict';

    let autoScrollActive = false; // Flag to enable/disable auto-scrolling
    let scrollDirection = "left"; // Default scroll direction

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

        // **Freshly select the media every time**
        const imageElement = document.querySelector('.media-viewer-aspecter img.thumbnail');
        const videoElement = document.querySelector('.media-viewer-aspecter video');

        console.log("[Debug] Image Element:", imageElement);
        console.log("[Debug] Video Element:", videoElement);

        if (imageElement) {
            console.log("[Auto Scroll] Image detected. Scrolling in 5 seconds...");
            setTimeout(scrollMedia, 5000);
        } 
        else if (videoElement) {
            waitForVideoDuration(videoElement);
        } 
        else {
            console.log("[Auto Scroll] No media detected. Scrolling in 10 seconds...");
            setTimeout(scrollMedia, 10000);
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
                setTimeout(scrollMedia, scrollTime);
            } else {
                setTimeout(checkDuration, 500); // Retry every 500ms until duration is available
            }
        }

        checkDuration();
    }

    // Function to stop auto-scrolling
    function stopAutoScroll() {
        autoScrollActive = false;
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

    // Expose functions to window for manual control
    window.startAutoScroll = startAutoScroll;
    window.stopAutoScroll = stopAutoScroll;

    console.log("[Auto Scroll] Script loaded. Use startAutoScroll('left') or startAutoScroll('right') to begin.");
})();
