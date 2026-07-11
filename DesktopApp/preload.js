const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApi', {
  getConfig: () => ({
    backendUrl: 'http://localhost:5000',
    aiEngineUrl: 'http://localhost:8000',
    appName: 'CompetiLens AI Desktop'
  })
});
