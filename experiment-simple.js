
/*
 
terms:
- environment
- configuration
- condition: level of an independent variable / "step" in an experiment
- stimulus: actual stimulus
- experiment
- trial
- participant

use cases:
- mobile phone display
- paper printout
- Kindle PDF Output
*/

const snellen = require("stimsrv/src/tasks/snellen.js");
const bangbox = require("stimsrv/src/tasks/bangbox.js");
const tao = require("stimsrv/src/tasks/aucklandoptotypes.js");
const pause = require("stimsrv/src/tasks/pause.js");

const centerline = require("./src/tasks/centerline.js");

const filestorage = require("stimsrv/src/storage/filestorage.js");

const staircase = require("stimsrv/src/controller/staircase.js");
const random = require("stimsrv/src/controller/random.js");
const sequence = require("stimsrv/src/controller/sequence.js");

// this is a complete configuration
module.exports = {
  
  name: "Simple Test Experiment",
    
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
          pixeldensity: 86,
          viewingdistance: 600,
          gamma: 2.2,
          minintensity: 1/40
        },{
          id: "right",
          description: "Right external monitor",
          resolution: "hd",
          pixeldensity: 86,
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
   
  experiments: [
    snellen({
      //rotate: random([-2,+2]), // add random rotation to prevent aliasing
      pixelAlign: false,
      lowIntensity: 0, //sequence.loop([0,0.25,0.5,0.75,0.9,0.95]),
      //highIntensity: 1.0,
      //contrastRatio: 1.05,
      foregroundIntensity: 0,
      backgroundIntensity: 1,
      //size: "3px",
      size: //sequence(["5mm","3mm","1mm"]), 
      staircase({
        startValue: "5mm",
        stepSize: 1.2,
        stepType: "multiply",
        minReversals: 0, //5,
        minTrials: 2
        //minValue: 
        //maxValue:
      })
    }),
    centerline({
      centerLine: random.pick([true,false]),
      angle: random.range(0,360, {round: 1}),
      foregroundIntensityHigh: false,
      size: staircase({
        startValue: "2mm",
        stepSize: 1.2,
        stepType: "multiply",
        minReversals: 0, //5,
        minTrials: 2
        //minValue: 
        //maxValue:
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
        //minValue: 
        //maxValue:
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
      buttonlabel: "Restart"
    })
  ]
  
}