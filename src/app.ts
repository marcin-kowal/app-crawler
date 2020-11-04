const puppeteer = require('puppeteer');
const config = require('./config.json');

(async() => {
    console.log('Starting Chrome...');

    const browser = await puppeteer.launch();
    console.log(await browser.version());

    const page = await browser.newPage();

    await page
        .on('console', (message: any) =>
            console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
    //     .on('pageerror', ({ message }: any) => console.log(message))
    //     .on('response', (response: any) =>
    //         console.log(`${response.status()} ${response.url()}`))
    //     .on('requestfailed', (request: any) =>
    //         console.log(`${request.failure().errorText} ${request.url()}`))
    //     .on('request', (request: any) =>
    //         console.log(request.headers()))
    ;

    const response = await page.goto(config.loginUri, {waitUntil: 'networkidle2'});

    // console.log('Authorization:');
    // console.log(await response.request().headers().Authorization);

    await page.focus('input[formcontrolname=login]');
    await page.keyboard.type(config.username);
    await page.focus('input[formcontrolname=password]');
    await page.keyboard.type(config.password);

    await page.evaluate(() => document.querySelector('button')!.click());
    
    // TODO wait for reload
    await page.screenshot({path: 'page1.png'});

    const url = await page.evaluate(() => document.URL);
    console.log(url);

    const data = await page.evaluate(() => document.body.innerHTML);
    console.log(data);
  
    const buttons = await page.evaluate(() => document.querySelectorAll('button'));
    console.log("Buttons:");
    console.log(buttons);

    const links = await page.evaluate(() => document.querySelectorAll('a'));
    console.log("Links:");
    console.log(links);

    await browser.close();

    console.log('Done...');
})();