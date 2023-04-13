const path = require("path");
const { spawnCommand } = require("../src/utils");

main();

async function main() {
  await installBrowsers();
  // await installAppliumDepencencies();
}

async function installBrowsers() {
  const { BROWSERS } = await import("@eyeo/get-browser-binary");
  // Install Chromium
  // console.log("Installing Chromium");
  // let chromium = await BROWSERS.chromium.installBrowser("latest");
  // Install Firefox
  console.log("Installing Firefox");
  let firefox = await BROWSERS.firefox.installBrowser("latest");
  // TODO: Installing Edge requires superuser privileges on Linux
  // console.log("Installing Edge");
  // let edge = await BROWSERS.edge.installBrowser("latest");
  // TODO: Catch misc install errors
}

// Run `appium` to install the Gecko driver, Chromium driver, and image plugin.
async function installAppliumDepencencies() {
  appiumPath = path.join(__dirname, "../node_modules/appium");
  appiumDriverList = await spawnCommand(
    `node "${appiumPath}" driver list --installed`
  );
  appiumPluginsList = await spawnCommand(
    `node "${appiumPath}" plugin list --installed`
  );
  await appiumDriverList;
  await appiumPluginsList;
  if (!appiumDriverList.stderr.includes("gecko")) {
    geckoInstall = await spawnCommand(
      `node ${appiumPath} driver install gecko`
    );
    if (geckoInstall.stderr.includes("successfully installed"))
      console.log("Installed Gecko driver.");
  }
  if (!appiumDriverList.stderr.includes("chromium")) {
    chromiumInstall = await spawnCommand(
      `node ${appiumPath} driver install chromium`
    );
    if (chromiumInstall.stderr.includes("successfully installed"))
      console.log("Installed Chromium driver.");
  }
  if (!appiumPluginsList.stderr.includes("images")) {
    imagesInstall = await spawnCommand(
      `node ${appiumPath} plugin install images`
    );
    if (imagesInstall.stderr.includes("successfully installed"))
      console.log("Installed Image plugin.");
  }
}
