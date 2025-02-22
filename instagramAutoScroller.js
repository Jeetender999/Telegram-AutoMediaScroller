(async function () {
    // Select the main container that holds all posts
    const mainContainer = document.querySelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1');

    if (!mainContainer) {
        console.error("Main container not found!");
        return;
    }

    // Function to wait for a given time
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Function to check if an element is fully visible
    function isFullyVisible(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    // Function to scroll the media into perfect view
    async function scrollToMedia(mediaElement) {
        if (mediaElement) {
            mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });

            // Keep checking until the element is actually in view
            for (let i = 0; i < 10; i++) { // Retry up to 10 times
                if (isFullyVisible(mediaElement)) break;
                await delay(300); // Wait 300ms and try again
                mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    // Find all <article> elements inside the main container
    const articles = mainContainer.querySelectorAll('article');
    console.log("Total Articles (Posts) Found:", articles.length);

    for (let index = 0; index < articles.length; index++) {
        const article = articles[index];
        const video = article.querySelector('video.x1lliihq.x5yr21d.xh8yej3');
        const image = article.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
        
        let mediaElement = video || image;
        if (!mediaElement) continue;

        let waitTime = 3000; // Default wait time for images

        if (video) {
            // Wait for video metadata to load before getting duration
            if (video.readyState >= 2) {
                waitTime = video.duration ? video.duration * 1000 : 5000;
            } else {
                await new Promise(resolve => {
                    video.addEventListener("loadedmetadata", () => {
                        waitTime = video.duration ? video.duration * 1000 : 5000;
                        resolve();
                    }, { once: true });
                });
            }
        }

        // Scroll the media (video or image) into perfect view
        await scrollToMedia(mediaElement);
        console.log(`Viewing Post ${index + 1}: ${video ? "Video" : "Image"} - Waiting ${waitTime / 1000} seconds`);

        // Wait before moving to the next post
        await delay(waitTime);
    }

    console.log("Auto-scroll completed!");
})();
