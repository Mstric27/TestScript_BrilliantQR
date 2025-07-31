const puppeteer = require("puppeteer");
const crypto = require("crypto");

const options = [
  "5b57Rl3aLtoMAjVtitsq",
  "H5XvzJHPqklhHJzi5N97",
  "QKWpjvvcICX6QrelVT5K",
  "XP9W4Pc1vAnjCvVNMV4a",
  "w259a5uQsNeKQrka9PFI",
  "y6x6wBSly4smztsRPo9J",
];

async function configureTest(page, configURLToTry, tokenToUse) {
  await page.goto(configURLToTry, {
    waitUntil: "networkidle0",
  });

  // Wait for the textarea
  await page.waitForSelector('textarea[name="note"]');

  // Type into the textarea
  await page.type('textarea[name="note"]', tokenToUse);

  // Enable the submit button by removing the disabled attribute
  await page.evaluate(() => {
    const button = document.querySelector('button[type="submit"]');
    if (button) {
      button.removeAttribute("disabled");
    }
  });

  // Wait a moment (sometimes helps with transitions/JS logic)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Submit the form
  await page.click('button[type="submit"]');

  // Optional: wait to confirm the form was submitted
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("Note submitted successfully.");
}

async function redirectTest(page, redirectURLToTry) {
  await page.goto(redirectURLToTry, {
    waitUntil: "networkidle0",
  });

  // Wait a moment (sometimes helps with transitions/JS logic)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Redirect worked");
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const randomIndex = Math.floor(Math.random() * options.length);
  const chosenOption = options[randomIndex];

  const configURLToTry = `https://brilliantqr.com/configure/${chosenOption}/0`;
  const redirectURLToTry = `https://brilliantqr.com/redirect/${chosenOption}/0`;
  const tokenToUse = crypto.randomUUID();

  const page = await browser.newPage();

  try {
    await configureTest(page, configURLToTry, tokenToUse);
    await redirectTest(page, redirectURLToTry);
  } catch (err) {
    console.error("Error during automation:", err);
  } finally {
    await browser.close();
  }
})();
