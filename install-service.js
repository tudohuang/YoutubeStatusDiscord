const Service = require('node-windows').Service;

const svc = new Service({
  name: 'YTMusicRichPresence',
  description: 'To sync with YouTube Music status to Discord',
  script: require('path').join(__dirname, 'rpc-server-service.js'),
  nodeOptions: ['--harmony', '--max_old_space_size=4096']
});

svc.on('install', () => {
  console.log("✅ Service installed，launching...");
  svc.start();
});

svc.install();
