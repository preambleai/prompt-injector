/**
 * Copyright (c) 2025 Preamble, Inc.
 * All rights reserved.
 * 
 * This file is part of the Prompt Injector AI security testing platform.
 * Unauthorized copying or distribution of this file is prohibited.
 */

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import * as path from 'path'
import aiAPIIntegration from '../services/ai-api-integration';
import { AttackEngine } from './services/attack-engine';

// Set development environment properly
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

console.log('Electron main process starting...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('app.isPackaged:', app.isPackaged)
console.log('isDev:', isDev)

// Initialize AttackEngine
const attackEngine = new AttackEngine()

// Wrapper functions to match the expected interface
const loadAttackPayloads = async () => {
  return await attackEngine.getPayloads();
};

const executeTest = async (model: any, payload: any) => {
  // Create a temporary test and run it
  const testId = await attackEngine.createTest({
    name: `Single Test - ${payload.name}`,
    description: `Testing ${payload.name} against ${model.name}`,
    targetModel: {
      provider: model.provider,
      model: model.model,
      apiKey: model.apiKey,
      endpoint: model.endpoint
    },
    payloads: [payload.id]
  });
  
  const testResult = await attackEngine.runTest(testId);
  const attackResult = testResult.results[0];
  
  // Handle case where no result is returned
  if (!attackResult) {
    return {
      id: `${model.id}-${payload.id}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      model: model,
      payload: payload,
      response: 'No result returned',
      vulnerability: false,
      confidence: 0,
      detectionMethod: 'no-result',
      duration: 0,
      success: false,
      error: 'No result returned from attack engine',
      executionTime: 0,
      metadata: {
        modelProvider: model.provider,
        payloadCategory: payload.category || 'unknown',
        payloadSeverity: payload.severity || 'low'
      }
    };
  }
  
  // Convert AttackResult to TestResult format
  return {
    id: `${model.id}-${payload.id}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    model: model,
    payload: payload,
    response: attackResult.response || '',
    vulnerability: attackResult.success,
    confidence: attackResult.success ? 0.8 : 0.2,
    detectionMethod: attackResult.success ? 'attack-success' : 'attack-failed',
    duration: 0,
    success: !attackResult.error,
    error: attackResult.error,
    executionTime: 0,
    metadata: {
      modelProvider: model.provider,
      payloadCategory: attackResult.category,
      payloadSeverity: attackResult.severity
    }
  };
};

const executeTestSuite = async (models: any[], payloads: any[], config: any) => {
  const results = [];
  
  for (const model of models) {
    if (model.enabled && config.selectedModels.includes(model.id)) {
      for (const payload of payloads) {
        if (config.selectedPayloads.includes(payload.id)) {
          const result = await executeTest(model, payload);
          results.push(result);
        }
      }
    }
  }
  
  return results;
};

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

    // Try port 3000 first (where Vite is configured), then 3001
    tryLoadURL(3000).then(success => {
      if (!success) {
        console.log('Port 3000 failed, trying port 3001...')
        tryLoadURL(3001).then(success2 => {
          if (!success2) {
            console.error('Failed to load from both ports 3000 and 3001')
            // Show an error message to the user
            const errorHtml = `
              <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                  <h1>Development Server Not Found</h1>
                  <p>Please make sure the Vite dev server is running on port 3000 or 3001</p>
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
    const indexPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html')
      : path.join(__dirname, '../index.html')
    
    console.log('Loading index.html from:', indexPath)
    console.log('app.isPackaged:', app.isPackaged)
    console.log('process.resourcesPath:', process.resourcesPath)
    console.log('__dirname:', __dirname)
    
    mainWindow?.loadFile(indexPath).catch(error => {
      console.error('Failed to load index.html:', error)
      // Try alternative paths if the primary one fails
      const fallbackPath = path.join(__dirname, '../dist/index.html')
      console.log('Trying fallback path:', fallbackPath)
      mainWindow?.loadFile(fallbackPath).catch(fallbackError => {
        console.error('Fallback path also failed:', fallbackError)
        // Show error message to user
        const errorHtml = `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
              <h1>Failed to Load Application</h1>
              <p>The application files could not be loaded.</p>
              <p>Tried paths:</p>
              <ul style="text-align: left; display: inline-block;">
                <li>${indexPath}</li>
                <li>${fallbackPath}</li>
              </ul>
              <button onclick="window.location.reload()">Retry</button>
            </body>
          </html>
        `
        mainWindow?.loadURL(`data:text/html,${encodeURIComponent(errorHtml)}`)
      })
    })
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

ipcMain.handle('llm-request', async (_event, request) => {
  try {
    const response = await aiAPIIntegration.makeRequest(request);
    return response;
  } catch (error) {
    let message = 'LLM request failed';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return { error: message };
  }
}); 

ipcMain.handle('make-ai-request', async (_event, request) => {
  try {
    const response = await aiAPIIntegration.makeRequest(request);
    return response;
  } catch (error) {
    let message = 'AI request failed';
    if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    } else if (typeof error === 'string') {
      message = error;
    }
    return { error: message };
  }
});

ipcMain.handle('get-available-models', async (_event, provider, apiKey) => {
  try {
    const models = await aiAPIIntegration.getAvailableModels(provider, apiKey);
    return models;
  } catch (error) {
    console.error(`Error getting available models for ${provider}:`, error);
    // Return empty array for now, but log the specific error for debugging
    if (provider === 'ollama') {
      console.log('💡 Make sure Ollama is running: ollama serve');
    }
    return [];
  }
});

ipcMain.handle('test-ollama-connection', async (_event) => {
  try {
    const isConnected = await aiAPIIntegration.testOllamaConnection();
    return isConnected;
  } catch (error) {
    console.error('Error testing Ollama connection:', error);
    return false;
  }
}); 

ipcMain.handle('execute-test', async (_event, model, payload) => {
  return await executeTest(model, payload);
});
ipcMain.handle('execute-test-suite', async (_event, models, payloads, config) => {
  return await executeTestSuite(models, payloads, config);
});
ipcMain.handle('load-attack-payloads', async () => {
  return await loadAttackPayloads();
}); 

ipcMain.handle('test-model-connection', async (_event, model) => {
  // Create a simple test payload
  const testPayload = "Hello, this is a connection test. Please respond with 'Connection successful' if you can see this message.";
  const testAttack = {
    id: 'connection-test',
    name: 'Connection Test',
    description: 'Test connection to AI model',
    category: 'TEST',
    payload: testPayload,
    severity: 'LOW',
    tags: ['test'],
    source: 'internal'
  };
  try {
    const result = await executeTest(model, testAttack);
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Test failed' };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}); 

ipcMain.handle('execute-red-team-attack', async (_event, model, attack) => {
  // Compose the attack payload
  const attackPayload = {
    id: attack.id,
    name: attack.name,
    description: attack.description,
    category: attack.category,
    payload: attack.payload,
    tags: [attack.category],
    source: 'red-team'
  };
  try {
    const result = await executeTest(model, attackPayload);
    // Analyze response for extraction attempts
    // (You may want to move analyzeExtractionAttempt and extractInformation to a shared file if needed)
    const extractionAttempt = (result.response && attack.successIndicators) ? attack.successIndicators.some((indicator: string) => result.response.toLowerCase().includes(indicator.toLowerCase())) : false;
    const extractedInfo = {}; // Optionally implement extraction logic here
    return {
      ...result,
      attackType: attack.category,
      extractionAttempt,
      extractedInfo
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}); 

ipcMain.handle('execute-benchmark-test', async (_event, model, benchmark, payload) => {
  // Compose the attack payload for benchmark testing
  const attackPayload = {
    id: payload.id,
    name: payload.name,
    description: payload.description,
    category: payload.category,
    payload: payload.payload,
    severity: payload.severity,
    tags: payload.tags,
    source: `benchmark-${benchmark.id}`
  };
  try {
    const result = await executeTest(model, attackPayload);
    // Calculate benchmark-specific metrics
    const actualOutcome = result.vulnerability ? 'success' : 'failure';
    // You may want to move these helpers to a shared file if needed
    const score = result.confidence * 100;
    const performance = {
      recall: 0, precision: 0, f1Score: 0, falsePositiveRate: 0, falseNegativeRate: 0 // Placeholder
    };
    return {
      ...result,
      benchmarkId: benchmark.id,
      metricName: payload.name,
      expectedOutcome: payload.expectedOutcome,
      actualOutcome,
      score,
      performance
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}); 