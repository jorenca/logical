var ENTITY_ICON = {};
ENTITY_ICON['and'] = 20;
ENTITY_ICON['or'] = 21;
ENTITY_ICON['not'] = 22;
ENTITY_ICON['xor'] = 23;

ENTITY_ICON['ctrue'] = 9;
ENTITY_ICON['cfalse'] = 10;
ENTITY_ICON['result'] = 30;

var LOGIC_ENTITY_CLASS = {};
LOGIC_ENTITY_CLASS['and'] = AndEntity;
LOGIC_ENTITY_CLASS['or'] = OrEntity;

LOGIC_ENTITY_CLASS['ctrue'] = TrueEntity;
LOGIC_ENTITY_CLASS['cfalse'] = FalseEntity;
LOGIC_ENTITY_CLASS['result'] = ResultEntity;


var ALL_RESULT_ENTITIES = [];
var RESULT_ENTITY_UNDEFINED_SPRITE = 30;
var RESULT_ENTITY_TRUE_SPRITE = 31;
var RESULT_ENTITY_FALSE_SPRITE = 32;
function refreshResultEntities(){
  console.log("Refreshing result sprites...");
  for(var i=0; i<ALL_RESULT_ENTITIES.length; i++){
    var resultEntity = ALL_RESULT_ENTITIES[i];
	  var newValue = resultEntity.logicEntity.outputValue();
	  var newSpriteId = (newValue === undefined) ? RESULT_ENTITY_UNDEFINED_SPRITE : (newValue ? RESULT_ENTITY_TRUE_SPRITE : RESULT_ENTITY_FALSE_SPRITE);
	  resultEntity.drawableEntity.changeSpriteTo(newSpriteId);
  }
}

var CURR_UNIQ_ID = 0;
function GraphicEntity(x, y, logicEntity){
  this.uniqueId = CURR_UNIQ_ID++;
	this.logicEntity = new LOGIC_ENTITY_CLASS[logicEntity]();
	this.drawableEntity = new DrawableEntity(x, y, ENTITY_ICON[logicEntity], this);
	
  this.attachedSrc = {};
  this.attachedDst = {};
  
  if(logicEntity == 'result'){
    ALL_RESULT_ENTITIES.push(this);
  }
	

  // Movement action
	this.moveDelta = function(dX, dY){
		this.drawableEntity.moveDelta(dX, dY);
	};
	
	// Attaching function
	this.startAttach = function(){
	  var startLogic =  this.logicEntity;
	  if(!startLogic.canBeStart){
	    alert("This node cannot be a connection startpoint.");
	    ACTMAN.resetAction();
	    return;
	  }
	  var actionEnd = [CONNECTION_END[0], this];
	  ACTMAN.currentAction = actionEnd;
	};
	
	// Accomplishing attachment function
	this.endAttach = function(startEntity){
	  ACTMAN.resetAction();
	  
	  if(startEntity === this){
	    alert("Cannot attach to self.");
	    return;
	  }
	  var endEntity = this;
	  if(!endEntity.logicEntity.canBeEnd){
	    alert("This node cannot be a connection endpoint.");
	    return;
	  }
	  
	  if(!endEntity.logicEntity.canAcceptMoreSources){
	    alert("This node cannot accept any more logic sources.");
	    return;
	  }
	  
	  if(endEntity in startEntity.attachedDst){// FIXME remove debug output
	    console.log("Between "); console.log(startEntity); console.log(this);
	    alert("Such a connection already exists.");
	    return;
	  }
	  
	  startEntity.beSourceFor(endEntity);
	  endEntity.beSourcedBy(startEntity);
	  
	  
	  console.log("Attaching end");
	  // renew status tiles
	  refreshResultEntities();
	};
	
	
	this.evalLogic = function(){
	  alert(this.logicEntity.outputValue());
	};
	
	this.beSourceFor = function(endEntity){
	  this.attachedDst[endEntity.uniqueId] = true;
	  this.drawableEntity.attachTo(endEntity.drawableEntity);
	};
	this.beSourcedBy = function(sourceEntity){
	  this.attachedSrc[sourceEntity.uniqueId] = true;
	  this.logicEntity.addSource(sourceEntity.logicEntity);
	};
}

function DrawableEntity(x, y, spriteFrame, listener){
  this.graphics = PIXI.Sprite.fromFrame(spriteFrame);
	this.graphics.hitArea = this.graphics.getBounds();
	this.graphics.interactive = true;
	this.graphics.position.x = x;
	this.graphics.position.y = y;
	stage.addChild(this.graphics);
	
	this.moveDelta = function(dX, dY){
	  this.graphics.x += dX;
		this.graphics.y += dY;
		
		for(var i = 0; i < this.linesTo.length; i++) {
		  var line = this.linesTo[i];
		  line.refresh();
    }
	};
	
	this.graphics.gEntity = listener;
	this.graphics.click = function(){
		var action = ACTMAN.currentAction;
		console.log("Action to execute: ");
		console.log(action);
		//this.tint = 0x888888;
		this.gEntity[action[0]](action[1], action[2]);
	};
	
	
	this.linesTo = [];
	this.attachTo = function(otherDrawable){
	  var newLine = new Line(this, otherDrawable);
	  this.linesTo.push(newLine);
	  otherDrawable.linesTo.push(newLine);
	};
	
	this.changeSpriteTo = function(spriteIndex){
	  var oldGraphics = this.graphics;
	  this.graphics = PIXI.Sprite.fromFrame(spriteIndex);
	  this.graphics.hitArea = this.graphics.getBounds();
	  this.graphics.interactive = true;
	  this.graphics.position.x = oldGraphics.position.x;
	  this.graphics.position.y = oldGraphics.position.y;
	  this.graphics.gEntity = oldGraphics.gEntity;
	  this.graphics.click = oldGraphics.click;
	  
	  stage.removeChild(oldGraphics);
	  stage.addChild(this.graphics);
	};
}

function Line(fromEntity, toEntity){
  this.from = fromEntity;
  this.to = toEntity;
  this.graphics = undefined;
 
 console.log("Creating connection:"); console.log(this.from); console.log(this.to);
 
  this.destroy = function(){
    stage.removeChild(graphics);
  };
  
  this.refresh = function(){
    if(this.graphics !== undefined){
      stage.removeChild(this.graphics);
    }
    this.graphics = new PIXI.Graphics();
    this.graphics.lineStyle(10, 0x222222, 1);
    this.graphics.moveTo(this.from.graphics.position.x+60, this.from.graphics.position.y+32);
    this.graphics.lineTo(this.to.graphics.position.x+4, this.to.graphics.position.y+32);
    stage.addChild(this.graphics);
  };
  
  this.refresh();
}


