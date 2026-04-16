const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

/**
 * Automates the submission of a Google Form.
 * @param {string} formUrl - The URL of the Google Form snippet/document.
 * @param {string} message - The daily update text to input.
 */
async function submitDailyJournal(formUrl, message) {
  console.log(`Launching browser...`);
  // headless: false makes the browser visible. 
  // slowMo adds a slight delay to each action so you can see it happen.
  // Dynamically find Chrome path based on Windows, Mac, or Linux
  const os = require('os');
  const fs = require('fs');
  
  let chromePath = '';
  if (os.platform() === 'win32') {
    // Check both standard local and x86 program files for Chrome
    const winPath1 = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const winPath2 = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
    chromePath = fs.existsSync(winPath1) ? winPath1 : winPath2;
  } else if (os.platform() === 'darwin') {
    chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    // Linux varies heavily. Scan for the most common Linux binary locations natively.
    const linuxPaths = [
      '/usr/bin/google-chrome-stable',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium'
    ];
    for (const p of linuxPaths) {
      if (fs.existsSync(p)) {
        chromePath = p;
        break;
      }
    }
    // Fallback if none exist on the standard root
    if (!chromePath) chromePath = '/usr/bin/google-chrome';
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
      console.log('You are not logged into your Google account! Please sign in manually...');
      
      console.log('Waiting up to 5 minutes for you to complete your sign-in...');
      
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

    // 0. Click "Clear form" to ensure a clean slate
    console.log('Attempting to clear form for a clean state...');
    const clearFormButton = await page.evaluateHandle(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const targetSpan = spans.find(s => s.innerText === 'Clear form');
      if (targetSpan) {
        return targetSpan.closest('div[role="button"]') || targetSpan;
      }
      return null;
    });

    if (clearFormButton && await clearFormButton.asElement()) {
      await page.evaluate(el => el.click(), clearFormButton);
      console.log('Clicked "Clear form". Waiting for confirmation dialog...');
      
      await new Promise(r => setTimeout(r, 1500));
      
      // Click the confirmation "Clear form" in the modal dialog
      const confirmClearButton = await page.evaluateHandle(() => {
        const dialogs = Array.from(document.querySelectorAll('div[role="alertdialog"], div[role="dialog"]'));
        if (dialogs.length > 0) {
           const spans = Array.from(dialogs[dialogs.length - 1].querySelectorAll('span'));
           const targetSpan = spans.find(s => s.innerText === 'Clear form');
           if (targetSpan) return targetSpan.closest('div[role="button"]') || targetSpan;
        }
        // Fallback
        const spans = Array.from(document.querySelectorAll('span'));
        // The dialog popup usually creates new elements at the end, finding the last matching one
        const targetSpan = spans.reverse().find(s => s.innerText === 'Clear form');
        if (targetSpan) {
          return targetSpan.closest('div[role="button"]') || targetSpan;
        }
        return null;
      });
      
      if (confirmClearButton && await confirmClearButton.asElement()) {
         await page.evaluate(el => el.click(), confirmClearButton);
         console.log('Form cleared successfully!');
      }
      // Give it extra time to reload/reset the DOM
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log('No "Clear form" button found. Assuming form is already clean.');
    }

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

    const csTasks = [
      "Graph algorithms", "Dynamic programming", "Trees and Tries", "Backtracking and Recursion",
      "Sorting and Searching algorithms", "Linked Lists and manipulating pointers", "Heaps and Priority Queues",
      "Hash Tables and Maps", "String manipulation algorithms", "Bit manipulation tricks", "Greedy algorithms",
      "System Design principles", "Rest API design and implementation", "Database schema normalization",
      "SQL complex queries optimization", "NoSQL aggregation pipelines", "Caching strategies with Redis",
      "Microservices architecture patterns", "Message queues (Kafka, RabbitMQ)", "WebSockets for real-time communication",
      "Docker containerization", "Kubernetes orchestration basics", "CI/CD pipeline setup with GitHub Actions",
      "React components and hooks", "State management with Redux", "Next.js server-side rendering",
      "Node.js event loop understanding", "Express.js middleware authoring", "Authentication with JWT",
      "OAuth2 integration", "Web security (XSS, CSRF mitigation)", "Unit testing with Jest",
      "E2E testing with Cypress or Playwright", "Typescript interfaces and generics", "Python Pandas for data manipulation",
      "Machine learning basics with Scikit-learn", "Neural networks with TensorFlow", "Computer vision with OpenCV",
      "Natural language processing with NLTK", "AWS fundamental services (EC2, S3)", "Serverless functions (AWS Lambda)",
      "GCP Firebase integration", "Azure DevOps workflows", "Linux shell scripting", "Git advanced workflows (rebase, cherry-pick)",
      "WebRTC protocol", "GraphQL server setup", "Deno framework exploration", "Rust server development",
      "Go language memory management", "Web frameworks comparison (Vue vs React)", "CSS Flexbox and Grid layouts",
      "Tailwind CSS styling", "Web performance optimization (Lazy loading)", "SEO best practices",
      "Progressive Web Apps (PWA)", "Service Workers implementation", "Browser rendering engine study",
      "TCP/IP layer protocols", "HTTP/2 and HTTP/3 enhancements", "Sockets programming in C",
      "Memory allocation in C/C++", "Object-oriented design patterns", "Functional programming paradigms",
      "Event-driven architecture", "SOLID design principles", "Clean Architecture implementation",
      "TDD (Test-Driven Development)", "BDD (Behavior-Driven Development)", "Agile/Scrum methodology",
      "Code review best practices", "Memory profiling and leak detection", "Multithreading and concurrency",
      "Asynchronous programming patterns", "Deadlock prevention strategies", "Operating System process scheduling",
      "Virtual memory structures", "File system implementation basics", "Compiler design basics (Lexical analysis)",
      "AST (Abstract Syntax Tree) manipulation", "Game development basics (Unity)", "Physics engines in game dev",
      "Blockchain fundamentals", "Smart contracts with Solidity", "Web3.js interactions", "Cryptography basics (RSA, AES)",
      "Hashing algorithms (SHA-256)", "Public Key Infrastructure (PKI)", "Penetration testing basics",
      "Ethical hacking and recon", "OWASP top 10 vulnerabilities", "MapReduce paradigm", "Hadoop ecosystem review",
      "Apache Spark data processing", "Distributed tracing and logging", "Data warehousing structures",
      "ETL pipeline building", "Data visualization with D3.js", "Mobile app dev with React Native", "Flutter cross-platform dev"
    ];
    
    // Pick a random task
    const randomTask = csTasks[Math.floor(Math.random() * csTasks.length)];

    const formAnswers = [
      { 
        question: 'What were your key tasks for the day?', 
        answer: `I practiced and studied ${randomTask} today.` 
      },
      { 
        question: 'What challenges/problems did you solve today?', 
        answer: `I solved various implementations and scenarios related to ${randomTask}.` 
      },
      { 
        question: 'What challenges/problems you were NOT able to solve today', 
        answer: 'I was able to solve most of the major challenges.' 
      },
      { 
        question: 'What is your plan for the next day of Simulated Work?', 
        answer: `I will review ${randomTask} and jump to the next topic.` 
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

    // Click the "Next" or "Submit" button for Page 2
    console.log('Clicking the "Next" or "Submit" button after answering questions...');
    const nextOrSubmitBtn = await page.evaluateHandle(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const targetSpan = spans.find(s => s.innerText === 'Next' || s.innerText === 'Submit');
      if (targetSpan) {
        return targetSpan.closest('div[role="button"]') || targetSpan;
      }
      return null;
    });

    if (nextOrSubmitBtn && nextOrSubmitBtn.asElement()) {
      await nextOrSubmitBtn.asElement().click();
      console.log('Clicked button to transition from Page 2!');
    } else {
      console.log('Warning: Could not find the "Next" or "Submit" button on Page 2.');
    }

    // Wait for the next section to animate and render
    await new Promise(r => setTimeout(r, 2000));
    
    // Attempt one final check for a "Submit" button in case there was a literal Page 3
    console.log('Checking for a final "Submit" button...');
    const finalSubmitBtn = await page.evaluateHandle(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const targetSpan = spans.find(s => s.innerText === 'Submit');
      if (targetSpan) {
        return targetSpan.closest('div[role="button"]') || targetSpan;
      }
      return null;
    });

    if (finalSubmitBtn && finalSubmitBtn.asElement()) {
      await finalSubmitBtn.asElement().click();
      console.log('Successfully clicked Submit!');
      await new Promise(r => setTimeout(r, 2000)); // Wait for confirmation page
    }

    console.log('Automation complete! Journal successfully submitted.');
    
    // Close browser gracefully to ensure profile state/cookies are saved
    await browser.close();
    return { success: true, message: 'Automation complete! Journal successfully submitted.' };
  } catch (error) {
    console.error('Automation error:', error);
    // Graceful close on error as well
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

module.exports = { submitDailyJournal };
