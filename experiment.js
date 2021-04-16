
const snellen = require("stimsrv/task/snellen");
const tao = require("stimsrv/task/aucklandoptotypes");
const pause = require("stimsrv/task/pause");
const loop = require("stimsrv/task/loop");

const staircase = require("stimsrv/controller/staircase");
const random = require("stimsrv/controller/random");
const sequence = require("stimsrv/controller/sequence");

const centerline = require("./src/task/centerline.js");   
const dashedline = require("./src/task/dashedline.js");  
const text = require("./src/task/text.js");  

const setup = require("./setup-lab.js");

const messages = require("./messages.js");

pause.defaults({
  background: "#eeeeff",
  textcolor: "#000000",
  buttondisplay: "response",
  style: "max-width: 30em; text-align: justify;"
});

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
    }),  
    
    // TODO: questionannaire

    pause({
      message: {
        "*": "Please start the experiment at Station A.",
        "stationA.display": messages.welcome2
      },
    }),  

    loop({
      
      context: {
        targetStation: sequence(["B","C"]), //,"D","E"]),
        minReversals: 1,
      },
      
      tasks: [

        pause({
          message: context => {
            let msg = {
              "*": "Please continue the experiment at Station " + context.targetStation + ".",
              "control": "Transition to Station " + context.targetStation
            };
            msg["station" + context.targetStation + ".display"] = "Continue the experiment here.\nPress «Continue» when you're ready";
            return msg;
          },
          style: null
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
          }),
          stimulusDisplay: context => "station" + context.targetStation + ".display"
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
          }),
          stimulusDisplay: context => "station" + context.targetStation + ".display"
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
          },
          stimulusDisplay: context => "station" + context.targetStation + ".display"
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
          },
          stimulusDisplay: context => "station" + context.targetStation + ".display"
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
          }),
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),
        
        tao({
          vanishing: true,
          size: staircase({
            startValue: "5mm",
            stepSize: 1.2,
            stepType: "multiply",
            minReversals: context => context.minReversals,
            minTrials: 2
          }),
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),

        text({
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
          },
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),
      ]
    }),

    pause({
      message: {
        "*": "Please continue the experiment at Station A.",
        "stationA.display": "Thank you for your effort!\n\nAs a final step, please answer a few quick questions about your experience during the experiment.\n\nPress «Continue» when you are ready."
      },
    }),

    // TODO: questionannaire
    
    pause({
      message: {
        display: "The experiment was completed successfully.\nThank you for your participation!",
        monitor: "Experiment ended."
      },
      button: "Store Results & Restart",
      buttondisplay: "control"
    }),
  ]
  
}