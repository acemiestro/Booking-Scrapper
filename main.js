const puppeteer = require('puppeteer');

let bookingUrl = process.argv[2];
let destination = process.argv[3];
let nHotels = process.argv[4];

(async () => {
    try {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        const page = await browser.newPage();
        await page.goto(bookingUrl, { waitUntil: "networkidle0" });
        
        // i/p box
        await page.waitForSelector("label.sb-destination-label-sr input.c-autocomplete__input.sb-searchbox__input.sb-destination__input", { visible: true });
        await page.click("label.sb-destination-label-sr input.c-autocomplete__input.sb-searchbox__input.sb-destination__input")
        await page.type("label.sb-destination-label-sr input.c-autocomplete__input.sb-searchbox__input.sb-destination__input", destination, { delay: 100 });
        
        // enter date
        
        // press enter
        await page.keyboard.press('Enter');
        
        // waiting to navigate
        await page.waitForNavigation({ waitUntil: "networkidle0" });
        // get hotel details
        let hotelData = await page.evaluate((nHotels) => {  
            let hotels = [];
            // get the hotel elements
            let hotelsElms = document.querySelectorAll('div.sr_property_block[data-hotelid]');
            // get the hotel data
            let idx = 0;
            hotelsElms.forEach((hotelelement) => {
                idx++;
                let hotelJson = {};
                if (idx > nHotels) {
                    return;
                }
                try {
                    hotelJson.name = hotelelement.querySelector('span.sr-hotel__name').innerText;
                    hotelJson.reviews = hotelelement.querySelector('div.bui-review-score__title').innerText;
                    hotelJson.rating = hotelelement.querySelector('div.bui-review-score__badge').innerText;
                    if (hotelelement.querySelector('div.prco-ltr-right-align-helper span.bui-u-sr-only')) {
                        hotelJson.price = hotelelement.querySelector('div.prco-ltr-right-align-helper span.bui-u-sr-only').innerText;
                    }
                }
                catch (exception) {

                }
                hotels.push(hotelJson);
            });
            return hotels;
        }, nHotels);

        console.dir(hotelData);
    }
    catch (err) {
        console.log(err);
    }
})();