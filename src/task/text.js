
const Dimension = require("another-dimension");

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
  
  ctx.rotate(condition.angle / 180 * Math.PI);
   
  ctx.textAlign = "center";
  
  let c = condition;
  
  // use only properties supported by node-canvas
  // see https://github.com/Automattic/node-canvas/wiki/Compatibility-Status#text-styles
  // (currently, line-height and font-stretch are omitted)
  //ctx.font = `${c.fontStyle} ${c.fontVariant} ${c.fontWeight} ${c.fontSize}px/${c.lineHeight} ${c.fontStretch} ${c.fontFamily}`;
  ctx.font = `${c.fontStyle} ${c.fontVariant} ${c.fontWeight} ${c.fontSize}px ${c.fontFamily}`;
  console.log("Font: " + ctx.font);
  
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

module.exports = function(config) {
  
  config.parameters = Object.assign({
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
  
  let sets = {
    "e-a": [
      ["Kamao","Kameo","Kemao","Kemeo"],
      ["andern","endern","andarn","endarn"],
      ["Rasta","Raste","Resta","Reste"]
    ],
    "rn-m-nn": [
      ["Lerno","Lemo","Lenno"],
      ["Serna","Sema","Senna"],
      ["Korne","Kome","Konne"]
    ],
    "D-O-Q": [
      ["Oelm","Delm","Qelm"],
      ["Oigel","Digel","Qigel"],
      ["Oarti","Darti","Qarti"],
      ["RIOL","RIDL","RIQL"]
    ],
    "R-B-P": [
      ["Rug","Bug","Pug"],
      ["Rein","Bein","Pein"],
      ["Rest","Best","Pest"],
    ],
    "ff-ll-fl-lf": [
      ["Stoffen","Stollen","Stolfen","Stoflen"],
      ["Saffe","Salle","Salfe","Safle"],
    ],
    "l-f": [
      ["Kolin","Kofin"],
      ["fokal","lokal"],
    ],
    "ll-il-li": [
      ["Deila","Della","Delia"],
      ["Monail","Monali","Monall"],
    ],
    "i-l": [
      ["Aigen","Algen"],
    ],
    /*
    "C-G-O": [
    ],
    "c-o": [
    ],  
*/    
  }
  
  for (let set of Object.values(sets)) {
    for (let subset of set) {
      subset.sort();  // sort in place
    }
  }
  
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
  
  config.options.selectCondition = function(sets) {
    return function(context) {
      let setKeys = Object.keys(sets);
      let pick = random.pick(setKeys)();
      return {
        next: function() {
          let key = pick.next().value;
          let index = Math.floor(sets[key].length * Math.random());
          let text = random.pick(sets[key][index])().next().value;
          return {
            done: false,
            value: {
              set: key,
              subset: index,
              text: text
            }
          }
        }
      }
    }
  }
  
  config.fonts = config.fonts || [];
  
  let canvasOptions = {
    dimensions: ["fontSize"],
    intensities: ["outlineIntensity","outline2Intensity"],
    fonts: config.fonts
  };
  
  let renderer = canvasRenderer(renderText, canvasOptions);
  
  let fontResources = config.fonts.map(f => f.resource);
    
  return {
    name: "text",
    description: "Text", 
    ui: function(context) {
      return {
        interfaces: {
          display: renderer,
          // apply letter-spacing on button to avoid hint by text length
          // unfortunately CSS applies letter-spacing after the last letter, so we need this hack
          response: htmlButtons(condition => sets[condition.set][condition.subset].map(t => ({label: '<span style="letter-spacing: 0.4em; margin-right: -0.4em;">' + t.toUpperCase() + '</span>', response: {text: t} }))),
          monitor: renderer,
          control: null,
        }
      }
    },
    controller: parameterController({
      parameters: config.parameters,
      conditions: config.options.selectCondition(sets)
    }),
    resources: fontResources
  }
}

