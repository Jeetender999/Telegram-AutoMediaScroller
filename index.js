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

    // Function to handle manual scroll clicks
    function handleManualScroll(event) {
        if (!autoScrollActive) return;

        const leftButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-prev-button');
        const rightButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-next-button');

        if (event.target === leftButton || event.target === rightButton) {
            console.log("[Auto Scroll] Manual scroll detected. Resetting...");
            clearTimeout(scrollTimeout); // Clear existing timeout
            setTimeout(detectMedia, 1000); // Detect new media after the manual click
        }
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

    // Attach event listener for manual scroll clicks
    document.addEventListener("click", handleManualScroll, true);

    // Expose functions to window for manual control
    window.startAutoScroll = startAutoScroll;
    window.stopAutoScroll = stopAutoScroll;

    console.log("[Auto Scroll] Script loaded. Use startAutoScroll('left') or startAutoScroll('right') to begin.");
})();
