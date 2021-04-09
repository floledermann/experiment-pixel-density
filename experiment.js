
const snellen = require("stimsrv/src/tasks/snellen.js");
const bangbox = require("stimsrv/src/tasks/bangbox.js");
const tao = require("stimsrv/src/tasks/aucklandoptotypes.js");
const pause = require("stimsrv/src/tasks/pause.js");

const staircase = require("stimsrv/src/controller/staircase.js");
const random = require("stimsrv/src/controller/random.js");
const sequence = require("stimsrv/src/controller/sequence.js");

const centerline = require("./src/tasks/centerline.js");   
const dashedline = require("./src/tasks/dashedline.js");  
const text = require("./src/tasks/text.js");  

const setup = require("./setup-lab.js");

const messages = require("./messages.js");

// stimsrv experiment definition
module.exports = {
  
  name: "HD Map Symbolization - Experiment 1",
  
  devices: setup.devices,
  roles: setup.roles, 
  
  tasks: [
  
    pause({
      message: {
        "*": "Please start the experiment at Station A.",
        "stationA.display": messages.welcome
      },
      button: "Continue",
      buttondisplay: "response"
    }),  

    pause({
      message: {
        "*": "Please start the experiment at Station A.",
        "stationA.display": messages.welcome2
      },
      button: "Continue",
      buttondisplay: "response"
    }),  

    loop({
      
      context: {
        targetStation: sequence(["B","C","D","E"]),
        minReversals: 5
      },
      
      tasks: [

        pause({
          message: context => {
            let msg = {
              "*": "Please continue the experiment at Station " + context.targetStation + ".",
              "control": "Transition to Station " + context.targetStation
            };
            msg["station" + context.targetStation + ".display"] = "Continue the experiment here. Press 'Continue' when you're ready";
            return msg;
          }),
          button: "Continue",
          buttondisplay: "response"
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
              minReversals: context => context.minReversals,
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
            minReversals: context => context.minReversals,
            minTrials: 2
          })
        }),
        
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
                minReversals: context => context.minReversals,
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
                minReversals: context => context.minReversals,
                minTrials: 2
            })
          }
        }),
        
        tao({
          foregroundIntensity: 0,
          backgroundIntensity: 1,
          size: staircase({
            startValue: "5mm",
            stepSize: 1.2,
            stepType: "multiply",
            minReversals: context => context.minReversals,
            minTrials: 2
          })
        }),
        
        tao({
          vanishing: true,
          size: staircase({
            startValue: "5mm",
            stepSize: 1.2,
            stepType: "multiply",
            minReversals: context => context.minReversals,
            minTrials: 2
          })
        }),

        text({
          conditions: [
            { text: "Kamao" },
            { text: "Kameo" },
            { text: "Kemao" },
            { text: "Kemeo" },
          ],
          parameters: {
            angle: random.range(-90,90, {round: 1}),
            outline: true,
            outline2: true,
            backgroundIntensity: 0.5,
            outlineIntensity: 1,
            outlineWidth: 0.25,
            fontSize:
              staircase({
                startValue: "3mm",
                stepSize: 1.1,
                stepType: "multiply", 
                minReversals: context => context.minReversals,
                minTrials: 2
            })
          }
        }),
      ]
    }),
    
    pause({
      message: {
        display: "The experiment was completed successfully.\nThank you for your participation!",
        monitor: "Experiment ended."
      },
      button: "Store Results & Restart",
      buttondisplay: "control"
    })
  ]
  
}