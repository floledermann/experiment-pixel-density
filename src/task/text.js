
const Dimension = require("another-dimension");

const valOrFunc = require("stimsrv/util/valOrFunc");
const pickProperties = require("stimsrv/util/pickProperties");
const htmlButtons = require("stimsrv/ui/htmlButtons");
const parameterController = require("stimsrv/controller/parameterController");
const random = require("stimsrv/controller/random");

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

function array(val) {
  if (val === undefined || val === null) return [];
  if (!Array.isArray(val)) return [val];
  return val;
}

function taskManager(config) {
  
  config = Object.assign({
    defaults: {},
    controllerConfig: [],
    transformCondition: [],
    // do we need this? may simply throw an error if it does not resolve to a static value
    staticOptions: []
  }, config);
  
  config.controllerConfig = [config.defaults, ...array(config.controllerConfig)];
  config.transformCondition = array(config.transformCondition);
  
  let params = parameterController({
    parameters: config.controllerConfig, //Array.prototype.map.call(arguments, p => pickProperties.without(p, staticOptions))
    nextContext: config.nextContext
  });
  
  function resolve(name, context, defaultValue) {
    let val = config.controllerConfig.reduce((val, current) => {
      if (typeof current == "function") current = current(context);
      let entry = current[name];
      if (typeof entry == "function") entry = entry(context);
      if (entry !== undefined) val = entry;
      return val;
    }, null);
    
    if ((val === null || val === undefined) && defaultValue !== undefined) return defaultValue;
    
    return val;
  }
  
  function resolveArray(name, context, defaultValue) {
    return array(resolve(name, context, defaultValue));
  };
  
  return {
    resolve: resolve,
    resolveArray: resolveArray,
    resolveResources: function(name, context) {
      return resolveArray(name, context).map(res => res.resource).filter(r => r);
    },
    transformCondition: context => condition => {
      return config.frontendTransformCondition.reduce((condition, transform) => {
        if (typeof transform == "function") {
          transform = transform(context);
        }
        if (typeof transform == "function") {
          transform = transform(condition);
        }
        Object.assign(condition, transform);
        return condition;
      }, condition);
    },
    
    controller: function(context) {
      return params(context);
    },
    
    interfaces: function(spec, context) {
      
      let interfaces = {};
      
      Object.keys(spec).forEach(key => {
        resolveArray(key + "Interface", context, key).forEach(ui => {
          interfaces[ui] = spec[key];
        })
      });
      
      return interfaces;
      
    }
    
  }
}

/*
function simpleTask(config) {
  config = Object.assign({
    name: "Unnamed Task",
    description: "",
    defaults: {},
    interfaces: {},
    nextCondition: null,
    transformCondition: null,
    nextContext: null,
    resources: //?
    css: //?
  }, config);
  
  let task = function(controllerConfig, transformCondition) {
    
    let interfaceOptions = Object.keys(config.interfaces).map(i => i + "Interface");
    let staticOptions = interfaceOptions.concat(["css"]);
    
    let interfaceOptions = Object.fromEntries(Object.entries(config.interfaces).map().
    
    let manager = taskManager({
      defaults: config.defaults,
      controllerConfig: controllerConfig,
      transformCondition: transformCondition,
      // do we need this? may simply throw an error if it does not resolve to a static value
      staticOptions: staticOptions
    });
    
    return {
      name: config.name,
      description: config.description,
      frontend: function(context) {
        return {
          interfaces: manager.interfaces(config.interfaces, context),
          transformCondition: manager.transformCondition(context)
        };

      },
      controller: manager.controller,
      resources: manager.resolveResources("fonts") //?
    }
  }
  
  task.defaults = function(_defaults) {
    config.defaults = Object.assign({}, config.defaults, _defaults);
  }
  
  return task;
}

let renderer = canvasRenderer(renderText, {
  dimensions: ["fontSize"],
  intensities: ["outlineIntensity","outline2Intensity"],
  fonts: // ?
});

let task = simpleTask({
  name: "text",
  description: "Text",
  defaults: DEFAULTS,
  interfaces: {
    display: renderer,
    monitor: renderer,
    response: htmlButtons({
      buttons: condition => condition.choices.map(
        c => ({
          label: '<span style="letter-spacing: 0.4em; margin-right: -0.4em;">' + c.toUpperCase() + '</span>',
          response: {text: c} 
        })
      ),
      css: manager.resolve("css", context)       
    }),
  }
});
*/

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
