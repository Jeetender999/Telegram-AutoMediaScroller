(function () {
    // Select the main container that holds all posts
    const mainContainer = document.querySelector('.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1c4vz4f.x2lah0s.xdt5ytf.xqjyukv.x6s0dn4.x1oa3qoh.x1nhvcw1');

    if (!mainContainer) {
        console.error("Main container not found!");
        return;
    }

    // Find all <article> elements inside the main container
    const articles = mainContainer.querySelectorAll('article');

    console.log("Total Articles (Posts) Found:", articles.length); // Print total count

    articles.forEach((article, index) => {
        const video = article.querySelector('video');
        const image = article.querySelector('img');

        let type = "Unknown"; // Default type

        if (video) {
            type = "Video";
        } else if (image) {
            type = "Image";
        }

        console.log(`Post ${index + 1}: ${type}`);
    });
})();
