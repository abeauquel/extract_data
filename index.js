var fs = require('fs');
const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'chromium-browser',
    headless: false,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  monLien="https://www.fraicheurquebec.com/liste-des-produits";

  console.log("Ouverture de la page ...");
  await  page.goto(monLien);
  console.log("Attente du chargement du titre Vérification du titre ...");
  //await page.waitForNavigation();
  //console.log("Attente du chargement du titre navigation ...");
  await page.waitForSelector('#content > div.introduction_liste_produits > h1');


  let title_page = await page.evaluate((sel) => {
    return document.querySelector(sel).innerText;
  }, '#content > div.introduction_liste_produits > h1');

  console.log("C'est ok "+title_page);

  let monTexte="";
  let max = 87;
  let idMin =1 ;
  let nomInsert="INSERT_FRUIT_ET_LEGUMES";

   monTexte+= await lireUnePage(monLien,max, idMin, nomInsert) ;
  var stream = fs.createWriteStream("script_v2.txt");
  stream.once('open', function(fd) {
    stream.write(monTexte);
    stream.end();
  });


   async function lireUnePage(lien, maxElement, idMin, nomInsert) {
    let declaVariable ="final static String "+nomInsert+ " = ";
    let monTexte=declaVariable+ "\"BEGIN TRANSACTION;\"";

    j=idMin;
    for(let i=0; i<maxElement;i+=1){
      try {
        let nom_produit = await page.evaluate((sel) => {
          return document.querySelector(sel).innerText;
        }, '#heading_'+i+' > h4 > a');
        ligneTxt="+ \" INSERT INTO produit VALUES ("+j+", '"+nom_produit+"', 1, 0);\"\n";

        console.log(ligneTxt);
        monTexte+=ligneTxt;
        j+=1;
      } catch (e) {
        console.log(e.toString() );
      }
    }
    monTexte+="+ \"COMMIT;\"";
    return monTexte;
  }
  async function genererExeInsert(nomInsert ,maxElement, idMin) {
    let monTexte="\n\n\n";
    j=idMin;
    for(let i=0; i<maxElement;i+=1){
      monTexte+="db.execSQL("+nomInsert+j+");\n";
      j++;
    }
    return monTexte;
  }







  await browser.close();
})();
