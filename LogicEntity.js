function OrEntity(){
  this.canBeStart = true;
  this.canBeEnd = true;
	this.inputEntities = [];
	this.canAcceptMoreSources = true;
	this.addSource = function(entityToAdd){
		this.inputEntities.push(entityToAdd);
	};
	this.removeSource = function(source){
	  var index = this.inputEntities.indexOf(source);
	  this.inputEntities.splice(index, 1);
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
	this.removeSource = function(source){
	  var index = this.inputEntities.indexOf(source);
	  this.inputEntities.splice(index, 1);
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

function XorEntity(){
  this.canBeStart = true;
  this.canBeEnd = true;
	this.inputEntities = [];
	this.canAcceptMoreSources = true;
	this.addSource = function(entityToAdd){
		this.inputEntities.push(entityToAdd);
		if(this.inputEntities.length > 1){
		  this.canAcceptMoreSources = false;
		}
	};
	this.removeSource = function(source){
	  var index = this.inputEntities.indexOf(source);
	  this.inputEntities.splice(index, 1);
	  this.canAcceptMoreSources = true;
	};
	this.outputValue = function(){
	  if(this.inputEntities.length < 2) return undefined;
		var res = this.inputEntities[0].outputValue() ^ this.inputEntities[1].outputValue();
		return res;
	};
}
function NotEntity(){
  this.canBeStart = true;
  this.canBeEnd = true;
	this.source = undefined;
	this.canAcceptMoreSources = true;
	this.addSource = function(entityToSet){
		this.source = entityToSet;
		this.canAcceptMoreSources = false;
	};
	this.removeSource = function(source){ // FIXME add assertion here that this.source === source
	  this.source = undefined;
	  this.canAcceptMoreSources = true;
	};
	this.outputValue = function(){
	  if(this.source === undefined) return undefined;
	  var result = this.source.outputValue();
	  return result === undefined ? undefined : !result;
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
	this.removeSource = function(source){ // FIXME add assertion here that this.source === source
	  this.source = undefined;
	  this.canAcceptMoreSources = true;
	};
	
	this.outputValue = function(){
	  if(this.source === undefined) return undefined;
	  return this.source.outputValue();
	};
}