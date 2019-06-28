const {
    app,
    BrowserWindow,
    Tray,
    ipcMain,
    dialog,
    Menu,
    MenuItem
} = require("electron");
const fs = require("fs");
var HOME_DIR = require("os").homedir();
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
    mainWind.loadFile(__dirname + "/views/index.html");

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
        },
        show: false
    });

    printWindow.loadFile(__dirname + `/views/${selectedPageSize}.html`);
    /**
     * after finishing load the window
     * it should send the stored data to secound window
     */
    printWindow.close();
    printWindow.webContents.on("did-finish-load", () => {
        printWindow.webContents.send("dataToPrint", storedData);
        /**
         * load the requiered file
         */
        // write File to home Desktop
        printWindow.webContents.printToPDF({
            printBackground: true,
            landscape: true,
            pageSize: "A3"
        }, (error, data) => {
            if (!error) {
                var path = require("path").join(HOME_DIR + "/Desktop/") + "NewAdvi.pdf";
                fs.writeFile(path, data, (err) => {
                    if (!err) {
                        printWindow.webContents.send("savedFilePath", path);
                        dialog.showMessageBox({
                            title: "File Saved",
                            message: "Location : " + path
                        });
                    } else {
                        dialog.showMessageBox({
                            title: "Error Saving File.",
                            message: "ERROR : " + err
                        });
                        
                    }
                });
            }
        });
    });

    /** to clear RAM after window closed */
    printWindow.on("closed", () => {
        printWindow = null;
    })
})