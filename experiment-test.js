
const tumblingE = require("stimsrv/task/tumblingE");
const tao = require("stimsrv/task/aucklandoptotypes");
const text = require("stimsrv/task/text");  

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
        margin-top: 4em;
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

    loop({
      
      context: {
        targetStation: sequence(["A","B","C","D"]),
        minReversals: 5,
      },
      
      tasks: [

        snellen({
          //rotate: random([-2,+2]), // add random rotation to prevent aliasing
          angle: sequence([0,90,180,270]),
          pixelAlign: false,
          foregroundIntensity: 0,
          backgroundIntensity: 1,
          size: "5mm",
        }),

        centerline({
          lineCount: sequence([3,4,0]),
          lineWidth: 1/9,
          angle: -15,
          length: "50mm",
          fill: false,
          fillIfNoLine: true,
          fillIntensity: random.pick([0.5,0.55,0.6]),
          width: "3mm",
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
              dashpattern: [3,2,1,2],
              label: "Dot‑dash"
            }
          ],
          parameters: {
            angle: -15,
            length: "50mm",
            width: sequence(["1.5mm","1.5mm","1.5mm","1.5mm"])
          },
          selectCondition: choices => sequence(choices),
        }),
/*
        tao({
          foregroundIntensity: 0,
          backgroundIntensity: 1,
          size: "5mm",
        }),
        */
        /*
        tao({
          vanishing: true,
          size: "5mm",
        }),
*/
        text({
          parameters: {
            angle: -15,
            outline: true,
            outline2: false,
            backgroundIntensity: 0.5,
            outlineIntensity: 1,
            outlineWidth: 0.25,
            fontFamily: "Roboto",
            fontSize: "3mm"
          },
          fonts: [{
            family: "Roboto",
            resource: resource("font/Roboto-Regular.ttf","resources/font/Roboto-Regular.ttf"),
          }],
        }),

      ]
    }),

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