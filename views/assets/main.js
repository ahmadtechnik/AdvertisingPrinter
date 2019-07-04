/**
 * Globalize Text Editor Object
 */
var _EDITOR = null;
var _DROPDOWN_OBJECTS = null;
var _UPLOADED_FILE = null;
var _IMAGE_EDITOR_ = null;
var _IMAGE_TO_CORP = null;
var _ALL_DATA_STORED = null;

var electron = require("electron");
var fs = require("fs");
var path = require("path");
var HOME_DIR = require("os").homedir();



// to show all saved Tamplates
electron.ipcRenderer.on("allExistingTamplates", (event, ars) => {
    $(`.tempMenuItem`).remove();
    $.each(ars, (index, args) => {
        args !== null ? args = args.replace(".pdf.json", "") : "";
        if (args !== null) {
            var fileName = `${args}.pdf.json`
            var filePathWithoutJSONExtention = path.join(HOME_DIR, "/Desktop/AdvertisingPDF/", fileName.split(".json")[0]);
            var pdfFileExist = fs.existsSync(filePathWithoutJSONExtention);

            var fileIsExist = fs.existsSync(path.join(__dirname, "/../", "templets", fileName));
            if (fileIsExist && pdfFileExist) {
                try {
                    var fileReaded = fs.readFileSync(path.join(__dirname, "/../", "templets", fileName), "utf8");
                    var background = JSON.parse(fileReaded).data.pageBackgroundColorDropdown;
                    var pageSize = args !== null ? args.split("#")[1] : "";
                    var a = $(`<a class="item tempMenuItem" id="${args}.pdf.json">${args}-${pageSize.toUpperCase()}</a>`);
                    // var removeBtnIcon = $(`<div class="ui button icon black inverted><i class="trash alternate outline icon"></i></div>"`);
                    a.css({
                        background: background
                    })
                    $(`#templatesContainer`).append(a);

                } catch (error) {
                    console.log(error)
                }
            }
        }
    });
    /**
     * in this button i have to get clicked button to get the same
     * JSON file from
     */
    $(`.tempMenuItem`).click((event) => {
        var fileName = $(event.target).attr("id");
        var fileIsExist = fs.existsSync(path.join(__dirname, "/../", "templets", fileName));
        var filePathWithoutJSONExtention = path.join(HOME_DIR, "/Desktop/AdvertisingPDF/", fileName.split(".json")[0]);
        var pdfFileExist = fs.existsSync(filePathWithoutJSONExtention);
        event.ctrlKey === true ? removeFileFromStorage() : openFile();

        function openFile() {
            if (fileIsExist) {
                try {
                    /** check if the pdf file exist before write it again */

                    if (pdfFileExist) {
                        require("openurl").open(`file://` + filePathWithoutJSONExtention);
                    } else {
                        alert(`THIS FILE ${filePathWithoutJSONExtention} REMOVED FROM DESKTOP DIRECTORY`);
                        /*
                        var parseJsonFile = JSON.parse(fileReaded);
                        _ALL_DATA_STORED = parseJsonFile.data;
                        imageEditorModalOptions.onApprove();
                        */
                    }
                } catch (error) {
                    alert("could not parse file : " + fileName);
                }
            }
        }

        function removeFileFromStorage() {
            if (pdfFileExist && fileIsExist) {
                fs.unlinkSync(path.join(__dirname, "/../", "templets", fileName));
                fs.unlinkSync(filePathWithoutJSONExtention);
                $(`#showtampletesBtn`).click();
            }
        };
    });
    $(`.tempMenuItem`).hover((event) => {
        $(event.target).attr("old", $(event.target).text());
        event.ctrlKey ? $(event.target).text("REMOVE.") : "";
    }, (event) => {
        var oldText = $(event.target).text();
        event.ctrlKey ? $(event.target).text($(event.target).attr("old")) : $(event.target).text($(event.target).attr("old"));
    })
});


$(document).ready(() => {
    _EDITOR = new Quill('#editor', options);
    _EDITOR.on('text-change', function (delta, oldDelta, source) {
        if (_EDITOR.getLines().length >= 8) {
            $(_EDITOR.container.offsetParent).find(".underInputFieldText").css("color", "red");
        } else {
            $(_EDITOR.container.offsetParent).find(".underInputFieldText").css("color", "gray");
        }
    });

    /** init elements */
    // 
    $(`#uploadFileFakeButton`).click(() => {
        $(`#uploadedFileButton`).click();
    });
    // set pageBackgroundColorDropdown values
    $(`#pageBackgroundColorDropdown`).dropdown({
        values: backgroundColorsValues
    });
    // set pageSizeDropdown values
    $(`#pageSizeDropdown`).dropdown({
        values: pageSizesValues
    });
    // set print btn action
    $(`#printBtnAction`).click(onPrintBtnAction);
    // set on upload btn change
    $(`#uploadedFileButton`).change(onUploadBtnChnge);
    // to lock any input filed
    $(`input[type="text"]`).keydown(setInputFieldsLength)
    // init Checkbox fields
    $(".checkbox").checkbox();
    // init sidbar menu

    // set showtampletesBtn action
    $(`#showtampletesBtn`).click(() => {
        electron.ipcRenderer.send("showSidbarMenu");
        $(".sidebar").sidebar('setting', 'transition', 'scale down').sidebar("toggle");
    });

    $(document).keydown((event) => {
        event.ctrlKey ? "" : ""
    });
});


/**
 * "productTitleField"
 * "productNewPriceField"
 * "productOldPriceField"
 * "productManufacturerField"
 * "productNoteField"
 * "editor"
 * "pageBackgroundColorDropdown"
 * "pageSizeDropdown"
 * "uploadedFileButton"
 * "uploadFileFakeButton"
 */
var onPrintBtnAction = (event) => {

    var checkBoxesData = {};
    $.each($("[name='addreflactionsToPrice']"), (index, value) => {
        checkBoxesData[$(value).attr("id")] = $(value).is(":checked");
    });

    var productTitleField = $(`#productTitleField`) //
    var productNewPriceField = $(`#productNewPriceField`); //
    var productOldPriceField = $(`#productOldPriceField`);
    var productManufacturerField = $(`#productManufacturerField`); //
    var productNoteField = $(`#productNoteField`);
    var editor = _EDITOR.getHtml(); //
    var pageBackgroundColorDropdown = $(`#pageBackgroundColorDropdown`); //
    var pageSizeDropdown = $(`#pageSizeDropdown`).dropdown("get value"); //
    var uploadedFileButton = document.getElementById("uploadedFileButton");
    var uploadFileFakeButton = $(`#uploadFileFakeButton`);
    /**
     * first step is to check if every field filled 
     * and all values are correct
     */
    if (productTitleField.val() !== "") {
        if (productNewPriceField.val() !== "") {
            if (productManufacturerField.val() !== "") {
                if (pageBackgroundColorDropdown.dropdown("get text") !== "") {
                    if (_UPLOADED_FILE !== null) {
                        uploadFileFakeButton.popup("destroy");

                        /** to convert the uploaded image to base64 */
                        getBase64(_UPLOADED_FILE, (result) => {
                            _ALL_DATA_STORED = {
                                productTitleField: productTitleField.val(),
                                productNewPriceField: productNewPriceField.val(),
                                productManufacturerField: productManufacturerField.val(),
                                pageBackgroundColorDropdown: pageBackgroundColorDropdown.dropdown("get text"),
                                _UPLOADED_FILE: result,
                                productOldPriceField: productOldPriceField.val(),
                                productNoteField: productNoteField.val(),
                                editor: editor,
                                pageSizeDropdown: pageSizeDropdown,
                                checkBoxesData: checkBoxesData
                            }

                            var img = new Image();
                            img.src = result;
                            img.width = 600;
                            var container = $(`<div id='imageEditorContainer'></div>`);
                            container.height = img.height;
                            container.width = img.width;

                            container.append(img);

                            _IMAGE_TO_CORP = img;
                            $(`#imageEditor .content`).html(container);


                            $(`#imageEditor`).modal(imageEditorModalOptions).modal("show");


                        });


                    } else {
                        uploadFileFakeButton.parent().popup({
                            html: "<span style='color:red;'>File is empty</span>",
                        }).popup("show");
                    }
                    pageBackgroundColorDropdown.parent().popup("destroy");
                } else {
                    pageBackgroundColorDropdown.parent().popup({
                        html: "<span style='color:red;'>This filed is empty</span>",
                    }).popup("show");
                }
                productManufacturerField.popup("destroy");
            } else {
                productManufacturerField.popup({
                    html: "<span style='color:red;'>This filed is empty</span>",
                }).popup("show");
            }
            productNewPriceField.popup("destroy");
        } else {
            productNewPriceField.popup({
                html: "<span style='color:red;'>This filed is empty</span>",
            }).popup("show");
        }
        productTitleField.popup("destroy");
    } else {
        productTitleField.popup({
            html: "<span style='color:red;'>This filed is empty</span>",
        }).popup("show");
    }
}

// on upload btn change
var onUploadBtnChnge = (event) => {
    var file = event.target.files;
    var uploadFileFakeButton = $(`#uploadFileFakeButton`);

    if (file.length > 0) {
        if (file[0].type === "image/png" || file[0].type === "image/jpg" || file[0].type === "image/jpeg") {
            _UPLOADED_FILE = file[0];
            uploadFileFakeButton.switchClass("blue", "green");
        } else {
            _UPLOADED_FILE = null;
            uploadFileFakeButton.switchClass("green", "blue");
            alert("THIS KIND OF FILES DOES NOT ACCEPTABLE")
        }
    } else {
        _UPLOADED_FILE = null;
        uploadFileFakeButton.switchClass("green", "blue");
    }


}
/**
 * Text editor toolbar options
 */
var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{
        'header': 1
    }, {
        'header': 2
    }], // custom button values
    [{
        'list': 'ordered'
    }, {
        'list': 'bullet'
    }],
    [{
        'script': 'sub'
    }, {
        'script': 'super'
    }], // superscript/subscript
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }], // outdent/indent
    [{
        'direction': 'rtl'
    }], // text direction

    [{
        'size': ['small', false, 'large', 'huge']
    }], // custom dropdown
    [{
        'header': [1, 2, 3, 4, 5, 6, false]
    }],

    [{
        'color': []
    }, {
        'background': []
    }], // dropdown with defaults from theme
    [{
        'font': []
    }],
    [{
        'align': []
    }],

    ['clean'] // remove formatting button
];
/**
 * Text editor module Options
 */
var options = {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow',
    placeholder: 'Please Type Specifications of the product',
};
/**
 * backgroundcolors dorpdownmenu values
 */
var backgroundColorsValues = []
/**
 * assign page sizes to pagesize select
 */
var pageSizesValues = [{
    name: `A3`,
    value: "a3",
    selected: true
}, {
    name: `A4`,
    value: "a4"
}, {
    name: `A6`,
    value: "a6"
}];

/** define colors values */
var colorsArray = ["red", "orange", "yellow", "pink",
    "olive", "green", "teal", "blue", "violet", "purple",
    "brown", "grey", "black"
];
/** assign all color values to select menu */
$.each(colorsArray, (index, element) => {
    var div = document.createElement("div");
    div.setAttribute("class", "ui label " + element);
    div.setAttribute("id", "color_" + element);
    document.body.appendChild(div);
    var selectedColor = $(div).css("background-color");
    backgroundColorsValues.push({
        name: `<a class="ui label mini ${element}">${selectedColor}</a>`,
        value: `${selectedColor}`
    });
    div.remove();
})

function setInputFieldsLength(event) {
    var thisValue = $(this).val();
    var thisID = $(this).attr("id");
    var keyCode = event.keyCode;
    if (keyCode !== 8) {
        switch (thisID) {
            case "productTitleField":
                if (thisValue.length > 15) {
                    $(this).parent().find("span[class='underInputFieldText']").css("color", "red");
                    return false;
                }
                break;
            case "productNewPriceField":
                if (thisValue.length > 3) {
                    $(this).parent().parent().find("span[class='underInputFieldText']").css("color", "red");
                    return false;
                }
                break;
            case "productOldPriceField":
                if (thisValue.length > 3) {
                    $(this).parent().parent().find("span[class='underInputFieldText']").css("color", "red");
                    return false;
                }
                break;
        }
    }
    $("span[class='underInputFieldText']").css("color", "gray");
}
/**
 * define image editor modal options
 */
var imageEditorModalOptions = {
    closable: false,
    onHide: () => {

    },
    onApprove: () => {
        if (_IMAGE_EDITOR_ !== null) {
            // init the image editor
            var croppedCanvas = _IMAGE_EDITOR_.getCroppedCanvas({
                width: returnImageSize().w,
                height: returnImageSize().h,
            });

            var gettedContext = croppedCanvas.getContext("2d");

            cropImageFromCanvas(gettedContext, croppedCanvas);

            _ALL_DATA_STORED._UPLOADED_FILE = croppedCanvas.toDataURL();
        };

        electron.ipcRenderer.send("chan", {
            selectedPageSize: _ALL_DATA_STORED.pageSizeDropdown,
            data: _ALL_DATA_STORED
        });
        /**
         *  to get the best size of the preview photo 
         */
        function returnImageSize() {
            var obj = {};
            switch (_ALL_DATA_STORED.pageSizeDropdown) {
                case "a6":
                    obj = {
                        w: 320,
                        h: 180
                    }
                    break;
                case "a3":
                    obj = {
                        w: 480,
                        h: 720
                    }
                    break;
            }
            return obj;
        }
    },
    onVisible: () => {
        var AspectTatio = 2 / 3;
        if (_ALL_DATA_STORED.pageSizeDropdown === "a6") {
            AspectTatio = null;
        }
        _IMAGE_EDITOR_ = new Cropper(_IMAGE_TO_CORP, {
            viewMode: 2,
            autoCropArea: 1
        });
        _IMAGE_EDITOR_.setAspectRatio(AspectTatio);

    }
}
/** extentions */
Quill.prototype.getHtml = function () {
    return this.container.firstChild.innerHTML;
};

function getBase64(file, afterFinish) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        afterFinish(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}


/** to clear empty space around the canvas */
function cropImageFromCanvas(ctx, canvas) {
    var w = canvas.width,
        h = canvas.height,
        pix = {
            x: [],
            y: []
        },
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        x, y, index;
    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index + 3] > 0) {
                pix.x.push(x);
                pix.y.push(y);
            }
        }
    }
    pix.x.sort(function (a, b) {
        return a - b
    });
    pix.y.sort(function (a, b) {
        return a - b
    });

    var n = pix.x.length - 1;

    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];
    var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(cut, 0, 0);

}