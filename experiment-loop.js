
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
    loop: true,
    clientTimestamps: false
  },
    
  devices: desktop.devices,
  roles: desktop.roles,
  storage: desktop.storage,
  
  context: {
    //pixeldensity: 96, this should be passed in form device info
    message: "Hi!",
    //message2: sequence(["Hi!", "Bye!"])
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
        display: context => "1\n" + context.message + "\n" + context.message2
      }
    }),
    loop({
      loop: context => {
        context.loopCounter++;
        console.log("Checking outer loop counter " + context.loopCounter);
        return context.loopCounter < 2;
      },
      context: {
        displayDevice: sequence(["desktop","mobile-1","mobile-2"]),
        loopCounter: 0 //count()
      },
      tasks: [
        pause({
          message: {
            display: context => "2.1\n" + context.loopCounter + "\n" + context.message + "\n" + context.message2
          }
        }),
        pause({
          message: {
            display: context => "2.2\n" + context.loopCounter + "\n" + context.message + "\n" + context.message2
          }
        }),
        loop({
          loop: context => {
            context.loopCounter++;
            console.log("Checking inner loop counter " + context.loopCounter);
            return context.loopCounter < 7;
          },
          context: {
            loopCounter: 5, //count()
            message2: "Inner loop says hi!",
            message: "Bye!"
          },
          tasks: [
            pause({
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