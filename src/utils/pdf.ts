import dayjs from "dayjs";

const puppeteer = require('puppeteer');
// const fs = require('fs');

export const generatePdfTicket = async (html) => {
    // Create a browser instance
    const browser = await puppeteer.launch();

    // Create a new page
    const page = await browser.newPage();

    //Get HTML content from HTML file
    // const html = fs.readFileSync(htmlContent, 'utf-8');
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
    // Close the browser instance
    browser.close();
    return pdf
};

interface Event {
    event: string
    date: Date
    firstname: string
    lastname: string
}

export const genTicket = (data: Event, id: number) => {
    return `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
    <script src=" https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js "></script>

    <style>
        body {
            font-family: "Space Grotesk", sans-serif;
            display: flex;
            justify-content: center;
        }

        .container {
            display: flex;
            flex-direction: column;
            border: 1px solid rgb(225, 65, 81);
            padding: 1;
            padding: 20px;
            border-radius: 10px;
        }

        .header {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 6px;
            padding: 10px;
        }

        .separator {
            width: 90%;
            height: 1px;
            background-color: rgb(229, 231, 235);
        }

        .header .title {
            font-size: 1.5rem;
            line-height: 2rem;
            font-weight: 500;
        }

        .header .subtitle {
            color: rgb(107 114 128);
        }

        .row {
            display: flex;
            flex-direction: row;
            gap: 2rem;
        }

        .col {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }


        .code {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 150px;
            height: 150px;
            background: rgb(243, 244, 246);
        }

        #code {
            border-radius: 5px;
        }

        .table {
            padding: 10px;
            font-size: 14px;
            font-weight: 400;
            width: 100%;
        }

        .table th {
            font-weight: 400;
            text-transform: uppercase;
            color: rgb(156 163 175);
            padding: 10px;
        }

        .table td {
            font-weight: 400;
            color: rgb(55 65 81);
            padding: 10px;
        }

        .info {
            padding: 24px;
        }

        .info .title {
            color: rgb(156 163 175);
            text-transform: uppercase;
            padding-block: 8px;
        }

        .info .subtitle {
            color: rgb(55 65 81);
            padding-block: 8px;
            text-transform: uppercase;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <span class="title">${data.event}</span>
            <span class="subtitle">${dayjs(data.date).format("MMM DD, YYYY")}</span>
            <div class="separator"></div>
        </div>
        <div class="row">
            <div class="col">
                <div class="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket Code</th>
                                <th>Ticket Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>EVT_${id}</td>
                                <td>General Access</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="separator"></div>
                <div class="info">
                    <div class="title">Benificier:</div>
                    <div class="subtitle">${data.firstname} ${data.lastname}</div>
                </div>
            </div>
            <div class="col">
                <div class="code">
                    <div id="code"></div>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        new QRCode(document.getElementById("code"), {
            text: ${JSON.stringify(data)},
            width: 128,
            height: 128,
            colorDark: "#313131",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    </script>
</body>

</html>
    `
} 