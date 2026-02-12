module.exports = {
    apps: [
      {
        name: "fintoo-front",
        script: "npm",    
        args: "run start:stage",
        instances: "2",
        exec_mode: "cluster",
        env: {
          NODE_ENV: "staging",        
        }
      }
    ]
  }