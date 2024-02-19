require("./server")();

const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 1300,
      height: 860,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    })
  
    win.loadFile("./static/home/index.html");
}

app.whenReady().then(() => {
    createWindow();
});