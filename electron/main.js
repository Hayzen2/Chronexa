import electron from "electron";

const { app, BrowserWindow } = electron;
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Determine if the app is running in development mode
const isDev = !app.isPackaged; 

// Create the main application window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if(isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    // In production, load the built index.html file from the dist directory
    win.loadFile(path.join(__dirname, '../client/dist/index.html'));
  }
}

app.whenReady().then(() => {
    createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    app.quit();
});