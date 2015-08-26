function OrEntity(){
  this.canBeStart = true;
  this.canBeEnd = true;
	this.inputEntities = [];
	this.canAcceptMoreSources = true;
	this.addSource = function(entityToAdd){
		this.inputEntities.push(entityToAdd);
	};
	this.outputValue = function(){
	  if(this.inputEntities.length === 0) return undefined;
		var res = false;
		for	(var i = 0; i < this.inputEntities.length; i++) {
			res = res || this.inputEntities[i].outputValue();
		}
		return res;
	};
}

function AndEntity(){
  this.canBeStart = true;
  this.canBeEnd = true;
	this.inputEntities = [];
	this.canAcceptMoreSources = true;
	this.addSource = function(entityToAdd){
		this.inputEntities.push(entityToAdd);
	};
	this.outputValue = function(){
	  if(this.inputEntities.length === 0) return undefined;
		var res = true;
		for	(var i = 0; i < this.inputEntities.length; i++) {
			res = res && this.inputEntities[i].outputValue();
		}
		return res;
	};
}


function TrueEntity(){
  this.canBeStart = true;
  this.canBeEnd = false;
	this.outputValue = function(){ return true; };
}
function FalseEntity(){
  this.canBeStart = true;
  this.canBeEnd = false;
  this.canAcceptMoreSources = true;
	this.outputValue = function(){ return false; };
}


function ResultEntity(){
  this.canBeStart = true;
  this.canBeEnd = true;
  this.canAcceptMoreSources = true;
  this.source = undefined;
  this.addSource = function(entityToSet){
		this.source = entityToSet;
		this.canAcceptMoreSources = false;
	};
	
	this.outputValue = function(){
	  if(this.source === undefined) return undefined;
	  return this.source.outputValue();
	};
}