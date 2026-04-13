const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

/**
 * Automates the submission of a Google Form.
 * @param {string} formUrl - The URL of the Google Form snippet/document.
 * @param {string} message - The daily update text to input.
 */
async function submitDailyJournal(formUrl, message) {
  console.log('Launching browser...');
  // headless: false makes the browser visible. 
  // slowMo adds a slight delay to each action so you can see it happen.
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 50,
    defaultViewport: null,
    // Use your actual physical Google Chrome instead of Chromium (Avoids "Insecure Browser" blocks from Google)
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    // This folder acts as your new permanent "kalvium.community" Chrome profile
    userDataDir: './chrome_profile'
  });
  
  try {
    const page = await browser.newPage();
    
    // First, let's check if you are logged into Google at all in this local profile
    console.log('Checking Kalvium Google Account connection...');
    await page.goto('https://accounts.google.com/signin/v2/identifier?hl=en&flowName=GlifWebSignIn&flowEntry=ServiceLogin', { waitUntil: 'networkidle2' });
    
    // If the URL is still on the sign-in page, we automatically enter the Kalvium email
    if (page.url().includes('signin') || page.url().includes('identifier')) {
      console.log('Automating Kalvium sign-in process...');
      
      try {
        // Wait for the email input and type the kalvium ID
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        // NOTE: You can change this to your exact email below!
        await page.type('input[type="email"]', 'your.name@kalvium.community');
        await page.keyboard.press('Enter');
        
        console.log('Please enter your password manually in the Chrome window.');
      } catch (err) {
        console.log('Already past the email stage or already logged in.');
      }

      console.log('Waiting up to 5 minutes for you to complete sign in...');
      // Wait until the URL changes to Google myaccount or the Google Form indicating success
      await page.waitForNavigation({ timeout: 300000 }); 
      console.log('Sign-in successful! Proceeding to the Google Form...');
    }

    console.log(`Navigating to ${formUrl}...`);
    await page.goto(formUrl, { waitUntil: 'networkidle2' });

    // Example interaction: Wait for a specific input field
    // Note: Google Forms input selectors vary, you need to inspect your specific form and get the textarea/input selector.
    // As a fallback for demonstration, we try to grab any text input or textarea
    const inputSelector = 'textarea, input[type="text"]'; 
    
    try {
      await page.waitForSelector(inputSelector, { timeout: 5000 });
      await page.type(inputSelector, message);
    } catch (e) {
      console.log('Could not find generic input field. Please update the selector in DailyJournal/automate.js.');
    }

    // THE CLICK EVENT IS COMMENTED OUT SO THE USER MUST SUBMIT MANUALLY
    // const submitButtonSelector = 'div[role="button"].appsMaterialWizButtonEl';
    // await page.click(submitButtonSelector);
    
    console.log(`Form filled. Message entered: "${message}"`);
    console.log('Leaving browser open for manual submission...');
    
    // DELIBERATELY NOT CLOSING THE BROWSER:
    // await browser.close(); 
    
    return { success: true, message: 'Values filled! Please review and submit manually in Chrome.' };
  } catch (error) {
    console.error('Automation error:', error);
    // Even if it fails, leaving the browser open is helpful to debug visually
    // await browser.close();
    throw error;
  }
}

module.exports = { submitDailyJournal };
