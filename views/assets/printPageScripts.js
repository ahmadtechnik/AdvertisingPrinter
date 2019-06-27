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
    

    var productTitleFieldELEMENT = $(`<span class="productTitleField">${productTitleField}</span>`);
    var productNoteFieldELEMENT = $(`<span class="productNoteField">${productNoteField}</span>`);
    var productOldPriceFieldELEMENT = $(`<span class="productOldPriceField">${productOldPriceField}</span>`);
    var productNewPriceFieldELEMENT = $(`<span class="productNewPriceField">${productNewPriceField}</span>`);
    var productManufacturerFieldELEMENT = $(`<span class="productManufacturerField">${productManufacturerField}</span>`);
    var pageSizeDropdownELEMENT = $(`<span class="pageSizeDropdown">${pageSizeDropdown}</span>`);
    var pageBackgroundColorDropdownELEMENT = $(`<span class="pageBackgroundColorDropdown">${pageBackgroundColorDropdown}</span>`);
    var _UPLOADED_FILEELEMENT =$(`<img class="_UPLOADED_FILE" src="${_UPLOADED_FILE}" />`);
    var editorELEMENT = $(`<div class="editor">${editor}</div>`)

    _UPLOADED_FILEELEMENT.resizable();

    bodyObject.append(productTitleFieldELEMENT);
    bodyObject.append(productNoteFieldELEMENT);
    bodyObject.append(productOldPriceFieldELEMENT);
    bodyObject.append(productNewPriceFieldELEMENT);
    bodyObject.append(productManufacturerFieldELEMENT);
    bodyObject.append(_UPLOADED_FILEELEMENT);
    bodyObject.append(editorELEMENT)
    
    bodyObject.css("background" , pageBackgroundColorDropdown);

    window.print();
});
$(document).ready(() => {

})

/**
 * init a3 page size
 */
var _A3_PAGE_SIZES = {
    height: 3508,
    width: 4961
};