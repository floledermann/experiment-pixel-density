const filestorage = require("stimsrv/storage/filestorage");

module.exports = {
  devices: [
    {
      name: "Development PC",
      id: "dev",
      pixeldensity: 91,
      viewingdistance: 600,
      devicePixelRatio: 1,
      imageSize: "720x1280",
    },
    {
      name: "Supervisor",
      id: "supervisor",
      pixeldensity: 265,
      viewingdistance: 500,
    },
    {
      name: "Main Monitor",
      id: "main",
      pixeldensity: 91,
      viewingdistance: 600,
    },
    {
      name: "Response Input",
      id: "response",
      pixeldensity: 403,
      viewingdistance: 350
    },
    {
      name: "Station A (Sony Xperia V)",
      id: "stationA",
      pixeldensity: 343,
      viewingdistance: 350,
      gamma: 2.2,
      client: "browser-simple",
      devicePixelRatio: 2,
      imageSize: "720x880",
    },
    {
      name: "Station B (Sony Xperia Z5-P)",
      id: "stationB",
      pixeldensity: 807,
      viewingdistance: 350,
      gamma: 2.2,
    },
    {
      name: "Station C (LG P-970)",
      id: "stationC",
      pixeldensity: 236,
      viewingdistance: 350,
      client: "browser-simple",
      devicePixelRatio: 1.5,
      imageSize: "480x520",
    },
    {
      name: "Station D (Google Nexus 6P)",
      id: "stationD",
      pixeldensity: 520,
      viewingdistance: 350,
      gamma: 2.6,
    },
  ],
  
  roles: [
    {
      role: "main",
      description: "Main Monitor",
      devices: ["main", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationA",
      description: "Station A",
      devices: ["stationA", "dev"],
      interfaces: ["display"],
    },
    {
      role: "stationB",
      description: "Station B",
      devices: ["stationB", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationC",
      description: "Station C",
      devices: ["stationC", "dev"],
      interfaces: ["display"]
    },
    {
      role: "stationD",
      description: "Station D",
      devices: ["stationD", "dev"],
      interfaces: ["display"]
    },
    {
      role: "response",
      description: "Response Input",
      devices: ["response","dev"],
      interfaces: ["response"],
      fullscreenButton: true
    },
    {
      role: "supervisor",
      description: "Supervisor",
      devices: ["supervisor","dev"],
      interfaces: ["monitor", "control"]
    },
  ],
  
}