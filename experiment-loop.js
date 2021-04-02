
const snellen = require("stimsrv/src/tasks/snellen.js");
const bangbox = require("stimsrv/src/tasks/bangbox.js");
const tao = require("stimsrv/src/tasks/aucklandoptotypes.js");
const pause = require("stimsrv/src/tasks/pause.js");
const loop = require("stimsrv/src/tasks/loop.js");   

const filestorage = require("stimsrv/src/storage/filestorage.js");

const staircase = require("stimsrv/src/controller/staircase.js");
const random = require("stimsrv/src/controller/random.js");
const sequence = require("stimsrv/src/controller/sequence.js");
const count = require("stimsrv/src/controller/count.js");   

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
    //pixeldensity: 96, this should be passed in form device info
    message: "Hi!",
    message2: sequence(["Hi!", "Bye!"])
  },
  
  context2: sequence([
  {
    message: "Hi"
  },
  {
    message: "Bye"
  }
  ]),
   
  tasks: [
    pause({
      message: {
        main: context => context.message + messages.greeting,
        display: context => context.message + " Please start the experiment at station 1.",
        monitor: "Waiting for user to start..."
      },
      button: "Continue"
    }),
    loop({
      context: {
        displayDevice: sequence(["desktop","mobile-1","mobile-2"]),
        loopCounter: 0 //count()
      },
      tasks: [
        pause({
          //buttondisplay: context => context.device,
          message: {
            display: context => "Please continue the experiment at station " + (context?.loopCounter + 1),
            monitor: "Transition to next device..."
          },
          button: "Continue"
        }),
        pause({
          //buttondisplay: context => context.device,
          message: {
            display: "The experiment continues"
          },
          button: "Continue"
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
      buttondisplay: "control"
    }),
  ]
}