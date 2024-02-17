const path = require("path");
const { spawnCommand } = require("../src/utils");
const browsers = require("@puppeteer/browsers");
const geckodriver = require("geckodriver");
const edgedriver = require("edgedriver");

async function main() {
  await installBrowsers();
  await installAppiumDepencencies();
}

main();

async function installBrowsers() {
  // Move to doc-detective-core directory to correctly set browser snapshot directory
  cwd = process.cwd();
  process.chdir(path.join(__dirname, ".."));

  // Meta
  const browser_platform = browsers.detectBrowserPlatform();
  const cacheDir = path.resolve("browser-snapshots");

  // Install Chrome
  try {
    console.log("Installing Chrome browser");
    let browser = "chrome";
    buildId = await browsers.resolveBuildId(
      browser,
      browser_platform,
      "stable"
    );
    const chromeInstall = await browsers.install({
      browser,
      buildId,
      cacheDir,
    });
  } catch (e) {
    console.log("Chrome download not available.");
  }

  // Install Firefox
  try {
    console.log("Installing Firefox browser");
    browser = "firefox";
    buildId = await browsers.resolveBuildId(
      browser,
      browser_platform,
      "latest"
    );
    const firefoxInstall = await browsers.install({
      browser,
      buildId,
      cacheDir,
    });
  } catch (e) {
    console.log("Firefox download not available.");
  }

  // Install ChromeDriver
  try {
    console.log("Installing ChromeDriver binary");
    browser = "chromedriver";
    buildId = await browsers.resolveBuildId(
      browser,
      browser_platform,
      "stable"
    );
    const chromeDriverInstall = await browsers.install({
      browser,
      buildId,
      cacheDir,
    });
  } catch (e) {
    console.log("ChromeDriver download not available.");
  }

  // Install EdgeDriver
  try {
    console.log("Installing EdgeDriver binary");
    const edgeDriverPath = await edgedriver.download();
  } catch (e) {
    console.log("Edge browser not available.");
  }

  // Install Geckodriver
  try {
    console.log("Installing Geckodriver binary");
    if (__dirname.includes("node_modules")) {
      // If running from node_modules
      binPath = path.join(__dirname, "../../.bin");
    } else {
      binPath = path.join(__dirname, "../node_modules/.bin");
    }
    process.env.GECKODRIVER_CACHE_DIR = binPath;
    const geckoInstall = await geckodriver.download();
  } catch (e) {
    console.log("Geckodriver download not available.");
  }
  // Move back to original directory
  process.chdir(cwd);
}

// Run `appium` to install the Gecko driver, Chromium driver, and image plugin.
async function installAppiumDepencencies() {
  if (__dirname.includes("node_modules")) {
    // If running from node_modules
    appiumPath = path.join(__dirname, "../../appium");
  } else {
    appiumPath = path.join(__dirname, "../node_modules/appium");
  }
  // Install appium dependencies
  try {
    console.log("Installing Chrome/Edge driver");
    chromiumInstall = await spawnCommand(
      `node ${appiumPath} driver install chromium`
    );
  } catch (e) {
    console.log("Chrome/Edge driver not available.");
  }
  try {
    console.log("Installing Firefox driver");
    geckoInstall = await spawnCommand(
      `node ${appiumPath} driver install gecko`
    );
  } catch (e) {
    console.log("Firefox driver not available.");
  }
  // macOS-only
  if (process.platform == "darwin") {
    try {
      console.log("Installing Safari driver");
      safariInstall = await spawnCommand(
        `node ${appiumPath} driver install safari`
      );
    } catch (e) {
      console.log("Safari driver not available.");
    }
  }
}
