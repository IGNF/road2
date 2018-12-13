module.exports = {
  apps : [{
    name       : "road2",
    script     : "./src/server.js",
    instances  : 4,
    exec_mode  : "cluster",
    watch      : true
  }]
}
