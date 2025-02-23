(async function () {
    const mainContainer = document.querySelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1');

    if (!mainContainer) {
        console.error("Main container not found!");
        return;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getVisibilityRatio(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.bottom < 0 || rect.top > windowHeight) {
            return 0;
        }

        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        return visibleHeight / rect.height;
    }

    function isFullyVisible(el) {
        return getVisibilityRatio(el) > 0.9;
    }

    // Enhanced function to find the most visible article and its index
    function findMostVisibleArticle() {
        let maxVisibility = 0;
        let visibleArticle = null;
        let visibleIndex = -1;

        articles.forEach((article, index) => {
            const visibilityRatio = getVisibilityRatio(article);
            if (visibilityRatio > maxVisibility && visibilityRatio > 0.3) { // Lowered threshold for initial detection
                maxVisibility = visibilityRatio;
                visibleArticle = article;
                visibleIndex = index;
            }
        });

        return { article: visibleArticle, index: visibleIndex, visibility: maxVisibility };
    }

    // New function to initialize starting position
    async function initializeStartingPosition() {
        // Wait for any ongoing scroll to settle
        await delay(500);

        // Find the most visible article
        const { article, index, visibility } = findMostVisibleArticle();

        if (index === -1 || !article) {
            console.log("No visible article found, starting from beginning");
            return 0;
        }

        // Verify the position is stable
        await delay(200);
        const verificationResult = findMostVisibleArticle();
        
        if (verificationResult.index === index) {
            console.log(`Starting from post ${index + 1} (${(visibility * 100).toFixed(1)}% visible)`);
            
            // Ensure the article is properly centered
            const mediaElement = article.querySelector('video.x1lliihq.x5yr21d.xh8yej3') || 
                               article.querySelector('img.x5yr21d.xu96u03.x10l6tqk.x13vifvy.x87ps6o.xh8yej3');
            
            if (mediaElement) {
                mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });
                await delay(500);
            }
            
            return index;
        } else {
            console.log("Position unstable, starting from beginning");
            return 0;
        }
    }

    let articles = Array.from(mainContainer.querySelectorAll('article'));
    console.log("Initial Articles Found:", articles.length);
    let currentIndex = 0;
    let scrollTimeout = null;
    let shouldStop = false;
    let isProcessingScroll = false;
    let lastProcessedIndex = -1;
    let debounceTimeout = null;

    async function scrollToMedia(mediaElement, expectedIndex) {
        if (!mediaElement) return false;

        mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });
        await delay(500);

        for (let i = 0; i < 5; i++) {
            const currentArticle = findMostVisibleArticle().article;
            const actualIndex = articles.indexOf(currentArticle);

            if (actualIndex !== expectedIndex) {
                console.log(`Scroll sync error detected! Expected: ${expectedIndex + 1}, Actual: ${actualIndex + 1}`);
                return false;
            }

            if (isFullyVisible(mediaElement)) {
                return true;
            }

            mediaElement.scrollIntoView({ behavior: "smooth", block: "center" });
            await delay(300);
        }

        return isFullyVisible(mediaElement);
    }

    async function handleManualScroll() {
        if (isProcessingScroll) return;
        isProcessingScroll = true;

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }

        await delay(500);

        const { article: visibleArticle, index: newIndex } = findMostVisibleArticle();
        
        if (!visibleArticle || newIndex === -1) {
            isProcessingScroll = false;
            return;
        }

        if (newIndex !== lastProcessedIndex) {
            await delay(200);
            const { index: verificationIndex } = findMostVisibleArticle();

            if (newIndex === verificationIndex) {
                lastProcessedIndex = newIndex;
                shouldStop = true;
                currentIndex = newIndex;

                const video = visibleArticle.querySelector('video.x1lliihq.x5yr21d.xh8yej3');
                const mediaType = video ? "Video" : "Image";

                console.log(`Manual scroll detected! Resetting index to ${currentIndex + 1}`);
                console.log(`Current post type: ${mediaType}`);

                await delay(500);
                startScrolling();
            }
        }

        isProcessingScroll = false;
    }

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

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(async () => {
            const { article: visibleArticle, index: visibleIndex } = findMostVisibleArticle();
            if (visibleArticle && visibleIndex !== currentIndex) {
                await handleManualScroll();
            }
        }, 300);
    });

    observer.observe(mainContainer, { childList: true, subtree: true });

    async function startScrolling() {
        shouldStop = false;

        while (!shouldStop) {
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

            let mediaType = video ? "Video" : "Image";
            let waitTime = 3000;

            if (video) {
                if (video.readyState >= 2) {
                    waitTime = video.duration ? video.duration * 1000 : 5000;
                } else {
                    waitTime = await new Promise(resolve => {
                        video.addEventListener("loadedmetadata", () => {
                            resolve(video.duration ? video.duration * 1000 : 5000);
                        }, { once: true });
                        
                        setTimeout(() => resolve(5000), 5000);
                    });
                }
            }

            console.log(`Attempting to view Post ${currentIndex + 1}: ${mediaType}`);

            const scrollSuccess = await scrollToMedia(mediaElement, currentIndex);
            
            if (!scrollSuccess) {
                console.log(`Failed to properly scroll to post ${currentIndex + 1}, retrying...`);
                await delay(1000);
                continue;
            }

            console.log(`Successfully viewing Post ${currentIndex + 1}: ${mediaType} - Waiting ${waitTime / 1000} seconds`);

            if (!shouldStop) {
                await new Promise(resolve => {
                    scrollTimeout = setTimeout(resolve, waitTime);
                });

                if (!shouldStop) {
                    const { article: finalArticle } = findMostVisibleArticle();
                    if (finalArticle === article) {
                        currentIndex++;
                    } else {
                        console.log("Position shifted during wait, readjusting...");
                        currentIndex = articles.indexOf(finalArticle);
                    }
                }
            }
        }
    }

    // Initialize starting position before beginning scroll
    currentIndex = await initializeStartingPosition();
    startScrolling();
})();