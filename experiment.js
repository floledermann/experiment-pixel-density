
const snellen = require("stimsrv/src/tasks/snellen.js");
const bangbox = require("stimsrv/src/tasks/bangbox.js");
const tao = require("stimsrv/src/tasks/aucklandoptotypes.js");
const pause = require("stimsrv/src/tasks/pause.js");

const filestorage = require("stimsrv/src/storage/filestorage.js");

const staircase = require("stimsrv/src/controller/staircase.js");
const random = require("stimsrv/src/controller/random.js");
const sequence = require("stimsrv/src/controller/sequence.js");

const centerline = require("./src/tasks/centerline.js");   
const dashedline = require("./src/tasks/dashedline.js");   


// this is a complete configuration
module.exports = {
  
  name: "Simple Test Experiment",
  
  settings: {
    loop: true
  },
    
  devices: [
    {
      name: "Main PC",
      id: "main",
      ip: ".",
      platform: "browser", // browser-old, browser-nojs, pdf, png
      screens: [{
          id: "left",
          description: "Left external monitor",
          resolution: "hd",
          pixeldensity: 91,
          viewingdistance: 600,
          gamma: 2.2,
          minintensity: 1/40
        },{
          id: "right",
          description: "Right external monitor",
          resolution: "hd",
          pixeldensity: 91,
          viewingdistance: 600,
          gamma: 2.2,
          minintensity: 1/40
        },{
          id: "main",
          description: "Laptop internal monitor",
          resolution: "hd",
          pixeldensity: 157,
          viewingdistance: 500,
          gamma: 2.2,
          minintensity: 1/40
      }],
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
      device: "main",
      role: "supervisor",
      interfaces: ["monitor", "control"],
      description: "Supervisor screen and experiment control"
    },
    {
      device: "main",
      screen: "left",
      role: "experiment",
      interfaces: ["display","response"],
      description: "Experiment screen for stimulus display and participant response"
    },
    {
      device: "main",
      screen: "left",
      role: "experiment-debug",
      interfaces: ["display","response","debug"],
      description: "Experiment screen with debugging output"
    },
    {
      device: "pixel2",
      role: "experiment",
      interfaces: ["display","response"],
      description: "Experiment screen for stimulus display and participant response"
    },
    {
      device: "xperia",
      role: "experiment-display",
      interfaces: ["display"],
      description: "Experiment screen for stimulus display."
    },
  ],  
  
  storage: filestorage({
    destination: "./data",
    format: "json"
  }),
   
  tasks: [
    dashedline({
      conditions: [
        {
          dashpattern: [100,0],
          label: "Solid"
        },
        {
          dashpattern: [1,1],
          label: "Dotted"
        },
        {
          dashpattern: [3,1],
          label: "Dashed"
        },
        {
          dashpattern: [3,1,1,1],
          label: "Dot‑dash"
        }
      ],
      parameters: {
        angle: random.range(0,360, {round: 1}),
        length: "50mm",
        width:
          staircase({
            startValue: "1.5mm",
            stepSize: 1.2,
            stepType: "multiply", 
            minReversals: 0, //5,
            minTrials: 2
        })
      }
    }),
    dashedline({
      conditions: [
        {
          dashpattern: [100,0],
          foregroundIntensity: 0.5,
          label: "Solid"
        },
        {
          dashpattern: [1,3],
          label: "Dotted"
        },
        {
          dashpattern: [3,3],
          label: "Dashed"
        },
        {
          dashpattern: [3,2,1,2],
          label: "Dot‑dash"
        }
      ],
      parameters: {
        angle: random.range(0,360, {round: 1}),
        length: "50mm",
        width:
          staircase({
            startValue: "1.5mm",
            stepSize: 1.2,
            stepType: "multiply", 
            minReversals: 5,
            minTrials: 2
        })
      }
    }),
    snellen({
      //rotate: random([-2,+2]), // add random rotation to prevent aliasing
      pixelAlign: false,
      //lowIntensity: 0, //sequence.loop([0,0.25,0.5,0.75,0.9,0.95]),
      //highIntensity: 1.0,
      //contrastRatio: 1.05,
      foregroundIntensity: 0,
      backgroundIntensity: 1,
      //size: "3px",
      size:
        staircase({
          startValue: "5mm",
          stepSize: 1.2,
          stepType: "multiply", 
          minReversals: 0, //5,
          minTrials: 2
      })
    }),
    centerline({
      centerLine: random.pick([true,false]),
      angle: random.range(0,360, {round: 1}),
      size: staircase({
        startValue: "2mm",
        stepSize: 1.2,
        stepType: "multiply",
        minReversals: 0, //5,
        minTrials: 2
      })
    }),
    tao({
      vanishing: true,
      size: staircase({
        startValue: "5mm",
        stepSize: 1.2,
        stepType: "multiply",
        minReversals: 0,
        minTrials: 2
      })
    }),
  /*
    pause({
      buttondisplay: "control",
      displaymessage: "Waiting for the experiment to start...",
      monitormessage: "Press Start or hit any key to start the experiment.",
      buttonlabel: "Start"
    }),*/   
    pause({
      buttondisplay: "control",
      displaymessage: "The experiment was completed successfully.\nThank you for your participation!",
      monitormessage: "Experiment ended.",
      buttonlabel: "Store Results & Restart"
    })
  ]
  
}