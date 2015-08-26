var NO_ACTION = ['moveDelta', 0, 0];
var MOV_LEFT = ['moveDelta', -90, 0];
var MOV_RIGHT = ['moveDelta', 90, 0];
var MOV_UP = ['moveDelta', 0, -90];
var MOV_DOWN = ['moveDelta', 0, 90];

var CREATE_AND = ['createEntity', 'and'];
var CREATE_OR = ['createEntity', 'or'];
var CREATE_NOT = ['createEntity', 'not'];
var CREATE_XOR = ['createEntity', 'xor'];
var CREATE_TRUE = ['createEntity', 'ctrue'];
var CREATE_FALSE = ['createEntity', 'cfalse'];
var CREATE_RESULT = ['createEntity', 'result'];

var CONNECTION_BEGIN = ['startAttach'];
var CONNECTION_END = ['endAttach'];
var CONNREMOVAL_BEGIN = ['startDetach'];
var CONNREMOVAL_END = ['endDetach'];

var EVAL = ['evalLogic'];

function ActionsManager(){
  // This variable stores the currently selected action and action parameters
	this.currentAction = NO_ACTION;
	this.resetAction = function(){
	  this.currentAction = NO_ACTION;
	};
	
	// This method is invoked in the main file to load all option buttons
	this.buttonSprites = function(){
		var sprites = [];
		
		sprites.push(makeModificator(0, 0, 0, MOV_LEFT, false));
		sprites.push(makeModificator(1, 0, 1, MOV_RIGHT, false));
		sprites.push(makeModificator(2, 0, 2, MOV_UP, false));
		sprites.push(makeModificator(3, 0, 3, MOV_DOWN, false));
		
		
		sprites.push(makeModificator(4, 0, 4, CREATE_AND, true));
		sprites.push(makeModificator(5, 0, 5, CREATE_OR, true));
		sprites.push(makeModificator(6, 0, 6, CREATE_NOT, true));
		sprites.push(makeModificator(7, 0, 7, CREATE_XOR, true));
		sprites.push(makeModificator(9, 1, 0, CREATE_TRUE, true));
		sprites.push(makeModificator(10, 1, 1, CREATE_FALSE, true));
		sprites.push(makeModificator(12, 1, 2, CREATE_RESULT, true));
		
		
		sprites.push(makeModificator(8, 0, 8, CONNECTION_BEGIN, false));
		sprites.push(makeModificator(13, 1, 8, CONNREMOVAL_BEGIN, false));
		
		
		sprites.push(makeModificator(11, 1, 3, EVAL, false));
		
		return sprites;
	};
	
	// This method should be triggered by action buttons
	this.runAction = function(){
	  var action = ACTMAN.currentAction;
	  switch(action[0]){
	    case 'createEntity':
	      console.log("Creating new entity...");
	      var ent = new GraphicEntity(200, 200, action[1]);
	      break;
	    default: 
	      console.log("Unknown action was supplied: "+action[0]);
	      break;
	  }
	  if(action == ACTMAN.currentAction){
	    ACTMAN.currentAction = NO_ACTION;
	  }
	};
}

function makeModificator(index, col, row, action, activating){
	var button = getButton(index, col, row);
	button.click = function(){
	  ACTMAN.currentAction = action;
	  if(activating){
	    ACTMAN.runAction();
	  }
	};
	return button;
}

// index is the sprite index
function getButton(index, col, row){
  var button = PIXI.Sprite.fromFrame(index);
	button.buttonMode = true;
	button.anchor.set(0.5);
	button.position.x = 45+col*70;
	button.position.y = 45+row*70;
	button.interactive = true;
	return button;
}