# EasyLife 🚀

EasyLife is a cross-platform personal automation tool designed to make your daily, repetitive online tasks entirely automated! It consists of a sleek React dashboard and a stealthy Node.js (Puppeteer) backend engine to bypass bot detections and accomplish browser tasks—like filling out your Daily Journal Google Form—effortlessly.

## Features ✨
- **Stealth Automation:** Uses `puppeteer-extra-plugin-stealth` seamlessly tying into your physical Chrome installation to naturally bypass Google "Insecure Browser" blocks.
- **Cross-Platform:** Works natively out-of-the-box on **Windows**, **macOS**, and **Linux**.
- **Intuitive GUI & CLI:** Use the beautiful React dashboard (`npm start`) or the global terminal command (`vansh fill form`) anywhere on your operating system.
- **Smart Dependencies:** The installer checks your system and downloads packages *only once*, keeping boots fast.

---

## 🛠️ Usage & Installation Steps

### 1. Requirements
Ensure you have the following installed on your system:
- **[Node.js](https://nodejs.org/)** (v18 or above recommended)
- **Google Chrome** browser (used naturally by the automation script)

### 2. First-Time Setup
Clone this repository to your preferred specific folder. Open your terminal (or Command Prompt) and run the initial setup depending on your operating system:

#### For Windows:
Open Command Prompt (CMD) or PowerShell and run:
```bat
git clone https://github.com/VANSH-THAPAR/EasyLife.git
cd EasyLife
npm install
npm run install-os
```
*(This sets up your global `vansh` CLI across your Windows system and creates a Desktop shortcut).*

#### For macOS / Linux:
Open your Terminal and run:
```bash
git clone https://github.com/VANSH-THAPAR/EasyLife.git
cd EasyLife
npm install
npm run install-os
```
*(After the installer finishes, it will prompt you. Simply close your terminal and open a new one, or type `source ~/.zshrc` (or `~/.bashrc`) so your terminal loads the new global command).*

*🔥 **Magic under the hood:** This `npm install` handles all the required packages across subfolders, and `npm run install-os` creates a global CLI command along with a Desktop Shortcut tailored specifically to your OS structure.*

### 3. Run Your Automation Anytime 🤖
Once the setup is done, you **do not** need to keep anything running in the background! From anywhere on your computer, at any time, just open a terminal and type:

```bash
vansh fill form
```

*(Mac/Linux users: Make sure you restart your terminal once or run `source ~/.zshrc` after the `install-os` step so your terminal registers the new alias!)*

*The script will automatically launch a visible Google Chrome, attempt to **Clear the form** to ensure a completely fresh session, fill out your Daily Journal, aggressively click **Submit**, and elegantly conclude itself!*

---

### Folder Structure
- **`/Frontend`**: The Vite & React App serving the user interface. Built files (`/dist`) are served by the backend automatically.
- **`/DailyJournal`**: Node.js API server and the Puppeteer `automate.js` script containing stealth logic.
- **`/bin`**: Holds the CLI wrapper entry point.
- **`start.js`**: The root-level smart entry script that automatically manages cross-platform builds and singleton dependency installations.