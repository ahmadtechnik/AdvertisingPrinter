// init electron object
var electron = require("electron");
var _EDITOR = null;
var checkBoxesData;

electron.ipcRenderer.on("dataToPrinta3", (event, arg) => {
    var productTitleField = arg.productTitleField;
    var productNoteField = arg.productNoteField;
    var productOldPriceField = arg.productOldPriceField;
    var productNoteField = arg.productNoteField;
    var productNewPriceField = arg.productNewPriceField;
    var productManufacturerField = arg.productManufacturerField;
    var pageSizeDropdown = arg.pageSizeDropdown;
    var pageBackgroundColorDropdown = arg.pageBackgroundColorDropdown;
    var _UPLOADED_FILE = arg._UPLOADED_FILE;
    var editor = arg.editor;
    checkBoxesData = arg.checkBoxesData;

    var bodyObject = $(`#mainContainer`);
    var imageBackGrounde = $(`#imageBackgrounder`);
    var body = $(`body`);

    var productTitleFieldELEMENT = $(`<span class="productTitleField">${productTitleField}</span>`);
    var productNoteFieldELEMENT = $(`<span class="productNoteField">${productNoteField}</span>`);
    var productOldPriceFieldELEMENT = productOldPriceField !== "" ?
        $(`<span class="productOldPriceField">${
            euroFractionsFilter(productOldPriceField , "productOldPriceField")}</span>`) : "";
    var productNewPriceFieldELEMENT = $(`<span class="productNewPriceField">${euroFractionsFilter(productNewPriceField , "productNewPriceField") }</span>`);
    var productManufacturerFieldELEMENT = $(`<span class="productManufacturerField">${productManufacturerField}</span>`);
    var pageSizeDropdownELEMENT = $(`<span class="pageSizeDropdown">${pageSizeDropdown}</span>`);
    var pageBackgroundColorDropdownELEMENT = $(`<span class="pageBackgroundColorDropdown">${pageBackgroundColorDropdown}</span>`);
    var _UPLOADED_FILEELEMENT = $(`<img class="_UPLOADED_FILE" src="${_UPLOADED_FILE}" />`);
    var editorELEMENT = $(`<div class="editor">${editor}</div>`)



    $(`#titleContainer`).append(productTitleFieldELEMENT);
    $(`#noteContainer`).append(productNoteFieldELEMENT);
    $(`#oldPriceContainer`).append(productOldPriceFieldELEMENT);
    $(`#newPriceContainer`).append(productNewPriceFieldELEMENT);
    $(`#manufacturerContainer`).append(productManufacturerFieldELEMENT);
    $(`#imageContainer`).append(_UPLOADED_FILEELEMENT);
    $(`#discreptionContainer`).append(editorELEMENT)


    body.css("background", pageBackgroundColorDropdown);

    imageBackGrounde.css({
        "background": pageBackgroundColorDropdown,
        "background-image": `url('${_UPLOADED_FILE}')`,
        "background-position": "center",
        /* Center the image */
        "background-repeat": "no-repeat",
        /* Do not repeat the image */
        "background-size": "contain",
    });

    // set postions
    $(`#discreptionContainer`).css({
        "top": ($(`#titleContainer`).height()) + 50,

    });
    $(`#imageContainer`).css("top", $(`#titleContainer`).offset().top + $(`#titleContainer`).height());
    $(`#oldPriceContainer`).css("bottom", $(`#newPriceContainer`).height() + 10);
    $(`#oldPriceContainer`).css("left", $(`#newPriceContainer`).width() - $(`#oldPriceContainer`).width() + 80);
    $(`#manufacturerContainer`).css({
        "top": $(`#titleContainer`).offset().top + $(`#titleContainer`).height(),
        "background": pageBackgroundColorDropdown,
    });

    /*
    $.each($("div"), (index, value) => {
        //console.log(value);
        $(value).css({
            "border-color": "white",
            "border-width": "1px",
            "border-style": "solid"
        });
    });
    */
});


electron.ipcRenderer.on("dataToPrinta6", (event, arg) => {
    var productTitleField = arg.productTitleField;
    var productNoteField = arg.productNoteField;
    var productOldPriceField = arg.productOldPriceField;
    var productNoteField = arg.productNoteField;
    var productNewPriceField = arg.productNewPriceField;
    var productManufacturerField = arg.productManufacturerField;
    var pageSizeDropdown = arg.pageSizeDropdown;
    var pageBackgroundColorDropdown = arg.pageBackgroundColorDropdown;
    var _UPLOADED_FILE = arg._UPLOADED_FILE;
    var editor = arg.editor;

    checkBoxesData = arg.checkBoxesData;

    var bodyObject = $(`#mainContainer`);
    var imageBackGrounde = $(`#imageBackgrounder`);
    var backfroundColored = $(`#backfroundColored`);
    var body = $(`body`);

    var productTitleFieldELEMENT = $(`<span class="productTitleField">${productTitleField}</span>`);
    var productNoteFieldELEMENT = $(`<span class="productNoteField">${productNoteField}</span>`);
    var productOldPriceFieldELEMENT = productOldPriceField !== "" ?
        $(`<span class="productOldPriceField">${
            euroFractionsFilter(productOldPriceField,"productOldPriceField")}</span>`) : "";
    var productNewPriceFieldELEMENT = $(`<span class="productNewPriceField">${euroFractionsFilter(productNewPriceField , "productNewPriceField") }</span>`);
    var productManufacturerFieldELEMENT = $(`<span class="productManufacturerField">${productManufacturerField}</span>`);
    var pageSizeDropdownELEMENT = $(`<span class="pageSizeDropdown">${pageSizeDropdown}</span>`);
    var pageBackgroundColorDropdownELEMENT = $(`<span class="pageBackgroundColorDropdown">${pageBackgroundColorDropdown}</span>`);
    var _UPLOADED_FILEELEMENT = $(`<img class="_UPLOADED_FILE" src="${_UPLOADED_FILE}" id="_UPLOADED_FILE" />`);
    _UPLOADED_FILEELEMENT.height(150)
    var editorELEMENT = $(`<div class="editor">${editor}</div>`)



    $(`#titleContainer`).append(productTitleFieldELEMENT);
    $(`#imageContainer`).append(_UPLOADED_FILEELEMENT);
    $(`#manufacturerContainer`).append(productManufacturerFieldELEMENT);
    $(`#discreptionContainer`).append(editorELEMENT)
    $(`#noteContainer`).append(productNoteFieldELEMENT);
    $(`#oldPriceContainer`).append(productOldPriceFieldELEMENT);
    $(`#newPriceContainer`).append(productNewPriceFieldELEMENT);



    //body.css("background", pageBackgroundColorDropdown);

    imageBackGrounde.css({
        "background": pageBackgroundColorDropdown,
        "background-image": `url('${_UPLOADED_FILE}')`,
        "background-position": "center",
        /* Center the image */
        "background-repeat": "no-repeat",
        /* Do not repeat the image */
        "background-size": "contain",
        width: bodyObject.width(),
        height: bodyObject.height(),
        "top": bodyObject.offset().top,
        "left": bodyObject.offset().left
    });

    backfroundColored.css({
        "background": pageBackgroundColorDropdown,
        width: bodyObject.width(),
        height: bodyObject.height(),
        "top": bodyObject.offset().top,
        "left": bodyObject.offset().left
    });

    // set postions
    $(`#titleContainer`).css({

        left: (bodyObject.width() / 2) - ($(`#titleContainer`).width() / 2)
    });
    //
    var im = document.createElement("img");
    im.src = _UPLOADED_FILE
    im.height = 150;
    im.setAttribute("id", "testImge");
    document.body.appendChild(im);
    $(`#imageContainer`).css({
        "left": (bodyObject.width() / 2) - (im.width / 2),
    });
    im.remove();
    //
    $(`#discreptionContainer`).css({

    });
    //
    $(`#noteContainer`).css({
        left: (bodyObject.width() / 2) - ($(`#noteContainer`).width() / 2)
    });
    //
    $(`#oldPriceContainer`).css({
        top: bodyObject.height() - $(`#newPriceContainer`).height() - $(`#oldPriceContainer`).height() + 15,
        left: 50
    });
    //
    $(`#newPriceContainer`).css({
        top: bodyObject.height() - $(`#newPriceContainer`).height(),
        left: 50
    });
    //
    $(`#manufacturerContainer`).css({
        "background": pageBackgroundColorDropdown,
    });
    //
    /*
    $.each($("div"), (index, value) => {

        $(value).css({
            "border-color": "white",
            "border-width": "1px",
            "border-style": "solid"
        });
    });
*/
});


electron.ipcRenderer.on("savedFilePath", (event, arg) => {
    //alert(arg);
})

$(document).ready(() => {

})

/**
 * init a3 page size
 */
var _A3_PAGE_SIZES = {
    height: 3508,
    width: 4961
};

var euroFractionsFilter = (numener, fieldName) => {
    switch (fieldName) {
        case "productOldPriceField":
            if (numener.substr(numener.length - 1) === "9" || checkBoxesData.addToOldPrice) {
                return numener + ".99<sup>€</sup>";
            } else {
                return numener + "<sup>€</sup>";
            }
            break;
        case "productNewPriceField":
            if (numener.substr(numener.length - 1) === "9" || checkBoxesData.addToNewPrice) {
                return numener + ".99<sup>€</sup>";
            } else {
                return numener + "<sup>€</sup>";
            }
    }
}