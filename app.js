const {
    app,
    BrowserWindow,
    Tray,
    ipcMain,
    dialog,
    Menu,
    MenuItem,
    globalShortcut
} = require("electron");
const fs = require("fs");
var HOME_DIR = require("os").homedir();
var PATH = require("path");

var dirExist = PATH.join(HOME_DIR + "/Desktop/AdvertisingPDF/");
if (fs.existsSync(dirExist)) {
    console.log("FOLDER EXIST");
} else {
    var folderMeked = fs.mkdirSync(PATH.join(HOME_DIR + "/Desktop/AdvertisingPDF"));
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

    mainWind.webContents.on("did-finish-load", () => {

    });

    //mainWind.setMenu(null);
});
var printWindow;
ipcMain.on("chan", (event, args) => {

    var selectedPageSize = args.selectedPageSize;
    var storedData = args.data;
    var fileName = args.data.productTitleField + "#" + selectedPageSize + ".pdf";

    printWindow = new BrowserWindow({
        width: 800,
        height: 600,
        modal: true,
        fullscreen: true,
        parent: mainWind,
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
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
                writeSyncFile(data, fileName, args);
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

ipcMain.on("showSidbarMenu", () => {
    console.log("on showSidbarMenu")
    emitAllTamplatesNames();
})

var counter = 1;

function writeSyncFile(data, filename, args) {
    var path = PATH.join(HOME_DIR + "/Desktop/AdvertisingPDF/") + filename;
    var dirPath = PATH.join(HOME_DIR + "/Desktop/AdvertisingPDF/");

    checkIfFileExistCallback(path, (fileExist, path) => {
        // in this case the file is exist
        // and it should not be writted again
        if (fileExist) {
            var selectedBackgroundColor = args.data.pageBackgroundColorDropdown;
            var newFileName = counter + "_" + filename;
            /** 
             * in case the file was exist 
             * it should to be written again with 
             * other name
             */

            writeSyncFile(data, newFileName, args);
            /*
            dialog.showMessageBox(mainWind, {
                title: "THIS FILE EXIST",
                message: "Please change file name or you can also change {Product Title} to change the name automatically",
                detail: "File Location : " + path,
                buttons: [
                    "Ok", "Open Old file to me."
                ]
            }, (response) => {
                switch (response) {
                    case 1:
                        require("openurl").open(`file://` + path);
                        break;
                }
            });
*/
            counter++;
        }
        // in this case it should write the file again
        else {
            fs.writeFile(path, data, (err) => {
                if (!err) {
                    printWindow.webContents.send("savedFilePath", path);
                    // write template file
                    createTemplate(args, PATH.join(__dirname + "/templets/") + filename + ".json");
                    dialog.showMessageBox(mainWind, {
                        title: "DONE!!!",
                        message: "This file was succesfully created..",
                        detail: "File Location : " + path,
                        buttons: [
                            "Ok", "Open Saved File."
                        ]
                    }, (response) => {
                        switch (response) {
                            case 1:
                                require("openurl").open(`file://` + path);
                                break;
                        }
                    });

                    printWindow.close();
                } else {
                    var newName = filename.replace(/[|&;$%@"<>()+/,]/g, "-");
                    /** if the same file was not exist or opened */
                    writeSyncFile(data, newName, args);
                    // write template file
                    createTemplate(args, PATH.join(__dirname + "/templets/", newName + ".json"));

                    counter++;
                }
            });
        }
    });
}

/** funciton to create JSON template */
function createTemplate(data, fileName) {
    console.log(fileName);
    var fileExist = fs.existsSync(fileName);

    fs.writeFile(fileName, JSON.stringify(data), 'utf8', (err) => {
        if (!err) {

        } else {
            console.log(err);
        }
    });
}

/** to emit all tamplates Name to render */
function emitAllTamplatesNames() {
    // read all tamplates names 
    var allTamplates = fs.readdirSync(PATH.join(__dirname, "/templets/"));
    delete allTamplates[0];
    mainWind.webContents.send("allExistingTamplates", allTamplates);
}

// to check if someFileExistOrNot
function checkIfFileExistCallback(filepath, callback) {
    var isExist = fs.existsSync(filepath);
    if (isExist) {
        callback(true, filepath);
    } else {
        callback(false, filepath);
    }
}

// auto updator function