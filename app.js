const {
    app,
    BrowserWindow,
    Tray
} = require("electron");

/**
 * get app ready
 */
let mainWind;
app.on("ready", () => {
    mainWind = new BrowserWindow({
        width: 800,
        height: 600,
        
    });
    
    mainWind.on("close", () => {
        console.log("Closed");
        mainWind = null;
    });
    mainWind.loadFile("./views/index.html");
});