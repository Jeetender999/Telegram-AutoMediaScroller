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

    // Function to scroll to an element smoothly
    function scrollToElement(element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Find all <article> elements inside the main container
    const articles = mainContainer.querySelectorAll('article');

    console.log("Total Articles (Posts) Found:", articles.length);

    for (let index = 0; index < articles.length; index++) {
        const article = articles[index];
        const video = article.querySelector('video');
        const image = article.querySelector('img');

        let waitTime = 3000; // Default wait time for images

        if (video) {
            // Wait for video duration or fallback to 5 seconds if duration is unavailable
            waitTime = video.duration ? video.duration * 1000 : 5000;
        }

        // Scroll to the current post
        scrollToElement(article);
        console.log(`Viewing Post ${index + 1}: ${video ? "Video" : "Image"} - Waiting ${waitTime / 1000} seconds`);

        // Wait before moving to the next post
        await delay(waitTime);
    }

    console.log("Auto-scroll completed!");
})();