const filestorage = require("stimsrv/storage/filestorage");

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
      id: "response",
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
      role: "stationA",
      description: "Station A (Main PC)",
      devices: ["stationA", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationB",
      description: "Station B (Google Pixel 2)",
      devices: ["stationB", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationC",
      description: "Station C (Sony Xperia Z5-P)",
      devices: ["stationC", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationD",
      description: "Station D (...)",
      devices: ["stationD", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationE",
      description: "Station E (...)",
      devices: ["stationE", "dev"],
      interfaces: ["display"]
    },
    {
      role: "response",
      description: "Response Input (Galaxy Tab)",
      devices: ["response","dev"],
      interfaces: ["response"]
    },
    {
      role: "supervisor",
      description: "Supervisor",
      devices: ["supervisor","dev"],
      interfaces: ["monitor", "control"]
    },
  ],
  
}