// let puppeteer = require("puppeteer");

// (async () => {
//     try {
//         let browser = await puppeteer.launch({
//             headless: false,
//             defaultViewport: null,
//             args: ["--start-maximized", "--disable-notifications"]
//         });
//         const page = await browser.newPage();
//         await page.goto("https://www.google.com", { waitUntil: "networkidle0" });
//         await page.click(".gb_le.gb_4.gb_5c");
//         await page.waitForSelector("input[type='email']");
//         await page.click("input[type='email']");
//         await page.type("input[type='email']", "practiceprojecat@gmail.com")
//         await page.click("#identifierNext");
//         await page.waitForNavigation({waitUntil: "networkidle0"});
//         await page.waitForSelector("input[type='password']");
//         await page.type("input[type='password']", "Bestfriend@29");
//         await page.click("#passwordNext");
//         await page.waitForNavigation({waitUntil: "networkidle0"});
//     }
//     catch(err){
//         console.log(err);
//     }
// })();
let cheerio = require("cheerio")
let puppeteer = require("puppeteer");

let fs = require("fs");
let request = require("request")

request("https://www.youtube.com/feed/trending", function (err, res, html) {
    if (err === null && res.statusCode === 200) {
        //fs.writeFileSync("trending.html", html)
        parsehtml(html)

    }
    else if (res.statusCode === 404) {
        console.log("invalid url");
    }
    else {
        console.log(err);
        console.log(res.statusCode);
    }

})

function parsehtml(html) {
    let $ = cheerio.load(html);

    var list_of_href = [];
    $('div[class="expanded-shelf"] ul').find('li > div > div > div > div[class="yt-lockup-content"] h3 a').each(function (index, element) {
        list_of_href.push($(element).attr('href'));
    });
    // console.log(list.length)
    // for(let i=0; i<list.length; i++){
    //     console.log(list[i]);
    // }


    var top10_href = []
    for (let i = 0; i < 2; i++) {

        top10_href.push(list_of_href[i]);

    }

    var list_of_names = [];
    $('div[class="expanded-shelf"] ul').find('li > div > div > div > div[class="yt-lockup-content"] h3 a').each(function (index, element) {
        list_of_names.push($(element).attr('title'));
    });
    console.log("\nTop 10 trending videos of youtube in India\n");

    // for(let i=0; i<10; i++){

    //     console.log(`${i+1} ${list_of_names[i]} `);

    // }

    (async function () {
        try {

            let browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null,
                args: ["--start-maximized", "--disable-notifications"]
            })

            let pArr = [];
            let tabs = await browser.pages();
            let tab = tabs[0];

            const page = await browser.newPage();
            await page.goto("https://www.google.com", { waitUntil: "networkidle0" });
            await page.click(".gb_le.gb_4.gb_5c");
            await page.waitForSelector("input[type='email']");
            await page.click("input[type='email']");
            await page.type("input[type='email']", "practiceprojecat@gmail.com")
            await page.click("#identifierNext");
            await page.waitForNavigation({ waitUntil: "networkidle0" });
            await page.waitForSelector("input[type='password']");
            await page.type("input[type='password']", "Bestfriend@29");
            await page.click("#passwordNext");
            await page.waitForNavigation({ waitUntil: "networkidle0" });


            for (let i = 0; i < top10_href.length; i++) {
                let newTab = await browser.newPage();
                let videoWillBeLiked = handleVideos(newTab, "https://www.youtube.com" + top10_href[i]);
                pArr.push(videoWillBeLiked)
            }

        } catch (err) {
            console.log(err);
        }
    })();
    async function handleVideos(tab, link) {
        await tab.goto(link, { waitUntil: "networkidle0" });
        let subscribe = await tab.$("div#subscribe-button ytd-subscribe-button-renderer paper-button.style-scope.ytd-subscribe-button-renderer")
        await subscribe.click()
        await tab.close()
    }
}