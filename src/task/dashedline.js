
const Dimension = require("another-dimension");

const htmlButtons = require("stimsrv/ui/htmlButtons");
const parameterController = require("stimsrv/controller/parameterController");
const random = require("stimsrv/controller/random");

const canvasRenderer = require("stimsrv/stimulus/canvas/canvasRenderer");

function renderDashedLine(ctx, condition) {
{
  
  condition = Object.assign({
    angle: 0,
    width: 10,
    length: 100,
    dashpattern: 3   // dash length, 1 unit = line width. single value or [dash,gap,dash,gap] array.
  }, condition);
  
  if (!Array.isArray(condition.dashpattern)) {
    condition.dashpattern = [condition.dashpattern];
  }
  
  // double last entry if uneven number of entries
  if (condition.dashpattern.length % 2 == 1) {
    condition.dashpattern.push(condition.dashpattern[condition.dashpattern.length-1]);
  }
  
  let w = condition.width;
  let l = condition.length;
  let w2 = w/2;
  let l2 = l/2;
    
  ctx.rotate(condition.angle / 180 * Math.PI);
  
  if (condition.gapIntensity) {
    ctx.save();
    ctx.fillStyle = condition.gapIntensity;
    ctx.beginPath();
    ctx.moveTo(-l2,-w2);
    ctx.lineTo(l2,-w2);
    ctx.lineTo(l2,w2);
    ctx.lineTo(-l2,w2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  
  let dashPos = -l2;
  let dashIndex = 0;
  
  while (dashPos < l2) {
    
    let dashLength = condition.dashpattern[dashIndex] * condition.width;
    
    if (dashPos + dashLength > l2) {
      dashLength = l2 - dashPos;
    }
    
    ctx.beginPath();
    ctx.moveTo(dashPos,-w2);
    ctx.lineTo(dashPos+dashLength,-w2);
    ctx.lineTo(dashPos+dashLength,w2);
    ctx.lineTo(dashPos,w2);
    ctx.closePath();
    ctx.fill();
    
    dashPos += (condition.dashpattern[dashIndex] + condition.dashpattern[dashIndex+1]) * condition.width;
    
    dashIndex += 2;
    if (dashIndex >= condition.dashpattern.length) {
      dashIndex = 0;
    }
  }
 
}}

module.exports = function(config) {
  
  config.parameters = Object.assign({
    angle: 0,
    width: "3mm",
    length: "30mm",
    backgroundIntensity: 1.0,
    foregroundIntensity: 0.0
  }, config.parameters);
  
  config.conditions = config.conditions || [
    {
      dashpattern: [100,0],
      label: "Solid"
    },
    {
      dashpattern: [3,3],
      label: "Dashed"
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
    dimensions: ["width","length"],
    intensities: ["gapIntensity"]
  };
  
  let buttonParameters = {width: "7arcmin", angle: 0, length: "75arcmin" };
  let buttonCanvas = htmlButtons.buttonCanvas(renderDashedLine, buttonParameters, canvasOptions);

  let renderer = canvasRenderer(renderDashedLine, canvasOptions);
  
  return {
    name: "dashed_line",
    description: "Dashed line", 
    ui: function(context) {
      return {
        interfaces: {
          display: renderer,
          response: htmlButtons(config.conditions.map(c => ({label: c.label, canvas: buttonCanvas, response: c}))),
          monitor: renderer,
          control: null
        }
      }
    },
    controller: parameterController(config.parameters, config.options.selectCondition(config.conditions))
  }
}



/*
"ChoiceTask" Factory parameters:

name
description
stimulusRenderer
defaultParameters
buttonParameters
defaultChoices
dimensions: ["width","length"],
intensities: ["gapIntensity"]

-- optional
verifyChoice: f()
controller
interfaces

-- overrides (in experiment file / factory call)
id
description
parameters
conditions (choices?)
buttonParameters
verifyChoice
interaces? / roles?
*/