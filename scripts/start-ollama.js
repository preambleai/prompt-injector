#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');

async function checkOllamaRunning() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 11434,
      path: '/api/tags',
      method: 'GET',
      timeout: 2000
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => {
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function startOllama() {
  const isRunning = await checkOllamaRunning();
  
  if (isRunning) {
    console.log('✅ Ollama is already running on port 11434');
    return;
  }
  
  console.log('🚀 Starting Ollama service...');
  
  const ollamaProcess = spawn('ollama', ['serve'], {
    stdio: 'inherit',
    shell: true
  });

  ollamaProcess.on('error', (error) => {
    console.error('❌ Failed to start Ollama:', error.message);
    console.log('💡 Make sure Ollama is installed: https://ollama.ai/');
    process.exit(1);
  });

  ollamaProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Ollama process exited with code ${code}`);
    }
  });

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Ollama...');
    ollamaProcess.kill('SIGINT');
    process.exit(0);
  });
}

startOllama().catch(console.error); 