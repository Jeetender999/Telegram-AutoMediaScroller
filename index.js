(function() {
    'use strict';

    let autoScrollActive = true; // Flag to enable/disable auto-scrolling

    // Function to simulate clicking the left swipe button
    function scrollLeft() {
        if (!autoScrollActive) return; 

        const leftButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-prev-button');
        if (leftButton) {
            leftButton.click();
            console.log("[Auto Scroll] Scrolled to previous media...");
            setTimeout(detectMedia, 1000); // Allow DOM to update before detecting new media
        } else {
            console.log("[Auto Scroll] Left scroll button not found! Stopping auto-scroll.");
            stopAutoScroll();
        }
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
            setTimeout(scrollLeft, 5000);
        } 
        else if (videoElement) {
            waitForVideoDuration(videoElement);
        } 
        else {
            console.log("[Auto Scroll] No media detected. Scrolling in 10 seconds...");
            setTimeout(scrollLeft, 10000);
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
                setTimeout(scrollLeft, scrollTime);
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
    function startAutoScroll() {
        if (!autoScrollActive) {
            autoScrollActive = true;
            console.log("[Auto Scroll] Restarted.");
            detectMedia();
        }
    }

    // Expose functions to window for manual control
    window.startAutoScroll = startAutoScroll;
    window.stopAutoScroll = stopAutoScroll;

    // Start auto-scrolling when the script is loaded
    detectMedia();
})();
