//ecosystem.config.js
const config = {
    apps: [{
      name: 'tistory-backup-web',
      script: './src/server/',
      // script: './node_modules/nuxt/bin/nuxt.js',
      // args: 'start',
      // script: 'nuxt',
      // args : 'start',
      //instances: 'max',
      instances: 0,
      exec_mode: 'fork',
      //wait_ready: true,
      //listen_timeout: 3000,    
      env_production: {
        "NODE_ENV": "production",
        //"httpPort": 7777,
        //"httpsPort": 4443,
      }
    }, {
      name: 'tistory-backup-batch',
      script: './src/batch/',
      // script: './node_modules/nuxt/bin/nuxt.js',
      // args: 'start',
      // script: 'nuxt',
      // args : 'start',
      //instances: 'max',
      instances: 0,
      exec_mode: 'fork',
      //wait_ready: true,
      //listen_timeout: 3000,
      env_production: {
        NODE_ENV: "production"        
      }
    }
    ]
  }
  module.exports = config;