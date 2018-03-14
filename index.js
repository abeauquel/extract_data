
const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'chromium-browser',
    headless: false,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();

  console.log("Ouverture de la page ...");
  await  page.goto('https://www.anime-planet.com/users/desacron/lists/for-people-who-love-reincarnation-andor--71911');
  console.log("Attente de la navigation ...");
 // await page.waitForNavigation();
  console.log("Attente du chargement du titre navigation ...");
  await page.waitForSelector('#siteContainer > div:nth-child(8) > div.pure-1.md-2-3 > h1');

  console.log("Vérification du titre ...");
  let title_page = await page.evaluate((sel) => {
    return document.querySelector(sel).innerText;
  }, '#siteContainer > div:nth-child(8) > div.pure-1.md-2-3 > h1');

  console.log(title_page);

  //#customlistDetails > div > div.pure-5-6 > table > tbody > tr:nth-child(1) > td.tableTitle > h5 > a
  //#customlistDetails > div > div.pure-5-6 > table > tbody > tr:nth-child(2) > td.tableTitle > h5 > a
  for(let i=1; i<44;i+=1){

    let test_titre =await page.evaluate((sel) => {
      return document.querySelector(sel).innerText;
    }, '#customlistDetails > div > div.pure-5-6 > table > tbody > tr:nth-child('+i+') > td.tableTitle > h5 > a');
    console.log("TITRE "+i+" : "+test_titre);
  }
  await browser.close();
})();
