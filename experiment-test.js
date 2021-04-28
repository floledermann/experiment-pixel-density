
const snellen = require("stimsrv/task/snellen");
const tao = require("stimsrv/task/aucklandoptotypes");
const pause = require("stimsrv/task/pause");
const loop = require("stimsrv/task/loop");

const staircase = require("stimsrv/controller/staircase");
const random = require("stimsrv/controller/random");
const sequence = require("stimsrv/controller/sequence");

const resource = require("stimsrv/util/resource");

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
  
  settings: {
    simpleBrowserRefresh: 5
  },
  
  tasks: [

    text({
      parameters: {
        fontFamily: "Orelega One",
        fontSize: sequence(["10mm","15mm"]),    
      },
      fonts: [{
        family: "Orelega One",
        resource: resource("font/OrelegaOne-Regular.ttf","resources/font/OrelegaOne-Regular.ttf"),
      }],
      stimulusDisplay: context => "station" + context.targetStation + ".display"
    }),

    
    pause({
      message: {
        display: "The experiment was completed successfully.\nThank you for your participation!",
        monitor: "Experiment ended."
      },
      button: "Store Results & Restart",
    }),
  ]
  
}