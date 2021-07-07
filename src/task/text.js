
const taskManager = require("stimsrv/task/taskManager");
const htmlButtons = require("stimsrv/ui/htmlButtons");
const canvasRenderer = require("stimsrv/stimulus/canvas/canvasRenderer");

function renderText(ctx, condition) {
  
  condition = Object.assign({
    text: "<no text defined>",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    fontSize: 4,
    // not supported by node-canvas
    //lineHeight: 1.5,
    //fontStretch: "normal",
    fontFamily: "Arial",
    angle: 0
  }, condition);
  
  console.log("Rendering: ", condition);
  //console.trace();
  
  ctx.rotate(condition.angle / 180 * Math.PI);
   
  ctx.textAlign = "center";
  
  let c = condition;
  
  // use only properties supported by node-canvas
  // see https://github.com/Automattic/node-canvas/wiki/Compatibility-Status#text-styles
  // (currently, line-height and font-stretch are omitted)
  //ctx.font = `${c.fontStyle} ${c.fontVariant} ${c.fontWeight} ${c.fontSize}px/${c.lineHeight} ${c.fontStretch} ${c.fontFamily}`;
  ctx.font = `${c.fontStyle} ${c.fontVariant} ${c.fontWeight} ${c.fontSize}px ${c.fontFamily}`;
  //console.log("Font: " + ctx.font);
  
  if (condition.outline && condition.outlineWidth > 0) {
    //console.log(condition.outlineWidth * condition.fontSize);
    //console.log(condition.outlineIntensity);
    ctx.save();
    ctx.strokeStyle = condition.outlineIntensity;
    ctx.lineWidth = condition.outlineWidth * condition.fontSize;
    ctx.lineJoin = "round";
    ctx.strokeText(c.text, 0, 0);
    ctx.restore();
  }
  
  if (condition.outline2 && condition.outline2Width > 0) {
    //console.log(condition.outline2Width * condition.fontSize);
    //console.log(condition.outline2Intensity);
    ctx.save();
    ctx.strokeStyle = condition.outline2Intensity;
    ctx.lineWidth = condition.outline2Width * condition.fontSize;
    ctx.lineJoin = "round";
    ctx.strokeText(c.text, 0, 0);
    ctx.restore();
  }
  
  ctx.fillText(c.text, 0, 0);
 
}

const DEFAULTS = {
  // condition
  text: "<no text defined>",
  fontStyle: "normal",
  fontVariant: "normal",
  fontWeight: "normal",
  fontSize: "4mm",
  // not supported by node-canvas
  //lineHeight: 1.5,
  //fontStretch: "normal",
  fontFamily: "Arial",
  angle: 0,
  outline: false,
  outlineWidth: 0.25, // relative to fontSize
  outlineIntensity: 0.5,
  outline2: false,
  outline2Width: 0.02, // relative to fontSize
  outline2Intensity: 0.0,
  backgroundIntensity: 1.0,
  foregroundIntensity: 0.0,
  
  // config
  
  displayInterface: "display", 
  responseInterface: "response",
  monitorInterface: "monitor",
  // fonts
  // css
}

let defaults = DEFAULTS;

let task = function(controllerConfig, transformCondition) {
  
  let manager = taskManager({
    defaults: defaults,
    controllerConfig: controllerConfig,
    transformCondition: transformCondition,
    // do we need this? may simply throw an error if it does not resolve to a static value
    staticOptions: ["stimulusInterface", "responseInterface", "monitorInterface", "fonts", "css"]
  });

  return {
    name: "text",
    description: "Text",
    frontend: function(context) {

      let renderer = canvasRenderer(renderText, {
        dimensions: ["fontSize"],
        intensities: ["outlineIntensity","outline2Intensity"],
        fonts: manager.resolveArray("fonts", context)
      });
      
      let responseButtons = htmlButtons({
        buttons: condition => condition.choices.map(
          c => ({
            label: '<span style="letter-spacing: 0.4em; margin-right: -0.4em;">' + c.toUpperCase() + '</span>',
            response: {text: c} 
          })
        ),
        css: manager.resolve("css", context)       
      });
        
      return {
        interfaces: manager.interfaces({
          display: renderer,  
          response: responseButtons,
          monitor: renderer
        }, context),
        transformCondition: manager.transformCondition(context)
      };

    },
    controller: manager.controller,
    resources: manager.resolveResources("fonts")
  }
}

task.defaults = function(_defaults) {
  defaults = Object.assign({}, DEFAULTS, _defaults);
}


module.exports = task;
