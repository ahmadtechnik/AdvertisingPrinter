// init electron object
var electron = require("electron");

electron.ipcRenderer.on("dataToPrint", (event, arg) => {
    console.log(arg);
    //wholeContainerSegment pageBackgroundColorDropdown
    $(`#wholeContainerSegment`).addClass("inverted " + arg.pageBackgroundColorDropdown);
    var img = $(`<img src="${arg._UPLOADED_FILE}"/>`);
    img.width($(`#imagePreviewImageContainer`).width());
    $(`#imagePreviewImageContainer`).append(img);

    //productTitleContainer productTitleField
    $(`#productTitleContainer`).html($(`<span>${arg.productTitleField}</span>`))
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