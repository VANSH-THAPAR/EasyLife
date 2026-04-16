<div align="center">
  <h1> EasyLife 🚀 </h1>
  <p><em>Your ultimate cross-platform personal automation tool.</em></p>
</div>

<br />

**EasyLife** is designed to make your daily, repetitive online tasks entirely automated! It consists of a sleek React dashboard and a stealthy Node.js (Puppeteer) backend engine to bypass bot detections and accomplish browser tasks—like flexibly filling out your Daily Journal Google Form—effortlessly.

---

## Table of Contents
- [Features ✨](#features-)
- [Requirements](#requirements)
- [Installation and Setup 🛠️](#installation-and-setup-️)
  - [Windows](#for-windows)
  - [macOS / Linux](#for-macos--linux)
- [Usage 🤖](#usage-)
- [Folder Structure 📂](#folder-structure-)

---

## Features ✨
- 🥷 **Stealth Automation:** Uses `puppeteer-extra-plugin-stealth` seamlessly tying into your physical Chrome installation to naturally bypass Google "Insecure Browser" blocks.
- 💻 **Cross-Platform:** Works natively out-of-the-box on **Windows**, **macOS**, and **Linux**.
- 🎨 **Intuitive GUI & CLI:** Use the beautiful React dashboard (`npm start`) or the global terminal command (`vansh fill form`) from anywhere on your operating system.
- 🧠 **Smart Dependencies:** The installer checks your system and downloads packages *only once*, keeping boots fast.

---

## Requirements
Ensure you have the following installed on your system before proceeding:
- **[Node.js](https://nodejs.org/)** (v18 or above recommended)
- **Google Chrome** browser (used natively by the automation script)
- **Git** (for cloning the repository)

---

## Installation and Setup 🛠️

### First-Time Setup
Clone this repository to your preferred permanent folder. Open your terminal (or Command Prompt) and run the initial setup depending on your operating system:

#### For Windows:
Open Command Prompt (CMD) or PowerShell and run:
```bat
git clone https://github.com/VANSH-THAPAR/EasyLife.git
cd EasyLife
npm install
npm run install-os
```
> **Note:** This sets up your global `vansh` CLI across your Windows system and creates a handy Desktop shortcut.

#### For macOS / Linux:
Open your Terminal and run:
```bash
git clone https://github.com/VANSH-THAPAR/EasyLife.git
cd EasyLife
npm install
npm run install-os
```
> **Note:** After the installer finishes, it will prompt you. Simply close your terminal and open a new one, or type `source ~/.zshrc` (or `source ~/.bashrc`) so your terminal loads the newly created global command.

<details>
<summary>🔥 <b>Magic under the hood (Click to expand)</b></summary>
This <code>npm install</code> handles all the required packages across subfolders sequentially, and <code>npm run install-os</code> creates a global CLI command along with a Desktop Shortcut tailored specifically to your OS structure!
</details>

---

## Usage 🤖

### Run Your Automation Anytime
Once the setup is done, you **do not** need to keep anything running in the background! From anywhere on your computer, at any time, just open a terminal and type:

```bash
vansh fill form
```

### Automate Daily via Windows Task Scheduler (Windows Only)

**Step 1: Create the Batch File**
First, create a file named `vansh.bat` in your `C:\Users\LENOVO` directory. Open it in a text editor like Notepad and paste the following content:
```bat
@echo off
"C:\Program Files\nodejs\node.exe" "C:\Users\LENOVO\EasyLife\bin\vansh.js" %*
```

**Step 2: Setup the Task Scheduler**
You can set up `vansh` to run automatically every day at a specific time (e.g., 10:15 AM) without you having to lift a finger!

Open your Command Prompt or PowerShell and paste the following command to schedule it:
```bat
schtasks /create /tn "VanshTask" /sc daily /st 10:15 /tr "C:\Users\LENOVO\vansh.bat fill form" /rl HIGHEST /f
```
*(Make sure the path matches where your `vansh.bat` global command is located. You can run `where vansh` to verify.)*

**Want to manually trigger the scheduled task right now?**
```bat
schtasks /run /tn "VanshTask"
```

> ⚠️ **Mac/Linux users:** Make sure you restart your terminal once or run `source ~/.zshrc` after the `install-os` step so your terminal registers the new alias!

**What happens next?** 
The script will automatically launch a visible Google Chrome, attempt to **Clear the form** to ensure a completely fresh session, seamlessly fill out your Daily Journal with dynamic tasks, aggressively click **Submit**, and elegantly gracefully conclude itself!

### Using the Dashboard Interface
If you prefer a graphical interface instead of the terminal:
1. Navigate into the `EasyLife` folder.
2. Run `node start.js`.
3. Open your browser to the local address provided in the terminal to view your Automation Dashboard.

---

## Folder Structure 📂
| Directory / File | Description |
| :--- | :--- |
| 📁 **`/Frontend`** | The Vite & React App serving the user interface. Built files (`/dist`) are served by the backend automatically. |
| 📁 **`/DailyJournal`**| Node.js API server and the Puppeteer `automate.js` script containing the stealth logic. |
| 📁 **`/bin`** | Holds the CLI wrapper entry point. |
| 📄 **`start.js`** | The root-level smart entry script that automatically manages cross-platform builds and singleton dependency installations. |
| 📄 **`setup-os.js`** | OS-level installation script configuring aliases and shortcuts. |

---
*Built to automate the boring stuff. Happy hacking!*