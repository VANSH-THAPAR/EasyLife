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
  // Dynamically find Chrome path based on Windows, Mac, or Linux
  const os = require('os');
  let chromePath = '';
  if (os.platform() === 'win32') {
    chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (os.platform() === 'darwin') {
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    chromePath = '/usr/bin/google-chrome'; // Linux default
  }

  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 50,
    defaultViewport: null,
    executablePath: chromePath,
    // Uses the absolute folder path so it saves safely in your EasyLife folder no matter where you execute 'vansh fill form'
    userDataDir: require('path').join(__dirname, 'chrome_profile')
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

    // --- FORM INTERACTION - PAGE 1 ---
    console.log('Interacting with the form: Page 1...');
    // Give the form a moment to render all elements fully
    await new Promise(r => setTimeout(r, 2000));

    // 1. Select the "Record email" checkbox (if it exists)
    // Most Google Forms use role="checkbox" for the "Record [email] as the email to be included" option.
    const checkboxes = await page.$$('div[role="checkbox"]');
    if (checkboxes.length > 0) {
      console.log('Found email verification checkbox. Clicking it...');
      await checkboxes[0].click();
      await new Promise(r => setTimeout(r, 500)); // slight pause
    } else {
      console.log('No email verification checkbox found, continuing...');
    }

    // 2. Click the radio button: "It was a working day, and I was present"
    console.log('Selecting "It was a working day, and I was present"...');
    const workingDayOption = await page.evaluateHandle(() => {
      // Find all span elements on the page
      const spans = Array.from(document.querySelectorAll('span'));
      // Filter for the one that exactly matches the requested option text
      const targetSpan = spans.find(s => s.innerText.includes('It was a working day, and I was present'));
      if (targetSpan) {
        // The actual clickable radio button wrapper is usually a few levels up
        return targetSpan.closest('div[role="radio"]') || targetSpan;
      }
      return null;
    });

    if (workingDayOption) {
      await workingDayOption.click();
      console.log('Option selected successfully!');
    } else {
      console.log('Warning: Could not find the "working day" option. Checking if page layout is different.');
    }
    
    await new Promise(r => setTimeout(r, 1000));

    // 3. Click the "Next" button to proceed to the next page
    console.log('Clicking the "Next" button...');
    const nextButton = await page.evaluateHandle(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const targetSpan = spans.find(s => s.innerText === 'Next');
      if (targetSpan) {
        return targetSpan.closest('div[role="button"]') || targetSpan;
      }
      return null;
    });

    if (nextButton) {
      await nextButton.click();
      console.log('Clicked Next! Moving to the next section...');
    } else {
      console.log('Warning: Could not find the "Next" button.');
    }

    console.log('Finished automating Page 1 tasks!');
    
    // --- FORM INTERACTION - PAGE 2 ---
    console.log('Interacting with the form: Page 2...');
    // Wait for the next section to animate and render
    await new Promise(r => setTimeout(r, 2500));

    const formAnswers = [
      { 
        question: 'What were your key tasks for the day?', 
        answer: 'i did dsa today' 
      },
      { 
        question: 'What challenges/problems did you solve today?', 
        answer: 'i solved trees and dp questions' 
      },
      { 
        question: 'What challenges/problems you were NOT able to solve today', 
        answer: 'i solved all the challanges' 
      },
      { 
        question: 'What is your plan for the next day of Simulated Work?', 
        answer: 'i will master trees and dp' 
      }
    ];

    for (const q of formAnswers) {
      console.log(`Typing answer for: "${q.question}"...`);
      const inputHandle = await page.evaluateHandle((qText) => {
        // In Google Forms, each question block usually has role="listitem"
        const listItems = Array.from(document.querySelectorAll('div[role="listitem"]'));
        for (const item of listItems) {
          if (item.innerText.includes(qText)) {
            // Find the textarea or input within this specific question block
            return item.querySelector('textarea') || item.querySelector('input[type="text"]');
          }
        }
        // Fallback: If layout changed, try finding headers
        const headers = Array.from(document.querySelectorAll('[role="heading"], div'));
        for (const header of headers) {
           if (header.innerText && header.innerText.includes(qText)) {
              let parent = header.parentElement;
              // search up to 4 levels deep for the closest input
              for(let i=0; i<4; i++) {
                if (!parent) break;
                let input = parent.querySelector('textarea') || parent.querySelector('input[type="text"]');
                if (input) return input;
                parent = parent.parentElement;
              }
           }
        }
        return null;
      }, q.question);

      if (inputHandle && inputHandle.asElement()) {
        await inputHandle.asElement().type(q.answer);
        await new Promise(r => setTimeout(r, 500)); // slight pause between typing different fields
      } else {
        console.log(`Warning: Could not find the text field for "${q.question}"`);
      }
    }

    await new Promise(r => setTimeout(r, 1000));

    // Click the "Next" button for Page 2
    console.log('Clicking the "Next" button after answering questions...');
    const nextButtonPage2 = await page.evaluateHandle(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const targetSpan = spans.find(s => s.innerText === 'Next');
      if (targetSpan) {
        return targetSpan.closest('div[role="button"]') || targetSpan;
      }
      return null;
    });

    if (nextButtonPage2 && nextButtonPage2.asElement()) {
      await nextButtonPage2.asElement().click();
      console.log('Clicked Next! Moving to the final submission page...');
    } else {
      console.log('Warning: Could not find the "Next" button on Page 2.');
    }

    console.log('Finished automating Page 2 tasks! Leaving browser open for manual submission...');
    
    // Leaving browser open for now to let you verify it worked step by step
    return { success: true, message: 'Values filled! Please review and submit manually in Chrome.' };
  } catch (error) {
    console.error('Automation error:', error);
    // Even if it fails, leaving the browser open is helpful to debug visually
    // await browser.close();
    throw error;
  }
}

module.exports = { submitDailyJournal };
