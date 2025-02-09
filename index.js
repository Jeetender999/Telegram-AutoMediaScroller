// Script to run auto scroll 

(function() {
    'use strict';

    // Function to simulate clicking the left swipe button
    function scrollLeft() {
        const leftButton = document.querySelector('.tgico.media-viewer-sibling-button.media-viewer-prev-button');
        if (leftButton) {
            leftButton.click(); // Simulate a left scroll (previous media)
        }
    }

    // Function to check for media and set timeouts accordingly
    function startAutoScrolling() {
        // Check if the current media is an image (using the thumbnail class on <img>)
        const imageElement = document.querySelector('.media-viewer-aspecter img.thumbnail');
        // Check if the current media is a video (using the <video> tag)
        const videoElement = document.querySelector('.media-viewer-aspecter video');

        // If the media is an image (thumbnail <img> tag)
        if (imageElement) {
            console.log("Image detected!"); // Log that an image was found
            // Scroll after 5 seconds for an image
            setTimeout(() => {
                scrollLeft(); // Scroll left after 5 seconds
                startAutoScrolling(); // Recheck and run the script again for the next media
            }, 5000); // 5 seconds for image
        } 
        // If the media is a video
        else if (videoElement) {
            console.log("Video detected!"); // Log that a video was found
            const videoDuration = videoElement.duration; // Get the video duration in seconds

            // If the video duration is found, use it, otherwise default to 20 seconds
            const scrollTime = videoDuration ? videoDuration * 1000 : 20000;

            console.log("Video duration: " + (videoDuration || "unknown") + " seconds"); // Log the video duration (or unknown)
            
            // Scroll after the video duration or 20 seconds, whichever is longer
            setTimeout(() => {
                scrollLeft(); // Scroll left after the appropriate time
                startAutoScrolling(); // Recheck and run the script again for the next media
            }, scrollTime); // Scroll based on video duration or 20 seconds
        }
        // If it's neither an image nor a video (default case)
        else {
            console.log("Unable to identify media, defaulting to 10 seconds."); // Log if no media is identified
            // Scroll after 10 seconds for anything else (unknown media)
            setTimeout(() => {
                scrollLeft(); // Scroll left after 10 seconds
                startAutoScrolling(); // Recheck and run the script again for the next media
            }, 10000); // 10 seconds for unknown media
        }
    }

    // Start auto-scrolling when the script is loaded
    startAutoScrolling();
})();