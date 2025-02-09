(function() {
    'use strict';

    let autoScrollActive = true; // Flag to enable/disable auto-scrolling

    // Function to simulate clicking the left swipe button
    function scrollLeft() {
        if (!autoScrollActive) return; 

        const leftButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-prev-button');
        if (leftButton) {
            leftButton.click(); 
        } else {
            console.log("[Auto Scroll] Left scroll button not found! Stopping auto-scroll.");
            stopAutoScroll(); // Stop auto-scrolling if the button is missing
        }
    }

    // Function to check for media and set timeouts accordingly
    function startAutoScrolling() {
        if (!autoScrollActive) return; 

        // Check if the left scroll button exists before continuing
        const leftButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-prev-button');
        if (!leftButton) {
            console.log("[Auto Scroll] Left scroll button not found! Auto-scrolling stopped.");
            stopAutoScroll();
            return;
        }

        const imageElement = document.querySelector('.media-viewer-aspecter img.thumbnail');
        const videoElement = document.querySelector('.media-viewer-aspecter video');

        if (imageElement) {
            console.log("[Auto Scroll] Image detected. Scrolling in 5 seconds...");
            setTimeout(() => {
                scrollLeft();
                startAutoScrolling();
            }, 5000);
        } 
        else if (videoElement) {
            const videoDuration = videoElement.duration;
            const scrollTime = videoDuration ? videoDuration * 1000 : 20000; 

            console.log(`[Auto Scroll] Video detected. Duration: ${videoDuration ? videoDuration.toFixed(2) : "Unknown"} seconds. Scrolling in ${scrollTime / 1000} seconds...`);

            setTimeout(() => {
                scrollLeft();
                startAutoScrolling();
            }, scrollTime);
        } 
        else {
            console.log("[Auto Scroll] No media detected. Scrolling in 10 seconds...");
            setTimeout(() => {
                scrollLeft();
                startAutoScrolling();
            }, 10000);
        }
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
            startAutoScrolling();
        }
    }

    // Expose functions to window for manual control
    window.startAutoScroll = startAutoScroll;
    window.stopAutoScroll = stopAutoScroll;

    // Start auto-scrolling when the script is loaded
    startAutoScrolling();
})();
