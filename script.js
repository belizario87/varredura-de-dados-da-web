const pup = require("puppeteer");

(async () => {
  const searchTerm = "mackbook";
  const url = "https://www.mercadolivre.com.br/";
  console.log("Iniciei");

  const browser = await pup.launch({ headless: true });

  console.log("abri o browser");

  const page = await browser.newPage();
  await page.goto(url);

  console.log("entrei na pagina");

  await page.setViewport({ width: 1000, height: 1024 });
  await page.waitForSelector(".nav-search-input");
  await page.type(".nav-search-input", searchTerm);

  await page.click("button[type='submit']");

  await page.waitForSelector(
    ".ui-search-item__title.ui-search-item__group__element > a "
  );

  const links = await page.$$eval(
    ".ui-search-item__title.ui-search-item__group__element > a",
    (el) => el.map((link) => link.href)
  );

  let c = 1;
  for (const link of links) {
    if (c > 60) continue;
    console.log("Pagina", c);

    await page.goto(link);
    await page.waitForSelector(".ui-pdp-title");

    const title = await page.$eval(".ui-pdp-title", (el) => el.innerText);
    const price = await page.$eval(
      ".andes-money-amount__fraction",
      (el) => el.innerText
    );

    await page.waitForSelector(".ui-pdp-seller__link-trigger-button");
    const seller = await page.evaluate(() => {
      const el = document.querySelector(".ui-pdp-seller__link-trigger-button");
      if (!el) {
        return null;
      } else {
        return el.innerText;
      }
    });

    const obj = { title, price, seller, link };

    console.log(obj);

    c++;
  }

  await browser.close();
})();
