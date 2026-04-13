const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

/**
 * Automates the submission of a Google Form.
 * @param {string} formUrl - The URL of the Google Form snippet/document.
 * @param {string} message - The daily update text to input.
 * @param {string} email - The dynamic Kalvium email to sign in with.
 */
async function submitDailyJournal(formUrl, message, email) {
  console.log(`Launching browser for ${email}...`);
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
    // Instead of opening a new tab, grab the first default tab Chrome opened
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0] : await browser.newPage();
    
    // Navigate directly to your daily journal form
    console.log(`Navigating to ${formUrl}...`);
    await page.goto(formUrl, { waitUntil: 'networkidle2' });
    
    // If Google Forms forces a login, it immediately redirects you to its Sign-In page.
    if (page.url().includes('signin') || page.url().includes('identifier') || page.url().includes('ServiceLogin')) {
      console.log('You are not logged into your Kalvium account! Automating sign-in process...');
      
      try {
        // Wait for the email input and type the Kalvium ID dynamically created in the frontend
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        await page.type('input[type="email"]', email);
        await page.keyboard.press('Enter');
        
        console.log('Email entered. Please enter your password manually in the Chrome window.');
      } catch (err) {
        console.log('Could not automatically type email. You may be on an account selection screen.');
      }

      console.log('Waiting up to 5 minutes for you to complete your password sign-in...');
      
      // Halts the script and only continues when Google automatically shifts the URL back away from the login page!
      await page.waitForFunction(
        () => !window.location.href.includes('signin') && !window.location.href.includes('identifier') && !window.location.href.includes('ServiceLogin'),
        { timeout: 300000 } // 5 Minutes
      );
      
      console.log('Sign-in successful!');

      // Since sign-in redirects to the form natively, just verify we actually got there, otherwise manually route back.
      if (!page.url().includes('docs.google.com/forms')) {
        console.log('Redirecting back to the Daily Journal form...');
        await page.goto(formUrl, { waitUntil: 'networkidle2' });
      }
    } else {
      console.log('Already logged into Kalvium! Bypassing sign-in and proceeding directly to the form...');
    }

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
