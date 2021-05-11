
const snellen = require("stimsrv/task/snellen");
const tao = require("stimsrv/task/aucklandoptotypes");
const pause = require("stimsrv/task/pause");
const loop = require("stimsrv/task/loop");

const staircase = require("stimsrv/controller/staircase");
const random = require("stimsrv/controller/random");
const sequence = require("stimsrv/controller/sequence");

const filestorage = require("stimsrv/storage/filestorage");

const resource = require("stimsrv/util/resource");
const htmlButtons = require("stimsrv/ui/htmlButtons");

const centerline = require("./src/task/centerline.js");   
const dashedline = require("./src/task/dashedline.js");  
const text = require("./src/task/text.js");  

const setup = require("./setup-lab.js");

const messages = require("./messages.js");

pause.defaults({
  background: "#eeeeff",
  textcolor: "#000000",
  buttondisplay: "response",
});

htmlButtons.defaults({
  clickSound: "/static/resource/resources/sound/click1.wav"
});

// stimsrv experiment definition
module.exports = {
  
  name: "HD Map Symbolization - Experiment 1",
  
  devices: setup.devices,
  roles: setup.roles,
  
  settings: {
    simpleBrowserRefresh: 5
  },
  
  storage: filestorage({
    destination: "./data"
  }),
  
  resources: [
    "resources/images",
    "resources/sound"
  ],
  
  css: `
    body.has-ui-response {
      font-size: 24px;
    }
    
    body.is-device-stationB {
      font-size: 24px;
    }
    
    .content {
      max-width: 17em;
      text-align: left;
    }
    
    .has-role-main .content {
      max-width: 32em;
      font-size: 1.5em;
    }
    
    .buttons-tao {
      display: grid;
      grid-template-columns: repeat(5, 6em);
    }
    
    @media (orientation: portrait) {
      .buttons {
        display: grid;
        grid-template-columns: repeat(1, 10em);
        margin-top: 6em;
      }
      
      .current-task-survey-language .buttons,
      .current-task-survey-vision .buttons {
        margin-top: 0;
        grid-template-columns: repeat(1, 14em);
      }

      .current-task-survey-vision .buttons {
        grid-template-columns: repeat(1, 16em);
      }
      
      .current-task-centerline .buttons,
      .current-task-dashedline .buttons {
        display: grid;
        grid-template-columns: repeat(1, 8em);
      }
      .current-task-text .buttons {
        display: grid;
        grid-template-columns: repeat(1, 10em);
      }
      .current-task-tao .buttons {
        display: grid;
        grid-template-columns: repeat(2, 6em);
      }
      .current-task-text .buttons button {
        height: 2.5em;
        margin: 0.5em;
      }

    }
  `,
  
  tasks: [

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
         "main.display": messages.welcome
      },
    }),

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.survey1_age
      },
      button: htmlButtons([
        "16-25",
        "26-35",
        "36-50",
        "51-65",
        "66 or older"
      ]),
      store: true
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.survey2_gender
      },
      button: htmlButtons([
        "Female",
        "Male",
        "Non-binary or other",
        "Would prefer not to answer",
      ]),
      store: true
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.survey3_language
      },
      button: htmlButtons([
        "Englisch",
        "German",
        "Greek",
        "Russian or other cyrillic",
        "Other European\nor Latin American",
        "Chinese",
        "Japanese",
        "Other Asian or African"
      ]),
      name: "survey-language",
      store: true
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.survey4_vision
      },
      button: htmlButtons([
        "Normal vision",
        "Corrected to normal\n(wearing glasses or contact lenses suitable for reading)",
        "Short-sighted\n(far objects appear blurred)",
        "Far-sighted\n(near objects appear blurred)",
        "Other vision impairment",
        "Would prefer not to answer"
      ]),
      name: "survey-vision",
      store: true
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.start1
      },
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.start2
      },
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.start3
      },
    }),  

    pause({
      message: {
        "*": "Please start the experiment at the Main Monitor.",
        "main.display": messages.start4
      },
    }),  

    loop({
      
      context: {
        targetStation: random.sequence(["A","B","C","D"]),
        //targetStation: sequence(["A","B","C","D"]),
        minReversals: 5,
      },
      
      tasks: [

        pause({
          message: context => {
            let msg = {
              "*": "Please continue the experiment at Station " + context.targetStation + ".",
              "control": "Transition to Station " + context.targetStation
            };
            msg["station" + context.targetStation + ".display"] = "Continue the experiment here.\n\nPress «Continue» when you have arrived.";
            return msg;
          },
        }),  

        pause({
          message: context => {
            let msg = {
              "*": "Press «Continue» when you are ready at Station " + context.targetStation + ".",
              "control": "Transition to Station " + context.targetStation
            };
            msg["station" + context.targetStation + ".display"] = "You may take a short break.\n\nPress «Continue» when you are ready to continue the experiment here.";
            return msg;
          },
        }),  

        snellen({
          //rotate: random([-2,+2]), // add random rotation to prevent aliasing
          angle: random.shuffle([0,90,180,270], { loop: true, preventContinuation: true }),
          pixelAlign: false,
          foregroundIntensity: 0,
          backgroundIntensity: 1,
          size:
            staircase({
              startValue: "1.163mm",
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
          length: "50mm",
          size: staircase({
            startValue: "0.868mm",
            stepSize: 1.2,
            stepType: "multiply",
            minReversals: context => context.minReversals,
            minTrials: 2
          }),    
        }, {
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),
        
        dashedline({
          conditions: [
            {
              dashpattern: [100,0],
              label: "Solid"
            },
            {
              dashpattern: [1,2],
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
                startValue: "0.28mm",
                stepSize: 1.2,
                stepType: "multiply", 
                minReversals: context => context.minReversals,
                minTrials: 2
            })
          },
          selectCondition: choices => random.shuffle(choices, { loop: true, multiple: 2, preventContinuation: true }),
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),

        tao({
          foregroundIntensity: 0,
          backgroundIntensity: 1,
          size: staircase({
            startValue: "1.447mm",
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
            startValue: "2.315mm",
            stepSize: 1.2,
            stepType: "multiply",
            minReversals: context => context.minReversals,
            minTrials: 2
          }),
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),

        text({
          parameters: {
            angle: random.range(-60,60, {round: 1}),
            outline: true,
            outline2: false,
            backgroundIntensity: 0.5,
            outlineIntensity: 1,
            outlineWidth: 0.25,
            fontFamily: "Roboto",
            fontSize:
              staircase({
                startValue: "1.708mm",
                stepSize: 1.1,
                stepType: "multiply", 
                minReversals: context => context.minReversals,
                minTrials: 2
            })
          },
          fonts: [{
            family: "Roboto",
            resource: resource("font/Roboto-Regular.ttf","resources/font/Roboto-Regular.ttf"),
          }],
          stimulusDisplay: context => "station" + context.targetStation + ".display"
        }),

      ]
    }),

    pause({
      message: {
        "*": "Please continue the experiment at the Main Monitor.",
        "main.display": "Thank you for your effort!\n\nAs a final step, please answer a few quick questions about your experience during the experiment.\n\nPress «Continue» when you are ready."
      },
    }),

    // TODO: questionannaire
    
    pause({
      message: {
        display: "The experiment was completed successfully.\nThank you for your participation!",
        response: "The experiment was completed successfully.\nThank you for your participation!",
        monitor: "Experiment ended."
      },
      button: "Store Results & Restart",
      buttondisplay: "control"
    }),
  ]
  
}