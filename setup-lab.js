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
      pixeldensity: 91,
      viewingdistance: 600,
    },
    {
      name: "Station A (Main PC)",
      id: "stationA",
      pixeldensity: 91,
      viewingdistance: 600,
    },
    {
      name: "Response Input (Galaxy Tab)",
      id: "response",
      pixeldensity: 440,
      viewingdistance: 350
    },
    {
      name: "Station B (Sony Xperia V)",
      id: "stationB",
      pixeldensity: 343,
      viewingdistance: 350,
      gamma: 2.2,
      client: "browser-simple",
      devicePixelRatio: 2,
      imageSize: "720x880",
    },
    {
      name: "Station C (Sony Xperia Z5-P)",
      id: "stationC",
      pixeldensity: 807,
      viewingdistance: 350,
    },
    {
      name: "Station D (LG P-970)",
      id: "stationD",
      pixeldensity: 236,
      viewingdistance: 350,
      client: "browser-simple",
      devicePixelRatio: 1.5,
      imageSize: "480x520",
    },
    {
      name: "Station E (Google Nexus 6P)",
      id: "stationE",
      resolution: "uhd",
      pixeldensity: 520,
      viewingdistance: 350,
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
      description: "Station B",
      devices: ["stationB", "dev"],
      interfaces: ["display"],
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
      role: "stationE",
      description: "Station E",
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