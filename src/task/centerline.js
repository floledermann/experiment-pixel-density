
const Dimension = require("another-dimension");

const valOrFunc = require("stimsrv/util/valOrFunc");
const htmlButtons = require("stimsrv/ui/htmlButtons");
const parameterController = require("stimsrv/controller/parameterController");

const canvasRenderer = require("stimsrv/stimulus/canvas/canvasRenderer");

function renderCenterline(ctx, condition) {

  
  condition = Object.assign({
    angle: 0,
    width: 7,
    length: 100,
    lineCount: 3,
    lineWidth: 1/7,
    fill: false,
    fillIfNoLine: true, // fill gap if no center line is present
    fillIfOneLine: true, // fill gap if no center line is present
    fillIntensity: "rgb(128,128,128)",
    pixelAlign: true
    // foregroundIntensity/backgroundIntensity are handled by caller!
  }, condition);
  
/*
  
  +--------------------------+   -       -    
  |##########################|   |     width*lineWidth 
  +--------------------------+   |       -    
                                 |     (width-(lineCount*lineWidth))/(lineCount-1)       
  +--------------------------+   |       -    
  |############ X ###########|  width  width*lineWidth 
  +--------------------------+   |       -
                                 |           
  +--------------------------+   |
  |##########################|   |           
  +--------------------------+   -           
  
  |--------------------------|
              length
 
X ... Origin
*/
  
  let w = condition.width;
  let lw = w * condition.lineWidth;
  let l = condition.length;
  let w2 = w/2;
  let l2 = l/2;
  
  // If w/2 (upper-left corner) lands on a fractional pixel,
  // align with pixel grid if requested.
  // Do this before rotation to avoid a visible offset between the different angles.
  if (condition.pixelAlign && w2 != Math.floor(w2)) {
    let remainder = w2-Math.floor(w2);
    ctx.translate(remainder, remainder);
  }
  
  ctx.rotate(condition.angle / 180 * Math.PI);
  
  if (condition.fill 
      || (condition.lineCount == 0 && condition.fillIfNoLine)
      || (condition.lineCount == 1 && condition.fillIfOneLine)) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-l2,-w2);
    ctx.lineTo(l2,-w2);
    ctx.lineTo(l2,w2);
    ctx.lineTo(-l2,w2);
    ctx.closePath();
    ctx.fillStyle = condition.fillIntensity;
    ctx.fill();
    ctx.restore();
  }
  
  if (condition.lineCount == 1) {
    ctx.beginPath();
    ctx.moveTo(-l2,-lw/2);
    ctx.lineTo(l2,-lw/2);
    ctx.lineTo(l2,lw/2);
    ctx.lineTo(-l2,lw/2);
    ctx.closePath();
    ctx.fill();
  }
  
  if (condition.lineCount > 1) {
    
    for (let i=0; i<condition.lineCount; i++) {
      
      let pos = -w2 + i*((w-lw) / (condition.lineCount - 1));
      
      ctx.beginPath();
      ctx.moveTo(-l2,pos);
      ctx.lineTo(l2,pos);
      ctx.lineTo(l2,pos+lw);
      ctx.lineTo(-l2,pos+lw);
      ctx.closePath();
      ctx.fill();
      
    }    
  }
  
}

module.exports = function(parameters, options) {
  
  parameters = Object.assign({
    angle: 0,
    width: "5mm",
    length: "30mm",
    lineCount: 3,
    lineWidth: 1/7,
    fill: false,
    fillIfNoLine: true, // fill gap if no center line is present
    fillIfOneLine: true, // fill gap if no center line is present
    backgroundIntensity: 1.0,
    foregroundIntensity: 0.0,
    fillIntensity: 0.5,
    //fillIntensity: "rgb(127, 127, 127)",  // gaussian blur on actual image, also midpoint @ 1.0gamma
    //fillIntensity: "rgb(85, 85, 85)",  // 1/3 intensity at 1.0 gamma
    //fillIntensity: "rgb(155, 155, 155)",  // 1/3 intensity at 2.2 gamma
    //fillIntensity: "rgb(212, 212, 212)", // 2/3 @ 2.2gamma
    //fillIntensity: "rgb(202, 202, 202)", // 3/5 @ 2.2gamma
    //fillIntensity: "rgb(168, 168, 168)", // 2/5 @ 2.2gamma
    pixelAlign: false
  }, parameters);

  options = Object.assign({
    
    dimensions: ["width","length"],
    intensities: ["fillIntensity"],
    
    stimulusDisplay: "display", // TODO: these three should be a common pattern handled by a helper class
    responseDisplay: "response",
    monitorDisplay: "monitor",
    
  }, options);
  
  let buttonParameters = {width: "25arcmin", angle: 0, length: "160arcmin", fillIntensity: 0.5};

  let renderer = canvasRenderer(renderCenterline, options);
  
  let buttonCanvas = canvasRenderer(renderCenterline, {
    dimensions: ["width","length"],
    intensities: ["fillIntensity"],
    width: 120,
    height: 40,
    overrideCondition: buttonParameters
  });

  
  // TODO: define set of conditions/choices to render buttons from, as in some other tasks
  // Alternative would be to move this entirely to the expeirment level, but how to configure buttonCanvas there?
  let responseButtons = htmlButtons({
    buttons: [
      //{label: "2 Lines", subUI: buttonCanvas, response: {lineCount: 2}},
      {label: "3 Lines", subUI: buttonCanvas, response: {lineCount: 3}},
      {label: "4 Lines", subUI: buttonCanvas, response: {lineCount: 4}},
      {label: "Grey&nbsp;Line", subUI: buttonCanvas, response: {lineCount: 0}}
    ]
  });
  
  return {
    name: "parallel",
    description: "Parallel lines",
    frontend: function(context) {
      let interfaces = {};
      
      for (let ui of valOrFunc.array(options.stimulusDisplay, context)) {
        interfaces[ui] = renderer;
      }
      
      for (let ui of valOrFunc.array(options.responseDisplay, context)) {
        interfaces[ui] = responseButtons;
      }
      
      for (let ui of valOrFunc.array(options.monitorDisplay, context)) {
        interfaces[ui] = renderer;
      }

      return {
        interfaces: interfaces
      };
    },
    controller: parameterController({parameters: parameters})
  }
}