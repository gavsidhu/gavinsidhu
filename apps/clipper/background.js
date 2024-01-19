// TODO: Implement context menu to save media, selections, and audio
let contextMenu = chrome.contextMenus.create({
    id: "clipper",
    title: "abcdef",
    type: 'normal',
    contexts: ['selection', 'link', 'image', 'video', 'audio']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {

})


async function saveData(info) {

}
