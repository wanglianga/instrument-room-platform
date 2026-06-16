const { execSync } = require('child_process');

async function start() {
  console.log('Starting application...');
  
  if (process.env.RUN_SEED === 'true') {
    console.log('Running seed data...');
    try {
      execSync('node dist/database/seeds/run-seed.js', { stdio: 'inherit' });
      console.log('Seed data completed!');
    } catch (error) {
      console.error('Error running seed data:', error.message);
    }
  }
  
  console.log('Starting server...');
  require('./dist/main');
}

start();
