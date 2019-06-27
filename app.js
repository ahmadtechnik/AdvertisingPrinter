const {
    app,
    BrowserWindow,
    Tray,
    ipcMain
} = require("electron");

/**
 * get app ready
 */
let mainWind;
app.on("ready", () => {
    mainWind = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: 'app.js'
        }
    });

    mainWind.on("close", () => {
        console.log("Closed");
        mainWind = null;
    });
    mainWind.loadFile("./views/index.html");

});
var printWindow;
ipcMain.on("chan", (event, args) => {
    var selectedPageSize = args.selectedPageSize;
    var storedData = args.data;
    printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        modal: true,
        parent: mainWind,
        webPreferences: {
            nodeIntegration: true
        }
    });
    
    /**
     * load the requiered file
     */
    printWindow.loadFile(`./views/${selectedPageSize}.html`);
    /**
     * after finishing load the window
     * it should send the stored data to secound window
     */
    printWindow.webContents.on("did-finish-load" , () => {
        printWindow.webContents.send("dataToPrint", storedData);
        //
       // printWindow.webContents.print();
    });

    /** to clear RAM after window closed */
    printWindow.on("closed", () => {
        printWindow = null;
    })
})