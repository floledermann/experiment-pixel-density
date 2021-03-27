
const Dimension = require("another-dimension");

const htmlButtons = require("stimsrv/src/ui/htmlButtons.js");
const parameterController = require("stimsrv/src/controller/parameterController.js");
const random = require("stimsrv/src/controller/random.js");

const canvasRenderer = require("stimsrv/src/stimuli/canvas/canvasRenderer.js");

function renderText(ctx, condition) {
{
  
  condition = Object.assign({
    text: "ABC abc",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    fontSize: "4mm",
    lineHeight: 1.5,
    fontStretch: "normal",
    fontFamily: "Helvetica,Arial,sans-serif",
    angle: 0
  }, condition);
  
  ctx.rotate(condition.angle / 180 * Math.PI);
   
  ctx.textAlign = "center";
  
  let c = condition;
  ctx.font = `${c.fontStyle} ${c.fontVariant} ${c.fontWeight} ${c.fontSize}px/${c.lineHeight} ${c.fontStretch} ${c.fontFamily} `
    
  ctx.fillText(c.text, 0, 0);
 
}}

module.exports = function(config) {
  
  config.parameters = Object.assign({
    text: "ABC abc",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    fontSize: "4mm",
    lineHeight: 1.5,
    fontStretch: "normal",
    fontFamily: "Helvetica,Arial,sans-serif",
    angle: 0,
    backgroundIntensity: 1.0,
    foregroundIntensity: 0.0
  }, config.parameters);
  
  config.conditions = config.conditions || [
    {
      text: "ABC"
    },
    {
      text: "DEF"
    }
  ];
  
  // add default values explicitly to conditions in order to have each condition fully specified
  let conditionKeys = new Set();
  for (let cond of config.conditions) {
    Object.keys(cond).forEach(k => conditionKeys.add(k));
  }
  for (let cond of config.conditions) {
    for (let key of conditionKeys) {
      if (!cond.hasOwnProperty(key)) {
        if (!(typeof config.parameters[key] == "function")) {
          cond[key] = config.parameters[key];
        }
        else {
          throw new Error("Condition parameter '" + key + "' is not specified for all conditions, but is dynamic - specify this parameter for all conditions!"); 
        }
      }
    }
  }
  
  config.options = Object.assign({
    selectCondition: random.pick
  }, config.options);
  
  let canvasOptions = {
    dimensions: ["fontSize"]
  };
  
  let renderer = canvasRenderer(renderText, canvasOptions);
  
  return {
    name: "text",
    description: "Text", 
    interfaces: {
      display: renderer,
      // apply letter-spacing on button to avoid hint by text length
      // unfortunately CSS applies letter-spacing after the last letter, so we need this hack
      response: htmlButtons(config.conditions.map(c => ({label: x => ('<span style="letter-spacing: 0.7em; margin-right: -0.7em;">' + x.text + '</span>'), response: c }))),
      monitor: renderer,
      control: null,
    },
    controller: parameterController(config.parameters, config.options.selectCondition(config.conditions))
  }
}

