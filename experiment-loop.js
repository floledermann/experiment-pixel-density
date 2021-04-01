
const snellen = require("stimsrv/src/tasks/snellen.js");
const bangbox = require("stimsrv/src/tasks/bangbox.js");
const tao = require("stimsrv/src/tasks/aucklandoptotypes.js");
const pause = require("stimsrv/src/tasks/pause.js");

const filestorage = require("stimsrv/src/storage/filestorage.js");

const staircase = require("stimsrv/src/controller/staircase.js");
const random = require("stimsrv/src/controller/random.js");
const sequence = require("stimsrv/src/controller/sequence.js");

const loop = require("./src/tasks/loop.js");   
const centerline = require("./src/tasks/centerline.js");   
const dashedline = require("./src/tasks/dashedline.js");  

const desktop = require("./config-desktop.js");
const messages = require("./messages.js");


module.exports = {
  
  name: "Loop Test",
  
  settings: {
    loop: true
  },
    
  devices: desktop.devices,
  roles: desktop.roles,
  storage: desktop.storage,
  
  context: {
    pixeldensity: 96
  },
   
  tasks: [
    pause({
      message: {
        main: messages.greeting,
        display: "Please start the experiment at station 1.",
        monitor: "Waiting for user to start..."
      },
      button: "Continue"
    }),
    loop({
      context: {
        displayDevice: sequence(["desktop","mobile-1","mobile-2"])
      },
      tasks: [
        pause({
          //buttondisplay: context => context.device,
          displaymessage: context => "Please continue the experiment at station " + (context.loopCounter + 1),
          monitormessage: "Transition to next device...",
          buttonlabel: "Continue"
        }),/*
        snellen({
          size:
            staircase({
              startValue: "5mm",
              stepSize: 1.2,
              stepType: "multiply", 
              minReversals: 0,
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
        })*/
      ],
    }),
    pause({
      message: {
        display: "Thank you for your participation!",
        monitor: "Experiment ended."
      },
      button: "Store & Restart",
      buttonDisplay: "control"
    }),
  ]
}