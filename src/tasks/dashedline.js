
const Dimension = require("another-dimension");

const htmlButtons = require("stimsrv/src/ui/htmlButtons.js");
const parameterController = require("stimsrv/src/controller/parameterController.js");

const canvasRenderer = require("stimsrv/src/stimuli/canvas/canvasRenderer.js");

function renderDashedLine(ctx, condition) {
{
  
  condition = Object.assign({
    angle: 0,
    width: 10,
    length: 100,
    dashPattern: 3   // dash length, 1 unit = line width. single value or [dash,gap,dash,gap] array.
    // foregroundColor/backgroundColor are handled by caller!
  }, condition);
  
  if (!Array.isArray(condition.dashPattern)) {
    condition.dashPattern = [condition.dashPattern];
  }
  
  // double last entry if uneven number of entries
  if (condition.dashPattern.length % 2 == 1) {
    condition.dashPattern.push(condition.dashPattern[condition.dashPattern.length-1]);
  }
  
  let w = condition.width;
  let l = condition.length;
  let w2 = w/2;
  let l2 = l/2;
    
  ctx.rotate(condition.angle / 180 * Math.PI);
  
  let dashPos = -l2;
  let dashIndex = 0;
  
  while (dashPos < l2) {
    
    let dashLength = condition.dashPattern[dashIndex] * condition.width;
    
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
    
    dashPos += (condition.dashPattern[dashIndex] + condition.dashPattern[dashIndex+1]) * condition.width;
    
    dashIndex += 2;
    if (dashIndex >= condition.dashPattern.length) {
      dashIndex = 0;
    }
  }
 
}}

module.exports = function(parameters, options) {
  
  parameters = Object.assign({
    angle: 0,
    width: "3mm",
    length: "30mm",
    backgroundIntensity: 1.0,
    foregroundIntensity: 0.0
  }, parameters);

  options = Object.assign({
    dimensions: ["width","length"],
    intensities: ["fillIntensity"]
  }, options);
  
  let buttonParameters = {width: "7arcmin", angle: 0, length: "75arcmin"};
  let buttonCanvas = htmlButtons.buttonCanvas(renderDashedLine, buttonParameters, options);

  let renderer = canvasRenderer(renderDashedLine, options);
  
  return {
    name: "dashed_line",
    description: "Dashed line", 
    interfaces: {
      display: renderer,
      response: htmlButtons([
        {label: "Solid", canvas: buttonCanvas, response: {dashPattern: [100,0]}},
        {label: "Dotted", canvas: buttonCanvas, response: {dashPattern: [1,1]}},
        {label: "Dashed", canvas: buttonCanvas, response: {dashPattern: [3,1]}},
        {label: "Dot‑dash", canvas: buttonCanvas, response: {dashPattern: [3,1,1,1]}}
      ]),
      monitor: renderer,
      control: null,
    },
    controller: parameterController(parameters, options)
  }
}