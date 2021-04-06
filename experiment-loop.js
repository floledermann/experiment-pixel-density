
const pause = require("stimsrv/src/tasks/pause.js");
const loop = require("stimsrv/src/tasks/loop.js");   

const sequence = require("stimsrv/src/controller/sequence.js");

const desktop = require("./config-desktop.js");

module.exports = {
  
  name: "Loop Test",
  
  settings: {
    loop: true,
    clientTimestamps: false
  },
    
  devices: desktop.devices,
  roles: desktop.roles,
  storage: desktop.storage,
  
  context: {
    //pixeldensity: 96, this should be passed in from device info
    message: sequence.loop(["Hi!", "Bye!"])
  },
  
  tasks: [
    pause({
      message: {
        display: context => "Root\n" + context.message + "\n" + context.message2
      }
    }),
    loop({
      initialContext: {
        displayDevice: sequence(["desktop","mobile-1","mobile-2"]),
        loopCounter: 0 //count()
      },
      loop: context => {
        context.loopCounter++;
        console.log("Checking outer loop counter " + context.loopCounter);
        return context.loopCounter < 2;
      },
      tasks: [
        pause({
          message: {
            display: context => "2.1\n" + context.loopCounter + "\n" + context.message + "\n" + context.message2
          }
        }),/*
        snellen({
          foregroundIntensity: 0,
          backgroundIntensity: 1,
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
        }),*/
        /*
        pause({
          message: {
            display: context => "2.2\n" + context.loopCounter + "\n" + context.message + "\n" + context.message2
          }
        }),*/
        loop({
           initialContext: {
            loopCounter: 5, //count()
            message2: "Inner loop says hi!",
            message: "Bye!"
          },
          loop: context => {
            context.loopCounter++;
            console.log("Checking inner loop counter " + context.loopCounter);
            return context.loopCounter < 7;
          },
          tasks: [
            pause({
              store: true,
              message: {
                display: context => "2.3.1\n" + context.loopCounter + "\n" + context.message + "\n" + context.message2
              }
            }),
            pause({
              message: {
                display: context => "2.3.2\n" + context.loopCounter + "\n" + context.message + "\n" + context.message2
              }
            })
          ],
        }),
      ],
    }),
    pause({
      message: {
        display: "Thank you for your participation!",
        monitor: "Experiment ended."
      },
      button: "Restart",
      //buttondisplay: "control"
    }),
  ]
}