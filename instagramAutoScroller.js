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

    // Function to get the most visible article
    function getCurrentVisibleArticle() {
        let visibleArticle = null;
        let maxVisibility = 0;

        articles.forEach(article => {
            const rect = article.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
            const visibilityRatio = visibleHeight / rect.height;

            if (visibilityRatio > maxVisibility && visibilityRatio > 0.5) { // At least 50% visible
                maxVisibility = visibilityRatio;
                visibleArticle = article;
            }
        });

        return visibleArticle;
    }

    // Function to scroll the media into perfect view
    async function scrollToMedia(mediaElement) {
        if (mediaElement) {
            mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });

            // Keep checking until the element is actually in view
            for (let i = 0; i < 10; i++) {
                if (isFullyVisible(mediaElement)) break;
                await delay(300);
                mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }

    // Array to store all discovered articles
    let articles = Array.from(mainContainer.querySelectorAll('article'));
    console.log("Initial Articles Found:", articles.length);
    let currentIndex = 0;

    // MutationObserver to detect new articles being added
    const observer = new MutationObserver(mutations => {
        let newArticles = [];

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === "ARTICLE" && !articles.includes(node)) {
                    newArticles.push(node);
                }
            });
        });

        if (newArticles.length > 0) {
            articles.push(...newArticles);
            console.log("New posts detected. Total articles:", articles.length);
        }

        // Find the most visible article
        const visibleArticle = getCurrentVisibleArticle();

        // Check if user has manually scrolled (visible post is different from our current post)
        if (visibleArticle && visibleArticle !== articles[currentIndex]) {
            const newIndex = articles.indexOf(visibleArticle);
            if (newIndex !== -1) {
                currentIndex = newIndex;

                // Determine the post type and wait time
                const video = visibleArticle.querySelector('video.x1lliihq.x5yr21d.xh8yej3');
                const image = visibleArticle.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
                let mediaType = video ? "Video" : "Image";
                let waitTime = video ? (video.duration ? video.duration * 1000 : 5000) : 3000;

                console.log(`Manual scroll detected! Resetting index to ${currentIndex + 1}.`);
                console.log(`Current post type: ${mediaType}, Duration: ${waitTime / 1000} sec`);
            }
        }
    });

    // Start observing the main container for new posts
    observer.observe(mainContainer, { childList: true, subtree: true });

    while (true) {
        

        if (currentIndex >= articles.length) {
            console.log("Waiting for new posts to load...");
            await delay(2000);
            continue;
        }

        const article = articles[currentIndex];
        const video = article.querySelector('video.x1lliihq.x5yr21d.xh8yej3');
        const image = article.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');

        let mediaElement = video || image;
        if (!mediaElement) {
            currentIndex++;
            continue;
        }

        let waitTime = video ? (video.duration ? video.duration * 1000 : 5000) : 3000;
        let mediaType = video ? "Video" : "Image";

        // Log debugging information
        console.log(`Viewing Post ${currentIndex + 1}: ${mediaType} - Waiting ${waitTime / 1000} seconds`);

        // Scroll to the media and wait
        await scrollToMedia(mediaElement);
        await delay(waitTime);

        currentIndex++;
    }
})();