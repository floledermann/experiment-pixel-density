
const pause = require("stimsrv/src/tasks/pause.js");
const loop = require("stimsrv/src/tasks/loop.js");   

const sequence = require("stimsrv/src/controller/sequence.js");
const count = require("stimsrv/src/controller/count.js");

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
    message: sequence.loop(["Odd number participant", "Even number participant"])
  },
  
  tasks: [
    pause({
      message: {
        display: context => "Task 1\n" + context.message + "\n" + (context.message2 || "")
      }
    }),
    loop({
      context: {
        displayDevice: sequence(["desktop","mobile-1","mobile-2"]),
        loopCounter: count()
      },
      loop: context => {
        return context.loopCounter < 2;
      },
      tasks: [
        pause({
          store: true,  // this is the only task that gets stored (by default, store == false for the pause task)
          message: {
            display: context => "Task 2.1\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + (context.message2 || "")
          }
        }),
        pause({
          message: {
            display: context => "Task 2.2\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + (context.message2 || "")
          }
        }),
        loop({
           context: {
            loopCounter: 5,
            message2: "Participant has seen Task 2.3!",
            message: "Local message for Task 2.3"
          },
          loop: context => {
            context.loopCounter++;
            return context.loopCounter < 7;
          },
          tasks: [
            pause({
              message: {
                display: context => "2.3.1\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + context.message2
              }
            }),
            pause({
              message: {
                display: context => "2.3.2\nCounter: " + context.loopCounter + "\n" + context.message + "\n" + context.message2
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
    }),
  ]
}