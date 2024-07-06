const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    //Get HTML content from HTML file
    const html = fs.readFileSync('index.html', 'utf-8');
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    // await page.waitForFunction('window.jsLoaded === true');

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');


    const pdf = await page.pdf({
        // path: 'result.pdf',
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
    });
    console.log(pdf)
    // Close the browser instance
    await browser.close();
})();