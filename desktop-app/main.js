const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

// URL of the live web app
const APP_URL = 'https://havticmovie.vercel.app';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: 'Havtic Movie',
    // icon: path.join(__dirname, 'build/icon.ico'), // Add icon later
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Optional: hide scrollbars for cleaner native look if desired, or let the web handle it
    },
    autoHideMenuBar: true, // Hides the default menu bar
    backgroundColor: '#080101', // Dark background to match Havtic
  });

  // Inject a custom User-Agent so the web app knows it's the desktop client
  const customUserAgent = mainWindow.webContents.userAgent + ' HavticDesktopApp/1.0';
  mainWindow.webContents.userAgent = customUserAgent;

  // Load the live URL
  mainWindow.loadURL(APP_URL);

  // Remove the default application menu completely for a cleaner look
  Menu.setApplicationMenu(null);
}

// Disable hardware acceleration if experiencing black screens on some GPUs
// app.disableHardwareAcceleration();

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
