/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'

// Set development environment
process.env['NODE_ENV'] = 'development'
const isDev = process.env['NODE_ENV'] === 'development'

console.log('Electron main process starting...')
console.log('NODE_ENV:', process.env['NODE_ENV'])
console.log('isDev:', isDev)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  console.log('Creating main window...')
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: false, // Disable for security
      contextIsolation: true, // Enable for security
      webSecurity: isDev ? false : true, // Only disable in development
      allowRunningInsecureContent: isDev, // Only allow in development
      preload: path.join(__dirname, 'preload.js') // Use preload script for security
    }
  })

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show')
    mainWindow?.show()
  })

  // Load the app
  if (isDev) {
    console.log('Development mode - loading from Vite dev server...')
    
    // Try to connect to the Vite dev server
    const tryLoadURL = async (port: number) => {
      try {
        const url = `http://localhost:${port}`
        console.log(`Attempting to load: ${url}`)
        await mainWindow?.loadURL(url)
        console.log(`Successfully loaded from port ${port}`)
        return true
      } catch (error) {
        console.log(`Failed to load from port ${port}:`, error)
        return false
      }
    }

    // Try port 3001 first (where Vite is running), then 3000
    tryLoadURL(3001).then(success => {
      if (!success) {
        console.log('Port 3001 failed, trying port 3000...')
        tryLoadURL(3000).then(success2 => {
          if (!success2) {
            console.error('Failed to load from both ports 3001 and 3000')
            // Show an error message to the user
            const errorHtml = `
              <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                  <h1>Development Server Not Found</h1>
                  <p>Please make sure the Vite dev server is running on port 3001 or 3000</p>
                  <p>Run: <code>npm run dev:renderer</code> in another terminal</p>
                  <button onclick="window.location.reload()">Retry</button>
                </body>
              </html>
            `
            mainWindow?.loadURL(`data:text/html,${encodeURIComponent(errorHtml)}`)
          }
        })
      }
    })
    
    // Open DevTools
    mainWindow?.webContents.openDevTools()
    
    // Log any load failures
    mainWindow?.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
      console.error('Failed to load:', { errorCode, errorDescription, validatedURL })
    })
    
    // Log successful loads
    mainWindow?.webContents.on('did-finish-load', () => {
      console.log('Page finished loading successfully')
    })
  } else {
    console.log('Production mode - loading from file...')
    mainWindow?.loadFile(path.join(__dirname, '../index.html'))
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    console.log('Main window closed')
    mainWindow = null
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log('Electron app ready, creating window...')
  createWindow()
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  console.log('All windows closed, quitting app...')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  console.log('App activated')
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Log app events
app.on('ready', () => {
  console.log('App ready event fired')
})

app.on('window-all-closed', () => {
  console.log('All windows closed event fired')
})

// IPC Handlers - These are now handled by the AttackEngine class
// The AttackEngine class has its own setupIPCHandlers method that sets up all the IPC handlers

// Remove the old IPC handlers since they're now handled by AttackEngine

// Simple menu setup
const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu) 