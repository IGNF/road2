module.exports = {
  apps : [{
    name       : "road2",
    script     : "./src/js/server.js",
    instances  : 4,
    exec_mode  : "cluster",
    watch      : true
  }]
}
