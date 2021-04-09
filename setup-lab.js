const filestorage = require("stimsrv/src/storage/filestorage.js");

module.exports = {
  devices: [
    {
      name: "Development PC",
      id: "dev",
      resolution: "hd",
      pixeldensity: 91,
      viewingdistance: 600,
      mouse: true,
      keyboard: true
    },
    {
      name: "Supervisor",
      id: "supervisor",
      resolution: "hd",
      pixeldensity: 91,
      viewingdistance: 600,
      mouse: true,
      keyboard: true
    },
    {
      name: "Station A (Main PC)",
      id: "stationA",
      resolution: "hd",
      pixeldensity: 91,
      viewingdistance: 600,
      mouse: true,
      keyboard: true
    },
    {
      name: "Response Input (Galaxy Tab)",
      id: "responseTablet",
      resolution: "hd",
      pixeldensity: 440,
      viewingdistance: 350
    },
    {
      name: "Station B (Google Pixel 2)",
      id: "stationB",
      resolution: "hd",
      pixeldensity: 440,
      viewingdistance: 350,
      gamma: 1.6,
      touch: false
    },
    {
      name: "Station C (Sony Xperia Z5-P)",
      id: "stationC",
      resolution: "uhd",
      pixeldensity: 801,
      viewingdistance: 350,
      touch: false 
    },
    {
      name: "Station D ()",
      id: "stationD",
      resolution: "uhd",
      pixeldensity: 801,
      viewingdistance: 350,
      touch: false
    },
    {
      name: "Station E ()",
      id: "stationE",
      resolution: "uhd",
      pixeldensity: 801,
      viewingdistance: 350,
      touch: false
    },
  ],
  
  roles: [
    {
      role: "supervisor",
      device: ["supervisor","dev"],
      interfaces: ["monitor", "control"]
    },
    {
      role: "response",
      device: ["responseTablet","dev"],
      interfaces: ["response"]
    },
    {
      role: "stationA",
      device: ["stationA", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationB",
      device: ["stationB", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationC",
      device: ["stationC", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationD",
      device: ["stationD", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationE",
      device: ["stationE", "dev"],
      interfaces: ["display"]
    },
  ],
  
}