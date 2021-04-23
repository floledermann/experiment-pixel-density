
const snellen = require("stimsrv/task/snellen");
const tao = require("stimsrv/task/aucklandoptotypes");
const pause = require("stimsrv/task/pause");
const loop = require("stimsrv/task/loop");

const staircase = require("stimsrv/controller/staircase");
const random = require("stimsrv/controller/random");
const sequence = require("stimsrv/controller/sequence");

const filestorage = require("stimsrv/storage/filestorage");

const centerline = require("./src/task/centerline.js");   
const dashedline = require("./src/task/dashedline.js");  
const text = require("./src/task/text.js");  

const setup = require("./setup-lab.js");

// stimsrv experiment definition
module.exports = {
  
  name: "HD Map Symbolization - Experiment 1 Calibration",
  
  devices: setup.devices,
  roles: setup.roles,

  storage: filestorage({
    destination: "./calibration_data"
  }),
  
  tasks: [

    snellen({
      pixelAlign: false,
      foregroundIntensity: 0,
      backgroundIntensity: 1,
      size: "48mm",
    }),

  ]
  
}