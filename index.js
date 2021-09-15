const puppeteer = require('puppeteer')
const fs = require('fs/promises')

async function DeutscheWelle() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://www.dw.com/de/themen/s-9077")
    // await page.screenshot({ path: 'DeutscheWelle.png', fullPage: true})

    const titles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".basicTeaser h2")).map(x => x.textContent)
    })
    await fs.writeFile('titles.txt', titles.join("\r\n"))

    const photos = await page.$$eval("img", (imgs) => {
        return imgs.map(x => x.src)
    })

    for (const photo of photos) {
        const imagePage = await page.goto(photo)
        await fs.writeFile(photo.split("/").pop(), await imagePage.buffer())
    }

    await browser.close()
}

DeutscheWelle()