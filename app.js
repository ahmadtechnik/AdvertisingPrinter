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
    var fileName = args.data.productTitleField + ".pdf";

    printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        modal: true,
        fullscreen: true,
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

    printWindow.webContents.on("did-finish-load", () => {
        printWindow.webContents.send("dataToPrint" + selectedPageSize, storedData);
        var landScape = true;
        if (selectedPageSize.toUpperCase() === "A6") {
            selectedPageSize = "A4"
            landScape = false
        }
        /**
         * load the requiered file
         */
        // write File to home Desktop
        printWindow.webContents.printToPDF({
            printBackground: true,
            landscape: landScape,
            pageSize: selectedPageSize.toUpperCase()
        }, (error, data) => {
            if (!error) {
                var path = require("path").join(HOME_DIR + "/Desktop/") + fileName;
                fs.writeFile(path, data, (err) => {
                    if (!err) {
                        printWindow.webContents.send("savedFilePath", path);
                        dialog.showMessageBox({
                            title: "File Saved",
                            message: "Location : " + path
                        });
                        require("openurl").open(`file://` + path);
                        printWindow.close();
                    } else {
                        dialog.showErrorBox("Error Saving File.", "ERROR : " + err + "\n Please notes that, maybe the old file still opened");
                        printWindow.close();
                    }
                });
            } else {
                dialog.showErrorBox("Error Print To PDF.", "ERROR : " + error);
            }
        });
    });

    /** to clear RAM after window closed */
    printWindow.on("closed", () => {
        printWindow = null;
        console.log("closed")
    })
})