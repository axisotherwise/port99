import puppeteer from "puppeteer";
import mail from "./nodemailer.js";
import path from "path";

const target = "https://port99.spartacodingclub.kr/";
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36";
const __dirname = path.resolve();

export default async function(email, password) {
    const PDF = {
        path: `./${email}.pdf`,
        format: "A4",
        printBackground: true,
    };
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ["--disable-notifications"],
    });
    
    const page = await browser.newPage();
    try {
        await page.setRequestInterception(true);
        page.on("request", async (request) => {
            if (request.resourceType === "image") request.abort();
            else request.continue(); 
        });
    
        await page.setUserAgent(userAgent);
        await page.setViewport({ width: 1260, height: 1080 });
        await page.goto(target, { waitUntil: "networkidle0" });
    
        await page.waitForSelector(".css-3oe3qh");
        await page.click(".css-3oe3qh");
        await page.waitForNavigation({ waitUntil: "networkidle0" });
    
        await page.waitForSelector(`[type="email"]`);
        await page.type(`[type="email"]`, `${email}`);
        await page.type(`[type="password"]`, `${password}`);
    
        await page.waitForSelector("button");
        await page.click("button");
    
        const validator = await page.waitForSelector("div div:nth-child(5)");
        const validatorResult = await validator.evaluate(el => el.innerHTML);
    
        if (validatorResult.length <= 23) {
            await page.close();
            return await browser.close();
        } else {
            await page.waitForSelector("div:nth-child(3) h1");
            await page.click("div:nth-child(3) h1");
    
            await page.waitForSelector("div:nth-child(6)");
    
            const pdfBuffer = await page.pdf(PDF);
            
            const sendMail = await mail(email);
    
            if (sendMail) {
                return true;
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await page.close();
        await browser.close();
    }
}


