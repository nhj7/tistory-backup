//ecosystem.config.js
const config = {
    apps: [{
      name: 'tb-web',
      script: './src/server/',
      // script: './node_modules/nuxt/bin/nuxt.js',
      // args: 'start',
      // script: 'nuxt',
      // args : 'start',
      //instances: 'max',
      instances: 1,
      exec_mode: 'fork',
      //wait_ready: true,
      //listen_timeout: 3000,    
      env_production: {
        "NODE_ENV": "production",
        //"httpPort": 7777,
        //"httpsPort": 4443,
      }
    }, {
      name: 'tb-batch',
      script: './src/batch/',
      // script: './node_modules/nuxt/bin/nuxt.js',
      // args: 'start',
      // script: 'nuxt',
      // args : 'start',
      //instances: 'max',
      instances: 1,
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