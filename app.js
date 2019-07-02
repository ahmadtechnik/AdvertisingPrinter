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

var dirExist = require("path").join(HOME_DIR + "/Desktop/AdvertisingPDF/");
if(fs.existsSync(dirExist)){
    console.log("FOLDER EXIST");
}else{
    var folderMeked = fs.mkdirSync(require("path").join(HOME_DIR + "/Desktop/AdvertisingPDF"));
    console.log("FOLDER CREATED ....");
}
/*
const request = require("request");
const lastVLocal = require("./package.json").version;
const appName = require("./package.json").appName;
request("https://ah-t.de/appsUpdates/appsMap.json", (error, response, body) => {
    if (!error && response.statusCode === 200) {

    }
});
*/

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
                writeSyncFile(data, fileName);
            } else {
                dialog.showErrorBox("Error Print To PDF.", "ERROR : " + error);
            }
        });
    });
    /** to clear RAM after window closed */
    printWindow.on("closed", () => {
        printWindow = null;
        console.log("closed")
    });
});
var counter = 1;
function writeSyncFile(data, filename) {
    var path = require("path").join(HOME_DIR + "/Desktop/AdvertisingPDF/") + filename;
    var dirPath = require("path").join(HOME_DIR + "/Desktop/AdvertisingPDF/");
    fs.writeFile(path, data, (err) => {
        if (!err) {
            printWindow.webContents.send("savedFilePath", path);
            dialog.showMessageBox(mainWind, {
                title: "File Saved",
                message: "Location : " + path,
                detail : path
            });
            require("openurl").open(`file://` + path);
            printWindow.close();
        } else {
            var fileExist = fs.existsSync(dirPath + `GENERETEDNAME${counter}.pdf`);
            if (fileExist) {
                console.log("File is exist");
                counter++;
                writeSyncFile(data, `GENERETEDNAME${counter}.pdf`);
            } else {
                console.log("File is not exist");
                writeSyncFile(data, `GENERETEDNAME${counter}.pdf`);
            }
        }
    });
}
// auto updator function