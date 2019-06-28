// init electron object
var electron = require("electron");

electron.ipcRenderer.on("dataToPrint", (event, arg) => {
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

    var bodyObject = $(`#mainContainer`);
    var imageBackGrounde = $(`#imageBackgrounder`);
    var body = $(`body`);

    var productTitleFieldELEMENT = $(`<span class="productTitleField">${productTitleField}</span>`);
    var productNoteFieldELEMENT = $(`<span class="productNoteField">${productNoteField}</span>`);
    var productOldPriceFieldELEMENT = productOldPriceField !== "" ?
        $(`<span class="productOldPriceField">${productOldPriceField}.99€</span>`) : "";
    var productNewPriceFieldELEMENT = $(`<span class="productNewPriceField">${productNewPriceField}.99€</span>`);
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
    $(`#discreptionContainer`).css("top", ($(`#titleContainer`).height() / 2) + 100);
    $(`#imageContainer`).css("top", ($(`#titleContainer`).height() / 2) + 100);
    $(`#oldPriceContainer`).css("bottom", $(`#newPriceContainer`).height() + 10);
    $(`#oldPriceContainer`).css("left", $(`#newPriceContainer`).width() - $(`#oldPriceContainer`).width() + 50);
    $(`#manufacturerContainer`).css({
        "top": ($(`#titleContainer`).height() / 2) + 50,
        "background": pageBackgroundColorDropdown,
    });
    console.log(pageBackgroundColorDropdown)
    /* 
        $.each($("div"), (index, value) => {
            console.log(value);
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