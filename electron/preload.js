const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Expose the platform to the renderer process to allow 
    // for platform-specific behavior
    // example: if (window.electronAPI.platform === 'win32') { ... }s
    platform: process.platform 
});