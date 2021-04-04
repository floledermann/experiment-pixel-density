const filestorage = require("stimsrv/src/storage/filestorage.js");

module.exports = {
  devices: [
    {
      name: "Main PC",
      id: "main",
      ip: ".",
      platform: "browser", // browser-old, browser-nojs, pdf, png
      screens: [
        {
          id: "left",
          description: "Left external monitor",
          resolution: "hd",
          pixeldensity: 91,
          viewingdistance: 600,
          gamma: 2.2,
          minintensity: 1/40
        },
        {
          id: "right",
          description: "Right external monitor",
          resolution: "hd",
          pixeldensity: 91,
          viewingdistance: 600,
          gamma: 2.2,
          minintensity: 1/40
        },
        {
          id: "main",
          description: "Laptop internal monitor",
          resolution: "hd",
          pixeldensity: 157,
          viewingdistance: 500,
          gamma: 2.2,
          minintensity: 1/40
        }
      ],
      mouse: true,
      keyboard: true
    },
    {
      name: "Google Pixel 2",
      id: "pixel2",
      resolution: "hd",
      pixeldensity: 440,
      viewingdistance: 350,
      gamma: 1.6,
      touch: true
    },
    {
      name: "Sony Xperia Z5-P",
      id: "xperia",
      resolution: "uhd",
      pixeldensity: 801,
      viewingdistance: 350,
      gamma: 2.2,
      touch: false  // viewing only
    }
  ],
  
  roles: [
    {
      role: "supervisor",
      device: "main",
      interfaces: ["monitor", "control"],
      description: "Supervisor screen and experiment control"
    },
    {
      role: "experiment",
      device: "main",
      screen: "left",
      interfaces: ["display","response"],
      description: "Experiment screen for stimulus display and participant response"
    },
    {
      role: "experiment-debug",
      device: "main",
      screen: "left",
      interfaces: ["display","response","debug"],
      description: "Experiment screen with debugging output"
    },
    {
      role: "experiment",
      device: "pixel2",
      interfaces: ["display","response"],
      description: "Experiment screen for stimulus display and participant response"
    },
    {
      role: "experiment-display",
      device: "xperia",
      interfaces: ["display"],
      description: "Experiment screen for stimulus display."
    },
  ],
  
  storage: filestorage({
    destination: "./data",
    format: "json"
  })

}