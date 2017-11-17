'use strict';var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break;}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"])_i["return"]();}finally{if(_d)throw _e;}}return _arr;}return function(arr,i){if(Array.isArray(arr)){return arr;}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i);}else{throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _get=function get(object,property,receiver){if(object===null)object=Function.prototype;var desc=Object.getOwnPropertyDescriptor(object,property);if(desc===undefined){var parent=Object.getPrototypeOf(object);if(parent===null){return undefined;}else{return get(parent,property,receiver);}}else if("value"in desc){return desc.value;}else{var getter=desc.get;if(getter===undefined){return undefined;}return getter.call(receiver);}};var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var CSS=function(){function CSS(name,item){_classCallCheck(this,CSS);this.getSVGString=function(board){var str,pos,style,defs,value,filter,z;str="{";for(style in this.css){if(!this.css.hasOwnProperty(style)){continue;}if(style==="border"){pos=this.css[style].indexOf(" ");str=str+"stroke-width: "+this.css[style].substring(0,pos)+";";pos=this.css[style].indexOf(" ",pos+1);str=str+"stroke:"+this.css[style].substring(pos)+";";}else if(style==="background-color"){str=str+"fill: "+this.css[style]+";";}else if(style==="background"){value=CSS.getSubstring(this.css[style],"linear-gradient","(",")",",");if(value.length>0){defs=CSS.getDefs(board);if(value[0]==="45deg"){pos=1;filter=util.create({tag:"linearGradient","id":this.name,x1:"0%",x2:"100%",y1:"100%",y2:"0%"});}else{filter=util.create({tag:"linearGradient","id":this.name,x1:"0%",x2:"0%",y1:"100%",y2:"0%"});pos=0;}defs.appendChild(filter);while(pos<value.length){value[pos]=value[pos].trim();z=value[pos].lastIndexOf(" ");filter.appendChild(util.create({tag:"stop","offset":value[pos].substring(z+1),style:{"stop-color":value[pos].substring(0,z)}}));pos+=1;}str=str+"fill: url(#"+this.name+");";continue;}str=str+style+": "+this.css[style]+";";}else{str=str+style+": "+this.css[style]+";";}}str=str+"}";return str;};var i,value,border,prop,el;this.name=name;this.css={};if(!item){return;}el=window.getComputedStyle(item,null);border=el.getPropertyValue("border");for(i in el){prop=i;value=el.getPropertyValue(prop);if(value&&value!==""){if(border){if(prop==="border-bottom"||prop==="border-right"||prop==="border-top"||prop==="border-left"){if(value!==border){this.css[prop]=value;}}else if(prop==="border-color"||prop==="border-bottom-color"||prop==="border-right-color"||prop==="border-top-color"||prop==="border-left-color"){if(border.substring(border.length-value.length)!==value){this.css[prop]=value;}}else if(prop==="border-width"){if(border.substring(0,value.length)!==value){this.css[prop]=value;}}else{this.css[prop]=value;}}else{this.css[prop]=value;}}}}_createClass(CSS,[{key:"add",value:function add(key,value){this.css[key]=value;}},{key:"get",value:function get(key){var i;for(i in this.css){if(i===key){return this.css[key];}}return null;}},{key:"getNumber",value:function getNumber(key){return parseInt((this.get(key)||"0").replace("px",""),10);}}],[{key:"getDefs",value:function getDefs(board){var defs;if(board.getElementsByTagName("defs").length<1){defs=util.create({tag:"defs"});board.insertBefore(defs,board.childNodes[0]);}else{defs=board.getElementsByTagName("defs")[0];}return defs;}},{key:"getSubstring",value:function getSubstring(str,search,startChar,endChar,splitter){var pos,end,count=0,array=[];pos=str.indexOf(search);if(pos>0){end=str.indexOf(startChar,pos);pos=end+1;if(end>0){while(end<str.length){if(str.charAt(end)===startChar){count+=1;}if(str.charAt(end)===endChar){count-=1;if(count===0){if(splitter&&pos!==end){array.push(str.substring(pos,end).trim());}break;}}if(str.charAt(end)===splitter&&count===1){array.push(str.substring(pos,end).trim());pos=end+1;}end+=1;}if(splitter){return array;}return str.substring(pos,end);}return str.substring(pos);}return"";}},{key:"addStyle",value:function addStyle(board,styleName){var defs,style,css;if(styleName.baseVal||styleName.baseVal===""){styleName=styleName.baseVal;}if(!styleName){return;}defs=CSS.getDefs(board);if(defs.getElementsByTagName("style").length>0){style=defs.getElementsByTagName("style")[0];}else{style=util.create({tag:"style"});style.item={};defs.appendChild(style);}if(!style.item[styleName]){css=util.getStyle(styleName);style.item[styleName]=css;style.innerHTML=style.innerHTML+"\n."+styleName+css.getSVGString(board);}}},{key:"addStyles",value:function addStyles(board,item){if(!item){return;}var items,i,className=item.className;if(className){if(className.baseVal||className.baseVal===""){className=className.baseVal;}}if(className){items=className.split(" ");for(i=0;i<items.length;i+=1){CSS.addStyle(board,items[i].trim());}}for(i=0;i<item.childNodes.length;i+=1){this.addStyles(board,item.childNodes[i]);}}}]);return CSS;}();var util=function(){function util(){_classCallCheck(this,util);}_createClass(util,null,[{key:"getRandomInt",value:function getRandomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}},{key:"createShape",value:function createShape(attrs){var xmlns=attrs.xmlns||'http://www.w3.org/2000/svg';var shape=document.createElementNS(xmlns,attrs.tag);for(var attr in attrs){if(attr!=='tag'){shape.setAttribute(attr,attrs[attr]);}}return shape;}},{key:"toPascalCase",value:function toPascalCase(value){value=value.charAt(0).toUpperCase()+value.substring(1).toLowerCase();return value;}},{key:"isSVG",value:function isSVG(tag){var i=void 0,list=['svg','path','polygon','polyline','line','rect','filter','feGaussianBlur','feOffset','feBlend','linearGradient','stop','text','symbol','textPath','defs','fegaussianblur','feoffset','feblend','circle','ellipse','g'];for(i=0;i<list.length;i+=1){if(list[i]===tag){return true;}}return false;}},{key:"create",value:function create(node){var style=void 0,item=void 0,xmlns=void 0,key=void 0,tag=void 0,k=void 0;if(document.createElementNS&&(this.isSVG(node.tag)||node.xmlns)){if(node.xmlns){xmlns=node.xmlns;}else{xmlns='http://www.w3.org/2000/svg';}if(node.tag==='img'&&xmlns){item=document.createElementNS(xmlns,'image');item.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');item.setAttributeNS('http://www.w3.org/1999/xlink','href',node.src);}else{item=document.createElementNS(xmlns,node.tag);}}else{item=document.createElement(node.tag);}tag=node.tag.toLowerCase();for(key in node){if(!node.hasOwnProperty(key)){continue;}k=key.toLowerCase();if(node[key]===null){continue;}if(k==='tag'||k.charAt(0)==='$'||k==='model'){continue;}if(k.charAt(0)==='#'){item[k.substring(1)]=node[key];continue;}if(k==='rotate'){item.setAttribute('transform','rotate('+node[key]+','+node.model.x+','+node.model.y+')');continue;}if(k==='value'){if(!node[key]){continue;}if(tag!=='input'){if(tag==='text'){item.appendChild(document.createTextNode(node[key]));}else{item.innerHTML=node[key];}}else{item[key]=node[key];}continue;}if(k.indexOf('on')===0){this.bind(item,k.substring(2),node[key]);continue;}if(k.indexOf('-')>=0){item.style[key]=node[key];}else{if(k==='style'&&_typeof(node[key])==='object'){for(style in node[key]){if(!node[key].hasOwnProperty(style)){continue;}if(node[key][style]){if('transform'===style){item.style.transform=node[key][style];item.style.msTransform=item.style.MozTransform=item.style.WebkitTransform=item.style.OTransform=node[key][style];}else{item.style[style]=node[key][style];}}}}else{item.setAttribute(key,node[key]);}}}if(node.$parent){node.$parent.appendChild(item);}if(node.model){item.model=node.model;}return item;}},{key:"setSize",value:function setSize(item,width,height){var value=void 0;value=util.getValue(width);item.setAttribute("width",value);item.style.width=Math.ceil(value);value=util.getValue(height);item.setAttribute("height",value);item.style.height=Math.ceil(value);}},{key:"setPos",value:function setPos(item,x,y){if(item.x&&item.x.baseVal){item.style.left=x+"px";item.style.top=y+"px";}else{item.x=x;item.y=y;}}},{key:"getValue",value:function getValue(value){return parseInt(("0"+value).replace("px",""),10);}},{key:"isIE",value:function isIE(){return document.all&&!window["opera"];}},{key:"isFireFox",value:function isFireFox(){return navigator.userAgent.toLowerCase().indexOf('firefox')>-1;}},{key:"isOpera",value:function isOpera(){return navigator.userAgent.indexOf("Opera")>-1;}},{key:"getEventX",value:function getEventX(event){return this.isIE?window.event["clientX"]:event.pageX;}},{key:"getEventY",value:function getEventY(event){return this.isIE?window.event["clientY"]:event.pageY;}},{key:"getNumber",value:function getNumber(str){return parseInt((str||"0").replace("px",""),10);}},{key:"getStyle",value:function getStyle(styleProp){var i,style,diff,current,ref,el=document.createElement("div"),css;document.body.appendChild(el);css=new CSS(styleProp);ref=new CSS(styleProp,el).css;style=window.getComputedStyle(el,null);el.className=styleProp;current=new CSS(styleProp,el).css;diff=util.getNumber(style.getPropertyValue("border-width"));for(i in current){if(!current.hasOwnProperty(i)){continue;}if(i==="width"||i==="height"){if(util.getNumber(current[i])!==0&&util.getNumber(current[i])+diff*2!==util.getNumber(ref[i])){css.add(i,current[i]);}}else if(current[i]!==ref[i]){css.add(i,current[i]);}}document.body.removeChild(el);return css;}},{key:"sizeOf",value:function sizeOf(item,model,node){var board,rect,root;if(!item){return;}root=model.getRoot();board=root.$gui;if(board.tagName==="svg"){if(typeof item==='string'){item=util.create({tag:"text",$font:true,value:item});item.setAttribute("width","5px");}}else if(typeof item==='string'){item=document.createTextNode(item);}board.appendChild(item);rect=item.getBoundingClientRect();board.removeChild(item);if(node){if(node.getSize().isEmpty()){node.withSize(Math.ceil(rect.width),Math.ceil(rect.height));}}return rect;}},{key:"getColor",value:function getColor(style,defaultColor){if(style){if(style.toLowerCase()==="create"){return"#008000";}if(style.toLowerCase()==="nac"){return"#FE3E3E";}if(style.indexOf("#")===0){return style;}}if(defaultColor){return defaultColor;}return"#000";}},{key:"toJson",value:function toJson(ref){var result={};return util.copy(result,ref,false,false);}},{key:"copy",value:function copy(ref,src,full,replace){if(src){var _i=void 0;for(_i in src){if(!src.hasOwnProperty(_i)||typeof src[_i]==="function"){continue;}if(_i.charAt(0)==="$"){if(full){ref[_i]=src[_i];}continue;}if(_typeof(src[_i])==="object"){if(replace){ref[_i]=src[_i];continue;}if(!ref[_i]){if(src[_i]instanceof Array){ref[_i]=[];}else{ref[_i]={};}}util.copy(ref[_i],src[_i],full,false);}else{if(src[_i]===""){continue;}ref[_i]=src[_i];}}if(src.width){ref.$startWidth=src.width;}if(src.height){ref.$startHeight=src.height;}}return ref;}},{key:"Range",value:function Range(min,max,x,y){max.x=Math.max(max.x,x);max.y=Math.max(max.y,y);min.x=Math.min(min.x,x);min.y=Math.min(min.y,y);}},{key:"getPosition",value:function getPosition(m,n,entity,refCenter){var t=void 0,p=[],list=void 0,distance=[],min=999999999,position=void 0,i=void 0,step=15;var pos=entity.getPos();var size=entity.getSize();list=[Point.LEFT,Point.RIGHT];for(i=0;i<2;i+=1){t=this.getLRPosition(m,n,entity,list[i]);if(t.y>=pos.y&&t.y<=pos.y+size.y+1){t.y+=entity["$"+list[i]]*step;if(t.y>pos.y+size.y){t=util.getUDPosition(m,n,entity,Point.DOWN,step);}p.push(t);distance.push(Math.sqrt((refCenter.x-t.x)*(refCenter.x-t.x)+(refCenter.y-t.y)*(refCenter.y-t.y)));}}list=[Point.UP,Point.DOWN];for(i=0;i<2;i+=1){t=util.getUDPosition(m,n,entity,list[i]);if(t.x>=pos.x&&t.x<=pos.x+size.x+1){t.x+=entity["$"+list[i]]*step;if(t.x>pos.x+size.x){t=this.getLRPosition(m,n,entity,Point.RIGHT,step);}p.push(t);distance.push(Math.sqrt((refCenter.x-t.x)*(refCenter.x-t.x)+(refCenter.y-t.y)*(refCenter.y-t.y)));}}for(i=0;i<p.length;i+=1){if(distance[i]<min){min=distance[i];position=p[i];}}return position;}},{key:"getUDPosition",value:function getUDPosition(m,n,e,p,step){var pos=e.getPos();var size=e.getSize();var x=void 0,y=pos.y;if(p===Point.DOWN){y+=size.y;}x=(y-n)/m;if(step){x+=e["$"+p]*step;if(x<pos.x){x=pos.x;}else if(x>pos.x+size.x){x=pos.x+size.x;}}return new Point(x,y,p);}},{key:"getLRPosition",value:function getLRPosition(m,n,e,p,step){var pos=e.getPos();var size=e.getSize();var y=void 0,x=pos.x;if(p===Point.RIGHT){x+=size.x;}y=m*x+n;if(step){y+=e["$"+p]*step;if(y<pos.y){y=pos.y;}else if(y>pos.y+size.y){y=pos.y+size.y;}}return new Point(x,y,p);}}]);return util;}();var EventListener=function(){function EventListener(){_classCallCheck(this,EventListener);}_createClass(EventListener,[{key:"update",value:function update(event){this.onUpdate(event);}},{key:"onUpdate",get:function get(){return this._onUpdate;},set:function set(value){this._onUpdate=value;}}]);return EventListener;}();var Control=function(){function Control(owner){_classCallCheck(this,Control);this.closed=false;this.$owner=owner;}_createClass(Control,[{key:"createEventListener",value:function createEventListener(){return new EventListener();}},{key:"getRoot",value:function getRoot(){if(this.$owner){return this.$owner.getRoot();}return this;}},{key:"initControl",value:function initControl(data){}},{key:"getItem",value:function getItem(id){return null;}},{key:"hasItem",value:function hasItem(id){return false;}},{key:"setValue",value:function setValue(object,attribute,value){return false;}},{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){}},{key:"getId",value:function getId(){return this.id;}},{key:"load",value:function load(json){}},{key:"addItem",value:function addItem(source,entity){if(entity){if(!this.property||this.property===entity.property){entity.addListener(this);this.entity=entity;}}}},{key:"setProperty",value:function setProperty(property){if(!this.property){return;}var objId=property.split(".")[0];var object=this.$owner.getItem(objId);this.property=property;this.$lastProperty=null;if(this.entity){this.entity.removeListener(this);}if(object){object.addListener(this);this.entity=object;this.updateElement(object.values[this.lastProperty]);}}},{key:"updateElement",value:function updateElement(value){}},{key:"addListener",value:function addListener(eventListener){if(!this.eventListener){this.eventListener=new Set();}this.eventListener.add(eventListener);}},{key:"registerEvent",value:function registerEvent(eventType){if(!this.eventsToListen){this.eventsToListen=new Set();}if(this.eventsToListen.has(eventType)){return true;}else{this.eventsToListen.add(eventType);this.registerListenerOnHTMLObject(eventType);return true;}}},{key:"registerListenerOnHTMLObject",value:function registerListenerOnHTMLObject(eventType){return false;}},{key:"registerEventListener",value:function registerListener(eventType, htmlElement){var control=this;var listener=function listener(t){t.eventType=eventType;t.id=control.id;control.$owner.fireEvent(t);};htmlElement.addEventListener(eventType,listener);}},{key:"fireEvent",value:function fireEvent(evt){}},{key:"isClosed",value:function isClosed(){return this.closed;}},{key:"getShowed",value:function getShowed(){if(this.isClosed()){return this.$owner.getShowed();}return this;}},{key:"lastProperty",get:function get(){if(!this.property){return"";}if(!this.$lastProperty){var arr=this.property.split(".");this.$lastProperty=arr[arr.length-1];}return this.$lastProperty;}}]);return Control;}();Control.EVENT_CREATED="CREATED";var DiagramElement=function(_Control){_inherits(DiagramElement,_Control);function DiagramElement(owner,type,id){_classCallCheck(this,DiagramElement);var _this=_possibleConstructorReturn(this,(DiagramElement.__proto__||Object.getPrototypeOf(DiagramElement)).call(this,owner));_this.labelHeight=25;_this.labelFontSize=14;_this.attrHeight=20;_this.attrFontSize=12;_this.pos=new Point();_this.size=new Point();_this.isDraggable=true;_this.property=type;_this.id=id;return _this;}_createClass(DiagramElement,[{key:"getPos",value:function getPos(){return this.pos;}},{key:"getSize",value:function getSize(){return this.size;}},{key:"getCenter",value:function getCenter(){var pos=this.getPos();var size=this.getSize();return new Point(pos.x+size.x/2,pos.y+size.y/2);}},{key:"getCenterPosition",value:function getCenterPosition(p){var pos=this.getPos();var size=this.getSize();var offset=this["$"+p];var center=this.getCenter();if(p===Point.DOWN){return new Point(Math.min(center.x+offset,center.x),pos.y+size.y,Point.DOWN);}if(p===Point.UP){return new Point(Math.min(center.x+offset,center.x),pos.y,Point.UP);}if(p===Point.LEFT){return new Point(pos.x,Math.min(center.y+offset,pos.y+size.y),Point.LEFT);}if(p===Point.RIGHT){return new Point(pos.x+size.x,Math.min(center.y+offset,pos.y+size.y),Point.RIGHT);}}},{key:"createShape",value:function createShape(attrs){return util.createShape(attrs);}},{key:"withPos",value:function withPos(x,y){if(x&&y){this.pos=new Point(x,y);}else{if(typeof x!='undefined'){this.pos.x=x;}if(typeof y!='undefined'){this.pos.y=y;}}return this;}},{key:"withSize",value:function withSize(width,height){if(width&&height){this.size=new Point(width,height);}else{if(typeof width!='undefined'){this.size.x=width;}if(typeof height!='undefined'){this.size.y=height;}}return this;}},{key:"getShowed",value:function getShowed(){return _get(DiagramElement.prototype.__proto__||Object.getPrototypeOf(DiagramElement.prototype),"getShowed",this).call(this);}}]);return DiagramElement;}(Control);var Point=function(){function Point(x,y,pos){_classCallCheck(this,Point);this.x=0;this.y=0;this.pos="";this.x=Math.ceil(x||0);this.y=Math.ceil(y||0);this.pos=pos;}_createClass(Point,[{key:"add",value:function add(pos){this.x+=pos.x;this.y+=pos.y;return this;}},{key:"addNum",value:function addNum(x,y){this.x+=x;this.y+=y;return this;}},{key:"sum",value:function sum(pos){var sum=new Point(this.x,this.y);sum.add(pos);return sum;}},{key:"center",value:function center(posA,posB){var count=0;if(posA){this.x+=posA.x;this.y+=posA.y;count++;}if(posB){this.x+=posB.x;this.y+=posB.y;count++;}if(count>0){this.x=this.x/count;this.y=this.y/count;}}},{key:"isEmpty",value:function isEmpty(){return this.x<1&&this.y<1;}},{key:"size",value:function size(posA,posB){var x1=0,x2=0,y1=0,y2=0;if(posA){x1=posA.x;y1=posA.y;}if(posB){x2=posB.x;y2=posB.y;}if(x1>x2){this.x=x1-x2;}else{this.x=x2-x1;}if(y1>y2){this.y=y1-y2;}else{this.y=y2-y1;}}}]);return Point;}();Point.UP="UP";Point.LEFT="LEFT";Point.RIGHT="RIGHT";Point.DOWN="DOWN";var Line=function(_DiagramElement){_inherits(Line,_DiagramElement);function Line(){_classCallCheck(this,Line);return _possibleConstructorReturn(this,(Line.__proto__||Object.getPrototypeOf(Line)).apply(this,arguments));}_createClass(Line,[{key:"init",value:function init(data){}},{key:"getTyp",value:function getTyp(){return"SVG";}},{key:"getPos",value:function getPos(){var pos=new Point();pos.center(this.source,this.target);return pos;}},{key:"getSize",value:function getSize(){var pos=new Point();pos.size(this.source,this.target);return pos;}},{key:"withColor",value:function withColor(color){this.color=color;return this;}},{key:"withSize",value:function withSize(x,y){return this;}},{key:"withPath",value:function withPath(path,close,angle){var i=void 0,d="M"+path[0].x+" "+path[0].y;this.line=Line.FORMAT.PATH;for(i=1;i<path.length;i+=1){d=d+"L "+path[i].x+" "+path[i].y;}if(close){d=d+" Z";this.target=path[0];}else{this.target=path[path.length-1];}this.path=d;if(angle instanceof Number){this.angle=angle;}else if(angle){}return this;}},{key:"getSVG",value:function getSVG(){if(this.line==="PATH"){return util.create({tag:"path","d":this.path,"fill":this.color,stroke:"#000","stroke-width":"1px"});}var line=util.create({tag:"line",'x1':this.source.x,'y1':this.source.y,'x2':this.target.x,'y2':this.target.y,"stroke":util.getColor(this.color)});if(this.line&&this.line.toLowerCase()==="dotted"){line.setAttribute("stroke-miterlimit","4");line.setAttribute("stroke-dasharray","1,1");}return line;}}]);return Line;}(DiagramElement);Line.FORMAT={SOLID:"SOLID",DOTTED:"DOTTED",PATH:"PATH"};var Node=function(_DiagramElement2){_inherits(Node,_DiagramElement2);function Node(parent,id,type){_classCallCheck(this,Node);var _this3=_possibleConstructorReturn(this,(Node.__proto__||Object.getPrototypeOf(Node)).call(this,parent));_this3.edges=[];_this3.maxWidth=250;_this3.$LEFT=0;_this3.$RIGHT=0;_this3.$TOP=0;_this3.$DOWN=0;_this3.withSize(150,70);_this3.property=type||'Node';_this3.id=id;_this3.edges=[];return _this3;}_createClass(Node,[{key:"init",value:function init(data){if(data['x']&&data['y']){this.withPos(data['x'],data['y']);}if(data['width']||data['height']){this.withSize(data['width'],data['height']);}if(data['label']){this.label=data['label'];}return this;}},{key:"getSVG",value:function getSVG(){var pos=this.getPos();var size=this.getSize();var attr={tag:'rect',x:pos.x-size.x/2,y:pos.y-size.y/2,rx:4,ry:4,height:size.y,width:size.x,style:'fill:white;stroke:black;stroke-width:2'};var shape=this.createShape(attr);var attrText={tag:'text',x:pos.x,y:pos.y,'text-anchor':'middle','alignment-baseline':'middle','font-family':'Verdana','font-size':'14',fill:'black'};var text=this.createShape(attrText);text.textContent=this.id;var group=this.createShape({tag:'g',id:this.id});group.appendChild(shape);group.appendChild(text);return group;}},{key:"redrawEdges",value:function redrawEdges(){var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=this.edges[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){var edge=_step.value;edge.redraw();}}catch(err){_didIteratorError=true;_iteratorError=err;}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return();}}finally{if(_didIteratorError){throw _iteratorError;}}}}}]);return Node;}(DiagramElement);var Clazz=function(_Node){_inherits(Clazz,_Node);function Clazz(owner,id,type){_classCallCheck(this,Clazz);var _this4=_possibleConstructorReturn(this,(Clazz.__proto__||Object.getPrototypeOf(Clazz)).call(this,owner,id,type));_this4.attributes=[];_this4.methods=[];_this4.padding=10;_this4.getSize().y=_this4.labelHeight+_this4.padding*2;return _this4;}_createClass(Clazz,[{key:"init",value:function init(json){this.label=json.name||json.label||'New '+this.property;this.style=json.style||"flat";if(json['attributes']){var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=json['attributes'][Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){var attr=_step2.value;this.attributes.push(attr);this.getSize().y+=this.attrHeight;}}catch(err){_didIteratorError2=true;_iteratorError2=err;}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return();}}finally{if(_didIteratorError2){throw _iteratorError2;}}}}if(json['methods']){var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=json['methods'][Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){var method=_step3.value;this.methods.push(method);this.getSize().y+=this.attrHeight;}}catch(err){_didIteratorError3=true;_iteratorError3=err;}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return();}}finally{if(_didIteratorError3){throw _iteratorError3;}}}}return this;}},{key:"getModernStyle",value:function getModernStyle(){var width=void 0,height=void 0,id=void 0,size=void 0,z=void 0,item=void 0,rect=void 0,g=void 0,board=void 0,styleHeader=void 0,headerHeight=void 0,x=void 0,y=void 0;board=this.getRoot()["board"];styleHeader=util.getStyle("ClazzHeader");headerHeight=styleHeader.getNumber("height");width=0;height=10+headerHeight;if(this.property==="Object"||this.getRoot()["model"].getType().toLowerCase()==="objectdiagram"){id=this.id.charAt(0).toLowerCase()+this.id.slice(1);item="Object";}else{id=this.id;item="Clazz";if(this.counter){id+=" ("+this.counter+")";}}g=util.create({tag:"g",model:this});size=util.sizeOf(id,this);width=Math.max(width,size.width);if(this.attributes&&this.attributes.length>0){height=height+this.attributes.length*25;for(z=0;z<this.attributes.length;z+=1){width=Math.max(width,util.sizeOf(this.attributes[z],this).width);}}else{height+=20;}if(this.methods&&this.methods.length>0){height=height+this.methods.length*25;for(z=0;z<this.methods.length;z+=1){width=Math.max(width,util.sizeOf(this.methods[z],this).width);}}width+=20;var pos=this.getPos();y=pos.y;x=pos.x;rect={tag:"rect","width":width,"height":height,"x":x,"y":y,"class":item+" draggable","fill":"none"};g.appendChild(util.create(rect));g.appendChild(util.create({tag:"rect",rx:0,"x":x,"y":y,height:headerHeight,"width":width,"class":"ClazzHeader"}));item=util.create({tag:"text",$font:true,"class":"InfoText","text-anchor":"right","x":x+width/2-size.width/2,"y":y+headerHeight/2+size.height/2,"width":size.width});if(this.property==="Object"||this.getRoot()["model"].type.toLowerCase()==="objectdiagram"){item.setAttribute("text-decoration","underline");}item.appendChild(document.createTextNode(id));g.appendChild(item);g.appendChild(util.create({tag:"line",x1:x,y1:y+headerHeight,x2:x+width,y2:y+headerHeight,stroke:"#000"}));y+=headerHeight+20;if(this.attributes){for(z=0;z<this.attributes.length;z+=1){g.appendChild(util.create({tag:"text",$font:true,"text-anchor":"left","width":width,"x":x+10,"y":y,value:this.attributes[z]}));y+=20;}if(this.attributes.length>0){y-=10;}}if(this.methods&&this.methods.length>0){g.appendChild(util.create({tag:"line",x1:x,y1:y,x2:x+width,y2:y,stroke:"#000"}));y+=20;for(z=0;z<this.methods.length;z+=1){g.appendChild(util.create({tag:"text",$font:true,"text-anchor":"left","width":width,"x":x+10,"y":y,value:this.methods[z]}));y+=20;}}return g;}},{key:"getCanvas",value:function getCanvas(){return null;}},{key:"getSVG",value:function getSVG(){var pos=this.getPos();if(this.style=="modern"){return this.getModernStyle();}var attrNode={tag:'rect',x:pos.x-this.getSize().x/2,y:pos.y-this.getSize().y/2,height:this.getSize().y,width:this.getSize().x,rx:1,ry:1,style:'fill:white;stroke:black;stroke-width:2'};var nodeShape=this.createShape(attrNode);var contentHeight=this.padding+this.attrHeight*this.attributes.length;var attrContent={tag:'rect',x:pos.x-this.getSize().x/2,y:pos.y-this.getSize().y/2,height:contentHeight,width:this.getSize().x,style:'fill:white;stroke:black;stroke-width:2'};var contentShape=this.createShape(attrContent);var attrLabel={tag:'text',x:pos.x,y:pos.y-this.getSize().y/2+this.labelHeight/2,'text-anchor':'middle','alignment-baseline':'central','font-family':'Verdana','font-size':this.labelFontSize,'font-weight':'bold',fill:'black'};var label=this.createShape(attrLabel);label.textContent=this.label;var group=this.createShape({tag:'g',id:this.id,transform:'translate(0 0)'});group.appendChild(nodeShape);group.appendChild(contentShape);group.appendChild(label);if(this.attributes.length>0){var _y=pos.y-this.getSize().y/2+this.labelHeight+this.attrHeight/2+this.padding/2;var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=this.attributes[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){var element=_step4.value;var attrText={tag:'text',x:pos.x-this.getSize().x/2+this.padding/2,y:_y,'text-anchor':'start','alignment-baseline':'middle','font-family':'Verdana','font-size':this.attrFontSize,fill:'black'};var text=this.createShape(attrText);text.textContent=element;group.appendChild(text);_y+=this.attrHeight;}}catch(err){_didIteratorError4=true;_iteratorError4=err;}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return();}}finally{if(_didIteratorError4){throw _iteratorError4;}}}}var height=this.attributes.length*this.attrHeight;var y=pos.y-this.getSize().y/2+this.labelHeight+height+this.attrHeight/2+this.padding/2;if(this.methods.length>0){y+=this.attrHeight/2;var _iteratorNormalCompletion5=true;var _didIteratorError5=false;var _iteratorError5=undefined;try{for(var _iterator5=this.methods[Symbol.iterator](),_step5;!(_iteratorNormalCompletion5=(_step5=_iterator5.next()).done);_iteratorNormalCompletion5=true){var _element=_step5.value;var _attrText={tag:'text',x:pos.x-this.getSize().x/2+this.padding/2,y:y,'text-anchor':'start','alignment-baseline':'middle','font-family':'Verdana','font-size':this.attrFontSize,fill:'black'};var _text=this.createShape(_attrText);_text.textContent=_element;group.appendChild(_text);y+=this.attrHeight;}}catch(err){_didIteratorError5=true;_iteratorError5=err;}finally{try{if(!_iteratorNormalCompletion5&&_iterator5.return){_iterator5.return();}}finally{if(_didIteratorError5){throw _iteratorError5;}}}}this.$viewElement=group;return group;}},{key:"getPropertyAsString",value:function getPropertyAsString(type){var value='';if(this[type]){var _iteratorNormalCompletion6=true;var _didIteratorError6=false;var _iteratorError6=undefined;try{for(var _iterator6=this[type][Symbol.iterator](),_step6; !(_iteratorNormalCompletion6=(_step6=_iterator6.next()).done); _iteratorNormalCompletion6=true){var property=_step6.value;value+=property+'\n';}}catch(err){_didIteratorError6=true;_iteratorError6=err;}finally{try{if(!_iteratorNormalCompletion6&&_iterator6.return){_iterator6.return();}}finally{if(_didIteratorError6){throw _iteratorError6;}}}}return value;}},{key:"convertStringToProperty",value:function convertStringToProperty(values,type){if(!this[type]){return false;}var properties=values.split(/\r?\n/);var newProperties=[];var _iteratorNormalCompletion7=true;var _didIteratorError7=false;var _iteratorError7=undefined;try{for(var _iterator7=properties[Symbol.iterator](),_step7;!(_iteratorNormalCompletion7=(_step7=_iterator7.next()).done);_iteratorNormalCompletion7=true){var property=_step7.value;if(property&&property.length>0){newProperties.push(property);}}}catch(err){_didIteratorError7=true;_iteratorError7=err;}finally{try{if(!_iteratorNormalCompletion7&&_iterator7.return){_iterator7.return();}}finally{if(_didIteratorError7){throw _iteratorError7;}}}var changed=false;if(this[type].length!==newProperties.length){changed=true;}else{for(var _i2=0;_i2<this[type].length;_i2++){if(!this[type][_i2]||!newProperties[_i2]||this[type][_i2]!==newProperties[_i2]){changed=true;}}}if(changed){this[type]=newProperties;this.getSize().y=this.labelHeight+this.padding*2+(this.attributes.length+this.methods.length)*this.attrHeight;}return changed;}}]);return Clazz;}(Node);var SO=function(_DiagramElement3){_inherits(SO,_DiagramElement3);function SO(owner){_classCallCheck(this,SO);return _possibleConstructorReturn(this,(SO.__proto__||Object.getPrototypeOf(SO)).call(this,owner));}_createClass(SO,[{key:"draw",value:function draw(typ){return null;}},{key:"getEvent",value:function getEvent(){return[];}},{key:"init",value:function init(data){this.property="SO";return this;}},{key:"getSVG",value:function getSVG(){}},{key:"withKeyValue",value:function withKeyValue(key,value){if(key==="typ"){this.property=value;}else if(key==="x"){this.withPos(value,null);}else if(key==="y"){this.withPos(null,value);}else if(key==="width"){this.withSize(value,null);}else if(key==="height"){this.withSize(null,value);}else{this[key]=value;}return this;}},{key:"event",value:function event(source,typ,value){return true;}}],[{key:"create",value:function create(element){var result=new SO(null);for(var key in element){if(element.hasOwnProperty(key)===false){continue;}result.withKeyValue(key,element[key]);}return result;}}]);return SO;}(DiagramElement);var _Symbol=function(_Node2){_inherits(_Symbol,_Node2);function _Symbol(owner,typ){_classCallCheck(this,_Symbol);var _this6=_possibleConstructorReturn(this,(_Symbol.__proto__||Object.getPrototypeOf(_Symbol)).call(this,owner,typ));_this6.$heightMax=0;_this6.$heightMin=0;return _this6;}_createClass(_Symbol,[{key:"draw",value:function draw(typ){return SymbolLibary.draw(this);}}]);return _Symbol;}(Node);var SymbolLibary=function(){function SymbolLibary(){_classCallCheck(this,SymbolLibary);}_createClass(SymbolLibary,null,[{key:"draw",value:function draw(node,parent){var symbol=void 0,fn=this[SymbolLibary.getName(node)];if(typeof fn==="function"){symbol=fn.apply(this,[node]);if(!parent){return SymbolLibary.createGroup(node,symbol);}return SymbolLibary.createGroup(node,symbol);}else if(node.property){symbol=new _Symbol(node,node.property);var pos=node.getPos();var size=node.getSize();symbol.withPos(pos.x,pos.y);symbol.withSize(size.x,size.y);symbol["value"]=node["value"];parent=node["$parent"];return SymbolLibary.draw(symbol,parent);}return null;}},{key:"upFirstChar",value:function upFirstChar(txt){return txt.charAt(0).toUpperCase()+txt.slice(1).toLowerCase();}},{key:"isSymbolName",value:function isSymbolName(typ){var fn=SymbolLibary["draw"+SymbolLibary.upFirstChar(typ)];return typeof fn==="function";}},{key:"isSymbol",value:function isSymbol(node){var fn=SymbolLibary[SymbolLibary.getName(node)];return typeof fn==="function";}},{key:"getName",value:function getName(node){if(node.property){return"draw"+SymbolLibary.upFirstChar(node.property);}if(node["src"]){return"draw"+SymbolLibary.upFirstChar(node["src"]);}return"drawNode";}},{key:"createImage",value:function createImage(node,model){var n=void 0,img=void 0;if(SymbolLibary.isSymbol(node)){return SymbolLibary.draw(null,node);}n={tag:"img",model:node,src:node["src"]};var size=node.getSize();if(size.isEmpty()==false){n.width=size.x;n.height=size.y;}else{n.xmlns="http://www.w3.org/1999/xhtml";}img=util.create(n);if(size.isEmpty()){model.appendImage(img);return null;}return img;}},{key:"createGroup",value:function createGroup(node,group){var func=void 0,y=void 0,yr=void 0,z=void 0,box=void 0,item=void 0,transform=void 0,i=void 0,offsetX=0,offsetY=0;var svg=void 0;if(node.property.toUpperCase()=="HTML"){svg=util.create({tag:"svg",style:{left:group.x+node.getPos().x,top:group.y+node.getPos().y,position:"absolute"}});}else{svg=util.create({tag:"g"});transform="translate("+group.pos.x+" "+group.pos.y+")";if(group.scale){transform+=" scale("+group.scale+")";}if(group.rotate){transform+=" rotate("+group.rotate+")";}svg.setAttribute('transform',transform);}for(i=0;i<group.items.length;i+=1){svg.appendChild(util.create(group.items[i]));}var elements=node["elements"];util.setSize(svg,group.width+node.getSize().x,group.height+node.getSize().y);node["$heightMin"]=node.getSize().y;if(elements){for(i=0;i<elements.length;i+=1){if(!elements[i]&&elements[i].length<1){elements.splice(i,1);i-=1;}}box=util.create({tag:"g"});z=elements.length*25+6;box.appendChild(util.create({tag:"rect",rx:0,x:offsetX,y:offsetY+28,width:60,height:z,stroke:"#000",fill:"#fff",opacity:"0.7"}));node["$heightMax"]=z+node["$heightMin"];svg["elements"]=elements;svg["activ"]=util.create({tag:"text",$font:true,"text-anchor":"left","width":60,"x":10+offsetX,"y":20,value:node["activText"]});svg.appendChild(svg.activ);y=offsetY+46;yr=offsetY+28;func=function func(event){svg.activ.textContent=event.currentTarget.value;};for(z=0;z<elements.length;z+=1){box.appendChild(util.create({tag:"text",$font:true,"text-anchor":"left","width":60,"x":10,"y":y,value:elements[z]}));item=box.appendChild(util.create({tag:"rect",rx:0,x:offsetX,y:yr,width:60,height:24,stroke:"none","class":"SVGChoice"}));item.value=elements[z];if(node["action"]){item.onclick=node["action"];}else{item.onclick=func;}y+=26;yr+=26;}svg.choicebox=box;}svg.tool=node;svg.onclick=function(){if(svg.status==="close"){svg.open();}else{svg.close();}};svg.close=function(){if(svg.status==="open"&&svg.choicebox){this.removeChild(svg.choicebox);}svg.status="close";svg.tool.size.height=svg.tool.heightMin;util.setSize(svg,svg.tool.size.x,svg.tool.size.y);};svg.open=function(){if(this.tagName==="svg"){return;}if(svg.status==="close"&&svg.choicebox){this.appendChild(svg.choicebox);}svg.status="open";svg.tool.size.height=svg.tool.heightMax;util.setSize(svg,svg.tool.width,svg.tool.height);};svg.close();return svg;}},{key:"addChild",value:function addChild(parent,json){var item=void 0;if(json.offsetLeft){item=json;}else{item=util.create(json);}item.setAttribute("class","draggable");parent.appendChild(item);}},{key:"all",value:function all(node){SymbolLibary.drawSmiley(node);SymbolLibary.drawDatabase(node);SymbolLibary.drawLetter(node);SymbolLibary.drawMobilephone(node);SymbolLibary.drawWall(node);SymbolLibary.drawActor(node);SymbolLibary.drawLamp(node);SymbolLibary.drawArrow(node);SymbolLibary.drawButton(node);SymbolLibary.drawDropdown(node);SymbolLibary.drawClassicon(node);SymbolLibary.drawEdgeicon(node);}},{key:"drawSmiley",value:function drawSmiley(node){return SO.create({x:node.getPos().x,y:node.getPos().y,width:50,height:52,items:[{tag:"path",d:"m49.01774,25.64542a24.5001,24.5 0 1 1 -49.0001,0a24.5001,24.5 0 1 1 49.0001,0z",stroke:"black",fill:"none"},{tag:"path",d:"m8,31.5c16,20 32,0.3 32,0.3"},{tag:"path",d:"m19.15,20.32a1.74,2.52 0 1 1 -3.49,0a1.74,2.52 0 1 1 3.49,0z"},{tag:"path",d:"m33,20.32a1.74,2.52 0 1 1 -3.48,0a1.74,2.52 0 1 1 3.48,0z"},{tag:"path",d:"m5.57,31.65c3.39,0.91 4.03,-2.20 4.03,-2.20"},{tag:"path",d:"m43,32c-3,0.91 -4,-2.20 -4.04,-2.20"}]});}},{key:"drawDatabase",value:function drawDatabase(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:25,height:40,items:[{tag:"path",d:"m0,6.26c0,-6.26 25.03,-6.26 25.03,0l0,25.82c0,6.26 -25.03,6.26 -25.03,0l0,-25.82z",stroke:"black",fill:"none"},{tag:"path",d:"m0,6.26c0,4.69 25.03,4.69 25.03,0m-25.03,2.35c0,4.69 25.03,4.69 25.03,0m-25.03,2.35c0,4.69 25.03,4.69 25.03,0",stroke:"black",fill:"none"}]});}},{key:"drawLetter",value:function drawLetter(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:25,height:17,items:[{tag:"path",stroke:"black",fill:"none",d:"m1,1l22,0l0,14l-22,0l0,-14z"},{tag:"path",stroke:"black",fill:"none",d:"m1.06,1.14l10.94,6.81l10.91,-6.91"}]});}},{key:"drawMobilephone",value:function drawMobilephone(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:25,height:50,items:[{tag:"path",d:"m 4.2 0.5 15.61 0c 2 0 3.7 1.65 3.7 3.7l 0 41.6c 0 2-1.65 3.7-3.7 3.7l-15.6 0c-2 0-3.7-1.6-3.7-3.7l 0-41.6c 0-2 1.6-3.7 3.7-3.7z",fill:"none",stroke:"black"},{tag:"path",d:"m 12.5 2.73a 0.5 0.5 0 1 1-1 0 0.5 0.5 0 1 1 1 0z"},{tag:"path",d:"m 14 46a 2 2 0 1 1-4 0 2 2 0 1 1 4 0z"},{tag:"path",d:"m 8 5 7 0"},{tag:"path",d:"m 1.63 7.54 20.73 0 0 34-20.73 0z"}]});}},{key:"drawWall",value:function drawWall(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:25,height:50,items:[{tag:"path",d:"m26,45.44l-5,3.56l-21,-9l0,-36.41l5,-3.56l20.96,9l-0,36.4z"},{tag:"path",stroke:"white",d:"m2.21,11l18.34,7.91m-14.46,-12.57l0,6.3m8.2,21.74l0,6.35m-8.6,-10l0,6.351m4.1,-10.67l0,6.3m4.8,-10.2l0,6.3m-8.87,-10.23l0,6.35m4.78,-10.22l0,6.35m-8,14.5l18.34,7.91m-18.34,-13.91l18.34,7.91m-18.34,-13.91l18.34,7.91m-18.34,-13.91l18.34,7.91m0,-13l0,34m-18.23,-41.84l18.3,8m0,0.11l5,-3.57"}]});}},{key:"drawActor",value:function drawActor(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:25,height:50,items:[{tag:"line",stroke:"#000",x1:"12",y1:"10",x2:"12",y2:"30"},{tag:"circle",stroke:"#000",cy:"5",cx:"12",r:"5"},{tag:"line",stroke:"#000",y2:"18",x2:"25",y1:"18",x1:"0"},{tag:"line",stroke:"#000",y2:"39",x2:"5",y1:"30",x1:"12"},{tag:"line",stroke:"#000",y2:"39",x2:"20",y1:"30",x1:"12"}]});}},{key:"drawLamp",value:function drawLamp(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:25,height:50,items:[{tag:"path",d:"m 22.47 10.58c-6.57 0-11.89 5.17-11.89 11.54 0 2.35 0.74 4.54 2 6.36 2 4 4.36 5.63 4.42 10.4l 11.15 0c 0.12-4.9 2.5-6.8 4.43-10.4 1.39-1.5 1.8-4.5 1.8-6.4 0-6.4-5.3-11.5-11.9-11.5z",fill:"white",stroke:"black"},{tag:"path",d:"m 18.4 40 8 0c 0.58 0 1 0.5 1 1 0 0.6-0.5 1-1 1l-8 0c-0.6 0-1-0.47-1-1 0-0.58 0.47-1 1-1z"},{tag:"path",d:"m 18.4 42.7 8 0c 0.58 0 1 0.47 1 1 0 0.58-0.47 1-1 1l-8 0c-0.58 0-1-0.47-1-1 0-0.58 0.46-1 1-1z"},{tag:"path",d:"m 18.4 45.3 8 0c 0.58 0 1 0.47 1 1 0 0.58-0.47 1-1 1l-8 0c-0.58 0-1-0.47-1-1 0-0.58 0.46-1 1-1z"},{tag:"path",d:"m 19.5 48c 0.37 0.8 1 1.3 1.9 1.7 0.6 0.3 1.5 0.3 2 0 0.8-0.3 1.4-0.8 1.9-1.8z"},{tag:"path",d:"m 6 37.5 4.2-4c 0.3-0.3 0.8-0.3 1 0 0.3 0.3 0.3 0.8 0 1.1l-4.2 4c-0.3 0.3-0.8 0.3-1.1 0-0.3-0.3-0.3-0.8 0-1z"},{tag:"path",d:"m 39 37.56-4.15-4c-0.3-0.3-0.8-0.3-1 0-0.3 0.3-0.3 0.8 0 1l 4.2 4c 0.3 0.3 0.8 0.3 1 0 0.3-0.3 0.3-0.8 0-1z"},{tag:"path",d:"m 38 23 5.8 0c 0.4 0 0.8-0.3 0.8-0.8 0-0.4-0.3-0.8-0.8-0.8l-5.8 0c-0.4 0-0.8 0.3-0.8 0.8 0 0.4 0.3 0.8 0.8 0.8z"},{tag:"path",d:"m 1.3 23 6 0c 0.4 0 0.8-0.3 0.8-0.8 0-0.4-0.3-0.8-0.8-0.8l-5.9 0c-0.4 0-0.8 0.3-0.8 0.8 0 0.4 0.3 0.8 0.8 0.8z"},{tag:"path",d:"m 34.75 11.2 4-4.1c 0.3-0.3 0.3-0.8 0-1-0.3-0.3-0.8-0.3-1 0l-4 4.1c-0.3 0.3-0.3 0.8 0 1 0.3 0.3 0.8 0.3 1 0z"},{tag:"path",d:"m 11.23 10-4-4c-0.3-0.3-0.8-0.3-1 0-0.3 0.3-0.3 0.8 0 1l 4.2 4c 0.3 0.3 0.8 0.3 1 0 0.3-0.3 0.3-0.8 0-1z"},{tag:"path",d:"m 21.64 1.3 0 5.8c 0 0.4 0.3 0.8 0.8 0.8 0.4 0 0.8-0.3 0.8-0.8l 0-5.8c 0-0.4-0.3-0.8-0.8-0.8-0.4 0-0.8 0.3-0.8 0.8z"},{tag:"path",d:"m 26.1 24.3c-0.5 0-1 0.2-1.3 0.4-1.1 0.6-2 3-2.27 3.5-0.26-0.69-1.14-2.9-2.2-3.5-0.7-0.4-2-0.7-2.5 0-0.6 0.8 0.2 2.2 0.9 2.9 1 0.9 3.9 0.9 3.9 0.9 0 0 0 0 0 0 0.54 0 2.8 0 3.7-0.9 0.7-0.7 1.5-2 0.9-2.9-0.2-0.3-0.7-0.4-1.2-0.4z"},{tag:"path",d:"m 22.5 28.57 0 10.7"}]});}},{key:"drawStop",value:function drawStop(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:30,height:30,items:[{tag:"path",fill:"#FFF","stroke-width":"2",stroke:"#B00",d:"m 6,6 a 14,14 0 1 0 0.06,-0.06 z m 0,0 20,21"}]});}},{key:"drawMin",value:function drawMin(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:20,height:20,items:[{tag:"path",fill:"white",stroke:"#000","stroke-width":0.2,"stroke-linejoin":"round",d:"m 0,0 19,0 0,19 -19,0 z"},{tag:"path",fill:"none",stroke:"#000","stroke-width":"1px","stroke-linejoin":"miter",d:"m 4,10 13,-0.04"}]});}},{key:"drawArrow",value:function drawArrow(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:10,height:9,rotate:node["rotate"],items:[{tag:"path",fill:"#000",stroke:"#000",d:"M 0,0 10,4 0,9 z"}]});}},{key:"drawMax",value:function drawMax(node){return SO.create({x:node.getPos().x||0,y:node.getPos().y||0,width:20,height:20,items:[{tag:"path",fill:"white",stroke:"#000","stroke-width":0.2,"stroke-linejoin":"round","stroke-dashoffset":2,"stroke-dasharray":"4.8,4.8",d:"m 0,0 4.91187,0 5.44643,0 9.11886,0 0,19.47716 -19.47716,0 0,-15.88809 z"},{tag:"path",fill:"none",stroke:"#000","stroke-width":"1px","stroke-linejoin":"miter",d:"m 4,10 6,0.006 0.02,5 0.01,-11 -0.03,6.02 c 2,-0.01 4,-0.002 6,0.01"}]});}},{key:"drawButton",value:function drawButton(node){var btnX,btnY,btnWidth,btnHeight,btnValue;btnX=node.getPos().x||0;btnY=node.getPos().y||0;btnWidth=node.getSize().x||60;btnHeight=node.getSize().y||28;btnValue=node["value"]||"";return SO.create({x:btnX,y:btnY,width:60,height:28,items:[{tag:"rect",rx:8,x:0,y:0,width:btnWidth,height:btnHeight,stroke:"#000",filter:"url(#drop-shadow)","class":"SVGBtn"},{tag:"text",$font:true,x:10,y:18,fill:"black",value:btnValue,"class":"hand"}]});}},{key:"drawDropdown",value:function drawDropdown(node){var btnX,btnY,btnWidth,btnHeight;btnX=node.getPos().x||0;btnY=node.getPos().y||0;btnWidth=node.getSize().x||60;btnHeight=node.getSize().y||28;return SO.create({x:btnX,y:btnY,width:btnWidth,height:btnHeight,items:[{tag:"rect",rx:0,x:0,y:0,width:btnWidth-20,height:btnHeight,stroke:"#000",fill:"none"},{tag:"rect",rx:2,x:btnWidth-20,y:0,width:20,height:28,stroke:"#000","class":"SVGBtn"},{tag:"path",style:"fill:#000000;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;fill-opacity:1",d:"m "+(btnWidth-15)+",13 10,0 L "+(btnWidth-10)+",20 z"}]});}},{key:"drawClassicon",value:function drawClassicon(node){var btnX=void 0,btnY=void 0,btnWidth=void 0,btnHeight=void 0;btnX=node.getPos().x||0;btnY=node.getPos().y||0;btnWidth=node.getSize().x||60;btnHeight=node.getSize().y||28;return SO.create({x:btnX,y:btnY,width:btnWidth,height:btnHeight,items:[{tag:"path",d:"m0,0l10.78832,0l0,4.49982l-10.78832,0.19999l0,9.19963l10.78832,0l0,-9.49962l-10.78832,0.19999l0,-4.59982z",style:"fill:none;stroke:#000000;"},{tag:"path",d:"m25.68807,0l10.78832,0l0,4.49982l-10.78832,0.19999l0,9.19963l10.78832,0l0,-9.49962l-10.78832,0.2l0,-4.59982z",style:"fill:none;stroke:#000000;"},{tag:"line",x1:11,y1:7,x2:25,y2:7,stroke:"#000"}]});}},{key:"drawEdgeicon",value:function drawEdgeicon(node){var btnX=void 0,btnY=void 0,btnWidth=void 0,btnHeight=void 0;btnX=node.getPos().x||0;btnY=node.getPos().y||0;btnWidth=node.getSize().x||30;btnHeight=node.getSize().y||35;return SO.create({x:btnX,y:btnY,width:btnWidth,height:btnHeight,items:[{tag:"path",d:"M2,10 20,10 20,35 2,35 Z M2,17 20,17 M20,10 28,5 28,9 M 28.5,4.7 24,4",style:"fill:none;stroke:#000000;transform:scale(0.4);"}]});}}]);return SymbolLibary;}();var BR=function(_Control2){_inherits(BR,_Control2);function BR(owner,data){_classCallCheck(this,BR);var _this7=_possibleConstructorReturn(this,(BR.__proto__||Object.getPrototypeOf(BR)).call(this,owner));_this7.createControl(document.getElementsByTagName("body")[0],data);return _this7;}_createClass(BR,[{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){}},{key:"createControl",value:function createControl(parent,data){var label=document.createElement("br");for(var attr in data){if(!data.hasOwnProperty(attr)){continue;}label.setAttribute(attr,data[attr]);}parent.appendChild(label);}},{key:"setProperty",value:function setProperty(property){}}]);return BR;}(Control);var Button=function(_Control3){_inherits(Button,_Control3);function Button(owner,data){_classCallCheck(this,Button);var _this8=_possibleConstructorReturn(this,(Button.__proto__||Object.getPrototypeOf(Button)).call(this,owner));_this8.createControl(document.getElementsByTagName("body")[0],data);return _this8;}_createClass(Button,[{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){}},{key:"createControl",value:function createControl(parent,data){if(typeof data==="string"){this.id=data;}else{this.id=data["id"];}this.$element=document.createElement("button");if(data instanceof Object){for(var attr in data){if(!data.hasOwnProperty(attr)){continue;}this.$element.setAttribute(attr,data[attr]);}}parent.appendChild(this.$element);}},{key:"setProperty",value:function setProperty(property){}}]);return Button;}(Control);var Div=function(_Control4){_inherits(Div,_Control4);function Div(owner,data){_classCallCheck(this,Div);var _this9=_possibleConstructorReturn(this,(Div.__proto__||Object.getPrototypeOf(Div)).call(this,owner));_this9.applyingChange=false;var id=void 0;if(typeof data==="string"){id=data;}else{id=data.id;_this9.className=data.class;_this9.property=data.property;}if(!id){return _possibleConstructorReturn(_this9);}_this9.id=id;var div=document.getElementById(id);if(!_this9.property){_this9.property=div.getAttribute("Property");}if(div instanceof HTMLDivElement){_this9.$element=div;}else{if(!div){_this9.$element=document.createElement("div");_this9.$element.setAttribute("id",_this9.id);_this9.$element.setAttribute("property",_this9.property);document.getElementsByTagName("body")[0].appendChild(_this9.$element);}else{return _possibleConstructorReturn(_this9);}}var objId=_this9.property.split(".")[0];var hasItem=_this9.$owner.hasItem(objId);if(hasItem){var item=_this9.$owner.getItem(objId);item.addListener(_this9);_this9.entity=item;}return _this9;}_createClass(Div,[{key:"controlChanged",value:function controlChanged(ev){this.$owner.setValue(this.entity,this.lastProperty,this.$element.innerHTML);}},{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){if(!this.applyingChange&&property==this.lastProperty){this.$element.innerHTML=newValue;}}},{key:"addItem",value:function addItem(source,entity){this.entity=entity;if(entity){if(!this.className||this.className===entity.property){if(entity.id==this.property.split(".")[0]){entity.addListener(this);}}}}}]);return Div;}(Control);var Form=function(_Control5){_inherits(Form,_Control5);function Form(owner,data){_classCallCheck(this,Form);var _this10=_possibleConstructorReturn(this,(Form.__proto__||Object.getPrototypeOf(Form)).call(this,owner));_this10.children=new Map();var id=void 0;if(typeof data==="string"){id=data;}else{id=data.id;}if(!id){return _possibleConstructorReturn(_this10);}_this10.id=id;var form=document.getElementById(id);if(form instanceof HTMLFormElement){_this10.$element=form;if(_this10.$element.hasAttribute("property")){_this10.property=_this10.$element.getAttribute("property");}}else{if(!form){_this10.$element=document.createElement("form");_this10.$element.setAttribute("id",_this10.id);if(data.hasOwnProperty("property")){_this10.property=data['property'];}for(var attr in data){if(data.hasOwnProperty(attr)===false){continue;}if(attr=="elements"){continue;}_this10.$element.setAttribute(attr,data[attr]);}document.getElementsByTagName("body")[0].appendChild(_this10.$element);}else{return _possibleConstructorReturn(_this10);}}var objId=_this10.property;var hasItem=_this10.$owner.hasItem(objId);if(hasItem){var item=_this10.$owner.getItem(objId);item.addListener(_this10);_this10.entity=item;}var _iteratorNormalCompletion8=true;var _didIteratorError8=false;var _iteratorError8=undefined;try{for(var _iterator8=data.elements[Symbol.iterator](),_step8;!(_iteratorNormalCompletion8=(_step8=_iterator8.next()).done);_iteratorNormalCompletion8=true){var field=_step8.value;if(field.hasOwnProperty("property")){var property=field["property"];property=_this10.property+'.'+property;field['property']=property;}if(!field.hasOwnProperty("class")){field['class']='input';}var control=_this10.$owner.load(field);_this10.children.set(control.getId(),control);}}catch(err){_didIteratorError8=true;_iteratorError8=err;}finally{try{if(!_iteratorNormalCompletion8&&_iterator8.return){_iterator8.return();}}finally{if(_didIteratorError8){throw _iteratorError8;}}}return _this10;}_createClass(Form,[{key:"createField",value:function createField(field){var control="input";if(field.hasOwnProperty("class")){control=field['class'];}var input=document.createElement(control);input.setAttribute("class",control);var id=void 0;if(!field.hasOwnProperty("id")){id=this.$owner.getId();field['id']=id;}if(field.hasOwnProperty("property")){var property=field["property"];property=this.id+'.'+property;input.setAttribute("property",property);}for(var attr in field){if(attr=="property"||attr=="class"||!field.hasOwnProperty(attr)){continue;}input.setAttribute(attr,field[attr]);}this.$element.appendChild(input);var newcontrol=this.$owner.load(field['id']);this.children.set(newcontrol.getId(),newcontrol);}},{key:"setProperty",value:function setProperty(id){this.property=id;var _iteratorNormalCompletion9=true;var _didIteratorError9=false;var _iteratorError9=undefined;try{for(var _iterator9=this.children[Symbol.iterator](),_step9;!(_iteratorNormalCompletion9=(_step9=_iterator9.next()).done);_iteratorNormalCompletion9=true){var _step9$value=_slicedToArray(_step9.value,2),_id=_step9$value[0],childControl=_step9$value[1];if(this.children.hasOwnProperty(_id)===false){continue;}if(childControl.property){childControl.setProperty(this.property+"."+childControl.lastProperty);}}}catch(err){_didIteratorError9=true;_iteratorError9=err;}finally{try{if(!_iteratorNormalCompletion9&&_iterator9.return){_iterator9.return();}}finally{if(_didIteratorError9){throw _iteratorError9;}}}}}]);return Form;}(Control);var Data=function(){function Data(){_classCallCheck(this,Data);this.$listener=[];this.values={};}_createClass(Data,[{key:"getValue",value:function getValue(attribute){return this.values[attribute];}},{key:"setValue",value:function setValue(attribute,newValue){var oldValue=this.values[attribute];this.values[attribute]=newValue;for(var _i3 in this.$listener){if(this.$listener.hasOwnProperty(_i3)===false){continue;}this.$listener[_i3].propertyChange(this,attribute,oldValue,newValue);}}},{key:"addListener",value:function addListener(control){this.$listener.push(control);}},{key:"removeListener",value:function removeListener(control){var pos=this.$listener.indexOf(control);if(pos>=0){this.$listener.splice(pos,1);}}}]);return Data;}();var Input=function(_Control6){_inherits(Input,_Control6);function Input(owner,data){_classCallCheck(this,Input);var _this11=_possibleConstructorReturn(this,(Input.__proto__||Object.getPrototypeOf(Input)).call(this,owner));_this11.applyingChange=false;_this11.initControl(data);return _this11;}_createClass(Input,[{key:"initControl",value:function initControl(data){var _this12=this;var id=void 0;if(typeof data==="string"){id=data;}else{id=data.id;if(data.type){this.type=data['type'];}else{this.type='text';}this.property=data['property'];}if(!id){return;}this.id=id;var inputField=document.getElementById(id);if(!this.property){if(inputField){if(inputField.hasAttribute("Property")){this.property=inputField.getAttribute("Property");}}}if(inputField instanceof HTMLInputElement){this.$element=inputField;this.type=inputField.type;}else{if(!inputField){this.$element=document.createElement("input");if(typeof data!=="string"){for(var attr in data){if(data.hasOwnProperty(attr)==false){continue;}this.$element.setAttribute(attr,data[attr]);}}else{if(this.type)this.$element.setAttribute("type",this.type);if(data.hasOwnProperty("class"))this.$element.setAttribute("class",data['class']);this.$element.setAttribute("id",this.id);this.$element.setAttribute("property",this.property);}document.getElementsByTagName("body")[0].appendChild(this.$element);}else{return;}}if(this.property){var objId=this.property.split(".")[0];var hasItem=this.$owner.hasItem(objId);if(hasItem){var item=this.$owner.getItem(objId);item.addListener(this);this.entity=item;}else{this.entity=new Data();}this.$element.onchange=function(ev){_this12.controlChanged(ev);};}else{this.entity=new Data();}}},{key:"controlChanged",value:function controlChanged(ev){if(this.$element.checkValidity()){this.$owner.setValue(this.entity,this.lastProperty,this.$element.value);}else{console.log("value does not match the pattern...");}}},{key:"propertyChange",value:function propertyChange(entity, property, oldValue, newValue){if(this.property&&!this.applyingChange&&property==this.lastProperty){this.$element.value=newValue;}}},{key:"addItem",value:function addItem(source, entity){if(this.property&&entity){if(entity.id==this.property.split(".")[0]){this.entity=entity;entity.addListener(this);}}}},{key:"updateElement",value:function updateElement(value){this.$element.value=value;}},{key:"registerListenerOnHTMLObject",value:function registerListenerOnHTMLObject(eventType){this.registerEventListener(eventType,this.$element);return true;}}]);return Input;}(Control);var Label=function(_Control7){_inherits(Label,_Control7);function Label(owner, data){_classCallCheck(this,Label);var _this13=_possibleConstructorReturn(this,(Label.__proto__||Object.getPrototypeOf(Label)).call(this,owner));_this13.createControl(document.getElementsByTagName("body")[0],data);return _this13;}_createClass(Label,[{key:"createControl",value:function createControl(parent, data){var label=document.createElement("label");for(var attr in data){if(!data.hasOwnProperty(attr)){continue;}if(attr=="textContent"){label.textContent=data['textContent'];}else{label.setAttribute(attr,data[attr]);}}parent.appendChild(label);}}]);return Label;}(Control);var BridgeElement=function BridgeElement(model){_classCallCheck(this,BridgeElement);this.model=model;this.id=model.id;BridgeElement.elementSet.add(this);};BridgeElement.elementSet=new Set();var Table=function(_Control8){_inherits(Table,_Control8);function Table(owner,data){_classCallCheck(this,Table);var _this14=_possibleConstructorReturn(this,(Table.__proto__||Object.getPrototypeOf(Table)).call(this,owner));_this14.columns=[];_this14.cells={};_this14.showedItems=[];_this14.itemsIds={};_this14.searchColumns=[];_this14.searchText=[];_this14.moveElement=null;_this14.isDrag=false;_this14.items=new Set();_this14.initControl(data);return _this14;}_createClass(Table,[{key:"initControl",value:function initControl(data){var id=void 0;if(typeof data==="string"){id=data;}else{id=data.id;if(data.property){this.property=data.property;}if(data.searchColumns){var _search=[];if(typeof data.searchColumns==="string"){_search=data.searchColumns.split(" ");}else{_search=data.searchColumns;}for(var z=0;z<_search.length;z++){var item=_search[z].trim();if(item.length>0){if(this.searchColumns.indexOf(item)<0){this.searchColumns.push(item);}}}}}if(!id){return;}if(this.$element){if(data["columns"]){for(var _i4 in data["columns"]){if(data["columns"].hasOwnProperty(_i4)===false){continue;}var col=new Column();var column=data["columns"][_i4];col.label=column.id;col.attribute=col["attribute"]||column.id;col.$element=document.createElement("th");col.$element.innerHTML=col.label;col.$element.draggable=true;col.$resize=document.createElement("div");col.$resize.classList.add("resize");col.$element.appendChild(col.$resize);this.addHeaderInfo(col);this.columns.push(col);this.tableOption.parentElement.insertBefore(col.$element,this.tableOption);}for(var _i5 in this.showedItems){var _item=this.showedItems[_i5];var _cell=void 0;while(_item.gui.children.length<this.columns.length){_cell=document.createElement("td");_item.gui.appendChild(_cell);}while(_item.gui.children.length>this.columns.length){_item.gui.removeChild(_item.gui.children[_item.gui.children.length-1]);}for(var c=0;c<this.columns.length;c++){var name=this.columns[c].attribute;var count=this.columns.length;_cell=_item.gui.children[c];_cell.innerHTML=_item.model.getValue(name);}}}return;}var table=document.getElementById(id);var headerrow=void 0;if(table){if(!this.property){this.property=table.getAttribute("property");}}else{table=document.createElement("table");document.getElementsByTagName("body")[0].appendChild(table);}this.$element=table;if(!this.$bodysection){this.$bodysection=document.createElement("tbody");table.appendChild(this.$bodysection);}if(data["classname"]){table.className=data["classname"];}else{table.className="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp";}this.id=id;table.id=id;table.setAttribute("type",this.constructor["name"].toLowerCase());var i=0;for(var _c in table.children){if(table.children.hasOwnProperty(_c)===false){continue;}var row=table.children[_c];if(row instanceof HTMLTableSectionElement){if(row.tagName=="THEAD"){headerrow=row;for(var r in row.children){if(row.children.hasOwnProperty(r)===false){continue;}this.parsingHeader(row.children[r]);}}else{for(var _r in row.children){if(row.children.hasOwnProperty(_r)===false){continue;}this.parsingData(row.children[_r]);}}}else{if(i==0){headerrow=row;this.parsingHeader(row);}else{this.parsingData(row);}}i++;}if(!headerrow||!this.$headersection){if(!this.$headersection){var header=table.getElementsByTagName("thead");if(header.length==0){this.$headersection=document.createElement("thead");table.appendChild(this.$headersection);}else{this.$headersection=header.item(0);}}if(!headerrow){headerrow=document.createElement("tr");this.$headersection.appendChild(headerrow);}}if(data["columns"]){for(var _i6 in data["columns"]){if(data["columns"].hasOwnProperty(_i6)===false){continue;}var _col=new Column();var _column=data["columns"][_i6];_col.label=_column.id;_col.attribute=_col["attribute"]||_column.id;_col.$element=document.createElement("th");_col.$element.innerHTML=_col.label;_col.$element.draggable=true;_col.$resize=document.createElement("div");_col.$resize.classList.add("resize");_col.$element.appendChild(_col.$resize);this.addHeaderInfo(_col);this.columns.push(_col);headerrow.appendChild(_col.$element);}this.tableOption=document.createElement("th");this.tableOption.classList.add("tableOption");headerrow.appendChild(this.tableOption);var context=this.addOptionItem(null,this.tableOption,true);var contentChild=this.addOptionItem("show",context,true);var simpleLink=this.addOptionItem("show",contentChild,false);}this.registerEvents(['mousemove','mousedown','mouseup','resize','dragstart','dragover','drop','dragend']);var searchBar=document.createElement("tr");var cell=document.createElement("td");cell.setAttribute("colspan",""+this.columns.length);searchBar.appendChild(cell);var search=document.createElement("input");search.className="search";var that=this;search.addEventListener('keyup',function(evt){that.search(evt.target["value"]);});cell.appendChild(search);if(this.resultColumn){if(this.resultColumn.startsWith("#")==false){this.countElement=document.createElement("div");searchBar.appendChild(this.countElement);}else{for(var _z=0;_z<this.$headersection.children.length;_z++){if(this.$headersection.children[_z].innerHTML===this.resultColumn){this.countColumn=this.$headersection.children[_z];this.countColumnPos=_z;break;}}}}var first=this.$headersection.children.item(0);this.$headersection.insertBefore(searchBar,first);}},{key:"addOptionItem",value:function addOptionItem(label,parent,sub){var labelControl=void 0;if(label){labelControl=document.createElement("a");labelControl.appendChild(document.createTextNode(label));labelControl.href="javascript:void(0);";parent.appendChild(labelControl);}if(sub){var _ret=function(){var context=document.createElement("div");context.classList.add("dropdown-content");context.style.setProperty("position","absolute");parent.appendChild(context);parent.addEventListener('click',function(){context.classList.toggle("show");},false);return{v:context};}();if((typeof _ret==="undefined"?"undefined":_typeof(_ret))==="object")return _ret.v;}return labelControl;}},{key:"registerEvents",value:function registerEvents(events){var _this15=this;var that=this;var _loop=function _loop(_i7){_this15.$element.addEventListener(events[_i7],function(evt){return that.tableEvent(events[_i7],evt);});};for(var _i7=0;_i7<events.length;_i7++){_loop(_i7);}}},{key:"tableEvent",value:function tableEvent(type,e){var button=0;var eventX=0;if(e instanceof MouseEvent){button=e.buttons;eventX=e.pageX;}if(type=='mouseup'){this.moveElement=null;}else if(type=='mousedown'||type=='resize'){this.moveElement=null;if(button==1){var c=void 0;for(c=0;c<this.columns.length;c++){if(this.columns[c].$resize===e.target){this.moveElement=this.columns[c];this.movePos=c;this.isDrag=false;break;}else if(this.columns[c].$element===e.target){this.moveElement=this.columns[c];this.movePos=c;this.isDrag=true;}}this.moveTimeStamp=e.timeStamp;this.moveX=eventX;}else{this.moveTimeStamp=0;}}else if(type=='mousemove'){if(button==1&&this.moveElement){if(this.moveTimeStamp&&e.timeStamp-this.moveTimeStamp<2000){if(this.isDrag){}else{var x=eventX-this.moveX;var width=this.moveElement.$element.offsetWidth;this.moveElement.$element.width=""+(width+x);e.stopPropagation();}}this.moveX=eventX;this.moveTimeStamp=e.timeStamp;}}else if(this.isDrag){this.columnDragEvent(type,e);}}},{key:"columnDragEvent",value:function columnDragEvent(type,e){if(type=='dragstart'){this.moveElement.$element.style.opacity='0.4';e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/json',JSON.stringify(util.toJson(this.moveElement)));}else if(type=='dragenter'){}else if(type=='dragleave'){this.moveElement.$element.classList.remove('over');}else if(type=='dragover'){if(e.preventDefault){e.preventDefault();}for(var c=0;c<this.columns.length;c++){if(this.columns[c].$element==e.target){this.dragColumn=this.columns[c];this.dragPos=c;this.columns[c].$element.classList.add('over');}else{this.columns[c].$element.classList.remove('over');}}if(e.target==this.tableOption){this.tableOption.classList.add('over');this.dragPos=this.columns.length;}else{this.tableOption.classList.remove('over');}e.dataTransfer.dropEffect='move';}else if(type=='drop'){if(e.stopPropagation){e.stopPropagation();}if(this.movePos==this.dragPos){return;}this.columns.splice(this.movePos,1);if(this.movePos>=this.dragPos){this.columns.splice(this.dragPos,0,this.moveElement);}else{this.columns.splice(this.dragPos-1,0,this.moveElement);}var line=this.moveElement.$element.parentElement;line.removeChild(this.moveElement.$element);if(this.dragPos<this.columns.length){line.insertBefore(this.moveElement.$element,this.dragColumn.$element);}else{line.insertBefore(this.moveElement.$element,this.tableOption);}var oldElement=void 0;var newElement=void 0;for(var _i8=0;_i8<this.$bodysection.children.length;_i8++){line=this.$bodysection.children.item(_i8);oldElement=line.children.item(this.movePos);newElement=line.children.item(this.dragPos);line.removeChild(oldElement);line.insertBefore(oldElement,newElement);}}else if(type=='dragend'){this.moveElement.$element.style.opacity='1';for(var _i9=0;_i9<this.columns.length;_i9++){this.columns[_i9].$element.classList.remove('over');}this.tableOption.classList.remove('over');}}},{key:"parsingHeader",value:function parsingHeader(row){for(var _i10 in row.children){if(row.children.hasOwnProperty(_i10)===false){continue;}var column=row.children[_i10];var id=column.innerHTML.trim();var col=null;for(var c in this.columns){if(this.columns.hasOwnProperty(_i10)===false){continue;}if(this.columns[c].label==id){col=this.columns[c];col.$element=column;break;}}if(col===null){col=new Column();col.label=id;col.attribute=column.getAttribute("attribute");col.$element=column;this.columns.push(col);}this.addHeaderInfo(col);}}},{key:"addHeaderInfo",value:function addHeaderInfo(col){var element=col.$element;var that=this;element.classList.add("sort");element.addEventListener('click',function(){that.sort(col);},false);}},{key:"parsingData",value:function parsingData(row){var id=row.getAttribute("id");var item=this.$owner.getItem(id);for(var _i11 in row.children){if(row.children.hasOwnProperty(_i11)===false){continue;}var cell=row.children[_i11];var colAttribute=this.columns[_i11].attribute;if(colAttribute.indexOf("\.")<0){item[colAttribute]=cell.innerHTML.trim();}}}},{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){if(entity){if(this.property&&this.property!==entity.property){return;}}if(!entity.id){return;}var item=this.itemsIds[entity.id];var row=void 0;if(!item){item=new BridgeElement(entity);this.items.add(item);this.itemsIds[entity.id]=item;}row=this.cells[entity.id];if(row){item.gui=row;}if(this.searching(item)==false){return;}var cell=void 0;var showItem=false;if(!row){showItem=true;row=document.createElement("tr");var count=this.columns.length;for(var _i12=0;_i12<count;_i12++){cell=document.createElement("td");row.appendChild(cell);}this.cells[entity.id]=row;item.gui=row;}for(var c=0;c<this.columns.length;c++){var name=this.columns[c].attribute;if(name===property){cell=row.children[c];cell.innerHTML=newValue;}}if(showItem){this.showItem(item,true);}}},{key:"sort",value:function sort(column){if(this.sortColumn==column){if(this.direction==1){this.direction=-1;column.$element.classList.remove("asc");column.$element.classList.add("desc");}else{this.direction=1;column.$element.classList.remove("desc");column.$element.classList.add("asc");}}else{if(this.sortColumn!=null){this.sortColumn.$element.classList.remove("desc");this.sortColumn.$element.classList.remove("asc");}this.sortColumn=column;this.sortColumn.$element.classList.add("asc");this.direction=1;}var that=this;var sort=function sort(a,b){return that.sorting(a,b);};this.showedItems.sort(sort);var len=this.showedItems.length;var body=this.$bodysection;var i=0;while(i<len){var item=this.showedItems[i];if(i!=Table.indexOfChild(item)){break;}i=i+1;}while(body.children.length>i){body.removeChild(body.children.item(body.children.length-1));}while(i<len){var _item2=this.showedItems[i];body.appendChild(_item2.gui);i=i+1;}}},{key:"sorting",value:function sorting(a,b){var path=this.sortColumn.attribute.split(".");var itemA=a.model.values;var itemB=b.model.values;var check=this.sortColumn.attribute;for(var p=0;p<path.length;p++){check=path[p];if(itemA[check]){itemA=itemA[check];}else{return 0;}if(itemB[check]){itemB=itemB[check];}else{return 0;}}if(itemA!=itemB){if(this.direction==1){return itemA<itemB?-1:1;}return itemA<itemB?1:-1;}return 0;}},{key:"search",value:function search(origSearchText){if(!origSearchText){origSearchText="";}var searchText=origSearchText.trim().toLowerCase();if(searchText==this.lastSearchText&&searchText!=""){return 0;}var oldSearch=this.lastSearchText;this.lastSearchText=searchText;this.parseSearchArray();if(searchText!=""&&oldSearch!=null&&searchText.indexOf(oldSearch)>=0&&searchText.indexOf("|")<0){this.searchArray(this.showedItems);}else{this.searchSet(this.items);}this.refreshCounter();}},{key:"refreshCounter",value:function refreshCounter(){if(this.countColumn){this.countColumn.innerHTML=this.columns[this.countColumnPos].label+" ("+this.showedItems.length+")";}}},{key:"parseSearchArray",value:function parseSearchArray(){var pos=0;var split=[];var quote=false;for(var _i13=0;_i13<this.lastSearchText.length;_i13++){if(this.lastSearchText.charAt(_i13)==" "&&!quote){var txt=this.lastSearchText.substring(pos,_i13).trim();if(txt.length>0){split.push(txt);}pos=_i13+1;}else if(this.lastSearchText.charAt(_i13)=="\""){if(quote){var _txt=this.lastSearchText.substring(pos,_i13).trim();if(_txt.length>0){split.push(_txt);}pos=_i13+1;}else{pos=_i13+1;}quote=!quote;}}if(pos<this.lastSearchText.length){split.push(this.lastSearchText.substring(pos,this.lastSearchText.length).trim());}this.searchText=split;return split;}},{key:"searchArray",value:function searchArray(root){this.showedItems=[];for(var _i14=0;_i14<root.length;_i14++){var item=root[_i14];this.showItem(item,this.searching(item));}}},{key:"searchSet",value:function searchSet(root){this.showedItems=[];var _iteratorNormalCompletion10=true;var _didIteratorError10=false;var _iteratorError10=undefined;try{for(var _iterator10=root[Symbol.iterator](),_step10;!(_iteratorNormalCompletion10=(_step10=_iterator10.next()).done);_iteratorNormalCompletion10=true){var item=_step10.value;var child=item;this.showItem(child,this.searching(child));}}catch(err){_didIteratorError10=true;_iteratorError10=err;}finally{try{if(!_iteratorNormalCompletion10&&_iterator10.return){_iterator10.return();}}finally{if(_didIteratorError10){throw _iteratorError10;}}}}},{key:"showItem",value:function showItem(item,visible){if(visible){this.showedItems.push(item);this.$bodysection.appendChild(item.gui);}else if(item.gui&&item.gui.parentElement){this.$bodysection.removeChild(item.gui);}}},{key:"searching",value:function searching(item){var fullText="";for(var _i15=0;_i15<this.searchColumns.length;_i15++){fullText=fullText+" "+item.model.getValue(this.searchColumns[_i15]);}fullText=fullText.trim().toLowerCase();for(var z=0;z<this.searchText.length;z++){if(""!=this.searchText[z]){var orSplit=void 0;if(this.searchText[z].indexOf("|")>0){orSplit=this.searchText[z].split("|");}else{orSplit=[this.searchText[z]];}var o=0;for(;o<orSplit.length;o++){var pos=orSplit[o].indexOf(":");if(orSplit[o].indexOf("#")==0&&pos>1){var _value=orSplit[o].substring(pos+1);var column=orSplit[o].substring(1,pos-1);var dataValue=item.model.getValue(column);if(dataValue){if(dataValue.toString().toLowerCase().indexOf(_value)>=0){break;}}}else if(orSplit[o].length>1&&orSplit[o].indexOf("-")==0){if(fullText.indexOf(orSplit[o].substring(1))<0){break;}}else if(fullText.indexOf(orSplit[o])>=0){break;}}if(o==orSplit.length){return false;}}}return true;}},{key:"getColumn",value:function getColumn(){return this.columns;}}],[{key:"indexOfChild",value:function indexOfChild(item){var i=0;var child=item.gui;while((child=child.previousSibling)!=null){i++;}return i;}}]);return Table;}(Control);var Column=function Column(){_classCallCheck(this,Column);};var nodes=Object.freeze({Node:Node,Clazz:Clazz,SO:SO,Symbol:_Symbol,SymbolLibary:SymbolLibary,BR:BR,Button:Button,Div:Div,Form:Form,Input:Input,Label:Label,Table:Table});var Adapter=function Adapter(){_classCallCheck(this,Adapter);this.id=null;};var Direction;(function(Direction){Direction[Direction["Up"]=0]="Up";Direction[Direction["Down"]=1]="Down";Direction[Direction["Left"]=2]="Left";Direction[Direction["Right"]=3]="Right";})(Direction||(Direction={}));var Edge=function(_DiagramElement4){_inherits(Edge,_DiagramElement4);function Edge(parent,id,type){_classCallCheck(this,Edge);var _this16=_possibleConstructorReturn(this,(Edge.__proto__||Object.getPrototypeOf(Edge)).call(this,parent));_this16.$points=[];_this16.property=type||'Edge';_this16.id=id;return _this16;}_createClass(Edge,[{key:"init",value:function init(data){}},{key:"withItem",value:function withItem(source,target){source.edges.push(this);target.edges.push(this);this.$sNode=source;this.$tNode=target;this.source=source.id;this.target=target.id;return this;}},{key:"getSVG",value:function getSVG(){var path="";if(this.$points.length>0){path='M';}for(var _i16=0; _i16<this.$points.length; _i16++){var point=new Point(this.$points[_i16].getPos().x,this.$points[_i16].getPos().y);if(_i16>0){path+='L';}path+=Math.floor(point.x)+' '+Math.floor(point.y)+' ';}var attr={tag:'path',id:this.id,d:path,stroke:'black','stroke-width':'3',fill:'none'};var shape=this.createShape(attr);this.$viewElement=shape;return shape;}},{key:"redraw",value:function redraw(){var a=this.getShortestPathIntersection(this.$sNode,this.$tNode.getPos());var b=this.getShortestPathIntersection(this.$tNode,this.$sNode.getPos());this.$viewElement.setAttribute('d',"M"+a.x+" "+a.y+" L"+b.x+" "+b.y);}},{key:"calc",value:function calc(board){var result=void 0,options=void 0,linetyp=void 0,sourcePos=void 0,targetPos=void 0,divisor=void 0,startNode=void 0,endNode=void 0;startNode=this.$sNode.getShowed();endNode=this.$tNode.getShowed();divisor=endNode.getCenter().x-startNode.getCenter().x;this.$points=[];if(divisor===0){if(startNode===endNode){return false;}if(startNode.getCenter().y<endNode.getCenter().y){sourcePos=startNode.getCenterPosition(Point.DOWN);targetPos=endNode.getCenterPosition(Point.UP);}else{sourcePos=startNode.getCenterPosition(Point.UP);targetPos=endNode.getCenterPosition(Point.DOWN);}}else{options=this.$owner["options"];if(options){linetyp=options.linetyp;}result=false;if(linetyp==="square"){result=this.calcSquareLine();}if(!result){this.$m=(endNode.getCenter().y-startNode.getCenter().y)/divisor;this.$n=startNode.getCenter().y-startNode.getCenter().x*this.$m;sourcePos=util.getPosition(this.$m,this.$n,startNode,endNode.getCenter());targetPos=util.getPosition(this.$m,this.$n,endNode,sourcePos);}}if(sourcePos&&targetPos){if(this.sourceInfo){this.calcInfoPos(sourcePos,startNode,this.sourceInfo);}if(this.targetInfo){this.calcInfoPos(targetPos,endNode,this.targetInfo);}startNode["$"+sourcePos.$id]+=1;endNode["$"+targetPos.$id]+=1;var line=new Line(this,this.lineStyle);line.source=sourcePos;line.target=targetPos;this.$points.push(line);if(this.info){this.info.withPos((sourcePos.x+targetPos.x)/2,(sourcePos.y+targetPos.y)/2);}}return true;}},{key:"addLineTo",value:function addLineTo(x1,y1,x2,y2){var start=void 0,end=void 0;if(!x2&&!y2){if(this.$points.length>0){start=this.$points[this.$points.length-1].target;end=new Point(start.x+x1,start.y+y1);}else{start=new Point(x1,y1);end=new Point(x1,y1);}}else{start=new Point(x1,y1);end=new Point(start.x+x2,start.y+y2);}var line=new Line(this,this.lineStyle);line.source=start;line.target=end;this.$points.push(line);}},{key:"addLine",value:function addLine(x1,y1,x2,y2){var start=void 0,end=void 0;if(!x2&&!y2){if(this.$points.length>0){start=this.$points[this.$points.length-1].target;end=new Point(x1,y1);}else{start=new Point(x1,y1);end=start;}}else{start=new Point(x1,y1);end=new Point(x2,y2);}var line=new Line(this,this.lineStyle);line.source=start;line.target=end;this.$points.push(line);}},{key:"calcInfoPos",value:function calcInfoPos(linePos,item,info){var newY=void 0,newX=void 0,spaceA=20,spaceB=0,step=15;if(item.$parent.options&&!item.$parent.options.rotatetext){spaceA=20;spaceB=10;}if(info.custom||info.getText().length<1){return;}newY=linePos.y;newX=linePos.x;var size=info.getSize();if(linePos.$id===Point.UP){newY=newY-size.y-spaceA;if(this.$m!==0){newX=(newY-this.$n)/this.$m+spaceB+item.$UP*step;}}else if(linePos.$id===Point.DOWN){newY=newY+spaceA;if(this.$m!==0){newX=(newY-this.$n)/this.$m+spaceB+item.$DOWN*step;}}else if(linePos.$id===Point.LEFT){newX=newX-size.x-item.$LEFT*step-spaceA;if(this.$m!==0){newY=this.$m*newX+this.$n;}}else if(linePos.$id===Point.RIGHT){newX+=item.$RIGHT*step+spaceA;if(this.$m!==0){newY=this.$m*newX+this.$n;}}info.withPos(Math.ceil(newX),Math.ceil(newY));}},{key:"calcSquareLine",value:function calcSquareLine(){var startPos=this.$sNode.getPos();var startSize=this.$sNode.getSize();var endPos=this.$tNode.getPos();var endSize=this.$tNode.getSize();if(startPos.y-40>endPos.y+endSize.y){this.addLineTo(startPos.x+startSize.x/2,startPos.y,0,-20);this.addLine(endPos.x+endSize.x/2,endPos.y+endSize.y+20);this.addLineTo(0,-20);return true;}if(endPos.y-40>startPos.y+startSize.y){this.addLineTo(startPos.x+startSize.x/2,startPos.y+startSize.y,0,+20);this.addLine(endPos.x+endSize.x/2,endPos.y-20);this.addLineTo(0,20);return true;}this.addLineTo(startPos.x+startSize.x/2,startPos.y,0,-20);this.addLine(endPos.x+endSize.x/2,endPos.y-20);this.addLineTo(0,20);return true;}},{key:"calcOffset",value:function calcOffset(){var i,z,min=new Point(999999999,999999999),max=new Point(0,0),item,svg,value,x,y;for(i=0;i<this.$points.length;i+=1){item=this.$points[i];if(item.typ==Line.FORMAT.PATH){value=document.createElement('div');svg=util.create({tag:"svg"});svg.appendChild(item.draw());value=svg.childNodes[0];x=y=0;if(!value.pathSegList){continue;}for(z=0;z<value.pathSegList.length;z+=1){item=value.pathSegList[z];switch(item.pathSegType){case SVGPathSeg.PATHSEG_MOVETO_ABS:case SVGPathSeg.PATHSEG_LINETO_ABS:case SVGPathSeg.PATHSEG_ARC_ABS:case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:x=item.x;y=item.y;break;case SVGPathSeg.PATHSEG_MOVETO_REL:case SVGPathSeg.PATHSEG_LINETO_REL:case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:case SVGPathSeg.PATHSEG_ARC_REL:x=x+item.x;y=y+item.y;break;}util.Range(min,max,x,y);}}else{util.Range(min,max,item.source.x,item.source.y);util.Range(min,max,item.target.x,item.target.y);}}return{x:min.x,y:min.y,width:max.x-min.x,height:max.y-min.y};}},{key:"getDirection",value:function getDirection(a,b){if(b.x<a.x){return 2;}if(b.x>a.x){return 3;}if(b.y<a.y){return 0;}if(b.y>a.y){return 1;}}},{key:"getShortestPathIntersection",value:function getShortestPathIntersection(node,point){var x=point.x;var y=point.y;var minX=node.getPos().x-node.getSize().x/2;var minY=node.getPos().y-node.getSize().y/2;var maxX=minX+node.getSize().x;var maxY=minY+node.getSize().y;var midX=(minX+maxX)/2;var midY=(minY+maxY)/2;var m=(midY-y)/(midX-x);if(x<=midX){var minXy=m*(minX-x)+y;if(minY<minXy&&minXy<maxY){return new Point(minX,minXy);}}if(x>=midX){var maxXy=m*(maxX-x)+y;if(minY<maxXy&&maxXy<maxY){return new Point(maxX,maxXy);}}if(y<=midY){var minYx=(minY-y)/m+x;if(minX<minYx&&minYx<maxX){return new Point(minYx,minY);}}if(y>=midY){var maxYx=(maxY-y)/m+x;if(minX<maxYx&&maxYx<maxX){return new Point(maxYx,maxY);}}}}]);return Edge;}(DiagramElement);var Aggregation=function(_Edge){_inherits(Aggregation,_Edge);function Aggregation(){_classCallCheck(this,Aggregation);return _possibleConstructorReturn(this,(Aggregation.__proto__||Object.getPrototypeOf(Aggregation)).apply(this,arguments));}_createClass(Aggregation,[{key:"getSVG",value:function getSVG(){var line=_get(Aggregation.prototype.__proto__||Object.getPrototypeOf(Aggregation.prototype),"getSVG",this).call(this);var endLine=this.$points[this.$points.length-1];var direction=this.getDirection(endLine.source,endLine.target);var x=endLine.getPos().x;var y=endLine.getPos().y;var path=void 0;switch(direction){case 0:path="M"+x+" "+(y-1)+" L"+(x+10)+" "+(y-11)+" L"+x+" "+(y-21)+" L"+(x-10)+" "+(y-11)+" Z";break;case 1:path="M"+x+" "+y+" L"+(x+10)+" "+(y-10)+" L"+x+" "+(y-20)+" L"+(x-10)+" "+(y-10)+" Z";break;case 2:path="M"+x+" "+y+" L"+(x-10)+" "+(y-10)+" L"+(x-20)+" "+y+" L"+(x-10)+" "+(y+10)+" Z";break;case 3:path="M"+x+" "+y+" L"+(x+10)+" "+(y-10)+" L"+(x+20)+" "+y+" L"+(x+10)+" "+(y+10)+" Z";break;}var attr={tag:'path',d:path,stroke:'black','stroke-width':'2',fill:'white'};var connector=this.createShape(attr);var group=this.createShape({tag:'g'});group.appendChild(line);group.appendChild(connector);return group;}}]);return Aggregation;}(Edge);var Composition=function(_Edge2){_inherits(Composition,_Edge2);function Composition(){_classCallCheck(this,Composition);return _possibleConstructorReturn(this,(Composition.__proto__||Object.getPrototypeOf(Composition)).apply(this,arguments));}return Composition;}(Edge);var Generalisation=function(_Edge3){_inherits(Generalisation,_Edge3);function Generalisation(){_classCallCheck(this,Generalisation);return _possibleConstructorReturn(this,(Generalisation.__proto__||Object.getPrototypeOf(Generalisation)).apply(this,arguments));}return Generalisation;}(Edge);var Implements=function(_Generalisation){_inherits(Implements,_Generalisation);function Implements(){_classCallCheck(this,Implements);return _possibleConstructorReturn(this,(Implements.__proto__||Object.getPrototypeOf(Implements)).apply(this,arguments));}return Implements;}(Generalisation);var Unidirectional=function(_Edge4){_inherits(Unidirectional,_Edge4);function Unidirectional(){_classCallCheck(this,Unidirectional);return _possibleConstructorReturn(this,(Unidirectional.__proto__||Object.getPrototypeOf(Unidirectional)).apply(this,arguments));}return Unidirectional;}(Edge);var edges=Object.freeze({get Direction(){return Direction;},Edge:Edge,Aggregation:Aggregation,Composition:Composition,Generalisation:Generalisation,Implements:Implements,Unidirectional:Unidirectional});var commonjsGlobal=typeof window!=='undefined'?window:typeof global!=='undefined'?global:typeof self!=='undefined'?self:{};function createCommonjsModule(fn,module){return module={exports:{}},fn(module,module.exports),module.exports;}var __moduleExports$5=createCommonjsModule(function(module,exports){/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */;(function(){/** Used as a safe reference for `undefined` in pre-ES5 environments. */var undefined;/** Used as the semantic version number. */var VERSION='3.10.1';/** Used to compose bitmasks for wrapper metadata. */var BIND_FLAG=1,BIND_KEY_FLAG=2,CURRY_BOUND_FLAG=4,CURRY_FLAG=8,CURRY_RIGHT_FLAG=16,PARTIAL_FLAG=32,PARTIAL_RIGHT_FLAG=64,ARY_FLAG=128,REARG_FLAG=256;/** Used as default options for `_.trunc`. */var DEFAULT_TRUNC_LENGTH=30,DEFAULT_TRUNC_OMISSION='...';/** Used to detect when a function becomes hot. */var HOT_COUNT=150,HOT_SPAN=16;/** Used as the size to enable large array optimizations. */var LARGE_ARRAY_SIZE=200;/** Used to indicate the type of lazy iteratees. */var LAZY_FILTER_FLAG=1,LAZY_MAP_FLAG=2;/** Used as the `TypeError` message for "Functions" methods. */var FUNC_ERROR_TEXT='Expected a function';/** Used as the internal argument placeholder. */var PLACEHOLDER='__lodash_placeholder__';/** `Object#toString` result references. */var argsTag='[object Arguments]',arrayTag='[object Array]',boolTag='[object Boolean]',dateTag='[object Date]',errorTag='[object Error]',funcTag='[object Function]',mapTag='[object Map]',numberTag='[object Number]',objectTag='[object Object]',regexpTag='[object RegExp]',setTag='[object Set]',stringTag='[object String]',weakMapTag='[object WeakMap]';var arrayBufferTag='[object ArrayBuffer]',float32Tag='[object Float32Array]',float64Tag='[object Float64Array]',int8Tag='[object Int8Array]',int16Tag='[object Int16Array]',int32Tag='[object Int32Array]',uint8Tag='[object Uint8Array]',uint8ClampedTag='[object Uint8ClampedArray]',uint16Tag='[object Uint16Array]',uint32Tag='[object Uint32Array]';/** Used to match empty string literals in compiled template source. */var reEmptyStringLeading=/\b__p \+= '';/g,reEmptyStringMiddle=/\b(__p \+=) '' \+/g,reEmptyStringTrailing=/(__e\(.*?\)|\b__t\)) \+\n'';/g;/** Used to match HTML entities and HTML characters. */var reEscapedHtml=/&(?:amp|lt|gt|quot|#39|#96);/g,reUnescapedHtml=/[&<>"'`]/g,reHasEscapedHtml=RegExp(reEscapedHtml.source),reHasUnescapedHtml=RegExp(reUnescapedHtml.source);/** Used to match template delimiters. */var reEscape=/<%-([\s\S]+?)%>/g,reEvaluate=/<%([\s\S]+?)%>/g,reInterpolate=/<%=([\s\S]+?)%>/g;/** Used to match property names within property paths. */var reIsDeepProp=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,reIsPlainProp=/^\w*$/,rePropName=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;/**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */var reRegExpChars=/^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,reHasRegExpChars=RegExp(reRegExpChars.source);/** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */var reComboMark=/[\u0300-\u036f\ufe20-\ufe23]/g;/** Used to match backslashes in property paths. */var reEscapeChar=/\\(\\)?/g;/** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */var reEsTemplate=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;/** Used to match `RegExp` flags from their coerced string values. */var reFlags=/\w*$/;/** Used to detect hexadecimal string values. */var reHasHexPrefix=/^0[xX]/;/** Used to detect host constructors (Safari > 5). */var reIsHostCtor=/^\[object .+?Constructor\]$/;/** Used to detect unsigned integer values. */var reIsUint=/^\d+$/;/** Used to match latin-1 supplementary letters (excluding mathematical operators). */var reLatin1=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;/** Used to ensure capturing order of template delimiters. */var reNoMatch=/($^)/;/** Used to match unescaped characters in compiled string literals. */var reUnescapedString=/['\n\r\u2028\u2029\\]/g;/** Used to match words to create compound words. */var reWords=function(){var upper='[A-Z\\xc0-\\xd6\\xd8-\\xde]',lower='[a-z\\xdf-\\xf6\\xf8-\\xff]+';return RegExp(upper+'+(?='+upper+lower+')|'+upper+'?'+lower+'|'+upper+'+|[0-9]+','g');}();/** Used to assign default `context` object properties. */var contextProps=['Array','ArrayBuffer','Date','Error','Float32Array','Float64Array','Function','Int8Array','Int16Array','Int32Array','Math','Number','Object','RegExp','Set','String','_','clearTimeout','isFinite','parseFloat','parseInt','setTimeout','TypeError','Uint8Array','Uint8ClampedArray','Uint16Array','Uint32Array','WeakMap'];/** Used to make template sourceURLs easier to identify. */var templateCounter=-1;/** Used to identify `toStringTag` values of typed arrays. */var typedArrayTags={};typedArrayTags[float32Tag]=typedArrayTags[float64Tag]=typedArrayTags[int8Tag]=typedArrayTags[int16Tag]=typedArrayTags[int32Tag]=typedArrayTags[uint8Tag]=typedArrayTags[uint8ClampedTag]=typedArrayTags[uint16Tag]=typedArrayTags[uint32Tag]=true;typedArrayTags[argsTag]=typedArrayTags[arrayTag]=typedArrayTags[arrayBufferTag]=typedArrayTags[boolTag]=typedArrayTags[dateTag]=typedArrayTags[errorTag]=typedArrayTags[funcTag]=typedArrayTags[mapTag]=typedArrayTags[numberTag]=typedArrayTags[objectTag]=typedArrayTags[regexpTag]=typedArrayTags[setTag]=typedArrayTags[stringTag]=typedArrayTags[weakMapTag]=false;/** Used to identify `toStringTag` values supported by `_.clone`. */var cloneableTags={};cloneableTags[argsTag]=cloneableTags[arrayTag]=cloneableTags[arrayBufferTag]=cloneableTags[boolTag]=cloneableTags[dateTag]=cloneableTags[float32Tag]=cloneableTags[float64Tag]=cloneableTags[int8Tag]=cloneableTags[int16Tag]=cloneableTags[int32Tag]=cloneableTags[numberTag]=cloneableTags[objectTag]=cloneableTags[regexpTag]=cloneableTags[stringTag]=cloneableTags[uint8Tag]=cloneableTags[uint8ClampedTag]=cloneableTags[uint16Tag]=cloneableTags[uint32Tag]=true;cloneableTags[errorTag]=cloneableTags[funcTag]=cloneableTags[mapTag]=cloneableTags[setTag]=cloneableTags[weakMapTag]=false;/** Used to map latin-1 supplementary letters to basic latin letters. */var deburredLetters={'\xc0':'A','\xc1':'A','\xc2':'A','\xc3':'A','\xc4':'A','\xc5':'A','\xe0':'a','\xe1':'a','\xe2':'a','\xe3':'a','\xe4':'a','\xe5':'a','\xc7':'C','\xe7':'c','\xd0':'D','\xf0':'d','\xc8':'E','\xc9':'E','\xca':'E','\xcb':'E','\xe8':'e','\xe9':'e','\xea':'e','\xeb':'e','\xcC':'I','\xcd':'I','\xce':'I','\xcf':'I','\xeC':'i','\xed':'i','\xee':'i','\xef':'i','\xd1':'N','\xf1':'n','\xd2':'O','\xd3':'O','\xd4':'O','\xd5':'O','\xd6':'O','\xd8':'O','\xf2':'o','\xf3':'o','\xf4':'o','\xf5':'o','\xf6':'o','\xf8':'o','\xd9':'U','\xda':'U','\xdb':'U','\xdc':'U','\xf9':'u','\xfa':'u','\xfb':'u','\xfc':'u','\xdd':'Y','\xfd':'y','\xff':'y','\xc6':'Ae','\xe6':'ae','\xde':'Th','\xfe':'th','\xdf':'ss'};/** Used to map characters to HTML entities. */var htmlEscapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'};/** Used to map HTML entities to characters. */var htmlUnescapes={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&#96;':'`'};/** Used to determine if values are of the language type `Object`. */var objectTypes={'function':true,'object':true};/** Used to escape characters for inclusion in compiled regexes. */var regexpEscapes={'0':'x30','1':'x31','2':'x32','3':'x33','4':'x34','5':'x35','6':'x36','7':'x37','8':'x38','9':'x39','A':'x41','B':'x42','C':'x43','D':'x44','E':'x45','F':'x46','a':'x61','b':'x62','c':'x63','d':'x64','e':'x65','f':'x66','n':'x6e','r':'x72','t':'x74','u':'x75','v':'x76','x':'x78'};/** Used to escape characters for inclusion in compiled string literals. */var stringEscapes={'\\':'\\',"'":"'",'\n':'n','\r':'r',"\u2028":'u2028',"\u2029":'u2029'};/** Detect free variable `exports`. */var freeExports=objectTypes[typeof exports==="undefined"?"undefined":_typeof(exports)]&&exports&&!exports.nodeType&&exports;/** Detect free variable `module`. */var freeModule=objectTypes[typeof module==="undefined"?"undefined":_typeof(module)]&&module&&!module.nodeType&&module;/** Detect free variable `global` from Node.js. */var freeGlobal=freeExports&&freeModule&&(typeof commonjsGlobal==="undefined"?"undefined":_typeof(commonjsGlobal))=='object'&&commonjsGlobal&&commonjsGlobal.Object&&commonjsGlobal;/** Detect free variable `self`. */var freeSelf=objectTypes[typeof self==="undefined"?"undefined":_typeof(self)]&&self&&self.Object&&self;/** Detect free variable `window`. */var freeWindow=objectTypes[typeof window==="undefined"?"undefined":_typeof(window)]&&window&&window.Object&&window;/** Detect the popular CommonJS extension `module.exports`. */var moduleExports=freeModule&&freeModule.exports===freeExports&&freeExports;/**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */var root=freeGlobal||freeWindow!==(this&&this.window)&&freeWindow||freeSelf||this;/*--------------------------------------------------------------------------*//**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */function baseCompareAscending(value,other){if(value!==other){var valIsNull=value===null,valIsUndef=value===undefined,valIsReflexive=value===value;var othIsNull=other===null,othIsUndef=other===undefined,othIsReflexive=other===other;if(value>other&&!othIsNull||!valIsReflexive||valIsNull&&!othIsUndef&&othIsReflexive||valIsUndef&&othIsReflexive){return 1;}if(value<other&&!valIsNull||!othIsReflexive||othIsNull&&!valIsUndef&&valIsReflexive||othIsUndef&&valIsReflexive){return-1;}}return 0;}/**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */function baseFindIndex(array,predicate,fromRight){var length=array.length,index=fromRight?length:-1;while(fromRight?index--:++index<length){if(predicate(array[index],index,array)){return index;}}return-1;}/**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */function baseIndexOf(array,value,fromIndex){if(value!==value){return indexOfNaN(array,fromIndex);}var index=fromIndex-1,length=array.length;while(++index<length){if(array[index]===value){return index;}}return-1;}/**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */function baseIsFunction(value){// Avoid a Chakra JIT bug in compatibility modes of IE 11.
// See https://github.com/jashkenas/underscore/issues/1621 for more details.
return typeof value=='function'||false;}/**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */function baseToString(value){return value==null?'':value+'';}/**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */function charsLeftIndex(string,chars){var index=-1,length=string.length;while(++index<length&&chars.indexOf(string.charAt(index))>-1){}return index;}/**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */function charsRightIndex(string,chars){var index=string.length;while(index--&&chars.indexOf(string.charAt(index))>-1){}return index;}/**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */function compareAscending(object,other){return baseCompareAscending(object.criteria,other.criteria)||object.index-other.index;}/**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */function compareMultiple(object,other,orders){var index=-1,objCriteria=object.criteria,othCriteria=other.criteria,length=objCriteria.length,ordersLength=orders.length;while(++index<length){var result=baseCompareAscending(objCriteria[index],othCriteria[index]);if(result){if(index>=ordersLength){return result;}var order=orders[index];return result*(order==='asc'||order===true?1:-1);}}// Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
// that causes it, under certain circumstances, to provide the same value for
// `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
// for more details.
//
// This also ensures a stable sort in V8 and other engines.
// See https://code.google.com/p/v8/issues/detail?id=90 for more details.
return object.index-other.index;}/**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */function deburrLetter(letter){return deburredLetters[letter];}/**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */function escapeHtmlChar(chr){return htmlEscapes[chr];}/**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */function escapeRegExpChar(chr,leadingChar,whitespaceChar){if(leadingChar){chr=regexpEscapes[chr];}else if(whitespaceChar){chr=stringEscapes[chr];}return'\\'+chr;}/**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */function escapeStringChar(chr){return'\\'+stringEscapes[chr];}/**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */function indexOfNaN(array,fromIndex,fromRight){var length=array.length,index=fromIndex+(fromRight?0:-1);while(fromRight?index--:++index<length){var other=array[index];if(other!==other){return index;}}return-1;}/**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */function isObjectLike(value){return!!value&&(typeof value==="undefined"?"undefined":_typeof(value))=='object';}/**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */function isSpace(charCode){return charCode<=160&&charCode>=9&&charCode<=13||charCode==32||charCode==160||charCode==5760||charCode==6158||charCode>=8192&&(charCode<=8202||charCode==8232||charCode==8233||charCode==8239||charCode==8287||charCode==12288||charCode==65279);}/**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */function replaceHolders(array,placeholder){var index=-1,length=array.length,resIndex=-1,result=[];while(++index<length){if(array[index]===placeholder){array[index]=PLACEHOLDER;result[++resIndex]=index;}}return result;}/**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */function sortedUniq(array,iteratee){var seen,index=-1,length=array.length,resIndex=-1,result=[];while(++index<length){var value=array[index],computed=iteratee?iteratee(value,index,array):value;if(!index||seen!==computed){seen=computed;result[++resIndex]=value;}}return result;}/**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */function trimmedLeftIndex(string){var index=-1,length=string.length;while(++index<length&&isSpace(string.charCodeAt(index))){}return index;}/**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */function trimmedRightIndex(string){var index=string.length;while(index--&&isSpace(string.charCodeAt(index))){}return index;}/**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */function unescapeHtmlChar(chr){return htmlUnescapes[chr];}/*--------------------------------------------------------------------------*//**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */function runInContext(context){// Avoid issues with some ES3 environments that attempt to use values, named
// after built-in constructors like `Object`, for the creation of literals.
// ES5 clears this up by stating that literals must use built-in constructors.
// See https://es5.github.io/#x11.1.5 for more details.
context=context?_.defaults(root.Object(),context,_.pick(root,contextProps)):root;/** Native constructor references. */var Array=context.Array,Date=context.Date,Error=context.Error,Function=context.Function,Math=context.Math,Number=context.Number,Object=context.Object,RegExp=context.RegExp,String=context.String,TypeError=context.TypeError;/** Used for native method references. */var arrayProto=Array.prototype,objectProto=Object.prototype,stringProto=String.prototype;/** Used to resolve the decompiled source of functions. */var fnToString=Function.prototype.toString;/** Used to check objects for own properties. */var hasOwnProperty=objectProto.hasOwnProperty;/** Used to generate unique IDs. */var idCounter=0;/**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */var objToString=objectProto.toString;/** Used to restore the original `_` reference in `_.noConflict`. */var oldDash=root._;/** Used to detect if a method is native. */var reIsNative=RegExp('^'+fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')+'$');/** Native method references. */var ArrayBuffer=context.ArrayBuffer,clearTimeout=context.clearTimeout,parseFloat=context.parseFloat,pow=Math.pow,propertyIsEnumerable=objectProto.propertyIsEnumerable,Set=getNative(context,'Set'),setTimeout=context.setTimeout,splice=arrayProto.splice,Uint8Array=context.Uint8Array,WeakMap=getNative(context,'WeakMap');/* Native method references for those with the same name as other `lodash` methods. */var nativeCeil=Math.ceil,nativeCreate=getNative(Object,'create'),nativeFloor=Math.floor,nativeIsArray=getNative(Array,'isArray'),nativeIsFinite=context.isFinite,nativeKeys=getNative(Object,'keys'),nativeMax=Math.max,nativeMin=Math.min,nativeNow=getNative(Date,'now'),nativeParseInt=context.parseInt,nativeRandom=Math.random;/** Used as references for `-Infinity` and `Infinity`. */var NEGATIVE_INFINITY=Number.NEGATIVE_INFINITY,POSITIVE_INFINITY=Number.POSITIVE_INFINITY;/** Used as references for the maximum length and index of an array. */var MAX_ARRAY_LENGTH=4294967295,MAX_ARRAY_INDEX=MAX_ARRAY_LENGTH-1,HALF_MAX_ARRAY_LENGTH=MAX_ARRAY_LENGTH>>>1;/**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */var MAX_SAFE_INTEGER=9007199254740991;/** Used to store function metadata. */var metaMap=WeakMap&&new WeakMap();/** Used to lookup unminified function names. */var realNames={};/*------------------------------------------------------------------------*//**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */function lodash(value){if(isObjectLike(value)&&!isArray(value)&&!(value instanceof LazyWrapper)){if(value instanceof LodashWrapper){return value;}if(hasOwnProperty.call(value,'__chain__')&&hasOwnProperty.call(value,'__wrapped__')){return wrapperClone(value);}}return new LodashWrapper(value);}/**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */function baseLodash(){}// No operation performed.
/**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */function LodashWrapper(value,chainAll,actions){this.__wrapped__=value;this.__actions__=actions||[];this.__chain__=!!chainAll;}/**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */var support=lodash.support={};/**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */lodash.templateSettings={/**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */'escape':reEscape,/**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */'evaluate':reEvaluate,/**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */'interpolate':reInterpolate,/**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */'variable':'',/**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */'imports':{/**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */'_':lodash}};/*------------------------------------------------------------------------*//**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */function LazyWrapper(value){this.__wrapped__=value;this.__actions__=[];this.__dir__=1;this.__filtered__=false;this.__iteratees__=[];this.__takeCount__=POSITIVE_INFINITY;this.__views__=[];}/**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */function lazyClone(){var result=new LazyWrapper(this.__wrapped__);result.__actions__=arrayCopy(this.__actions__);result.__dir__=this.__dir__;result.__filtered__=this.__filtered__;result.__iteratees__=arrayCopy(this.__iteratees__);result.__takeCount__=this.__takeCount__;result.__views__=arrayCopy(this.__views__);return result;}/**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */function lazyReverse(){if(this.__filtered__){var result=new LazyWrapper(this);result.__dir__=-1;result.__filtered__=true;}else{result=this.clone();result.__dir__*=-1;}return result;}/**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */function lazyValue(){var array=this.__wrapped__.value(),dir=this.__dir__,isArr=isArray(array),isRight=dir<0,arrLength=isArr?array.length:0,view=getView(0,arrLength,this.__views__),start=view.start,end=view.end,length=end-start,index=isRight?end:start-1,iteratees=this.__iteratees__,iterLength=iteratees.length,resIndex=0,takeCount=nativeMin(length,this.__takeCount__);if(!isArr||arrLength<LARGE_ARRAY_SIZE||arrLength==length&&takeCount==length){return baseWrapperValue(isRight&&isArr?array.reverse():array,this.__actions__);}var result=[];outer:while(length--&&resIndex<takeCount){index+=dir;var iterIndex=-1,value=array[index];while(++iterIndex<iterLength){var data=iteratees[iterIndex],iteratee=data.iteratee,type=data.type,computed=iteratee(value);if(type==LAZY_MAP_FLAG){value=computed;}else if(!computed){if(type==LAZY_FILTER_FLAG){continue outer;}else{break outer;}}}result[resIndex++]=value;}return result;}/*------------------------------------------------------------------------*//**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */function MapCache(){this.__data__={};}/**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */function mapDelete(key){return this.has(key)&&delete this.__data__[key];}/**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */function mapGet(key){return key=='__proto__'?undefined:this.__data__[key];}/**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */function mapHas(key){return key!='__proto__'&&hasOwnProperty.call(this.__data__,key);}/**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */function mapSet(key,value){if(key!='__proto__'){this.__data__[key]=value;}return this;}/*------------------------------------------------------------------------*//**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */function SetCache(values){var length=values?values.length:0;this.data={'hash':nativeCreate(null),'set':new Set()};while(length--){this.push(values[length]);}}/**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */function cacheIndexOf(cache,value){var data=cache.data,result=typeof value=='string'||isObject(value)?data.set.has(value):data.hash[value];return result?0:-1;}/**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */function cachePush(value){var data=this.data;if(typeof value=='string'||isObject(value)){data.set.add(value);}else{data.hash[value]=true;}}/*------------------------------------------------------------------------*//**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */function arrayConcat(array,other){var index=-1,length=array.length,othIndex=-1,othLength=other.length,result=Array(length+othLength);while(++index<length){result[index]=array[index];}while(++othIndex<othLength){result[index++]=other[othIndex];}return result;}/**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */function arrayCopy(source,array){var index=-1,length=source.length;array||(array=Array(length));while(++index<length){array[index]=source[index];}return array;}/**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */function arrayEach(array,iteratee){var index=-1,length=array.length;while(++index<length){if(iteratee(array[index],index,array)===false){break;}}return array;}/**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */function arrayEachRight(array,iteratee){var length=array.length;while(length--){if(iteratee(array[length],length,array)===false){break;}}return array;}/**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */function arrayEvery(array,predicate){var index=-1,length=array.length;while(++index<length){if(!predicate(array[index],index,array)){return false;}}return true;}/**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */function arrayExtremum(array,iteratee,comparator,exValue){var index=-1,length=array.length,computed=exValue,result=computed;while(++index<length){var value=array[index],current=+iteratee(value);if(comparator(current,computed)){computed=current;result=value;}}return result;}/**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */function arrayFilter(array,predicate){var index=-1,length=array.length,resIndex=-1,result=[];while(++index<length){var value=array[index];if(predicate(value,index,array)){result[++resIndex]=value;}}return result;}/**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */function arrayMap(array,iteratee){var index=-1,length=array.length,result=Array(length);while(++index<length){result[index]=iteratee(array[index],index,array);}return result;}/**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */function arrayPush(array,values){var index=-1,length=values.length,offset=array.length;while(++index<length){array[offset+index]=values[index];}return array;}/**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */function arrayReduce(array,iteratee,accumulator,initFromArray){var index=-1,length=array.length;if(initFromArray&&length){accumulator=array[++index];}while(++index<length){accumulator=iteratee(accumulator,array[index],index,array);}return accumulator;}/**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */function arrayReduceRight(array,iteratee,accumulator,initFromArray){var length=array.length;if(initFromArray&&length){accumulator=array[--length];}while(length--){accumulator=iteratee(accumulator,array[length],length,array);}return accumulator;}/**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */function arraySome(array,predicate){var index=-1,length=array.length;while(++index<length){if(predicate(array[index],index,array)){return true;}}return false;}/**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */function arraySum(array,iteratee){var length=array.length,result=0;while(length--){result+=+iteratee(array[length])||0;}return result;}/**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */function assignDefaults(objectValue,sourceValue){return objectValue===undefined?sourceValue:objectValue;}/**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */function assignOwnDefaults(objectValue,sourceValue,key,object){return objectValue===undefined||!hasOwnProperty.call(object,key)?sourceValue:objectValue;}/**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */function assignWith(object,source,customizer){var index=-1,props=keys(source),length=props.length;while(++index<length){var key=props[index],value=object[key],result=customizer(value,source[key],key,object,source);if((result===result?result!==value:value===value)||value===undefined&&!(key in object)){object[key]=result;}}return object;}/**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */function baseAssign(object,source){return source==null?object:baseCopy(source,keys(source),object);}/**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */function baseAt(collection,props){var index=-1,isNil=collection==null,isArr=!isNil&&isArrayLike(collection),length=isArr?collection.length:0,propsLength=props.length,result=Array(propsLength);while(++index<propsLength){var key=props[index];if(isArr){result[index]=isIndex(key,length)?collection[key]:undefined;}else{result[index]=isNil?undefined:collection[key];}}return result;}/**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */function baseCopy(source,props,object){object||(object={});var index=-1,length=props.length;while(++index<length){var key=props[index];object[key]=source[key];}return object;}/**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */function baseCallback(func,thisArg,argCount){var type=typeof func==="undefined"?"undefined":_typeof(func);if(type=='function'){return thisArg===undefined?func:bindCallback(func,thisArg,argCount);}if(func==null){return identity;}if(type=='object'){return baseMatches(func);}return thisArg===undefined?property(func):baseMatchesProperty(func,thisArg);}/**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */function baseClone(value,isDeep,customizer,key,object,stackA,stackB){var result;if(customizer){result=object?customizer(value,key,object):customizer(value);}if(result!==undefined){return result;}if(!isObject(value)){return value;}var isArr=isArray(value);if(isArr){result=initCloneArray(value);if(!isDeep){return arrayCopy(value,result);}}else{var tag=objToString.call(value),isFunc=tag==funcTag;if(tag==objectTag||tag==argsTag||isFunc&&!object){result=initCloneObject(isFunc?{}:value);if(!isDeep){return baseAssign(result,value);}}else{return cloneableTags[tag]?initCloneByTag(value,tag,isDeep):object?value:{};}}// Check for circular references and return its corresponding clone.
stackA||(stackA=[]);stackB||(stackB=[]);var length=stackA.length;while(length--){if(stackA[length]==value){return stackB[length];}}// Add the source value to the stack of traversed objects and associate it with its clone.
stackA.push(value);stackB.push(result);// Recursively populate clone (susceptible to call stack limits).
(isArr?arrayEach:baseForOwn)(value,function(subValue,key){result[key]=baseClone(subValue,isDeep,customizer,key,value,stackA,stackB);});return result;}/**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */var baseCreate=function(){function object(){}return function(prototype){if(isObject(prototype)){object.prototype=prototype;var result=new object();object.prototype=undefined;}return result||{};};}();/**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */function baseDelay(func,wait,args){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return setTimeout(function(){func.apply(undefined,args);},wait);}/**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */function baseDifference(array,values){var length=array?array.length:0,result=[];if(!length){return result;}var index=-1,indexOf=getIndexOf(),isCommon=indexOf==baseIndexOf,cache=isCommon&&values.length>=LARGE_ARRAY_SIZE?createCache(values):null,valuesLength=values.length;if(cache){indexOf=cacheIndexOf;isCommon=false;values=cache;}outer:while(++index<length){var value=array[index];if(isCommon&&value===value){var valuesIndex=valuesLength;while(valuesIndex--){if(values[valuesIndex]===value){continue outer;}}result.push(value);}else if(indexOf(values,value,0)<0){result.push(value);}}return result;}/**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */var baseEach=createBaseEach(baseForOwn);/**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */var baseEachRight=createBaseEach(baseForOwnRight,true);/**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */function baseEvery(collection,predicate){var result=true;baseEach(collection,function(value,index,collection){result=!!predicate(value,index,collection);return result;});return result;}/**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */function baseExtremum(collection,iteratee,comparator,exValue){var computed=exValue,result=computed;baseEach(collection,function(value,index,collection){var current=+iteratee(value,index,collection);if(comparator(current,computed)||current===exValue&&current===result){computed=current;result=value;}});return result;}/**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */function baseFill(array,value,start,end){var length=array.length;start=start==null?0:+start||0;if(start<0){start=-start>length?0:length+start;}end=end===undefined||end>length?length:+end||0;if(end<0){end+=length;}length=start>end?0:end>>>0;start>>>=0;while(start<length){array[start++]=value;}return array;}/**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */function baseFilter(collection,predicate){var result=[];baseEach(collection,function(value,index,collection){if(predicate(value,index,collection)){result.push(value);}});return result;}/**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */function baseFind(collection,predicate,eachFunc,retKey){var result;eachFunc(collection,function(value,key,collection){if(predicate(value,key,collection)){result=retKey?key:value;return false;}});return result;}/**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */function baseFlatten(array,isDeep,isStrict,result){result||(result=[]);var index=-1,length=array.length;while(++index<length){var value=array[index];if(isObjectLike(value)&&isArrayLike(value)&&(isStrict||isArray(value)||isArguments(value))){if(isDeep){// Recursively flatten arrays (susceptible to call stack limits).
baseFlatten(value,isDeep,isStrict,result);}else{arrayPush(result,value);}}else if(!isStrict){result[result.length]=value;}}return result;}/**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */var baseFor=createBaseFor();/**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */var baseForRight=createBaseFor(true);/**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */function baseForIn(object,iteratee){return baseFor(object,iteratee,keysIn);}/**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */function baseForOwn(object,iteratee){return baseFor(object,iteratee,keys);}/**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */function baseForOwnRight(object,iteratee){return baseForRight(object,iteratee,keys);}/**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */function baseFunctions(object,props){var index=-1,length=props.length,resIndex=-1,result=[];while(++index<length){var key=props[index];if(isFunction(object[key])){result[++resIndex]=key;}}return result;}/**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */function baseGet(object,path,pathKey){if(object==null){return;}if(pathKey!==undefined&&pathKey in toObject(object)){path=[pathKey];}var index=0,length=path.length;while(object!=null&&index<length){object=object[path[index++]];}return index&&index==length?object:undefined;}/**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */function baseIsEqual(value,other,customizer,isLoose,stackA,stackB){if(value===other){return true;}if(value==null||other==null||!isObject(value)&&!isObjectLike(other)){return value!==value&&other!==other;}return baseIsEqualDeep(value,other,baseIsEqual,customizer,isLoose,stackA,stackB);}/**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function baseIsEqualDeep(object,other,equalFunc,customizer,isLoose,stackA,stackB){var objIsArr=isArray(object),othIsArr=isArray(other),objTag=arrayTag,othTag=arrayTag;if(!objIsArr){objTag=objToString.call(object);if(objTag==argsTag){objTag=objectTag;}else if(objTag!=objectTag){objIsArr=isTypedArray(object);}}if(!othIsArr){othTag=objToString.call(other);if(othTag==argsTag){othTag=objectTag;}else if(othTag!=objectTag){othIsArr=isTypedArray(other);}}var objIsObj=objTag==objectTag,othIsObj=othTag==objectTag,isSameTag=objTag==othTag;if(isSameTag&&!(objIsArr||objIsObj)){return equalByTag(object,other,objTag);}if(!isLoose){var objIsWrapped=objIsObj&&hasOwnProperty.call(object,'__wrapped__'),othIsWrapped=othIsObj&&hasOwnProperty.call(other,'__wrapped__');if(objIsWrapped||othIsWrapped){return equalFunc(objIsWrapped?object.value():object,othIsWrapped?other.value():other,customizer,isLoose,stackA,stackB);}}if(!isSameTag){return false;}// Assume cyclic values are equal.
// For more information on detecting circular references see https://es5.github.io/#JO.
stackA||(stackA=[]);stackB||(stackB=[]);var length=stackA.length;while(length--){if(stackA[length]==object){return stackB[length]==other;}}// Add `object` and `other` to the stack of traversed objects.
stackA.push(object);stackB.push(other);var result=(objIsArr?equalArrays:equalObjects)(object,other,equalFunc,customizer,isLoose,stackA,stackB);stackA.pop();stackB.pop();return result;}/**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */function baseIsMatch(object,matchData,customizer){var index=matchData.length,length=index,noCustomizer=!customizer;if(object==null){return!length;}object=toObject(object);while(index--){var data=matchData[index];if(noCustomizer&&data[2]?data[1]!==object[data[0]]:!(data[0]in object)){return false;}}while(++index<length){data=matchData[index];var key=data[0],objValue=object[key],srcValue=data[1];if(noCustomizer&&data[2]){if(objValue===undefined&&!(key in object)){return false;}}else{var result=customizer?customizer(objValue,srcValue,key):undefined;if(!(result===undefined?baseIsEqual(srcValue,objValue,customizer,true):result)){return false;}}}return true;}/**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */function baseMap(collection,iteratee){var index=-1,result=isArrayLike(collection)?Array(collection.length):[];baseEach(collection,function(value,key,collection){result[++index]=iteratee(value,key,collection);});return result;}/**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */function baseMatches(source){var matchData=getMatchData(source);if(matchData.length==1&&matchData[0][2]){var key=matchData[0][0],value=matchData[0][1];return function(object){if(object==null){return false;}return object[key]===value&&(value!==undefined||key in toObject(object));};}return function(object){return baseIsMatch(object,matchData);};}/**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */function baseMatchesProperty(path,srcValue){var isArr=isArray(path),isCommon=isKey(path)&&isStrictComparable(srcValue),pathKey=path+'';path=toPath(path);return function(object){if(object==null){return false;}var key=pathKey;object=toObject(object);if((isArr||!isCommon)&&!(key in object)){object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));if(object==null){return false;}key=last(path);object=toObject(object);}return object[key]===srcValue?srcValue!==undefined||key in object:baseIsEqual(srcValue,object[key],undefined,true);};}/**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */function baseMerge(object,source,customizer,stackA,stackB){if(!isObject(object)){return object;}var isSrcArr=isArrayLike(source)&&(isArray(source)||isTypedArray(source)),props=isSrcArr?undefined:keys(source);arrayEach(props||source,function(srcValue,key){if(props){key=srcValue;srcValue=source[key];}if(isObjectLike(srcValue)){stackA||(stackA=[]);stackB||(stackB=[]);baseMergeDeep(object,source,key,baseMerge,customizer,stackA,stackB);}else{var value=object[key],result=customizer?customizer(value,srcValue,key,object,source):undefined,isCommon=result===undefined;if(isCommon){result=srcValue;}if((result!==undefined||isSrcArr&&!(key in object))&&(isCommon||(result===result?result!==value:value===value))){object[key]=result;}}});return object;}/**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function baseMergeDeep(object,source,key,mergeFunc,customizer,stackA,stackB){var length=stackA.length,srcValue=source[key];while(length--){if(stackA[length]==srcValue){object[key]=stackB[length];return;}}var value=object[key],result=customizer?customizer(value,srcValue,key,object,source):undefined,isCommon=result===undefined;if(isCommon){result=srcValue;if(isArrayLike(srcValue)&&(isArray(srcValue)||isTypedArray(srcValue))){result=isArray(value)?value:isArrayLike(value)?arrayCopy(value):[];}else if(isPlainObject(srcValue)||isArguments(srcValue)){result=isArguments(value)?toPlainObject(value):isPlainObject(value)?value:{};}else{isCommon=false;}}// Add the source value to the stack of traversed objects and associate
// it with its merged value.
stackA.push(srcValue);stackB.push(result);if(isCommon){// Recursively merge objects and arrays (susceptible to call stack limits).
object[key]=mergeFunc(result,srcValue,customizer,stackA,stackB);}else if(result===result?result!==value:value===value){object[key]=result;}}/**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */function baseProperty(key){return function(object){return object==null?undefined:object[key];};}/**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */function basePropertyDeep(path){var pathKey=path+'';path=toPath(path);return function(object){return baseGet(object,path,pathKey);};}/**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */function basePullAt(array,indexes){var length=array?indexes.length:0;while(length--){var index=indexes[length];if(index!=previous&&isIndex(index)){var previous=index;splice.call(array,index,1);}}return array;}/**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */function baseRandom(min,max){return min+nativeFloor(nativeRandom()*(max-min+1));}/**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */function baseReduce(collection,iteratee,accumulator,initFromCollection,eachFunc){eachFunc(collection,function(value,index,collection){accumulator=initFromCollection?(initFromCollection=false,value):iteratee(accumulator,value,index,collection);});return accumulator;}/**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */var baseSetData=!metaMap?identity:function(func,data){metaMap.set(func,data);return func;};/**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */function baseSlice(array,start,end){var index=-1,length=array.length;start=start==null?0:+start||0;if(start<0){start=-start>length?0:length+start;}end=end===undefined||end>length?length:+end||0;if(end<0){end+=length;}length=start>end?0:end-start>>>0;start>>>=0;var result=Array(length);while(++index<length){result[index]=array[index+start];}return result;}/**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */function baseSome(collection,predicate){var result;baseEach(collection,function(value,index,collection){result=predicate(value,index,collection);return!result;});return!!result;}/**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */function baseSortBy(array,comparer){var length=array.length;array.sort(comparer);while(length--){array[length]=array[length].value;}return array;}/**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */function baseSortByOrder(collection,iteratees,orders){var callback=getCallback(),index=-1;iteratees=arrayMap(iteratees,function(iteratee){return callback(iteratee);});var result=baseMap(collection,function(value){var criteria=arrayMap(iteratees,function(iteratee){return iteratee(value);});return{'criteria':criteria,'index':++index,'value':value};});return baseSortBy(result,function(object,other){return compareMultiple(object,other,orders);});}/**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */function baseSum(collection,iteratee){var result=0;baseEach(collection,function(value,index,collection){result+=+iteratee(value,index,collection)||0;});return result;}/**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */function baseUniq(array,iteratee){var index=-1,indexOf=getIndexOf(),length=array.length,isCommon=indexOf==baseIndexOf,isLarge=isCommon&&length>=LARGE_ARRAY_SIZE,seen=isLarge?createCache():null,result=[];if(seen){indexOf=cacheIndexOf;isCommon=false;}else{isLarge=false;seen=iteratee?[]:result;}outer:while(++index<length){var value=array[index],computed=iteratee?iteratee(value,index,array):value;if(isCommon&&value===value){var seenIndex=seen.length;while(seenIndex--){if(seen[seenIndex]===computed){continue outer;}}if(iteratee){seen.push(computed);}result.push(value);}else if(indexOf(seen,computed,0)<0){if(iteratee||isLarge){seen.push(computed);}result.push(value);}}return result;}/**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */function baseValues(object,props){var index=-1,length=props.length,result=Array(length);while(++index<length){result[index]=object[props[index]];}return result;}/**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */function baseWhile(array,predicate,isDrop,fromRight){var length=array.length,index=fromRight?length:-1;while((fromRight?index--:++index<length)&&predicate(array[index],index,array)){}return isDrop?baseSlice(array,fromRight?0:index,fromRight?index+1:length):baseSlice(array,fromRight?index+1:0,fromRight?length:index);}/**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */function baseWrapperValue(value,actions){var result=value;if(result instanceof LazyWrapper){result=result.value();}var index=-1,length=actions.length;while(++index<length){var action=actions[index];result=action.func.apply(action.thisArg,arrayPush([result],action.args));}return result;}/**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */function binaryIndex(array,value,retHighest){var low=0,high=array?array.length:low;if(typeof value=='number'&&value===value&&high<=HALF_MAX_ARRAY_LENGTH){while(low<high){var mid=low+high>>>1,computed=array[mid];if((retHighest?computed<=value:computed<value)&&computed!==null){low=mid+1;}else{high=mid;}}return high;}return binaryIndexBy(array,value,identity,retHighest);}/**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */function binaryIndexBy(array,value,iteratee,retHighest){value=iteratee(value);var low=0,high=array?array.length:0,valIsNaN=value!==value,valIsNull=value===null,valIsUndef=value===undefined;while(low<high){var mid=nativeFloor((low+high)/2),computed=iteratee(array[mid]),isDef=computed!==undefined,isReflexive=computed===computed;if(valIsNaN){var setLow=isReflexive||retHighest;}else if(valIsNull){setLow=isReflexive&&isDef&&(retHighest||computed!=null);}else if(valIsUndef){setLow=isReflexive&&(retHighest||isDef);}else if(computed==null){setLow=false;}else{setLow=retHighest?computed<=value:computed<value;}if(setLow){low=mid+1;}else{high=mid;}}return nativeMin(high,MAX_ARRAY_INDEX);}/**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */function bindCallback(func,thisArg,argCount){if(typeof func!='function'){return identity;}if(thisArg===undefined){return func;}switch(argCount){case 1:return function(value){return func.call(thisArg,value);};case 3:return function(value,index,collection){return func.call(thisArg,value,index,collection);};case 4:return function(accumulator,value,index,collection){return func.call(thisArg,accumulator,value,index,collection);};case 5:return function(value,other,key,object,source){return func.call(thisArg,value,other,key,object,source);};}return function(){return func.apply(thisArg,arguments);};}/**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */function bufferClone(buffer){var result=new ArrayBuffer(buffer.byteLength),view=new Uint8Array(result);view.set(new Uint8Array(buffer));return result;}/**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */function composeArgs(args,partials,holders){var holdersLength=holders.length,argsIndex=-1,argsLength=nativeMax(args.length-holdersLength,0),leftIndex=-1,leftLength=partials.length,result=Array(leftLength+argsLength);while(++leftIndex<leftLength){result[leftIndex]=partials[leftIndex];}while(++argsIndex<holdersLength){result[holders[argsIndex]]=args[argsIndex];}while(argsLength--){result[leftIndex++]=args[argsIndex++];}return result;}/**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */function composeArgsRight(args,partials,holders){var holdersIndex=-1,holdersLength=holders.length,argsIndex=-1,argsLength=nativeMax(args.length-holdersLength,0),rightIndex=-1,rightLength=partials.length,result=Array(argsLength+rightLength);while(++argsIndex<argsLength){result[argsIndex]=args[argsIndex];}var offset=argsIndex;while(++rightIndex<rightLength){result[offset+rightIndex]=partials[rightIndex];}while(++holdersIndex<holdersLength){result[offset+holders[holdersIndex]]=args[argsIndex++];}return result;}/**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */function createAggregator(setter,initializer){return function(collection,iteratee,thisArg){var result=initializer?initializer():{};iteratee=getCallback(iteratee,thisArg,3);if(isArray(collection)){var index=-1,length=collection.length;while(++index<length){var value=collection[index];setter(result,value,iteratee(value,index,collection),collection);}}else{baseEach(collection,function(value,key,collection){setter(result,value,iteratee(value,key,collection),collection);});}return result;};}/**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */function createAssigner(assigner){return restParam(function(object,sources){var index=-1,length=object==null?0:sources.length,customizer=length>2?sources[length-2]:undefined,guard=length>2?sources[2]:undefined,thisArg=length>1?sources[length-1]:undefined;if(typeof customizer=='function'){customizer=bindCallback(customizer,thisArg,5);length-=2;}else{customizer=typeof thisArg=='function'?thisArg:undefined;length-=customizer?1:0;}if(guard&&isIterateeCall(sources[0],sources[1],guard)){customizer=length<3?undefined:customizer;length=1;}while(++index<length){var source=sources[index];if(source){assigner(object,source,customizer);}}return object;});}/**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */function createBaseEach(eachFunc,fromRight){return function(collection,iteratee){var length=collection?getLength(collection):0;if(!isLength(length)){return eachFunc(collection,iteratee);}var index=fromRight?length:-1,iterable=toObject(collection);while(fromRight?index--:++index<length){if(iteratee(iterable[index],index,iterable)===false){break;}}return collection;};}/**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */function createBaseFor(fromRight){return function(object,iteratee,keysFunc){var iterable=toObject(object),props=keysFunc(object),length=props.length,index=fromRight?length:-1;while(fromRight?index--:++index<length){var key=props[index];if(iteratee(iterable[key],key,iterable)===false){break;}}return object;};}/**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */function createBindWrapper(func,thisArg){var Ctor=createCtorWrapper(func);function wrapper(){var fn=this&&this!==root&&this instanceof wrapper?Ctor:func;return fn.apply(thisArg,arguments);}return wrapper;}/**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */function createCache(values){return nativeCreate&&Set?new SetCache(values):null;}/**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */function createCompounder(callback){return function(string){var index=-1,array=words(deburr(string)),length=array.length,result='';while(++index<length){result=callback(result,array[index],index);}return result;};}/**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */function createCtorWrapper(Ctor){return function(){// Use a `switch` statement to work with class constructors.
// See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
// for more details.
var args=arguments;switch(args.length){case 0:return new Ctor();case 1:return new Ctor(args[0]);case 2:return new Ctor(args[0],args[1]);case 3:return new Ctor(args[0],args[1],args[2]);case 4:return new Ctor(args[0],args[1],args[2],args[3]);case 5:return new Ctor(args[0],args[1],args[2],args[3],args[4]);case 6:return new Ctor(args[0],args[1],args[2],args[3],args[4],args[5]);case 7:return new Ctor(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);}var thisBinding=baseCreate(Ctor.prototype),result=Ctor.apply(thisBinding,args);// Mimic the constructor's `return` behavior.
// See https://es5.github.io/#x13.2.2 for more details.
return isObject(result)?result:thisBinding;};}/**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */function createCurry(flag){function curryFunc(func,arity,guard){if(guard&&isIterateeCall(func,arity,guard)){arity=undefined;}var result=createWrapper(func,flag,undefined,undefined,undefined,undefined,undefined,arity);result.placeholder=curryFunc.placeholder;return result;}return curryFunc;}/**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */function createDefaults(assigner,customizer){return restParam(function(args){var object=args[0];if(object==null){return object;}args.push(customizer);return assigner.apply(undefined,args);});}/**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */function createExtremum(comparator,exValue){return function(collection,iteratee,thisArg){if(thisArg&&isIterateeCall(collection,iteratee,thisArg)){iteratee=undefined;}iteratee=getCallback(iteratee,thisArg,3);if(iteratee.length==1){collection=isArray(collection)?collection:toIterable(collection);var result=arrayExtremum(collection,iteratee,comparator,exValue);if(!(collection.length&&result===exValue)){return result;}}return baseExtremum(collection,iteratee,comparator,exValue);};}/**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */function createFind(eachFunc,fromRight){return function(collection,predicate,thisArg){predicate=getCallback(predicate,thisArg,3);if(isArray(collection)){var index=baseFindIndex(collection,predicate,fromRight);return index>-1?collection[index]:undefined;}return baseFind(collection,predicate,eachFunc);};}/**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */function createFindIndex(fromRight){return function(array,predicate,thisArg){if(!(array&&array.length)){return-1;}predicate=getCallback(predicate,thisArg,3);return baseFindIndex(array,predicate,fromRight);};}/**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */function createFindKey(objectFunc){return function(object,predicate,thisArg){predicate=getCallback(predicate,thisArg,3);return baseFind(object,predicate,objectFunc,true);};}/**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */function createFlow(fromRight){return function(){var wrapper,length=arguments.length,index=fromRight?length:-1,leftIndex=0,funcs=Array(length);while(fromRight?index--:++index<length){var func=funcs[leftIndex++]=arguments[index];if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}if(!wrapper&&LodashWrapper.prototype.thru&&getFuncName(func)=='wrapper'){wrapper=new LodashWrapper([],true);}}index=wrapper?-1:length;while(++index<length){func=funcs[index];var funcName=getFuncName(func),data=funcName=='wrapper'?getData(func):undefined;if(data&&isLaziable(data[0])&&data[1]==(ARY_FLAG|CURRY_FLAG|PARTIAL_FLAG|REARG_FLAG)&&!data[4].length&&data[9]==1){wrapper=wrapper[getFuncName(data[0])].apply(wrapper,data[3]);}else{wrapper=func.length==1&&isLaziable(func)?wrapper[funcName]():wrapper.thru(func);}}return function(){var args=arguments,value=args[0];if(wrapper&&args.length==1&&isArray(value)&&value.length>=LARGE_ARRAY_SIZE){return wrapper.plant(value).value();}var index=0,result=length?funcs[index].apply(this,args):value;while(++index<length){result=funcs[index].call(this,result);}return result;};};}/**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */function createForEach(arrayFunc,eachFunc){return function(collection,iteratee,thisArg){return typeof iteratee=='function'&&thisArg===undefined&&isArray(collection)?arrayFunc(collection,iteratee):eachFunc(collection,bindCallback(iteratee,thisArg,3));};}/**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */function createForIn(objectFunc){return function(object,iteratee,thisArg){if(typeof iteratee!='function'||thisArg!==undefined){iteratee=bindCallback(iteratee,thisArg,3);}return objectFunc(object,iteratee,keysIn);};}/**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */function createForOwn(objectFunc){return function(object,iteratee,thisArg){if(typeof iteratee!='function'||thisArg!==undefined){iteratee=bindCallback(iteratee,thisArg,3);}return objectFunc(object,iteratee);};}/**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */function createObjectMapper(isMapKeys){return function(object,iteratee,thisArg){var result={};iteratee=getCallback(iteratee,thisArg,3);baseForOwn(object,function(value,key,object){var mapped=iteratee(value,key,object);key=isMapKeys?mapped:key;value=isMapKeys?value:mapped;result[key]=value;});return result;};}/**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */function createPadDir(fromRight){return function(string,length,chars){string=baseToString(string);return(fromRight?string:'')+createPadding(string,length,chars)+(fromRight?'':string);};}/**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */function createPartial(flag){var partialFunc=restParam(function(func,partials){var holders=replaceHolders(partials,partialFunc.placeholder);return createWrapper(func,flag,undefined,partials,holders);});return partialFunc;}/**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */function createReduce(arrayFunc,eachFunc){return function(collection,iteratee,accumulator,thisArg){var initFromArray=arguments.length<3;return typeof iteratee=='function'&&thisArg===undefined&&isArray(collection)?arrayFunc(collection,iteratee,accumulator,initFromArray):baseReduce(collection,getCallback(iteratee,thisArg,4),accumulator,initFromArray,eachFunc);};}/**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */function createHybridWrapper(func,bitmask,thisArg,partials,holders,partialsRight,holdersRight,argPos,ary,arity){var isAry=bitmask&ARY_FLAG,isBind=bitmask&BIND_FLAG,isBindKey=bitmask&BIND_KEY_FLAG,isCurry=bitmask&CURRY_FLAG,isCurryBound=bitmask&CURRY_BOUND_FLAG,isCurryRight=bitmask&CURRY_RIGHT_FLAG,Ctor=isBindKey?undefined:createCtorWrapper(func);function wrapper(){// Avoid `arguments` object use disqualifying optimizations by
// converting it to an array before providing it to other functions.
var length=arguments.length,index=length,args=Array(length);while(index--){args[index]=arguments[index];}if(partials){args=composeArgs(args,partials,holders);}if(partialsRight){args=composeArgsRight(args,partialsRight,holdersRight);}if(isCurry||isCurryRight){var placeholder=wrapper.placeholder,argsHolders=replaceHolders(args,placeholder);length-=argsHolders.length;if(length<arity){var newArgPos=argPos?arrayCopy(argPos):undefined,newArity=nativeMax(arity-length,0),newsHolders=isCurry?argsHolders:undefined,newHoldersRight=isCurry?undefined:argsHolders,newPartials=isCurry?args:undefined,newPartialsRight=isCurry?undefined:args;bitmask|=isCurry?PARTIAL_FLAG:PARTIAL_RIGHT_FLAG;bitmask&=~(isCurry?PARTIAL_RIGHT_FLAG:PARTIAL_FLAG);if(!isCurryBound){bitmask&=~(BIND_FLAG|BIND_KEY_FLAG);}var newData=[func,bitmask,thisArg,newPartials,newsHolders,newPartialsRight,newHoldersRight,newArgPos,ary,newArity],result=createHybridWrapper.apply(undefined,newData);if(isLaziable(func)){setData(result,newData);}result.placeholder=placeholder;return result;}}var thisBinding=isBind?thisArg:this,fn=isBindKey?thisBinding[func]:func;if(argPos){args=reorder(args,argPos);}if(isAry&&ary<args.length){args.length=ary;}if(this&&this!==root&&this instanceof wrapper){fn=Ctor||createCtorWrapper(func);}return fn.apply(thisBinding,args);}return wrapper;}/**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */function createPadding(string,length,chars){var strLength=string.length;length=+length;if(strLength>=length||!nativeIsFinite(length)){return'';}var padLength=length-strLength;chars=chars==null?' ':chars+'';return repeat(chars,nativeCeil(padLength/chars.length)).slice(0,padLength);}/**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */function createPartialWrapper(func,bitmask,thisArg,partials){var isBind=bitmask&BIND_FLAG,Ctor=createCtorWrapper(func);function wrapper(){// Avoid `arguments` object use disqualifying optimizations by
// converting it to an array before providing it `func`.
var argsIndex=-1,argsLength=arguments.length,leftIndex=-1,leftLength=partials.length,args=Array(leftLength+argsLength);while(++leftIndex<leftLength){args[leftIndex]=partials[leftIndex];}while(argsLength--){args[leftIndex++]=arguments[++argsIndex];}var fn=this&&this!==root&&this instanceof wrapper?Ctor:func;return fn.apply(isBind?thisArg:this,args);}return wrapper;}/**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */function createRound(methodName){var func=Math[methodName];return function(number,precision){precision=precision===undefined?0:+precision||0;if(precision){precision=pow(10,precision);return func(number*precision)/precision;}return func(number);};}/**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */function createSortedIndex(retHighest){return function(array,value,iteratee,thisArg){var callback=getCallback(iteratee);return iteratee==null&&callback===baseCallback?binaryIndex(array,value,retHighest):binaryIndexBy(array,value,callback(iteratee,thisArg,1),retHighest);};}/**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */function createWrapper(func,bitmask,thisArg,partials,holders,argPos,ary,arity){var isBindKey=bitmask&BIND_KEY_FLAG;if(!isBindKey&&typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}var length=partials?partials.length:0;if(!length){bitmask&=~(PARTIAL_FLAG|PARTIAL_RIGHT_FLAG);partials=holders=undefined;}length-=holders?holders.length:0;if(bitmask&PARTIAL_RIGHT_FLAG){var partialsRight=partials,holdersRight=holders;partials=holders=undefined;}var data=isBindKey?undefined:getData(func),newData=[func,bitmask,thisArg,partials,holders,partialsRight,holdersRight,argPos,ary,arity];if(data){mergeData(newData,data);bitmask=newData[1];arity=newData[9];}newData[9]=arity==null?isBindKey?0:func.length:nativeMax(arity-length,0)||0;if(bitmask==BIND_FLAG){var result=createBindWrapper(newData[0],newData[2]);}else if((bitmask==PARTIAL_FLAG||bitmask==(BIND_FLAG|PARTIAL_FLAG))&&!newData[4].length){result=createPartialWrapper.apply(undefined,newData);}else{result=createHybridWrapper.apply(undefined,newData);}var setter=data?baseSetData:setData;return setter(result,newData);}/**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */function equalArrays(array,other,equalFunc,customizer,isLoose,stackA,stackB){var index=-1,arrLength=array.length,othLength=other.length;if(arrLength!=othLength&&!(isLoose&&othLength>arrLength)){return false;}// Ignore non-index properties.
while(++index<arrLength){var arrValue=array[index],othValue=other[index],result=customizer?customizer(isLoose?othValue:arrValue,isLoose?arrValue:othValue,index):undefined;if(result!==undefined){if(result){continue;}return false;}// Recursively compare arrays (susceptible to call stack limits).
if(isLoose){if(!arraySome(other,function(othValue){return arrValue===othValue||equalFunc(arrValue,othValue,customizer,isLoose,stackA,stackB);})){return false;}}else if(!(arrValue===othValue||equalFunc(arrValue,othValue,customizer,isLoose,stackA,stackB))){return false;}}return true;}/**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function equalByTag(object,other,tag){switch(tag){case boolTag:case dateTag:// Coerce dates and booleans to numbers, dates to milliseconds and booleans
// to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
return+object==+other;case errorTag:return object.name==other.name&&object.message==other.message;case numberTag:// Treat `NaN` vs. `NaN` as equal.
return object!=+object?other!=+other:object==+other;case regexpTag:case stringTag:// Coerce regexes to strings and treat strings primitives and string
// objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
return object==other+'';}return false;}/**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function equalObjects(object,other,equalFunc,customizer,isLoose,stackA,stackB){var objProps=keys(object),objLength=objProps.length,othProps=keys(other),othLength=othProps.length;if(objLength!=othLength&&!isLoose){return false;}var index=objLength;while(index--){var key=objProps[index];if(!(isLoose?key in other:hasOwnProperty.call(other,key))){return false;}}var skipCtor=isLoose;while(++index<objLength){key=objProps[index];var objValue=object[key],othValue=other[key],result=customizer?customizer(isLoose?othValue:objValue,isLoose?objValue:othValue,key):undefined;// Recursively compare objects (susceptible to call stack limits).
if(!(result===undefined?equalFunc(objValue,othValue,customizer,isLoose,stackA,stackB):result)){return false;}skipCtor||(skipCtor=key=='constructor');}if(!skipCtor){var objCtor=object.constructor,othCtor=other.constructor;// Non `Object` object instances with different constructors are not equal.
if(objCtor!=othCtor&&'constructor'in object&&'constructor'in other&&!(typeof objCtor=='function'&&objCtor instanceof objCtor&&typeof othCtor=='function'&&othCtor instanceof othCtor)){return false;}}return true;}/**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */function getCallback(func,thisArg,argCount){var result=lodash.callback||callback;result=result===callback?baseCallback:result;return argCount?result(func,thisArg,argCount):result;}/**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */var getData=!metaMap?noop:function(func){return metaMap.get(func);};/**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */function getFuncName(func){var result=func.name,array=realNames[result],length=array?array.length:0;while(length--){var data=array[length],otherFunc=data.func;if(otherFunc==null||otherFunc==func){return data.name;}}return result;}/**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */function getIndexOf(collection,target,fromIndex){var result=lodash.indexOf||indexOf;result=result===indexOf?baseIndexOf:result;return collection?result(collection,target,fromIndex):result;}/**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */var getLength=baseProperty('length');/**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */function getMatchData(object){var result=pairs(object),length=result.length;while(length--){result[length][2]=isStrictComparable(result[length][1]);}return result;}/**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */function getNative(object,key){var value=object==null?undefined:object[key];return isNative(value)?value:undefined;}/**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */function getView(start,end,transforms){var index=-1,length=transforms.length;while(++index<length){var data=transforms[index],size=data.size;switch(data.type){case'drop':start+=size;break;case'dropRight':end-=size;break;case'take':end=nativeMin(end,start+size);break;case'takeRight':start=nativeMax(start,end-size);break;}}return{'start':start,'end':end};}/**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */function initCloneArray(array){var length=array.length,result=new array.constructor(length);// Add array properties assigned by `RegExp#exec`.
if(length&&typeof array[0]=='string'&&hasOwnProperty.call(array,'index')){result.index=array.index;result.input=array.input;}return result;}/**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */function initCloneObject(object){var Ctor=object.constructor;if(!(typeof Ctor=='function'&&Ctor instanceof Ctor)){Ctor=Object;}return new Ctor();}/**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */function initCloneByTag(object,tag,isDeep){var Ctor=object.constructor;switch(tag){case arrayBufferTag:return bufferClone(object);case boolTag:case dateTag:return new Ctor(+object);case float32Tag:case float64Tag:case int8Tag:case int16Tag:case int32Tag:case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:var buffer=object.buffer;return new Ctor(isDeep?bufferClone(buffer):buffer,object.byteOffset,object.length);case numberTag:case stringTag:return new Ctor(object);case regexpTag:var result=new Ctor(object.source,reFlags.exec(object));result.lastIndex=object.lastIndex;}return result;}/**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */function invokePath(object,path,args){if(object!=null&&!isKey(path,object)){path=toPath(path);object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));path=last(path);}var func=object==null?object:object[path];return func==null?undefined:func.apply(object,args);}/**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */function isArrayLike(value){return value!=null&&isLength(getLength(value));}/**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */function isIndex(value,length){value=typeof value=='number'||reIsUint.test(value)?+value:-1;length=length==null?MAX_SAFE_INTEGER:length;return value>-1&&value%1==0&&value<length;}/**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */function isIterateeCall(value,index,object){if(!isObject(object)){return false;}var type=typeof index==="undefined"?"undefined":_typeof(index);if(type=='number'?isArrayLike(object)&&isIndex(index,object.length):type=='string'&&index in object){var other=object[index];return value===value?value===other:other!==other;}return false;}/**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */function isKey(value,object){var type=typeof value==="undefined"?"undefined":_typeof(value);if(type=='string'&&reIsPlainProp.test(value)||type=='number'){return true;}if(isArray(value)){return false;}var result=!reIsDeepProp.test(value);return result||object!=null&&value in toObject(object);}/**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */function isLaziable(func){var funcName=getFuncName(func);if(!(funcName in LazyWrapper.prototype)){return false;}var other=lodash[funcName];if(func===other){return true;}var data=getData(other);return!!data&&func===data[0];}/**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */function isLength(value){return typeof value=='number'&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER;}/**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */function isStrictComparable(value){return value===value&&!isObject(value);}/**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */function mergeData(data,source){var bitmask=data[1],srcBitmask=source[1],newBitmask=bitmask|srcBitmask,isCommon=newBitmask<ARY_FLAG;var isCombo=srcBitmask==ARY_FLAG&&bitmask==CURRY_FLAG||srcBitmask==ARY_FLAG&&bitmask==REARG_FLAG&&data[7].length<=source[8]||srcBitmask==(ARY_FLAG|REARG_FLAG)&&bitmask==CURRY_FLAG;// Exit early if metadata can't be merged.
if(!(isCommon||isCombo)){return data;}// Use source `thisArg` if available.
if(srcBitmask&BIND_FLAG){data[2]=source[2];// Set when currying a bound function.
newBitmask|=bitmask&BIND_FLAG?0:CURRY_BOUND_FLAG;}// Compose partial arguments.
var value=source[3];if(value){var partials=data[3];data[3]=partials?composeArgs(partials,value,source[4]):arrayCopy(value);data[4]=partials?replaceHolders(data[3],PLACEHOLDER):arrayCopy(source[4]);}// Compose partial right arguments.
value=source[5];if(value){partials=data[5];data[5]=partials?composeArgsRight(partials,value,source[6]):arrayCopy(value);data[6]=partials?replaceHolders(data[5],PLACEHOLDER):arrayCopy(source[6]);}// Use source `argPos` if available.
value=source[7];if(value){data[7]=arrayCopy(value);}// Use source `ary` if it's smaller.
if(srcBitmask&ARY_FLAG){data[8]=data[8]==null?source[8]:nativeMin(data[8],source[8]);}// Use source `arity` if one is not provided.
if(data[9]==null){data[9]=source[9];}// Use source `func` and merge bitmasks.
data[0]=source[0];data[1]=newBitmask;return data;}/**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */function mergeDefaults(objectValue,sourceValue){return objectValue===undefined?sourceValue:merge(objectValue,sourceValue,mergeDefaults);}/**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */function pickByArray(object,props){object=toObject(object);var index=-1,length=props.length,result={};while(++index<length){var key=props[index];if(key in object){result[key]=object[key];}}return result;}/**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */function pickByCallback(object,predicate){var result={};baseForIn(object,function(value,key,object){if(predicate(value,key,object)){result[key]=value;}});return result;}/**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */function reorder(array,indexes){var arrLength=array.length,length=nativeMin(indexes.length,arrLength),oldArray=arrayCopy(array);while(length--){var index=indexes[length];array[length]=isIndex(index,arrLength)?oldArray[index]:undefined;}return array;}/**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */var setData=function(){var count=0,lastCalled=0;return function(key,value){var stamp=now(),remaining=HOT_SPAN-(stamp-lastCalled);lastCalled=stamp;if(remaining>0){if(++count>=HOT_COUNT){return key;}}else{count=0;}return baseSetData(key,value);};}();/**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */function shimKeys(object){var props=keysIn(object),propsLength=props.length,length=propsLength&&object.length;var allowIndexes=!!length&&isLength(length)&&(isArray(object)||isArguments(object));var index=-1,result=[];while(++index<propsLength){var key=props[index];if(allowIndexes&&isIndex(key,length)||hasOwnProperty.call(object,key)){result.push(key);}}return result;}/**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */function toIterable(value){if(value==null){return[];}if(!isArrayLike(value)){return values(value);}return isObject(value)?value:Object(value);}/**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */function toObject(value){return isObject(value)?value:Object(value);}/**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */function toPath(value){if(isArray(value)){return value;}var result=[];baseToString(value).replace(rePropName,function(match,number,quote,string){result.push(quote?string.replace(reEscapeChar,'$1'):number||match);});return result;}/**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */function wrapperClone(wrapper){return wrapper instanceof LazyWrapper?wrapper.clone():new LodashWrapper(wrapper.__wrapped__,wrapper.__chain__,arrayCopy(wrapper.__actions__));}/*------------------------------------------------------------------------*//**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */function chunk(array,size,guard){if(guard?isIterateeCall(array,size,guard):size==null){size=1;}else{size=nativeMax(nativeFloor(size)||1,1);}var index=0,length=array?array.length:0,resIndex=-1,result=Array(nativeCeil(length/size));while(index<length){result[++resIndex]=baseSlice(array,index,index+=size);}return result;}/**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */function compact(array){var index=-1,length=array?array.length:0,resIndex=-1,result=[];while(++index<length){var value=array[index];if(value){result[++resIndex]=value;}}return result;}/**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */var difference=restParam(function(array,values){return isObjectLike(array)&&isArrayLike(array)?baseDifference(array,baseFlatten(values,false,true)):[];});/**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */function drop(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}return baseSlice(array,n<0?0:n);}/**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */function dropRight(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}n=length-(+n||0);return baseSlice(array,0,n<0?0:n);}/**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */function dropRightWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3),true,true):[];}/**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */function dropWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3),true):[];}/**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */function fill(array,value,start,end){var length=array?array.length:0;if(!length){return[];}if(start&&typeof start!='number'&&isIterateeCall(array,value,start)){start=0;end=length;}return baseFill(array,value,start,end);}/**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */var findIndex=createFindIndex();/**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */var findLastIndex=createFindIndex(true);/**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */function first(array){return array?array[0]:undefined;}/**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */function flatten(array,isDeep,guard){var length=array?array.length:0;if(guard&&isIterateeCall(array,isDeep,guard)){isDeep=false;}return length?baseFlatten(array,isDeep):[];}/**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */function flattenDeep(array){var length=array?array.length:0;return length?baseFlatten(array,true):[];}/**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */function indexOf(array,value,fromIndex){var length=array?array.length:0;if(!length){return-1;}if(typeof fromIndex=='number'){fromIndex=fromIndex<0?nativeMax(length+fromIndex,0):fromIndex;}else if(fromIndex){var index=binaryIndex(array,value);if(index<length&&(value===value?value===array[index]:array[index]!==array[index])){return index;}return-1;}return baseIndexOf(array,value,fromIndex||0);}/**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */function initial(array){return dropRight(array,1);}/**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */var intersection=restParam(function(arrays){var othLength=arrays.length,othIndex=othLength,caches=Array(length),indexOf=getIndexOf(),isCommon=indexOf==baseIndexOf,result=[];while(othIndex--){var value=arrays[othIndex]=isArrayLike(value=arrays[othIndex])?value:[];caches[othIndex]=isCommon&&value.length>=120?createCache(othIndex&&value):null;}var array=arrays[0],index=-1,length=array?array.length:0,seen=caches[0];outer:while(++index<length){value=array[index];if((seen?cacheIndexOf(seen,value):indexOf(result,value,0))<0){var othIndex=othLength;while(--othIndex){var cache=caches[othIndex];if((cache?cacheIndexOf(cache,value):indexOf(arrays[othIndex],value,0))<0){continue outer;}}if(seen){seen.push(value);}result.push(value);}}return result;});/**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */function last(array){var length=array?array.length:0;return length?array[length-1]:undefined;}/**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */function lastIndexOf(array,value,fromIndex){var length=array?array.length:0;if(!length){return-1;}var index=length;if(typeof fromIndex=='number'){index=(fromIndex<0?nativeMax(length+fromIndex,0):nativeMin(fromIndex||0,length-1))+1;}else if(fromIndex){index=binaryIndex(array,value,true)-1;var other=array[index];if(value===value?value===other:other!==other){return index;}return-1;}if(value!==value){return indexOfNaN(array,index,true);}while(index--){if(array[index]===value){return index;}}return-1;}/**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */function pull(){var args=arguments,array=args[0];if(!(array&&array.length)){return array;}var index=0,indexOf=getIndexOf(),length=args.length;while(++index<length){var fromIndex=0,value=args[index];while((fromIndex=indexOf(array,value,fromIndex))>-1){splice.call(array,fromIndex,1);}}return array;}/**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */var pullAt=restParam(function(array,indexes){indexes=baseFlatten(indexes);var result=baseAt(array,indexes);basePullAt(array,indexes.sort(baseCompareAscending));return result;});/**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */function remove(array,predicate,thisArg){var result=[];if(!(array&&array.length)){return result;}var index=-1,indexes=[],length=array.length;predicate=getCallback(predicate,thisArg,3);while(++index<length){var value=array[index];if(predicate(value,index,array)){result.push(value);indexes.push(index);}}basePullAt(array,indexes);return result;}/**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */function rest(array){return drop(array,1);}/**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */function slice(array,start,end){var length=array?array.length:0;if(!length){return[];}if(end&&typeof end!='number'&&isIterateeCall(array,start,end)){start=0;end=length;}return baseSlice(array,start,end);}/**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */var sortedIndex=createSortedIndex();/**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */var sortedLastIndex=createSortedIndex(true);/**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */function take(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}return baseSlice(array,0,n<0?0:n);}/**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */function takeRight(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}n=length-(+n||0);return baseSlice(array,n<0?0:n);}/**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */function takeRightWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3),false,true):[];}/**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */function takeWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3)):[];}/**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */var union=restParam(function(arrays){return baseUniq(baseFlatten(arrays,false,true));});/**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */function uniq(array,isSorted,iteratee,thisArg){var length=array?array.length:0;if(!length){return[];}if(isSorted!=null&&typeof isSorted!='boolean'){thisArg=iteratee;iteratee=isIterateeCall(array,isSorted,thisArg)?undefined:isSorted;isSorted=false;}var callback=getCallback();if(!(iteratee==null&&callback===baseCallback)){iteratee=callback(iteratee,thisArg,3);}return isSorted&&getIndexOf()==baseIndexOf?sortedUniq(array,iteratee):baseUniq(array,iteratee);}/**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */function unzip(array){if(!(array&&array.length)){return[];}var index=-1,length=0;array=arrayFilter(array,function(group){if(isArrayLike(group)){length=nativeMax(group.length,length);return true;}});var result=Array(length);while(++index<length){result[index]=arrayMap(array,baseProperty(index));}return result;}/**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */function unzipWith(array,iteratee,thisArg){var length=array?array.length:0;if(!length){return[];}var result=unzip(array);if(iteratee==null){return result;}iteratee=bindCallback(iteratee,thisArg,4);return arrayMap(result,function(group){return arrayReduce(group,iteratee,undefined,true);});}/**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */var without=restParam(function(array,values){return isArrayLike(array)?baseDifference(array,values):[];});/**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */function xor(){var index=-1,length=arguments.length;while(++index<length){var array=arguments[index];if(isArrayLike(array)){var result=result?arrayPush(baseDifference(result,array),baseDifference(array,result)):array;}}return result?baseUniq(result):[];}/**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */var zip=restParam(unzip);/**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */function zipObject(props,values){var index=-1,length=props?props.length:0,result={};if(length&&!values&&!isArray(props[0])){values=[];}while(++index<length){var key=props[index];if(values){result[key]=values[index];}else if(key){result[key[0]]=key[1];}}return result;}/**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */var zipWith=restParam(function(arrays){var length=arrays.length,iteratee=length>2?arrays[length-2]:undefined,thisArg=length>1?arrays[length-1]:undefined;if(length>2&&typeof iteratee=='function'){length-=2;}else{iteratee=length>1&&typeof thisArg=='function'?(--length,thisArg):undefined;thisArg=undefined;}arrays.length=length;return unzipWith(arrays,iteratee,thisArg);});/*------------------------------------------------------------------------*//**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */function chain(value){var result=lodash(value);result.__chain__=true;return result;}/**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */function tap(value,interceptor,thisArg){interceptor.call(thisArg,value);return value;}/**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */function thru(value,interceptor,thisArg){return interceptor.call(thisArg,value);}/**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */function wrapperChain(){return chain(this);}/**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */function wrapperCommit(){return new LodashWrapper(this.value(),this.__chain__);}/**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */var wrapperConcat=restParam(function(values){values=baseFlatten(values);return this.thru(function(array){return arrayConcat(isArray(array)?array:[toObject(array)],values);});});/**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */function wrapperPlant(value){var result,parent=this;while(parent instanceof baseLodash){var clone=wrapperClone(parent);if(result){previous.__wrapped__=clone;}else{result=clone;}var previous=clone;parent=parent.__wrapped__;}previous.__wrapped__=value;return result;}/**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */function wrapperReverse(){var value=this.__wrapped__;var interceptor=function interceptor(value){return wrapped&&wrapped.__dir__<0?value:value.reverse();};if(value instanceof LazyWrapper){var wrapped=value;if(this.__actions__.length){wrapped=new LazyWrapper(this);}wrapped=wrapped.reverse();wrapped.__actions__.push({'func':thru,'args':[interceptor],'thisArg':undefined});return new LodashWrapper(wrapped,this.__chain__);}return this.thru(interceptor);}/**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */function wrapperToString(){return this.value()+'';}/**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */function wrapperValue(){return baseWrapperValue(this.__wrapped__,this.__actions__);}/*------------------------------------------------------------------------*//**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */var at=restParam(function(collection,props){return baseAt(collection,baseFlatten(props));});/**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */var countBy=createAggregator(function(result,value,key){hasOwnProperty.call(result,key)?++result[key]:result[key]=1;});/**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */function every(collection,predicate,thisArg){var func=isArray(collection)?arrayEvery:baseEvery;if(thisArg&&isIterateeCall(collection,predicate,thisArg)){predicate=undefined;}if(typeof predicate!='function'||thisArg!==undefined){predicate=getCallback(predicate,thisArg,3);}return func(collection,predicate);}/**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */function filter(collection,predicate,thisArg){var func=isArray(collection)?arrayFilter:baseFilter;predicate=getCallback(predicate,thisArg,3);return func(collection,predicate);}/**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */var find=createFind(baseEach);/**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */var findLast=createFind(baseEachRight,true);/**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */function findWhere(collection,source){return find(collection,baseMatches(source));}/**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */var forEach=createForEach(arrayEach,baseEach);/**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */var forEachRight=createForEach(arrayEachRight,baseEachRight);/**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */var groupBy=createAggregator(function(result,value,key){if(hasOwnProperty.call(result,key)){result[key].push(value);}else{result[key]=[value];}});/**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */function includes(collection,target,fromIndex,guard){var length=collection?getLength(collection):0;if(!isLength(length)){collection=values(collection);length=collection.length;}if(typeof fromIndex!='number'||guard&&isIterateeCall(target,fromIndex,guard)){fromIndex=0;}else{fromIndex=fromIndex<0?nativeMax(length+fromIndex,0):fromIndex||0;}return typeof collection=='string'||!isArray(collection)&&isString(collection)?fromIndex<=length&&collection.indexOf(target,fromIndex)>-1:!!length&&getIndexOf(collection,target,fromIndex)>-1;}/**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */var indexBy=createAggregator(function(result,value,key){result[key]=value;});/**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */var invoke=restParam(function(collection,path,args){var index=-1,isFunc=typeof path=='function',isProp=isKey(path),result=isArrayLike(collection)?Array(collection.length):[];baseEach(collection,function(value){var func=isFunc?path:isProp&&value!=null?value[path]:undefined;result[++index]=func?func.apply(value,args):invokePath(value,path,args);});return result;});/**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */function map(collection,iteratee,thisArg){var func=isArray(collection)?arrayMap:baseMap;iteratee=getCallback(iteratee,thisArg,3);return func(collection,iteratee);}/**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */var partition=createAggregator(function(result,value,key){result[key?0:1].push(value);},function(){return[[],[]];});/**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */function pluck(collection,path){return map(collection,property(path));}/**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */var reduce=createReduce(arrayReduce,baseEach);/**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */var reduceRight=createReduce(arrayReduceRight,baseEachRight);/**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */function reject(collection,predicate,thisArg){var func=isArray(collection)?arrayFilter:baseFilter;predicate=getCallback(predicate,thisArg,3);return func(collection,function(value,index,collection){return!predicate(value,index,collection);});}/**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */function sample(collection,n,guard){if(guard?isIterateeCall(collection,n,guard):n==null){collection=toIterable(collection);var length=collection.length;return length>0?collection[baseRandom(0,length-1)]:undefined;}var index=-1,result=toArray(collection),length=result.length,lastIndex=length-1;n=nativeMin(n<0?0:+n||0,length);while(++index<n){var rand=baseRandom(index,lastIndex),value=result[rand];result[rand]=result[index];result[index]=value;}result.length=n;return result;}/**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */function shuffle(collection){return sample(collection,POSITIVE_INFINITY);}/**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */function size(collection){var length=collection?getLength(collection):0;return isLength(length)?length:keys(collection).length;}/**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */function some(collection,predicate,thisArg){var func=isArray(collection)?arraySome:baseSome;if(thisArg&&isIterateeCall(collection,predicate,thisArg)){predicate=undefined;}if(typeof predicate!='function'||thisArg!==undefined){predicate=getCallback(predicate,thisArg,3);}return func(collection,predicate);}/**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */function sortBy(collection,iteratee,thisArg){if(collection==null){return[];}if(thisArg&&isIterateeCall(collection,iteratee,thisArg)){iteratee=undefined;}var index=-1;iteratee=getCallback(iteratee,thisArg,3);var result=baseMap(collection,function(value,key,collection){return{'criteria':iteratee(value,key,collection),'index':++index,'value':value};});return baseSortBy(result,compareAscending);}/**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */var sortByAll=restParam(function(collection,iteratees){if(collection==null){return[];}var guard=iteratees[2];if(guard&&isIterateeCall(iteratees[0],iteratees[1],guard)){iteratees.length=1;}return baseSortByOrder(collection,baseFlatten(iteratees),[]);});/**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */function sortByOrder(collection,iteratees,orders,guard){if(collection==null){return[];}if(guard&&isIterateeCall(iteratees,orders,guard)){orders=undefined;}if(!isArray(iteratees)){iteratees=iteratees==null?[]:[iteratees];}if(!isArray(orders)){orders=orders==null?[]:[orders];}return baseSortByOrder(collection,iteratees,orders);}/**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */function where(collection,source){return filter(collection,baseMatches(source));}/*------------------------------------------------------------------------*//**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */var now=nativeNow||function(){return new Date().getTime();};/*------------------------------------------------------------------------*//**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */function after(n,func){if(typeof func!='function'){if(typeof n=='function'){var temp=n;n=func;func=temp;}else{throw new TypeError(FUNC_ERROR_TEXT);}}n=nativeIsFinite(n=+n)?n:0;return function(){if(--n<1){return func.apply(this,arguments);}};}/**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */function ary(func,n,guard){if(guard&&isIterateeCall(func,n,guard)){n=undefined;}n=func&&n==null?func.length:nativeMax(+n||0,0);return createWrapper(func,ARY_FLAG,undefined,undefined,undefined,undefined,n);}/**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */function before(n,func){var result;if(typeof func!='function'){if(typeof n=='function'){var temp=n;n=func;func=temp;}else{throw new TypeError(FUNC_ERROR_TEXT);}}return function(){if(--n>0){result=func.apply(this,arguments);}if(n<=1){func=undefined;}return result;};}/**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */var bind=restParam(function(func,thisArg,partials){var bitmask=BIND_FLAG;if(partials.length){var holders=replaceHolders(partials,bind.placeholder);bitmask|=PARTIAL_FLAG;}return createWrapper(func,bitmask,thisArg,partials,holders);});/**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */var bindAll=restParam(function(object,methodNames){methodNames=methodNames.length?baseFlatten(methodNames):functions(object);var index=-1,length=methodNames.length;while(++index<length){var key=methodNames[index];object[key]=createWrapper(object[key],BIND_FLAG,object);}return object;});/**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */var bindKey=restParam(function(object,key,partials){var bitmask=BIND_FLAG|BIND_KEY_FLAG;if(partials.length){var holders=replaceHolders(partials,bindKey.placeholder);bitmask|=PARTIAL_FLAG;}return createWrapper(key,bitmask,object,partials,holders);});/**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */var curry=createCurry(CURRY_FLAG);/**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */var curryRight=createCurry(CURRY_RIGHT_FLAG);/**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */function debounce(func,wait,options){var args,maxTimeoutId,result,stamp,thisArg,timeoutId,trailingCall,lastCalled=0,maxWait=false,trailing=true;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}wait=wait<0?0:+wait||0;if(options===true){var leading=true;trailing=false;}else if(isObject(options)){leading=!!options.leading;maxWait='maxWait'in options&&nativeMax(+options.maxWait||0,wait);trailing='trailing'in options?!!options.trailing:trailing;}function cancel(){if(timeoutId){clearTimeout(timeoutId);}if(maxTimeoutId){clearTimeout(maxTimeoutId);}lastCalled=0;maxTimeoutId=timeoutId=trailingCall=undefined;}function complete(isCalled,id){if(id){clearTimeout(id);}maxTimeoutId=timeoutId=trailingCall=undefined;if(isCalled){lastCalled=now();result=func.apply(thisArg,args);if(!timeoutId&&!maxTimeoutId){args=thisArg=undefined;}}}function delayed(){var remaining=wait-(now()-stamp);if(remaining<=0||remaining>wait){complete(trailingCall,maxTimeoutId);}else{timeoutId=setTimeout(delayed,remaining);}}function maxDelayed(){complete(trailing,timeoutId);}function debounced(){args=arguments;stamp=now();thisArg=this;trailingCall=trailing&&(timeoutId||!leading);if(maxWait===false){var leadingCall=leading&&!timeoutId;}else{if(!maxTimeoutId&&!leading){lastCalled=stamp;}var remaining=maxWait-(stamp-lastCalled),isCalled=remaining<=0||remaining>maxWait;if(isCalled){if(maxTimeoutId){maxTimeoutId=clearTimeout(maxTimeoutId);}lastCalled=stamp;result=func.apply(thisArg,args);}else if(!maxTimeoutId){maxTimeoutId=setTimeout(maxDelayed,remaining);}}if(isCalled&&timeoutId){timeoutId=clearTimeout(timeoutId);}else if(!timeoutId&&wait!==maxWait){timeoutId=setTimeout(delayed,wait);}if(leadingCall){isCalled=true;result=func.apply(thisArg,args);}if(isCalled&&!timeoutId&&!maxTimeoutId){args=thisArg=undefined;}return result;}debounced.cancel=cancel;return debounced;}/**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */var defer=restParam(function(func,args){return baseDelay(func,1,args);});/**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */var delay=restParam(function(func,wait,args){return baseDelay(func,wait,args);});/**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */var flow=createFlow();/**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */var flowRight=createFlow(true);/**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */function memoize(func,resolver){if(typeof func!='function'||resolver&&typeof resolver!='function'){throw new TypeError(FUNC_ERROR_TEXT);}var memoized=function memoized(){var args=arguments,key=resolver?resolver.apply(this,args):args[0],cache=memoized.cache;if(cache.has(key)){return cache.get(key);}var result=func.apply(this,args);memoized.cache=cache.set(key,result);return result;};memoized.cache=new memoize.Cache();return memoized;}/**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */var modArgs=restParam(function(func,transforms){transforms=baseFlatten(transforms);if(typeof func!='function'||!arrayEvery(transforms,baseIsFunction)){throw new TypeError(FUNC_ERROR_TEXT);}var length=transforms.length;return restParam(function(args){var index=nativeMin(args.length,length);while(index--){args[index]=transforms[index](args[index]);}return func.apply(this,args);});});/**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */function negate(predicate){if(typeof predicate!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return function(){return!predicate.apply(this,arguments);};}/**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */function once(func){return before(2,func);}/**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */var partial=createPartial(PARTIAL_FLAG);/**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */var partialRight=createPartial(PARTIAL_RIGHT_FLAG);/**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */var rearg=restParam(function(func,indexes){return createWrapper(func,REARG_FLAG,undefined,undefined,undefined,baseFlatten(indexes));});/**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */function restParam(func,start){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}start=nativeMax(start===undefined?func.length-1:+start||0,0);return function(){var args=arguments,index=-1,length=nativeMax(args.length-start,0),rest=Array(length);while(++index<length){rest[index]=args[start+index];}switch(start){case 0:return func.call(this,rest);case 1:return func.call(this,args[0],rest);case 2:return func.call(this,args[0],args[1],rest);}var otherArgs=Array(start+1);index=-1;while(++index<start){otherArgs[index]=args[index];}otherArgs[start]=rest;return func.apply(this,otherArgs);};}/**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */function spread(func){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return function(array){return func.apply(this,array);};}/**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */function throttle(func,wait,options){var leading=true,trailing=true;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}if(options===false){leading=false;}else if(isObject(options)){leading='leading'in options?!!options.leading:leading;trailing='trailing'in options?!!options.trailing:trailing;}return debounce(func,wait,{'leading':leading,'maxWait':+wait,'trailing':trailing});}/**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */function wrap(value,wrapper){wrapper=wrapper==null?identity:wrapper;return createWrapper(wrapper,PARTIAL_FLAG,undefined,[value],[]);}/*------------------------------------------------------------------------*//**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */function clone(value,isDeep,customizer,thisArg){if(isDeep&&typeof isDeep!='boolean'&&isIterateeCall(value,isDeep,customizer)){isDeep=false;}else if(typeof isDeep=='function'){thisArg=customizer;customizer=isDeep;isDeep=false;}return typeof customizer=='function'?baseClone(value,isDeep,bindCallback(customizer,thisArg,1)):baseClone(value,isDeep);}/**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */function cloneDeep(value,customizer,thisArg){return typeof customizer=='function'?baseClone(value,true,bindCallback(customizer,thisArg,1)):baseClone(value,true);}/**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */function gt(value,other){return value>other;}/**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */function gte(value,other){return value>=other;}/**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */function isArguments(value){return isObjectLike(value)&&isArrayLike(value)&&hasOwnProperty.call(value,'callee')&&!propertyIsEnumerable.call(value,'callee');}/**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */var isArray=nativeIsArray||function(value){return isObjectLike(value)&&isLength(value.length)&&objToString.call(value)==arrayTag;};/**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */function isBoolean(value){return value===true||value===false||isObjectLike(value)&&objToString.call(value)==boolTag;}/**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */function isDate(value){return isObjectLike(value)&&objToString.call(value)==dateTag;}/**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */function isElement(value){return!!value&&value.nodeType===1&&isObjectLike(value)&&!isPlainObject(value);}/**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */function isEmpty(value){if(value==null){return true;}if(isArrayLike(value)&&(isArray(value)||isString(value)||isArguments(value)||isObjectLike(value)&&isFunction(value.splice))){return!value.length;}return!keys(value).length;}/**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */function isEqual(value,other,customizer,thisArg){customizer=typeof customizer=='function'?bindCallback(customizer,thisArg,3):undefined;var result=customizer?customizer(value,other):undefined;return result===undefined?baseIsEqual(value,other,customizer):!!result;}/**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */function isError(value){return isObjectLike(value)&&typeof value.message=='string'&&objToString.call(value)==errorTag;}/**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */function isFinite(value){return typeof value=='number'&&nativeIsFinite(value);}/**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */function isFunction(value){// The use of `Object#toString` avoids issues with the `typeof` operator
// in older versions of Chrome and Safari which return 'function' for regexes
// and Safari 8 equivalents which return 'object' for typed array constructors.
return isObject(value)&&objToString.call(value)==funcTag;}/**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */function isObject(value){// Avoid a V8 JIT bug in Chrome 19-20.
// See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
var type=typeof value==="undefined"?"undefined":_typeof(value);return!!value&&(type=='object'||type=='function');}/**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */function isMatch(object,source,customizer,thisArg){customizer=typeof customizer=='function'?bindCallback(customizer,thisArg,3):undefined;return baseIsMatch(object,getMatchData(source),customizer);}/**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */function isNaN(value){// An `NaN` primitive is the only value that is not equal to itself.
// Perform the `toStringTag` check first to avoid errors with some host objects in IE.
return isNumber(value)&&value!=+value;}/**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */function isNative(value){if(value==null){return false;}if(isFunction(value)){return reIsNative.test(fnToString.call(value));}return isObjectLike(value)&&reIsHostCtor.test(value);}/**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */function isNull(value){return value===null;}/**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */function isNumber(value){return typeof value=='number'||isObjectLike(value)&&objToString.call(value)==numberTag;}/**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */function isPlainObject(value){var Ctor;// Exit early for non `Object` objects.
if(!(isObjectLike(value)&&objToString.call(value)==objectTag&&!isArguments(value))||!hasOwnProperty.call(value,'constructor')&&(Ctor=value.constructor,typeof Ctor=='function'&&!(Ctor instanceof Ctor))){return false;}// IE < 9 iterates inherited properties before own properties. If the first
// iterated property is an object's own property then there are no inherited
// enumerable properties.
var result;// In most environments an object's own properties are iterated before
// its inherited properties. If the last iterated property is an object's
// own property then there are no inherited enumerable properties.
baseForIn(value,function(subValue,key){result=key;});return result===undefined||hasOwnProperty.call(value,result);}/**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */function isRegExp(value){return isObject(value)&&objToString.call(value)==regexpTag;}/**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */function isString(value){return typeof value=='string'||isObjectLike(value)&&objToString.call(value)==stringTag;}/**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */function isTypedArray(value){return isObjectLike(value)&&isLength(value.length)&&!!typedArrayTags[objToString.call(value)];}/**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */function isUndefined(value){return value===undefined;}/**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */function lt(value,other){return value<other;}/**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */function lte(value,other){return value<=other;}/**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */function toArray(value){var length=value?getLength(value):0;if(!isLength(length)){return values(value);}if(!length){return[];}return arrayCopy(value);}/**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */function toPlainObject(value){return baseCopy(value,keysIn(value));}/*------------------------------------------------------------------------*//**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */var merge=createAssigner(baseMerge);/**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */var assign=createAssigner(function(object,source,customizer){return customizer?assignWith(object,source,customizer):baseAssign(object,source);});/**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */function create(prototype,properties,guard){var result=baseCreate(prototype);if(guard&&isIterateeCall(prototype,properties,guard)){properties=undefined;}return properties?baseAssign(result,properties):result;}/**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */var defaults=createDefaults(assign,assignDefaults);/**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */var defaultsDeep=createDefaults(merge,mergeDefaults);/**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */var findKey=createFindKey(baseForOwn);/**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */var findLastKey=createFindKey(baseForOwnRight);/**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */var forIn=createForIn(baseFor);/**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */var forInRight=createForIn(baseForRight);/**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */var forOwn=createForOwn(baseForOwn);/**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */var forOwnRight=createForOwn(baseForOwnRight);/**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */function functions(object){return baseFunctions(object,keysIn(object));}/**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */function get(object,path,defaultValue){var result=object==null?undefined:baseGet(object,toPath(path),path+'');return result===undefined?defaultValue:result;}/**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */function has(object,path){if(object==null){return false;}var result=hasOwnProperty.call(object,path);if(!result&&!isKey(path)){path=toPath(path);object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));if(object==null){return false;}path=last(path);result=hasOwnProperty.call(object,path);}return result||isLength(object.length)&&isIndex(path,object.length)&&(isArray(object)||isArguments(object));}/**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */function invert(object,multiValue,guard){if(guard&&isIterateeCall(object,multiValue,guard)){multiValue=undefined;}var index=-1,props=keys(object),length=props.length,result={};while(++index<length){var key=props[index],value=object[key];if(multiValue){if(hasOwnProperty.call(result,value)){result[value].push(key);}else{result[value]=[key];}}else{result[value]=key;}}return result;}/**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */var keys=!nativeKeys?shimKeys:function(object){var Ctor=object==null?undefined:object.constructor;if(typeof Ctor=='function'&&Ctor.prototype===object||typeof object!='function'&&isArrayLike(object)){return shimKeys(object);}return isObject(object)?nativeKeys(object):[];};/**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */function keysIn(object){if(object==null){return[];}if(!isObject(object)){object=Object(object);}var length=object.length;length=length&&isLength(length)&&(isArray(object)||isArguments(object))&&length||0;var Ctor=object.constructor,index=-1,isProto=typeof Ctor=='function'&&Ctor.prototype===object,result=Array(length),skipIndexes=length>0;while(++index<length){result[index]=index+'';}for(var key in object){if(!(skipIndexes&&isIndex(key,length))&&!(key=='constructor'&&(isProto||!hasOwnProperty.call(object,key)))){result.push(key);}}return result;}/**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */var mapKeys=createObjectMapper(true);/**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */var mapValues=createObjectMapper();/**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */var omit=restParam(function(object,props){if(object==null){return{};}if(typeof props[0]!='function'){var props=arrayMap(baseFlatten(props),String);return pickByArray(object,baseDifference(keysIn(object),props));}var predicate=bindCallback(props[0],props[1],3);return pickByCallback(object,function(value,key,object){return!predicate(value,key,object);});});/**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */function pairs(object){object=toObject(object);var index=-1,props=keys(object),length=props.length,result=Array(length);while(++index<length){var key=props[index];result[index]=[key,object[key]];}return result;}/**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */var pick=restParam(function(object,props){if(object==null){return{};}return typeof props[0]=='function'?pickByCallback(object,bindCallback(props[0],props[1],3)):pickByArray(object,baseFlatten(props));});/**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */function result(object,path,defaultValue){var result=object==null?undefined:object[path];if(result===undefined){if(object!=null&&!isKey(path,object)){path=toPath(path);object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));result=object==null?undefined:object[last(path)];}result=result===undefined?defaultValue:result;}return isFunction(result)?result.call(object):result;}/**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */function set(object,path,value){if(object==null){return object;}var pathKey=path+'';path=object[pathKey]!=null||isKey(path,object)?[pathKey]:toPath(path);var index=-1,length=path.length,lastIndex=length-1,nested=object;while(nested!=null&&++index<length){var key=path[index];if(isObject(nested)){if(index==lastIndex){nested[key]=value;}else if(nested[key]==null){nested[key]=isIndex(path[index+1])?[]:{};}}nested=nested[key];}return object;}/**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */function transform(object,iteratee,accumulator,thisArg){var isArr=isArray(object)||isTypedArray(object);iteratee=getCallback(iteratee,thisArg,4);if(accumulator==null){if(isArr||isObject(object)){var Ctor=object.constructor;if(isArr){accumulator=isArray(object)?new Ctor():[];}else{accumulator=baseCreate(isFunction(Ctor)?Ctor.prototype:undefined);}}else{accumulator={};}}(isArr?arrayEach:baseForOwn)(object,function(value,index,object){return iteratee(accumulator,value,index,object);});return accumulator;}/**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */function values(object){return baseValues(object,keys(object));}/**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */function valuesIn(object){return baseValues(object,keysIn(object));}/*------------------------------------------------------------------------*//**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */function inRange(value,start,end){start=+start||0;if(end===undefined){end=start;start=0;}else{end=+end||0;}return value>=nativeMin(start,end)&&value<nativeMax(start,end);}/**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */function random(min,max,floating){if(floating&&isIterateeCall(min,max,floating)){max=floating=undefined;}var noMin=min==null,noMax=max==null;if(floating==null){if(noMax&&typeof min=='boolean'){floating=min;min=1;}else if(typeof max=='boolean'){floating=max;noMax=true;}}if(noMin&&noMax){max=1;noMax=false;}min=+min||0;if(noMax){max=min;min=0;}else{max=+max||0;}if(floating||min%1||max%1){var rand=nativeRandom();return nativeMin(min+rand*(max-min+parseFloat('1e-'+((rand+'').length-1))),max);}return baseRandom(min,max);}/*------------------------------------------------------------------------*//**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */var camelCase=createCompounder(function(result,word,index){word=word.toLowerCase();return result+(index?word.charAt(0).toUpperCase()+word.slice(1):word);});/**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */function capitalize(string){string=baseToString(string);return string&&string.charAt(0).toUpperCase()+string.slice(1);}/**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */function deburr(string){string=baseToString(string);return string&&string.replace(reLatin1,deburrLetter).replace(reComboMark,'');}/**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */function endsWith(string,target,position){string=baseToString(string);target=target+'';var length=string.length;position=position===undefined?length:nativeMin(position<0?0:+position||0,length);position-=target.length;return position>=0&&string.indexOf(target,position)==position;}/**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */function escape(string){// Reset `lastIndex` because in IE < 9 `String#replace` does not.
string=baseToString(string);return string&&reHasUnescapedHtml.test(string)?string.replace(reUnescapedHtml,escapeHtmlChar):string;}/**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */function escapeRegExp(string){string=baseToString(string);return string&&reHasRegExpChars.test(string)?string.replace(reRegExpChars,escapeRegExpChar):string||'(?:)';}/**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */var kebabCase=createCompounder(function(result,word,index){return result+(index?'-':'')+word.toLowerCase();});/**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */function pad(string,length,chars){string=baseToString(string);length=+length;var strLength=string.length;if(strLength>=length||!nativeIsFinite(length)){return string;}var mid=(length-strLength)/2,leftLength=nativeFloor(mid),rightLength=nativeCeil(mid);chars=createPadding('',rightLength,chars);return chars.slice(0,leftLength)+string+chars;}/**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */var padLeft=createPadDir();/**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */var padRight=createPadDir(true);/**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */function parseInt(string,radix,guard){// Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
// Chrome fails to trim leading <BOM> whitespace characters.
// See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
if(guard?isIterateeCall(string,radix,guard):radix==null){radix=0;}else if(radix){radix=+radix;}string=trim(string);return nativeParseInt(string,radix||(reHasHexPrefix.test(string)?16:10));}/**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */function repeat(string,n){var result='';string=baseToString(string);n=+n;if(n<1||!string||!nativeIsFinite(n)){return result;}// Leverage the exponentiation by squaring algorithm for a faster repeat.
// See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
do{if(n%2){result+=string;}n=nativeFloor(n/2);string+=string;}while(n);return result;}/**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */var snakeCase=createCompounder(function(result,word,index){return result+(index?'_':'')+word.toLowerCase();});/**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */var startCase=createCompounder(function(result,word,index){return result+(index?' ':'')+(word.charAt(0).toUpperCase()+word.slice(1));});/**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */function startsWith(string,target,position){string=baseToString(string);position=position==null?0:nativeMin(position<0?0:+position||0,string.length);return string.lastIndexOf(target,position)==position;}/**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */function template(string,options,otherOptions){// Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
// and Laura Doktorova's doT.js (https://github.com/olado/doT).
var settings=lodash.templateSettings;if(otherOptions&&isIterateeCall(string,options,otherOptions)){options=otherOptions=undefined;}string=baseToString(string);options=assignWith(baseAssign({},otherOptions||options),settings,assignOwnDefaults);var imports=assignWith(baseAssign({},options.imports),settings.imports,assignOwnDefaults),importsKeys=keys(imports),importsValues=baseValues(imports,importsKeys);var isEscaping,isEvaluating,index=0,interpolate=options.interpolate||reNoMatch,source="__p += '";// Compile the regexp to match each delimiter.
var reDelimiters=RegExp((options.escape||reNoMatch).source+'|'+interpolate.source+'|'+(interpolate===reInterpolate?reEsTemplate:reNoMatch).source+'|'+(options.evaluate||reNoMatch).source+'|$','g');// Use a sourceURL for easier debugging.
var sourceURL='//# sourceURL='+('sourceURL'in options?options.sourceURL:'lodash.templateSources['+ ++templateCounter+']')+'\n';string.replace(reDelimiters,function(match,escapeValue,interpolateValue,esTemplateValue,evaluateValue,offset){interpolateValue||(interpolateValue=esTemplateValue);// Escape characters that can't be included in string literals.
source+=string.slice(index,offset).replace(reUnescapedString,escapeStringChar);// Replace delimiters with snippets.
if(escapeValue){isEscaping=true;source+="' +\n__e("+escapeValue+") +\n'";}if(evaluateValue){isEvaluating=true;source+="';\n"+evaluateValue+";\n__p += '";}if(interpolateValue){source+="' +\n((__t = ("+interpolateValue+")) == null ? '' : __t) +\n'";}index=offset+match.length;// The JS engine embedded in Adobe products requires returning the `match`
// string in order to produce the correct `offset` value.
return match;});source+="';\n";// If `variable` is not specified wrap a with-statement around the generated
// code to add the data object to the top of the scope chain.
var variable=options.variable;if(!variable){source='with (obj) {\n'+source+'\n}\n';}// Cleanup code by stripping empty strings.
source=(isEvaluating?source.replace(reEmptyStringLeading,''):source).replace(reEmptyStringMiddle,'$1').replace(reEmptyStringTrailing,'$1;');// Frame code as the function body.
source='function('+(variable||'obj')+') {\n'+(variable?'':'obj || (obj = {});\n')+"var __t, __p = ''"+(isEscaping?', __e = _.escape':'')+(isEvaluating?', __j = Array.prototype.join;\n'+"function print() { __p += __j.call(arguments, '') }\n":';\n')+source+'return __p\n}';var result=attempt(function(){return Function(importsKeys,sourceURL+'return '+source).apply(undefined,importsValues);});// Provide the compiled function's source by its `toString` method or
// the `source` property as a convenience for inlining compiled templates.
result.source=source;if(isError(result)){throw result;}return result;}/**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */function trim(string,chars,guard){var value=string;string=baseToString(string);if(!string){return string;}if(guard?isIterateeCall(value,chars,guard):chars==null){return string.slice(trimmedLeftIndex(string),trimmedRightIndex(string)+1);}chars=chars+'';return string.slice(charsLeftIndex(string,chars),charsRightIndex(string,chars)+1);}/**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */function trimLeft(string,chars,guard){var value=string;string=baseToString(string);if(!string){return string;}if(guard?isIterateeCall(value,chars,guard):chars==null){return string.slice(trimmedLeftIndex(string));}return string.slice(charsLeftIndex(string,chars+''));}/**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */function trimRight(string,chars,guard){var value=string;string=baseToString(string);if(!string){return string;}if(guard?isIterateeCall(value,chars,guard):chars==null){return string.slice(0,trimmedRightIndex(string)+1);}return string.slice(0,charsRightIndex(string,chars+'')+1);}/**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */function trunc(string,options,guard){if(guard&&isIterateeCall(string,options,guard)){options=undefined;}var length=DEFAULT_TRUNC_LENGTH,omission=DEFAULT_TRUNC_OMISSION;if(options!=null){if(isObject(options)){var separator='separator'in options?options.separator:separator;length='length'in options?+options.length||0:length;omission='omission'in options?baseToString(options.omission):omission;}else{length=+options||0;}}string=baseToString(string);if(length>=string.length){return string;}var end=length-omission.length;if(end<1){return omission;}var result=string.slice(0,end);if(separator==null){return result+omission;}if(isRegExp(separator)){if(string.slice(end).search(separator)){var match,newEnd,substring=string.slice(0,end);if(!separator.global){separator=RegExp(separator.source,(reFlags.exec(separator)||'')+'g');}separator.lastIndex=0;while(match=separator.exec(substring)){newEnd=match.index;}result=result.slice(0,newEnd==null?end:newEnd);}}else if(string.indexOf(separator,end)!=end){var index=result.lastIndexOf(separator);if(index>-1){result=result.slice(0,index);}}return result+omission;}/**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */function unescape(string){string=baseToString(string);return string&&reHasEscapedHtml.test(string)?string.replace(reEscapedHtml,unescapeHtmlChar):string;}/**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */function words(string,pattern,guard){if(guard&&isIterateeCall(string,pattern,guard)){pattern=undefined;}string=baseToString(string);return string.match(pattern||reWords)||[];}/*------------------------------------------------------------------------*//**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */var attempt=restParam(function(func,args){try{return func.apply(undefined,args);}catch(e){return isError(e)?e:new Error(e);}});/**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */function callback(func,thisArg,guard){if(guard&&isIterateeCall(func,thisArg,guard)){thisArg=undefined;}return isObjectLike(func)?matches(func):baseCallback(func,thisArg);}/**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */function constant(value){return function(){return value;};}/**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */function identity(value){return value;}/**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */function matches(source){return baseMatches(baseClone(source,true));}/**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */function matchesProperty(path,srcValue){return baseMatchesProperty(path,baseClone(srcValue,true));}/**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */var method=restParam(function(path,args){return function(object){return invokePath(object,path,args);};});/**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */var methodOf=restParam(function(object,args){return function(path){return invokePath(object,path,args);};});/**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */function mixin(object,source,options){if(options==null){var isObj=isObject(source),props=isObj?keys(source):undefined,methodNames=props&&props.length?baseFunctions(source,props):undefined;if(!(methodNames?methodNames.length:isObj)){methodNames=false;options=source;source=object;object=this;}}if(!methodNames){methodNames=baseFunctions(source,keys(source));}var chain=true,index=-1,isFunc=isFunction(object),length=methodNames.length;if(options===false){chain=false;}else if(isObject(options)&&'chain'in options){chain=options.chain;}while(++index<length){var methodName=methodNames[index],func=source[methodName];object[methodName]=func;if(isFunc){object.prototype[methodName]=function(func){return function(){var chainAll=this.__chain__;if(chain||chainAll){var result=object(this.__wrapped__),actions=result.__actions__=arrayCopy(this.__actions__);actions.push({'func':func,'args':arguments,'thisArg':object});result.__chain__=chainAll;return result;}return func.apply(object,arrayPush([this.value()],arguments));};}(func);}}return object;}/**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */function noConflict(){root._=oldDash;return this;}/**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */function noop(){}// No operation performed.
/**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */function property(path){return isKey(path)?baseProperty(path):basePropertyDeep(path);}/**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */function propertyOf(object){return function(path){return baseGet(object,toPath(path),path+'');};}/**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */function range(start,end,step){if(step&&isIterateeCall(start,end,step)){end=step=undefined;}start=+start||0;step=step==null?1:+step||0;if(end==null){end=start;start=0;}else{end=+end||0;}// Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
// See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
var index=-1,length=nativeMax(nativeCeil((end-start)/(step||1)),0),result=Array(length);while(++index<length){result[index]=start;start+=step;}return result;}/**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */function times(n,iteratee,thisArg){n=nativeFloor(n);// Exit early to avoid a JSC JIT bug in Safari 8
// where `Array(0)` is treated as `Array(1)`.
if(n<1||!nativeIsFinite(n)){return[];}var index=-1,result=Array(nativeMin(n,MAX_ARRAY_LENGTH));iteratee=bindCallback(iteratee,thisArg,1);while(++index<n){if(index<MAX_ARRAY_LENGTH){result[index]=iteratee(index);}else{iteratee(index);}}return result;}/**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */function uniqueId(prefix){var id=++idCounter;return baseToString(prefix)+id;}/*------------------------------------------------------------------------*//**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */function add(augend,addend){return(+augend||0)+(+addend||0);}/**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */var ceil=createRound('ceil');/**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */var floor=createRound('floor');/**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */var max=createExtremum(gt,NEGATIVE_INFINITY);/**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */var min=createExtremum(lt,POSITIVE_INFINITY);/**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */var round=createRound('round');/**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */function sum(collection,iteratee,thisArg){if(thisArg&&isIterateeCall(collection,iteratee,thisArg)){iteratee=undefined;}iteratee=getCallback(iteratee,thisArg,3);return iteratee.length==1?arraySum(isArray(collection)?collection:toIterable(collection),iteratee):baseSum(collection,iteratee);}/*------------------------------------------------------------------------*/// Ensure wrappers are instances of `baseLodash`.
lodash.prototype=baseLodash.prototype;LodashWrapper.prototype=baseCreate(baseLodash.prototype);LodashWrapper.prototype.constructor=LodashWrapper;LazyWrapper.prototype=baseCreate(baseLodash.prototype);LazyWrapper.prototype.constructor=LazyWrapper;// Add functions to the `Map` cache.
MapCache.prototype['delete']=mapDelete;MapCache.prototype.get=mapGet;MapCache.prototype.has=mapHas;MapCache.prototype.set=mapSet;// Add functions to the `Set` cache.
SetCache.prototype.push=cachePush;// Assign cache to `_.memoize`.
memoize.Cache=MapCache;// Add functions that return wrapped values when chaining.
lodash.after=after;lodash.ary=ary;lodash.assign=assign;lodash.at=at;lodash.before=before;lodash.bind=bind;lodash.bindAll=bindAll;lodash.bindKey=bindKey;lodash.callback=callback;lodash.chain=chain;lodash.chunk=chunk;lodash.compact=compact;lodash.constant=constant;lodash.countBy=countBy;lodash.create=create;lodash.curry=curry;lodash.curryRight=curryRight;lodash.debounce=debounce;lodash.defaults=defaults;lodash.defaultsDeep=defaultsDeep;lodash.defer=defer;lodash.delay=delay;lodash.difference=difference;lodash.drop=drop;lodash.dropRight=dropRight;lodash.dropRightWhile=dropRightWhile;lodash.dropWhile=dropWhile;lodash.fill=fill;lodash.filter=filter;lodash.flatten=flatten;lodash.flattenDeep=flattenDeep;lodash.flow=flow;lodash.flowRight=flowRight;lodash.forEach=forEach;lodash.forEachRight=forEachRight;lodash.forIn=forIn;lodash.forInRight=forInRight;lodash.forOwn=forOwn;lodash.forOwnRight=forOwnRight;lodash.functions=functions;lodash.groupBy=groupBy;lodash.indexBy=indexBy;lodash.initial=initial;lodash.intersection=intersection;lodash.invert=invert;lodash.invoke=invoke;lodash.keys=keys;lodash.keysIn=keysIn;lodash.map=map;lodash.mapKeys=mapKeys;lodash.mapValues=mapValues;lodash.matches=matches;lodash.matchesProperty=matchesProperty;lodash.memoize=memoize;lodash.merge=merge;lodash.method=method;lodash.methodOf=methodOf;lodash.mixin=mixin;lodash.modArgs=modArgs;lodash.negate=negate;lodash.omit=omit;lodash.once=once;lodash.pairs=pairs;lodash.partial=partial;lodash.partialRight=partialRight;lodash.partition=partition;lodash.pick=pick;lodash.pluck=pluck;lodash.property=property;lodash.propertyOf=propertyOf;lodash.pull=pull;lodash.pullAt=pullAt;lodash.range=range;lodash.rearg=rearg;lodash.reject=reject;lodash.remove=remove;lodash.rest=rest;lodash.restParam=restParam;lodash.set=set;lodash.shuffle=shuffle;lodash.slice=slice;lodash.sortBy=sortBy;lodash.sortByAll=sortByAll;lodash.sortByOrder=sortByOrder;lodash.spread=spread;lodash.take=take;lodash.takeRight=takeRight;lodash.takeRightWhile=takeRightWhile;lodash.takeWhile=takeWhile;lodash.tap=tap;lodash.throttle=throttle;lodash.thru=thru;lodash.times=times;lodash.toArray=toArray;lodash.toPlainObject=toPlainObject;lodash.transform=transform;lodash.union=union;lodash.uniq=uniq;lodash.unzip=unzip;lodash.unzipWith=unzipWith;lodash.values=values;lodash.valuesIn=valuesIn;lodash.where=where;lodash.without=without;lodash.wrap=wrap;lodash.xor=xor;lodash.zip=zip;lodash.zipObject=zipObject;lodash.zipWith=zipWith;// Add aliases.
lodash.backflow=flowRight;lodash.collect=map;lodash.compose=flowRight;lodash.each=forEach;lodash.eachRight=forEachRight;lodash.extend=assign;lodash.iteratee=callback;lodash.methods=functions;lodash.object=zipObject;lodash.select=filter;lodash.tail=rest;lodash.unique=uniq;// Add functions to `lodash.prototype`.
mixin(lodash,lodash);/*------------------------------------------------------------------------*/// Add functions that return unwrapped values when chaining.
lodash.add=add;lodash.attempt=attempt;lodash.camelCase=camelCase;lodash.capitalize=capitalize;lodash.ceil=ceil;lodash.clone=clone;lodash.cloneDeep=cloneDeep;lodash.deburr=deburr;lodash.endsWith=endsWith;lodash.escape=escape;lodash.escapeRegExp=escapeRegExp;lodash.every=every;lodash.find=find;lodash.findIndex=findIndex;lodash.findKey=findKey;lodash.findLast=findLast;lodash.findLastIndex=findLastIndex;lodash.findLastKey=findLastKey;lodash.findWhere=findWhere;lodash.first=first;lodash.floor=floor;lodash.get=get;lodash.gt=gt;lodash.gte=gte;lodash.has=has;lodash.identity=identity;lodash.includes=includes;lodash.indexOf=indexOf;lodash.inRange=inRange;lodash.isArguments=isArguments;lodash.isArray=isArray;lodash.isBoolean=isBoolean;lodash.isDate=isDate;lodash.isElement=isElement;lodash.isEmpty=isEmpty;lodash.isEqual=isEqual;lodash.isError=isError;lodash.isFinite=isFinite;lodash.isFunction=isFunction;lodash.isMatch=isMatch;lodash.isNaN=isNaN;lodash.isNative=isNative;lodash.isNull=isNull;lodash.isNumber=isNumber;lodash.isObject=isObject;lodash.isPlainObject=isPlainObject;lodash.isRegExp=isRegExp;lodash.isString=isString;lodash.isTypedArray=isTypedArray;lodash.isUndefined=isUndefined;lodash.kebabCase=kebabCase;lodash.last=last;lodash.lastIndexOf=lastIndexOf;lodash.lt=lt;lodash.lte=lte;lodash.max=max;lodash.min=min;lodash.noConflict=noConflict;lodash.noop=noop;lodash.now=now;lodash.pad=pad;lodash.padLeft=padLeft;lodash.padRight=padRight;lodash.parseInt=parseInt;lodash.random=random;lodash.reduce=reduce;lodash.reduceRight=reduceRight;lodash.repeat=repeat;lodash.result=result;lodash.round=round;lodash.runInContext=runInContext;lodash.size=size;lodash.snakeCase=snakeCase;lodash.some=some;lodash.sortedIndex=sortedIndex;lodash.sortedLastIndex=sortedLastIndex;lodash.startCase=startCase;lodash.startsWith=startsWith;lodash.sum=sum;lodash.template=template;lodash.trim=trim;lodash.trimLeft=trimLeft;lodash.trimRight=trimRight;lodash.trunc=trunc;lodash.unescape=unescape;lodash.uniqueId=uniqueId;lodash.words=words;// Add aliases.
lodash.all=every;lodash.any=some;lodash.contains=includes;lodash.eq=isEqual;lodash.detect=find;lodash.foldl=reduce;lodash.foldr=reduceRight;lodash.head=first;lodash.include=includes;lodash.inject=reduce;mixin(lodash,function(){var source={};baseForOwn(lodash,function(func,methodName){if(!lodash.prototype[methodName]){source[methodName]=func;}});return source;}(),false);/*------------------------------------------------------------------------*/// Add functions capable of returning wrapped and unwrapped values when chaining.
lodash.sample=sample;lodash.prototype.sample=function(n){if(!this.__chain__&&n==null){return sample(this.value());}return this.thru(function(value){return sample(value,n);});};/*------------------------------------------------------------------------*//**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */lodash.VERSION=VERSION;// Assign default placeholders.
arrayEach(['bind','bindKey','curry','curryRight','partial','partialRight'],function(methodName){lodash[methodName].placeholder=lodash;});// Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
arrayEach(['drop','take'],function(methodName,index){LazyWrapper.prototype[methodName]=function(n){var filtered=this.__filtered__;if(filtered&&!index){return new LazyWrapper(this);}n=n==null?1:nativeMax(nativeFloor(n)||0,0);var result=this.clone();if(filtered){result.__takeCount__=nativeMin(result.__takeCount__,n);}else{result.__views__.push({'size':n,'type':methodName+(result.__dir__<0?'Right':'')});}return result;};LazyWrapper.prototype[methodName+'Right']=function(n){return this.reverse()[methodName](n).reverse();};});// Add `LazyWrapper` methods that accept an `iteratee` value.
arrayEach(['filter','map','takeWhile'],function(methodName,index){var type=index+1,isFilter=type!=LAZY_MAP_FLAG;LazyWrapper.prototype[methodName]=function(iteratee,thisArg){var result=this.clone();result.__iteratees__.push({'iteratee':getCallback(iteratee,thisArg,1),'type':type});result.__filtered__=result.__filtered__||isFilter;return result;};});// Add `LazyWrapper` methods for `_.first` and `_.last`.
arrayEach(['first','last'],function(methodName,index){var takeName='take'+(index?'Right':'');LazyWrapper.prototype[methodName]=function(){return this[takeName](1).value()[0];};});// Add `LazyWrapper` methods for `_.initial` and `_.rest`.
arrayEach(['initial','rest'],function(methodName,index){var dropName='drop'+(index?'':'Right');LazyWrapper.prototype[methodName]=function(){return this.__filtered__?new LazyWrapper(this):this[dropName](1);};});// Add `LazyWrapper` methods for `_.pluck` and `_.where`.
arrayEach(['pluck','where'],function(methodName,index){var operationName=index?'filter':'map',createCallback=index?baseMatches:property;LazyWrapper.prototype[methodName]=function(value){return this[operationName](createCallback(value));};});LazyWrapper.prototype.compact=function(){return this.filter(identity);};LazyWrapper.prototype.reject=function(predicate,thisArg){predicate=getCallback(predicate,thisArg,1);return this.filter(function(value){return!predicate(value);});};LazyWrapper.prototype.slice=function(start,end){start=start==null?0:+start||0;var result=this;if(result.__filtered__&&(start>0||end<0)){return new LazyWrapper(result);}if(start<0){result=result.takeRight(-start);}else if(start){result=result.drop(start);}if(end!==undefined){end=+end||0;result=end<0?result.dropRight(-end):result.take(end-start);}return result;};LazyWrapper.prototype.takeRightWhile=function(predicate,thisArg){return this.reverse().takeWhile(predicate,thisArg).reverse();};LazyWrapper.prototype.toArray=function(){return this.take(POSITIVE_INFINITY);};// Add `LazyWrapper` methods to `lodash.prototype`.
baseForOwn(LazyWrapper.prototype,function(func,methodName){var checkIteratee=/^(?:filter|map|reject)|While$/.test(methodName),retUnwrapped=/^(?:first|last)$/.test(methodName),lodashFunc=lodash[retUnwrapped?'take'+(methodName=='last'?'Right':''):methodName];if(!lodashFunc){return;}lodash.prototype[methodName]=function(){var args=retUnwrapped?[1]:arguments,chainAll=this.__chain__,value=this.__wrapped__,isHybrid=!!this.__actions__.length,isLazy=value instanceof LazyWrapper,iteratee=args[0],useLazy=isLazy||isArray(value);if(useLazy&&checkIteratee&&typeof iteratee=='function'&&iteratee.length!=1){// Avoid lazy use if the iteratee has a "length" value other than `1`.
isLazy=useLazy=false;}var interceptor=function interceptor(value){return retUnwrapped&&chainAll?lodashFunc(value,1)[0]:lodashFunc.apply(undefined,arrayPush([value],args));};var action={'func':thru,'args':[interceptor],'thisArg':undefined},onlyLazy=isLazy&&!isHybrid;if(retUnwrapped&&!chainAll){if(onlyLazy){value=value.clone();value.__actions__.push(action);return func.call(value);}return lodashFunc.call(undefined,this.value())[0];}if(!retUnwrapped&&useLazy){value=onlyLazy?value:new LazyWrapper(this);var result=func.apply(value,args);result.__actions__.push(action);return new LodashWrapper(result,chainAll);}return this.thru(interceptor);};});// Add `Array` and `String` methods to `lodash.prototype`.
arrayEach(['join','pop','push','replace','shift','sort','splice','split','unshift'],function(methodName){var func=(/^(?:replace|split)$/.test(methodName)?stringProto:arrayProto)[methodName],chainName=/^(?:push|sort|unshift)$/.test(methodName)?'tap':'thru',retUnwrapped=/^(?:join|pop|replace|shift)$/.test(methodName);lodash.prototype[methodName]=function(){var args=arguments;if(retUnwrapped&&!this.__chain__){return func.apply(this.value(),args);}return this[chainName](function(value){return func.apply(value,args);});};});// Map minified function names to their real names.
baseForOwn(LazyWrapper.prototype,function(func,methodName){var lodashFunc=lodash[methodName];if(lodashFunc){var key=lodashFunc.name,names=realNames[key]||(realNames[key]=[]);names.push({'name':methodName,'func':lodashFunc});}});realNames[createHybridWrapper(undefined,BIND_KEY_FLAG).name]=[{'name':'wrapper','func':undefined}];// Add functions to the lazy wrapper.
LazyWrapper.prototype.clone=lazyClone;LazyWrapper.prototype.reverse=lazyReverse;LazyWrapper.prototype.value=lazyValue;// Add chaining functions to the `lodash` wrapper.
lodash.prototype.chain=wrapperChain;lodash.prototype.commit=wrapperCommit;lodash.prototype.concat=wrapperConcat;lodash.prototype.plant=wrapperPlant;lodash.prototype.reverse=wrapperReverse;lodash.prototype.toString=wrapperToString;lodash.prototype.run=lodash.prototype.toJSON=lodash.prototype.valueOf=lodash.prototype.value=wrapperValue;// Add function aliases to the `lodash` wrapper.
lodash.prototype.collect=lodash.prototype.map;lodash.prototype.head=lodash.prototype.first;lodash.prototype.select=lodash.prototype.filter;lodash.prototype.tail=lodash.prototype.rest;return lodash;}/*--------------------------------------------------------------------------*/// Export lodash.
var _=runInContext();// Some AMD build optimizers like r.js check for condition patterns like the following:
if(typeof define=='function'&&_typeof(define.amd)=='object'&&define.amd){// Expose lodash to the global object when an AMD loader is present to avoid
// errors in cases where lodash is loaded by a script tag and not intended
// as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
// more details.
root._=_;// Define as an anonymous module so, through path mapping, it can be
// referenced as the "underscore" module.
define(function(){return _;});}// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
else if(freeExports&&freeModule){// Export for Node.js or RingoJS.
if(moduleExports){(freeModule.exports=_)._=_;}// Export for Rhino with CommonJS support.
else{freeExports._=_;}}else{// Export for a browser or Rhino.
root._=_;}}).call(commonjsGlobal);});var __moduleExports$4=createCommonjsModule(function(module){/* global window */var lodash;if('function'==="function"){try{lodash=__moduleExports$5;}catch(e){}}if(!lodash){lodash=window._;}module.exports=lodash;});var __moduleExports$3=createCommonjsModule(function(module){"use strict";var _=__moduleExports$4;module.exports=Graph;var DEFAULT_EDGE_NAME="\x00",GRAPH_NODE="\x00",EDGE_KEY_DELIM="\x01";// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.
function Graph(opts){this._isDirected=_.has(opts,"directed")?opts.directed:true;this._isMultigraph=_.has(opts,"multigraph")?opts.multigraph:false;this._isCompound=_.has(opts,"compound")?opts.compound:false;// Label for the graph itself
this._label=undefined;// Defaults to be set when creating a new node
this._defaultNodeLabelFn=_.constant(undefined);// Defaults to be set when creating a new edge
this._defaultEdgeLabelFn=_.constant(undefined);// v -> label
this._nodes={};if(this._isCompound){// v -> parent
this._parent={};// v -> children
this._children={};this._children[GRAPH_NODE]={};}// v -> edgeObj
this._in={};// u -> v -> Number
this._preds={};// v -> edgeObj
this._out={};// v -> w -> Number
this._sucs={};// e -> edgeObj
this._edgeObjs={};// e -> label
this._edgeLabels={};}/* Number of nodes in the graph. Should only be changed by the implementation. */Graph.prototype._nodeCount=0;/* Number of edges in the graph. Should only be changed by the implementation. */Graph.prototype._edgeCount=0;/* === Graph functions ========= */Graph.prototype.isDirected=function(){return this._isDirected;};Graph.prototype.isMultigraph=function(){return this._isMultigraph;};Graph.prototype.isCompound=function(){return this._isCompound;};Graph.prototype.setGraph=function(label){this._label=label;return this;};Graph.prototype.graph=function(){return this._label;};/* === Node functions ========== */Graph.prototype.setDefaultNodeLabel=function(newDefault){if(!_.isFunction(newDefault)){newDefault=_.constant(newDefault);}this._defaultNodeLabelFn=newDefault;return this;};Graph.prototype.nodeCount=function(){return this._nodeCount;};Graph.prototype.nodes=function(){return _.keys(this._nodes);};Graph.prototype.sources=function(){return _.filter(this.nodes(),function(v){return _.isEmpty(this._in[v]);},this);};Graph.prototype.sinks=function(){return _.filter(this.nodes(),function(v){return _.isEmpty(this._out[v]);},this);};Graph.prototype.setNodes=function(vs,value){var args=arguments;_.each(vs,function(v){if(args.length>1){this.setNode(v,value);}else{this.setNode(v);}},this);return this;};Graph.prototype.setNode=function(v,value){if(_.has(this._nodes,v)){if(arguments.length>1){this._nodes[v]=value;}return this;}this._nodes[v]=arguments.length>1?value:this._defaultNodeLabelFn(v);if(this._isCompound){this._parent[v]=GRAPH_NODE;this._children[v]={};this._children[GRAPH_NODE][v]=true;}this._in[v]={};this._preds[v]={};this._out[v]={};this._sucs[v]={};++this._nodeCount;return this;};Graph.prototype.node=function(v){return this._nodes[v];};Graph.prototype.hasNode=function(v){return _.has(this._nodes,v);};Graph.prototype.removeNode=function(v){var self=this;if(_.has(this._nodes,v)){var removeEdge=function removeEdge(e){self.removeEdge(self._edgeObjs[e]);};delete this._nodes[v];if(this._isCompound){this._removeFromParentsChildList(v);delete this._parent[v];_.each(this.children(v),function(child){this.setParent(child);},this);delete this._children[v];}_.each(_.keys(this._in[v]),removeEdge);delete this._in[v];delete this._preds[v];_.each(_.keys(this._out[v]),removeEdge);delete this._out[v];delete this._sucs[v];--this._nodeCount;}return this;};Graph.prototype.setParent=function(v,parent){if(!this._isCompound){throw new Error("Cannot set parent in a non-compound graph");}if(_.isUndefined(parent)){parent=GRAPH_NODE;}else{// Coerce parent to string
parent+="";for(var ancestor=parent;!_.isUndefined(ancestor);ancestor=this.parent(ancestor)){if(ancestor===v){throw new Error("Setting "+parent+" as parent of "+v+" would create create a cycle");}}this.setNode(parent);}this.setNode(v);this._removeFromParentsChildList(v);this._parent[v]=parent;this._children[parent][v]=true;return this;};Graph.prototype._removeFromParentsChildList=function(v){delete this._children[this._parent[v]][v];};Graph.prototype.parent=function(v){if(this._isCompound){var parent=this._parent[v];if(parent!==GRAPH_NODE){return parent;}}};Graph.prototype.children=function(v){if(_.isUndefined(v)){v=GRAPH_NODE;}if(this._isCompound){var children=this._children[v];if(children){return _.keys(children);}}else if(v===GRAPH_NODE){return this.nodes();}else if(this.hasNode(v)){return[];}};Graph.prototype.predecessors=function(v){var predsV=this._preds[v];if(predsV){return _.keys(predsV);}};Graph.prototype.successors=function(v){var sucsV=this._sucs[v];if(sucsV){return _.keys(sucsV);}};Graph.prototype.neighbors=function(v){var preds=this.predecessors(v);if(preds){return _.union(preds,this.successors(v));}};Graph.prototype.filterNodes=function(filter){var copy=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});copy.setGraph(this.graph());_.each(this._nodes,function(value,v){if(filter(v)){copy.setNode(v,value);}},this);_.each(this._edgeObjs,function(e){if(copy.hasNode(e.v)&&copy.hasNode(e.w)){copy.setEdge(e,this.edge(e));}},this);var self=this;var parents={};function findParent(v){var parent=self.parent(v);if(parent===undefined||copy.hasNode(parent)){parents[v]=parent;return parent;}else if(parent in parents){return parents[parent];}else{return findParent(parent);}}if(this._isCompound){_.each(copy.nodes(),function(v){copy.setParent(v,findParent(v));});}return copy;};/* === Edge functions ========== */Graph.prototype.setDefaultEdgeLabel=function(newDefault){if(!_.isFunction(newDefault)){newDefault=_.constant(newDefault);}this._defaultEdgeLabelFn=newDefault;return this;};Graph.prototype.edgeCount=function(){return this._edgeCount;};Graph.prototype.edges=function(){return _.values(this._edgeObjs);};Graph.prototype.setPath=function(vs,value){var self=this,args=arguments;_.reduce(vs,function(v,w){if(args.length>1){self.setEdge(v,w,value);}else{self.setEdge(v,w);}return w;});return this;};/*
 * setEdge(v, w, [value, [name]])
 * setEdge({ v, w, [name] }, [value])
 */Graph.prototype.setEdge=function(){var v,w,name,value,valueSpecified=false,arg0=arguments[0];if((typeof arg0==="undefined"?"undefined":_typeof(arg0))==="object"&&arg0!==null&&"v"in arg0){v=arg0.v;w=arg0.w;name=arg0.name;if(arguments.length===2){value=arguments[1];valueSpecified=true;}}else{v=arg0;w=arguments[1];name=arguments[3];if(arguments.length>2){value=arguments[2];valueSpecified=true;}}v=""+v;w=""+w;if(!_.isUndefined(name)){name=""+name;}var e=edgeArgsToId(this._isDirected,v,w,name);if(_.has(this._edgeLabels,e)){if(valueSpecified){this._edgeLabels[e]=value;}return this;}if(!_.isUndefined(name)&&!this._isMultigraph){throw new Error("Cannot set a named edge when isMultigraph = false");}// It didn't exist, so we need to create it.
// First ensure the nodes exist.
this.setNode(v);this.setNode(w);this._edgeLabels[e]=valueSpecified?value:this._defaultEdgeLabelFn(v,w,name);var edgeObj=edgeArgsToObj(this._isDirected,v,w,name);// Ensure we add undirected edges in a consistent way.
v=edgeObj.v;w=edgeObj.w;Object.freeze(edgeObj);this._edgeObjs[e]=edgeObj;incrementOrInitEntry(this._preds[w],v);incrementOrInitEntry(this._sucs[v],w);this._in[w][e]=edgeObj;this._out[v][e]=edgeObj;this._edgeCount++;return this;};Graph.prototype.edge=function(v,w,name){var e=arguments.length===1?edgeObjToId(this._isDirected,arguments[0]):edgeArgsToId(this._isDirected,v,w,name);return this._edgeLabels[e];};Graph.prototype.hasEdge=function(v,w,name){var e=arguments.length===1?edgeObjToId(this._isDirected,arguments[0]):edgeArgsToId(this._isDirected,v,w,name);return _.has(this._edgeLabels,e);};Graph.prototype.removeEdge=function(v,w,name){var e=arguments.length===1?edgeObjToId(this._isDirected,arguments[0]):edgeArgsToId(this._isDirected,v,w,name),edge=this._edgeObjs[e];if(edge){v=edge.v;w=edge.w;delete this._edgeLabels[e];delete this._edgeObjs[e];decrementOrRemoveEntry(this._preds[w],v);decrementOrRemoveEntry(this._sucs[v],w);delete this._in[w][e];delete this._out[v][e];this._edgeCount--;}return this;};Graph.prototype.inEdges=function(v,u){var inV=this._in[v];if(inV){var edges=_.values(inV);if(!u){return edges;}return _.filter(edges,function(edge){return edge.v===u;});}};Graph.prototype.outEdges=function(v,w){var outV=this._out[v];if(outV){var edges=_.values(outV);if(!w){return edges;}return _.filter(edges,function(edge){return edge.w===w;});}};Graph.prototype.nodeEdges=function(v,w){var inEdges=this.inEdges(v,w);if(inEdges){return inEdges.concat(this.outEdges(v,w));}};function incrementOrInitEntry(map,k){if(map[k]){map[k]++;}else{map[k]=1;}}function decrementOrRemoveEntry(map,k){if(! --map[k]){delete map[k];}}function edgeArgsToId(isDirected,v_,w_,name){var v=""+v_;var w=""+w_;if(!isDirected&&v>w){var tmp=v;v=w;w=tmp;}return v+EDGE_KEY_DELIM+w+EDGE_KEY_DELIM+(_.isUndefined(name)?DEFAULT_EDGE_NAME:name);}function edgeArgsToObj(isDirected,v_,w_,name){var v=""+v_;var w=""+w_;if(!isDirected&&v>w){var tmp=v;v=w;w=tmp;}var edgeObj={v:v,w:w};if(name){edgeObj.name=name;}return edgeObj;}function edgeObjToId(isDirected,edgeObj){return edgeArgsToId(isDirected,edgeObj.v,edgeObj.w,edgeObj.name);}});var __moduleExports$6=createCommonjsModule(function(module){module.exports='1.0.7';});var __moduleExports$2=createCommonjsModule(function(module){// Includes only the "core" of graphlib
module.exports={Graph:__moduleExports$3,version:__moduleExports$6};});var __moduleExports$7=createCommonjsModule(function(module){var _=__moduleExports$4,Graph=__moduleExports$3;module.exports={write:write,read:read};function write(g){var json={options:{directed:g.isDirected(),multigraph:g.isMultigraph(),compound:g.isCompound()},nodes:writeNodes(g),edges:writeEdges(g)};if(!_.isUndefined(g.graph())){json.value=_.clone(g.graph());}return json;}function writeNodes(g){return _.map(g.nodes(),function(v){var nodeValue=g.node(v),parent=g.parent(v),node={v:v};if(!_.isUndefined(nodeValue)){node.value=nodeValue;}if(!_.isUndefined(parent)){node.parent=parent;}return node;});}function writeEdges(g){return _.map(g.edges(),function(e){var edgeValue=g.edge(e),edge={v:e.v,w:e.w};if(!_.isUndefined(e.name)){edge.name=e.name;}if(!_.isUndefined(edgeValue)){edge.value=edgeValue;}return edge;});}function read(json){var g=new Graph(json.options).setGraph(json.value);_.each(json.nodes,function(entry){g.setNode(entry.v,entry.value);if(entry.parent){g.setParent(entry.v,entry.parent);}});_.each(json.edges,function(entry){g.setEdge({v:entry.v,w:entry.w,name:entry.name},entry.value);});return g;}});var __moduleExports$9=createCommonjsModule(function(module){var _=__moduleExports$4;module.exports=components;function components(g){var visited={},cmpts=[],cmpt;function dfs(v){if(_.has(visited,v))return;visited[v]=true;cmpt.push(v);_.each(g.successors(v),dfs);_.each(g.predecessors(v),dfs);}_.each(g.nodes(),function(v){cmpt=[];dfs(v);if(cmpt.length){cmpts.push(cmpt);}});return cmpts;}});var __moduleExports$11=createCommonjsModule(function(module){var _=__moduleExports$4;module.exports=PriorityQueue;/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */function PriorityQueue(){this._arr=[];this._keyIndices={};}/**
 * Returns the number of elements in the queue. Takes `O(1)` time.
 */PriorityQueue.prototype.size=function(){return this._arr.length;};/**
 * Returns the keys that are in the queue. Takes `O(n)` time.
 */PriorityQueue.prototype.keys=function(){return this._arr.map(function(x){return x.key;});};/**
 * Returns `true` if **key** is in the queue and `false` if not.
 */PriorityQueue.prototype.has=function(key){return _.has(this._keyIndices,key);};/**
 * Returns the priority for **key**. If **key** is not present in the queue
 * then this function returns `undefined`. Takes `O(1)` time.
 *
 * @param {Object} key
 */PriorityQueue.prototype.priority=function(key){var index=this._keyIndices[key];if(index!==undefined){return this._arr[index].priority;}};/**
 * Returns the key for the minimum element in this queue. If the queue is
 * empty this function throws an Error. Takes `O(1)` time.
 */PriorityQueue.prototype.min=function(){if(this.size()===0){throw new Error("Queue underflow");}return this._arr[0].key;};/**
 * Inserts a new key into the priority queue. If the key already exists in
 * the queue this function returns `false`; otherwise it will return `true`.
 * Takes `O(n)` time.
 *
 * @param {Object} key the key to add
 * @param {Number} priority the initial priority for the key
 */PriorityQueue.prototype.add=function(key,priority){var keyIndices=this._keyIndices;key=String(key);if(!_.has(keyIndices,key)){var arr=this._arr;var index=arr.length;keyIndices[key]=index;arr.push({key:key,priority:priority});this._decrease(index);return true;}return false;};/**
 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
 */PriorityQueue.prototype.removeMin=function(){this._swap(0,this._arr.length-1);var min=this._arr.pop();delete this._keyIndices[min.key];this._heapify(0);return min.key;};/**
 * Decreases the priority for **key** to **priority**. If the new priority is
 * greater than the previous priority, this function will throw an Error.
 *
 * @param {Object} key the key for which to raise priority
 * @param {Number} priority the new priority for the key
 */PriorityQueue.prototype.decrease=function(key,priority){var index=this._keyIndices[key];if(priority>this._arr[index].priority){throw new Error("New priority is greater than current priority. "+"Key: "+key+" Old: "+this._arr[index].priority+" New: "+priority);}this._arr[index].priority=priority;this._decrease(index);};PriorityQueue.prototype._heapify=function(i){var arr=this._arr;var l=2*i,r=l+1,largest=i;if(l<arr.length){largest=arr[l].priority<arr[largest].priority?l:largest;if(r<arr.length){largest=arr[r].priority<arr[largest].priority?r:largest;}if(largest!==i){this._swap(i,largest);this._heapify(largest);}}};PriorityQueue.prototype._decrease=function(index){var arr=this._arr;var priority=arr[index].priority;var parent;while(index!==0){parent=index>>1;if(arr[parent].priority<priority){break;}this._swap(index,parent);index=parent;}};PriorityQueue.prototype._swap=function(i,j){var arr=this._arr;var keyIndices=this._keyIndices;var origArrI=arr[i];var origArrJ=arr[j];arr[i]=origArrJ;arr[j]=origArrI;keyIndices[origArrJ.key]=i;keyIndices[origArrI.key]=j;};});var __moduleExports$10=createCommonjsModule(function(module){var _=__moduleExports$4,PriorityQueue=__moduleExports$11;module.exports=dijkstra;var DEFAULT_WEIGHT_FUNC=_.constant(1);function dijkstra(g,source,weightFn,edgeFn){return runDijkstra(g,String(source),weightFn||DEFAULT_WEIGHT_FUNC,edgeFn||function(v){return g.outEdges(v);});}function runDijkstra(g,source,weightFn,edgeFn){var results={},pq=new PriorityQueue(),v,vEntry;var updateNeighbors=function updateNeighbors(edge){var w=edge.v!==v?edge.v:edge.w,wEntry=results[w],weight=weightFn(edge),distance=vEntry.distance+weight;if(weight<0){throw new Error("dijkstra does not allow negative edge weights. "+"Bad edge: "+edge+" Weight: "+weight);}if(distance<wEntry.distance){wEntry.distance=distance;wEntry.predecessor=v;pq.decrease(w,distance);}};g.nodes().forEach(function(v){var distance=v===source?0:Number.POSITIVE_INFINITY;results[v]={distance:distance};pq.add(v,distance);});while(pq.size()>0){v=pq.removeMin();vEntry=results[v];if(vEntry.distance===Number.POSITIVE_INFINITY){break;}edgeFn(v).forEach(updateNeighbors);}return results;}});var __moduleExports$12=createCommonjsModule(function(module){var dijkstra=__moduleExports$10,_=__moduleExports$4;module.exports=dijkstraAll;function dijkstraAll(g,weightFunc,edgeFunc){return _.transform(g.nodes(),function(acc,v){acc[v]=dijkstra(g,v,weightFunc,edgeFunc);},{});}});var __moduleExports$14=createCommonjsModule(function(module){var _=__moduleExports$4;module.exports=tarjan;function tarjan(g){var index=0,stack=[],visited={},// node id -> { onStack, lowlink, index }
results=[];function dfs(v){var entry=visited[v]={onStack:true,lowlink:index,index:index++};stack.push(v);g.successors(v).forEach(function(w){if(!_.has(visited,w)){dfs(w);entry.lowlink=Math.min(entry.lowlink,visited[w].lowlink);}else if(visited[w].onStack){entry.lowlink=Math.min(entry.lowlink,visited[w].index);}});if(entry.lowlink===entry.index){var cmpt=[],w;do{w=stack.pop();visited[w].onStack=false;cmpt.push(w);}while(v!==w);results.push(cmpt);}}g.nodes().forEach(function(v){if(!_.has(visited,v)){dfs(v);}});return results;}});var __moduleExports$13=createCommonjsModule(function(module){var _=__moduleExports$4,tarjan=__moduleExports$14;module.exports=findCycles;function findCycles(g){return _.filter(tarjan(g),function(cmpt){return cmpt.length>1||cmpt.length===1&&g.hasEdge(cmpt[0],cmpt[0]);});}});var __moduleExports$15=createCommonjsModule(function(module){var _=__moduleExports$4;module.exports=floydWarshall;var DEFAULT_WEIGHT_FUNC=_.constant(1);function floydWarshall(g,weightFn,edgeFn){return runFloydWarshall(g,weightFn||DEFAULT_WEIGHT_FUNC,edgeFn||function(v){return g.outEdges(v);});}function runFloydWarshall(g,weightFn,edgeFn){var results={},nodes=g.nodes();nodes.forEach(function(v){results[v]={};results[v][v]={distance:0};nodes.forEach(function(w){if(v!==w){results[v][w]={distance:Number.POSITIVE_INFINITY};}});edgeFn(v).forEach(function(edge){var w=edge.v===v?edge.w:edge.v,d=weightFn(edge);results[v][w]={distance:d,predecessor:v};});});nodes.forEach(function(k){var rowK=results[k];nodes.forEach(function(i){var rowI=results[i];nodes.forEach(function(j){var ik=rowI[k];var kj=rowK[j];var ij=rowI[j];var altDistance=ik.distance+kj.distance;if(altDistance<ij.distance){ij.distance=altDistance;ij.predecessor=kj.predecessor;}});});});return results;}});var __moduleExports$17=createCommonjsModule(function(module){var _=__moduleExports$4;module.exports=topsort;topsort.CycleException=CycleException;function topsort(g){var visited={},stack={},results=[];function visit(node){if(_.has(stack,node)){throw new CycleException();}if(!_.has(visited,node)){stack[node]=true;visited[node]=true;_.each(g.predecessors(node),visit);delete stack[node];results.push(node);}}_.each(g.sinks(),visit);if(_.size(visited)!==g.nodeCount()){throw new CycleException();}return results;}function CycleException(){}});var __moduleExports$16=createCommonjsModule(function(module){var topsort=__moduleExports$17;module.exports=isAcyclic;function isAcyclic(g){try{topsort(g);}catch(e){if(e instanceof topsort.CycleException){return false;}throw e;}return true;}});var __moduleExports$19=createCommonjsModule(function(module){var _=__moduleExports$4;module.exports=dfs;/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. This algorithm treats
 * the input as undirected.
 *
 * Order must be one of "pre" or "post".
 */function dfs(g,vs,order){if(!_.isArray(vs)){vs=[vs];}var acc=[],visited={};_.each(vs,function(v){if(!g.hasNode(v)){throw new Error("Graph does not have node: "+v);}doDfs(g,v,order==="post",visited,acc);});return acc;}function doDfs(g,v,postorder,visited,acc){if(!_.has(visited,v)){visited[v]=true;if(!postorder){acc.push(v);}_.each(g.neighbors(v),function(w){doDfs(g,w,postorder,visited,acc);});if(postorder){acc.push(v);}}}});var __moduleExports$18=createCommonjsModule(function(module){var dfs=__moduleExports$19;module.exports=postorder;function postorder(g,vs){return dfs(g,vs,"post");}});var __moduleExports$20=createCommonjsModule(function(module){var dfs=__moduleExports$19;module.exports=preorder;function preorder(g,vs){return dfs(g,vs,"pre");}});var __moduleExports$21=createCommonjsModule(function(module){var _=__moduleExports$4,Graph=__moduleExports$3,PriorityQueue=__moduleExports$11;module.exports=prim;function prim(g,weightFunc){var result=new Graph(),parents={},pq=new PriorityQueue(),v;function updateNeighbors(edge){var w=edge.v===v?edge.w:edge.v,pri=pq.priority(w);if(pri!==undefined){var edgeWeight=weightFunc(edge);if(edgeWeight<pri){parents[w]=v;pq.decrease(w,edgeWeight);}}}if(g.nodeCount()===0){return result;}_.each(g.nodes(),function(v){pq.add(v,Number.POSITIVE_INFINITY);result.setNode(v);});// Start from an arbitrary node
pq.decrease(g.nodes()[0],0);var init=false;while(pq.size()>0){v=pq.removeMin();if(_.has(parents,v)){result.setEdge(v,parents[v]);}else if(init){throw new Error("Input graph is not connected: "+g);}else{init=true;}g.nodeEdges(v).forEach(updateNeighbors);}return result;}});var __moduleExports$8=createCommonjsModule(function(module){module.exports={components:__moduleExports$9,dijkstra:__moduleExports$10,dijkstraAll:__moduleExports$12,findCycles:__moduleExports$13,floydWarshall:__moduleExports$15,isAcyclic:__moduleExports$16,postorder:__moduleExports$18,preorder:__moduleExports$20,prim:__moduleExports$21,tarjan:__moduleExports$14,topsort:__moduleExports$17};});var __moduleExports$1=createCommonjsModule(function(module){/**
 * Copyright (c) 2014, Chris Pettitt
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */var lib=__moduleExports$2;module.exports={Graph:lib.Graph,json:__moduleExports$7,alg:__moduleExports$8,version:lib.version};});var __moduleExports=createCommonjsModule(function(module){/* global window */var graphlib;if('function'==="function"){try{graphlib=__moduleExports$1;}catch(e){}}if(!graphlib){graphlib=window.graphlib;}module.exports=graphlib;});var __moduleExports$24=createCommonjsModule(function(module,exports){/**
 * @license
 * lodash 3.10.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern -d -o ./index.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */;(function(){/** Used as a safe reference for `undefined` in pre-ES5 environments. */var undefined;/** Used as the semantic version number. */var VERSION='3.10.1';/** Used to compose bitmasks for wrapper metadata. */var BIND_FLAG=1,BIND_KEY_FLAG=2,CURRY_BOUND_FLAG=4,CURRY_FLAG=8,CURRY_RIGHT_FLAG=16,PARTIAL_FLAG=32,PARTIAL_RIGHT_FLAG=64,ARY_FLAG=128,REARG_FLAG=256;/** Used as default options for `_.trunc`. */var DEFAULT_TRUNC_LENGTH=30,DEFAULT_TRUNC_OMISSION='...';/** Used to detect when a function becomes hot. */var HOT_COUNT=150,HOT_SPAN=16;/** Used as the size to enable large array optimizations. */var LARGE_ARRAY_SIZE=200;/** Used to indicate the type of lazy iteratees. */var LAZY_FILTER_FLAG=1,LAZY_MAP_FLAG=2;/** Used as the `TypeError` message for "Functions" methods. */var FUNC_ERROR_TEXT='Expected a function';/** Used as the internal argument placeholder. */var PLACEHOLDER='__lodash_placeholder__';/** `Object#toString` result references. */var argsTag='[object Arguments]',arrayTag='[object Array]',boolTag='[object Boolean]',dateTag='[object Date]',errorTag='[object Error]',funcTag='[object Function]',mapTag='[object Map]',numberTag='[object Number]',objectTag='[object Object]',regexpTag='[object RegExp]',setTag='[object Set]',stringTag='[object String]',weakMapTag='[object WeakMap]';var arrayBufferTag='[object ArrayBuffer]',float32Tag='[object Float32Array]',float64Tag='[object Float64Array]',int8Tag='[object Int8Array]',int16Tag='[object Int16Array]',int32Tag='[object Int32Array]',uint8Tag='[object Uint8Array]',uint8ClampedTag='[object Uint8ClampedArray]',uint16Tag='[object Uint16Array]',uint32Tag='[object Uint32Array]';/** Used to match empty string literals in compiled template source. */var reEmptyStringLeading=/\b__p \+= '';/g,reEmptyStringMiddle=/\b(__p \+=) '' \+/g,reEmptyStringTrailing=/(__e\(.*?\)|\b__t\)) \+\n'';/g;/** Used to match HTML entities and HTML characters. */var reEscapedHtml=/&(?:amp|lt|gt|quot|#39|#96);/g,reUnescapedHtml=/[&<>"'`]/g,reHasEscapedHtml=RegExp(reEscapedHtml.source),reHasUnescapedHtml=RegExp(reUnescapedHtml.source);/** Used to match template delimiters. */var reEscape=/<%-([\s\S]+?)%>/g,reEvaluate=/<%([\s\S]+?)%>/g,reInterpolate=/<%=([\s\S]+?)%>/g;/** Used to match property names within property paths. */var reIsDeepProp=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,reIsPlainProp=/^\w*$/,rePropName=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;/**
   * Used to match `RegExp` [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns)
   * and those outlined by [`EscapeRegExpPattern`](http://ecma-international.org/ecma-262/6.0/#sec-escaperegexppattern).
   */var reRegExpChars=/^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g,reHasRegExpChars=RegExp(reRegExpChars.source);/** Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks). */var reComboMark=/[\u0300-\u036f\ufe20-\ufe23]/g;/** Used to match backslashes in property paths. */var reEscapeChar=/\\(\\)?/g;/** Used to match [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components). */var reEsTemplate=/\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;/** Used to match `RegExp` flags from their coerced string values. */var reFlags=/\w*$/;/** Used to detect hexadecimal string values. */var reHasHexPrefix=/^0[xX]/;/** Used to detect host constructors (Safari > 5). */var reIsHostCtor=/^\[object .+?Constructor\]$/;/** Used to detect unsigned integer values. */var reIsUint=/^\d+$/;/** Used to match latin-1 supplementary letters (excluding mathematical operators). */var reLatin1=/[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;/** Used to ensure capturing order of template delimiters. */var reNoMatch=/($^)/;/** Used to match unescaped characters in compiled string literals. */var reUnescapedString=/['\n\r\u2028\u2029\\]/g;/** Used to match words to create compound words. */var reWords=function(){var upper='[A-Z\\xc0-\\xd6\\xd8-\\xde]',lower='[a-z\\xdf-\\xf6\\xf8-\\xff]+';return RegExp(upper+'+(?='+upper+lower+')|'+upper+'?'+lower+'|'+upper+'+|[0-9]+','g');}();/** Used to assign default `context` object properties. */var contextProps=['Array','ArrayBuffer','Date','Error','Float32Array','Float64Array','Function','Int8Array','Int16Array','Int32Array','Math','Number','Object','RegExp','Set','String','_','clearTimeout','isFinite','parseFloat','parseInt','setTimeout','TypeError','Uint8Array','Uint8ClampedArray','Uint16Array','Uint32Array','WeakMap'];/** Used to make template sourceURLs easier to identify. */var templateCounter=-1;/** Used to identify `toStringTag` values of typed arrays. */var typedArrayTags={};typedArrayTags[float32Tag]=typedArrayTags[float64Tag]=typedArrayTags[int8Tag]=typedArrayTags[int16Tag]=typedArrayTags[int32Tag]=typedArrayTags[uint8Tag]=typedArrayTags[uint8ClampedTag]=typedArrayTags[uint16Tag]=typedArrayTags[uint32Tag]=true;typedArrayTags[argsTag]=typedArrayTags[arrayTag]=typedArrayTags[arrayBufferTag]=typedArrayTags[boolTag]=typedArrayTags[dateTag]=typedArrayTags[errorTag]=typedArrayTags[funcTag]=typedArrayTags[mapTag]=typedArrayTags[numberTag]=typedArrayTags[objectTag]=typedArrayTags[regexpTag]=typedArrayTags[setTag]=typedArrayTags[stringTag]=typedArrayTags[weakMapTag]=false;/** Used to identify `toStringTag` values supported by `_.clone`. */var cloneableTags={};cloneableTags[argsTag]=cloneableTags[arrayTag]=cloneableTags[arrayBufferTag]=cloneableTags[boolTag]=cloneableTags[dateTag]=cloneableTags[float32Tag]=cloneableTags[float64Tag]=cloneableTags[int8Tag]=cloneableTags[int16Tag]=cloneableTags[int32Tag]=cloneableTags[numberTag]=cloneableTags[objectTag]=cloneableTags[regexpTag]=cloneableTags[stringTag]=cloneableTags[uint8Tag]=cloneableTags[uint8ClampedTag]=cloneableTags[uint16Tag]=cloneableTags[uint32Tag]=true;cloneableTags[errorTag]=cloneableTags[funcTag]=cloneableTags[mapTag]=cloneableTags[setTag]=cloneableTags[weakMapTag]=false;/** Used to map latin-1 supplementary letters to basic latin letters. */var deburredLetters={'\xc0':'A','\xc1':'A','\xc2':'A','\xc3':'A','\xc4':'A','\xc5':'A','\xe0':'a','\xe1':'a','\xe2':'a','\xe3':'a','\xe4':'a','\xe5':'a','\xc7':'C','\xe7':'c','\xd0':'D','\xf0':'d','\xc8':'E','\xc9':'E','\xca':'E','\xcb':'E','\xe8':'e','\xe9':'e','\xea':'e','\xeb':'e','\xcC':'I','\xcd':'I','\xce':'I','\xcf':'I','\xeC':'i','\xed':'i','\xee':'i','\xef':'i','\xd1':'N','\xf1':'n','\xd2':'O','\xd3':'O','\xd4':'O','\xd5':'O','\xd6':'O','\xd8':'O','\xf2':'o','\xf3':'o','\xf4':'o','\xf5':'o','\xf6':'o','\xf8':'o','\xd9':'U','\xda':'U','\xdb':'U','\xdc':'U','\xf9':'u','\xfa':'u','\xfb':'u','\xfc':'u','\xdd':'Y','\xfd':'y','\xff':'y','\xc6':'Ae','\xe6':'ae','\xde':'Th','\xfe':'th','\xdf':'ss'};/** Used to map characters to HTML entities. */var htmlEscapes={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;'};/** Used to map HTML entities to characters. */var htmlUnescapes={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'",'&#96;':'`'};/** Used to determine if values are of the language type `Object`. */var objectTypes={'function':true,'object':true};/** Used to escape characters for inclusion in compiled regexes. */var regexpEscapes={'0':'x30','1':'x31','2':'x32','3':'x33','4':'x34','5':'x35','6':'x36','7':'x37','8':'x38','9':'x39','A':'x41','B':'x42','C':'x43','D':'x44','E':'x45','F':'x46','a':'x61','b':'x62','c':'x63','d':'x64','e':'x65','f':'x66','n':'x6e','r':'x72','t':'x74','u':'x75','v':'x76','x':'x78'};/** Used to escape characters for inclusion in compiled string literals. */var stringEscapes={'\\':'\\',"'":"'",'\n':'n','\r':'r',"\u2028":'u2028',"\u2029":'u2029'};/** Detect free variable `exports`. */var freeExports=objectTypes[typeof exports==="undefined"?"undefined":_typeof(exports)]&&exports&&!exports.nodeType&&exports;/** Detect free variable `module`. */var freeModule=objectTypes[typeof module==="undefined"?"undefined":_typeof(module)]&&module&&!module.nodeType&&module;/** Detect free variable `global` from Node.js. */var freeGlobal=freeExports&&freeModule&&(typeof commonjsGlobal==="undefined"?"undefined":_typeof(commonjsGlobal))=='object'&&commonjsGlobal&&commonjsGlobal.Object&&commonjsGlobal;/** Detect free variable `self`. */var freeSelf=objectTypes[typeof self==="undefined"?"undefined":_typeof(self)]&&self&&self.Object&&self;/** Detect free variable `window`. */var freeWindow=objectTypes[typeof window==="undefined"?"undefined":_typeof(window)]&&window&&window.Object&&window;/** Detect the popular CommonJS extension `module.exports`. */var moduleExports=freeModule&&freeModule.exports===freeExports&&freeExports;/**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it's the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */var root=freeGlobal||freeWindow!==(this&&this.window)&&freeWindow||freeSelf||this;/*--------------------------------------------------------------------------*//**
   * The base implementation of `compareAscending` which compares values and
   * sorts them in ascending order without guaranteeing a stable sort.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {number} Returns the sort order indicator for `value`.
   */function baseCompareAscending(value,other){if(value!==other){var valIsNull=value===null,valIsUndef=value===undefined,valIsReflexive=value===value;var othIsNull=other===null,othIsUndef=other===undefined,othIsReflexive=other===other;if(value>other&&!othIsNull||!valIsReflexive||valIsNull&&!othIsUndef&&othIsReflexive||valIsUndef&&othIsReflexive){return 1;}if(value<other&&!valIsNull||!othIsReflexive||othIsNull&&!valIsUndef&&valIsReflexive||othIsUndef&&valIsReflexive){return-1;}}return 0;}/**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */function baseFindIndex(array,predicate,fromRight){var length=array.length,index=fromRight?length:-1;while(fromRight?index--:++index<length){if(predicate(array[index],index,array)){return index;}}return-1;}/**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */function baseIndexOf(array,value,fromIndex){if(value!==value){return indexOfNaN(array,fromIndex);}var index=fromIndex-1,length=array.length;while(++index<length){if(array[index]===value){return index;}}return-1;}/**
   * The base implementation of `_.isFunction` without support for environments
   * with incorrect `typeof` results.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   */function baseIsFunction(value){// Avoid a Chakra JIT bug in compatibility modes of IE 11.
// See https://github.com/jashkenas/underscore/issues/1621 for more details.
return typeof value=='function'||false;}/**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */function baseToString(value){return value==null?'':value+'';}/**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the first character not found in `chars`.
   */function charsLeftIndex(string,chars){var index=-1,length=string.length;while(++index<length&&chars.indexOf(string.charAt(index))>-1){}return index;}/**
   * Used by `_.trim` and `_.trimRight` to get the index of the last character
   * of `string` that is not found in `chars`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @param {string} chars The characters to find.
   * @returns {number} Returns the index of the last character not found in `chars`.
   */function charsRightIndex(string,chars){var index=string.length;while(index--&&chars.indexOf(string.charAt(index))>-1){}return index;}/**
   * Used by `_.sortBy` to compare transformed elements of a collection and stable
   * sort them in ascending order.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @returns {number} Returns the sort order indicator for `object`.
   */function compareAscending(object,other){return baseCompareAscending(object.criteria,other.criteria)||object.index-other.index;}/**
   * Used by `_.sortByOrder` to compare multiple properties of a value to another
   * and stable sort them.
   *
   * If `orders` is unspecified, all valuess are sorted in ascending order. Otherwise,
   * a value is sorted in ascending order if its corresponding order is "asc", and
   * descending if "desc".
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {boolean[]} orders The order to sort by for each property.
   * @returns {number} Returns the sort order indicator for `object`.
   */function compareMultiple(object,other,orders){var index=-1,objCriteria=object.criteria,othCriteria=other.criteria,length=objCriteria.length,ordersLength=orders.length;while(++index<length){var result=baseCompareAscending(objCriteria[index],othCriteria[index]);if(result){if(index>=ordersLength){return result;}var order=orders[index];return result*(order==='asc'||order===true?1:-1);}}// Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
// that causes it, under certain circumstances, to provide the same value for
// `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
// for more details.
//
// This also ensures a stable sort in V8 and other engines.
// See https://code.google.com/p/v8/issues/detail?id=90 for more details.
return object.index-other.index;}/**
   * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
   *
   * @private
   * @param {string} letter The matched letter to deburr.
   * @returns {string} Returns the deburred letter.
   */function deburrLetter(letter){return deburredLetters[letter];}/**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */function escapeHtmlChar(chr){return htmlEscapes[chr];}/**
   * Used by `_.escapeRegExp` to escape characters for inclusion in compiled regexes.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @param {string} leadingChar The capture group for a leading character.
   * @param {string} whitespaceChar The capture group for a whitespace character.
   * @returns {string} Returns the escaped character.
   */function escapeRegExpChar(chr,leadingChar,whitespaceChar){if(leadingChar){chr=regexpEscapes[chr];}else if(whitespaceChar){chr=stringEscapes[chr];}return'\\'+chr;}/**
   * Used by `_.template` to escape characters for inclusion in compiled string literals.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */function escapeStringChar(chr){return'\\'+stringEscapes[chr];}/**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */function indexOfNaN(array,fromIndex,fromRight){var length=array.length,index=fromIndex+(fromRight?0:-1);while(fromRight?index--:++index<length){var other=array[index];if(other!==other){return index;}}return-1;}/**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */function isObjectLike(value){return!!value&&(typeof value==="undefined"?"undefined":_typeof(value))=='object';}/**
   * Used by `trimmedLeftIndex` and `trimmedRightIndex` to determine if a
   * character code is whitespace.
   *
   * @private
   * @param {number} charCode The character code to inspect.
   * @returns {boolean} Returns `true` if `charCode` is whitespace, else `false`.
   */function isSpace(charCode){return charCode<=160&&charCode>=9&&charCode<=13||charCode==32||charCode==160||charCode==5760||charCode==6158||charCode>=8192&&(charCode<=8202||charCode==8232||charCode==8233||charCode==8239||charCode==8287||charCode==12288||charCode==65279);}/**
   * Replaces all `placeholder` elements in `array` with an internal placeholder
   * and returns an array of their indexes.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {*} placeholder The placeholder to replace.
   * @returns {Array} Returns the new array of placeholder indexes.
   */function replaceHolders(array,placeholder){var index=-1,length=array.length,resIndex=-1,result=[];while(++index<length){if(array[index]===placeholder){array[index]=PLACEHOLDER;result[++resIndex]=index;}}return result;}/**
   * An implementation of `_.uniq` optimized for sorted arrays without support
   * for callback shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate-value-free array.
   */function sortedUniq(array,iteratee){var seen,index=-1,length=array.length,resIndex=-1,result=[];while(++index<length){var value=array[index],computed=iteratee?iteratee(value,index,array):value;if(!index||seen!==computed){seen=computed;result[++resIndex]=value;}}return result;}/**
   * Used by `_.trim` and `_.trimLeft` to get the index of the first non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the first non-whitespace character.
   */function trimmedLeftIndex(string){var index=-1,length=string.length;while(++index<length&&isSpace(string.charCodeAt(index))){}return index;}/**
   * Used by `_.trim` and `_.trimRight` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */function trimmedRightIndex(string){var index=string.length;while(index--&&isSpace(string.charCodeAt(index))){}return index;}/**
   * Used by `_.unescape` to convert HTML entities to characters.
   *
   * @private
   * @param {string} chr The matched character to unescape.
   * @returns {string} Returns the unescaped character.
   */function unescapeHtmlChar(chr){return htmlUnescapes[chr];}/*--------------------------------------------------------------------------*//**
   * Create a new pristine `lodash` function using the given `context` object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns a new `lodash` function.
   * @example
   *
   * _.mixin({ 'foo': _.constant('foo') });
   *
   * var lodash = _.runInContext();
   * lodash.mixin({ 'bar': lodash.constant('bar') });
   *
   * _.isFunction(_.foo);
   * // => true
   * _.isFunction(_.bar);
   * // => false
   *
   * lodash.isFunction(lodash.foo);
   * // => false
   * lodash.isFunction(lodash.bar);
   * // => true
   *
   * // using `context` to mock `Date#getTime` use in `_.now`
   * var mock = _.runInContext({
   *   'Date': function() {
   *     return { 'getTime': getTimeMock };
   *   }
   * });
   *
   * // or creating a suped-up `defer` in Node.js
   * var defer = _.runInContext({ 'setTimeout': setImmediate }).defer;
   */function runInContext(context){// Avoid issues with some ES3 environments that attempt to use values, named
// after built-in constructors like `Object`, for the creation of literals.
// ES5 clears this up by stating that literals must use built-in constructors.
// See https://es5.github.io/#x11.1.5 for more details.
context=context?_.defaults(root.Object(),context,_.pick(root,contextProps)):root;/** Native constructor references. */var Array=context.Array,Date=context.Date,Error=context.Error,Function=context.Function,Math=context.Math,Number=context.Number,Object=context.Object,RegExp=context.RegExp,String=context.String,TypeError=context.TypeError;/** Used for native method references. */var arrayProto=Array.prototype,objectProto=Object.prototype,stringProto=String.prototype;/** Used to resolve the decompiled source of functions. */var fnToString=Function.prototype.toString;/** Used to check objects for own properties. */var hasOwnProperty=objectProto.hasOwnProperty;/** Used to generate unique IDs. */var idCounter=0;/**
     * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
     * of values.
     */var objToString=objectProto.toString;/** Used to restore the original `_` reference in `_.noConflict`. */var oldDash=root._;/** Used to detect if a method is native. */var reIsNative=RegExp('^'+fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g,'\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,'$1.*?')+'$');/** Native method references. */var ArrayBuffer=context.ArrayBuffer,clearTimeout=context.clearTimeout,parseFloat=context.parseFloat,pow=Math.pow,propertyIsEnumerable=objectProto.propertyIsEnumerable,Set=getNative(context,'Set'),setTimeout=context.setTimeout,splice=arrayProto.splice,Uint8Array=context.Uint8Array,WeakMap=getNative(context,'WeakMap');/* Native method references for those with the same name as other `lodash` methods. */var nativeCeil=Math.ceil,nativeCreate=getNative(Object,'create'),nativeFloor=Math.floor,nativeIsArray=getNative(Array,'isArray'),nativeIsFinite=context.isFinite,nativeKeys=getNative(Object,'keys'),nativeMax=Math.max,nativeMin=Math.min,nativeNow=getNative(Date,'now'),nativeParseInt=context.parseInt,nativeRandom=Math.random;/** Used as references for `-Infinity` and `Infinity`. */var NEGATIVE_INFINITY=Number.NEGATIVE_INFINITY,POSITIVE_INFINITY=Number.POSITIVE_INFINITY;/** Used as references for the maximum length and index of an array. */var MAX_ARRAY_LENGTH=4294967295,MAX_ARRAY_INDEX=MAX_ARRAY_LENGTH-1,HALF_MAX_ARRAY_LENGTH=MAX_ARRAY_LENGTH>>>1;/**
     * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
     * of an array-like value.
     */var MAX_SAFE_INTEGER=9007199254740991;/** Used to store function metadata. */var metaMap=WeakMap&&new WeakMap();/** Used to lookup unminified function names. */var realNames={};/*------------------------------------------------------------------------*//**
     * Creates a `lodash` object which wraps `value` to enable implicit chaining.
     * Methods that operate on and return arrays, collections, and functions can
     * be chained together. Methods that retrieve a single value or may return a
     * primitive value will automatically end the chain returning the unwrapped
     * value. Explicit chaining may be enabled using `_.chain`. The execution of
     * chained methods is lazy, that is, execution is deferred until `_#value`
     * is implicitly or explicitly called.
     *
     * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
     * fusion is an optimization strategy which merge iteratee calls; this can help
     * to avoid the creation of intermediate data structures and greatly reduce the
     * number of iteratee executions.
     *
     * Chaining is supported in custom builds as long as the `_#value` method is
     * directly or indirectly included in the build.
     *
     * In addition to lodash methods, wrappers have `Array` and `String` methods.
     *
     * The wrapper `Array` methods are:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
     * `splice`, and `unshift`
     *
     * The wrapper `String` methods are:
     * `replace` and `split`
     *
     * The wrapper methods that support shortcut fusion are:
     * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
     * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
     * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
     * and `where`
     *
     * The chainable wrapper methods are:
     * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
     * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
     * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defaultsDeep`,
     * `defer`, `delay`, `difference`, `drop`, `dropRight`, `dropRightWhile`,
     * `dropWhile`, `fill`, `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `keysIn`, `map`, `mapKeys`, `mapValues`, `matches`,
     * `matchesProperty`, `memoize`, `merge`, `method`, `methodOf`, `mixin`,
     * `modArgs`, `negate`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
     * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
     * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `restParam`,
     * `reverse`, `set`, `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`,
     * `sortByOrder`, `splice`, `spread`, `take`, `takeRight`, `takeRightWhile`,
     * `takeWhile`, `tap`, `throttle`, `thru`, `times`, `toArray`, `toPlainObject`,
     * `transform`, `union`, `uniq`, `unshift`, `unzip`, `unzipWith`, `values`,
     * `valuesIn`, `where`, `without`, `wrap`, `xor`, `zip`, `zipObject`, `zipWith`
     *
     * The wrapper methods that are **not** chainable by default are:
     * `add`, `attempt`, `camelCase`, `capitalize`, `ceil`, `clone`, `cloneDeep`,
     * `deburr`, `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`,
     * `floor`, `get`, `gt`, `gte`, `has`, `identity`, `includes`, `indexOf`,
     * `inRange`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isError`, `isFinite` `isFunction`, `isMatch`,
     * `isNative`, `isNaN`, `isNull`, `isNumber`, `isObject`, `isPlainObject`,
     * `isRegExp`, `isString`, `isUndefined`, `isTypedArray`, `join`, `kebabCase`,
     * `last`, `lastIndexOf`, `lt`, `lte`, `max`, `min`, `noConflict`, `noop`,
     * `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `repeat`, `result`, `round`, `runInContext`, `shift`, `size`,
     * `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`, `startCase`,
     * `startsWith`, `sum`, `template`, `trim`, `trimLeft`, `trimRight`, `trunc`,
     * `unescape`, `uniqueId`, `value`, and `words`
     *
     * The wrapper method `sample` will return a wrapped value when `n` is provided,
     * otherwise an unwrapped value is returned.
     *
     * @name _
     * @constructor
     * @category Chain
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(total, n) {
     *   return total + n;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(n) {
     *   return n * n;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */function lodash(value){if(isObjectLike(value)&&!isArray(value)&&!(value instanceof LazyWrapper)){if(value instanceof LodashWrapper){return value;}if(hasOwnProperty.call(value,'__chain__')&&hasOwnProperty.call(value,'__wrapped__')){return wrapperClone(value);}}return new LodashWrapper(value);}/**
     * The function whose prototype all chaining wrappers inherit from.
     *
     * @private
     */function baseLodash(){}// No operation performed.
/**
     * The base constructor for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap.
     * @param {boolean} [chainAll] Enable chaining for all wrapper methods.
     * @param {Array} [actions=[]] Actions to peform to resolve the unwrapped value.
     */function LodashWrapper(value,chainAll,actions){this.__wrapped__=value;this.__actions__=actions||[];this.__chain__=!!chainAll;}/**
     * An object environment feature flags.
     *
     * @static
     * @memberOf _
     * @type Object
     */var support=lodash.support={};/**
     * By default, the template delimiters used by lodash are like those in
     * embedded Ruby (ERB). Change the following template settings to use
     * alternative delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */lodash.templateSettings={/**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */'escape':reEscape,/**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */'evaluate':reEvaluate,/**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */'interpolate':reInterpolate,/**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */'variable':'',/**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */'imports':{/**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */'_':lodash}};/*------------------------------------------------------------------------*//**
     * Creates a lazy wrapper object which wraps `value` to enable lazy evaluation.
     *
     * @private
     * @param {*} value The value to wrap.
     */function LazyWrapper(value){this.__wrapped__=value;this.__actions__=[];this.__dir__=1;this.__filtered__=false;this.__iteratees__=[];this.__takeCount__=POSITIVE_INFINITY;this.__views__=[];}/**
     * Creates a clone of the lazy wrapper object.
     *
     * @private
     * @name clone
     * @memberOf LazyWrapper
     * @returns {Object} Returns the cloned `LazyWrapper` object.
     */function lazyClone(){var result=new LazyWrapper(this.__wrapped__);result.__actions__=arrayCopy(this.__actions__);result.__dir__=this.__dir__;result.__filtered__=this.__filtered__;result.__iteratees__=arrayCopy(this.__iteratees__);result.__takeCount__=this.__takeCount__;result.__views__=arrayCopy(this.__views__);return result;}/**
     * Reverses the direction of lazy iteration.
     *
     * @private
     * @name reverse
     * @memberOf LazyWrapper
     * @returns {Object} Returns the new reversed `LazyWrapper` object.
     */function lazyReverse(){if(this.__filtered__){var result=new LazyWrapper(this);result.__dir__=-1;result.__filtered__=true;}else{result=this.clone();result.__dir__*=-1;}return result;}/**
     * Extracts the unwrapped value from its lazy wrapper.
     *
     * @private
     * @name value
     * @memberOf LazyWrapper
     * @returns {*} Returns the unwrapped value.
     */function lazyValue(){var array=this.__wrapped__.value(),dir=this.__dir__,isArr=isArray(array),isRight=dir<0,arrLength=isArr?array.length:0,view=getView(0,arrLength,this.__views__),start=view.start,end=view.end,length=end-start,index=isRight?end:start-1,iteratees=this.__iteratees__,iterLength=iteratees.length,resIndex=0,takeCount=nativeMin(length,this.__takeCount__);if(!isArr||arrLength<LARGE_ARRAY_SIZE||arrLength==length&&takeCount==length){return baseWrapperValue(isRight&&isArr?array.reverse():array,this.__actions__);}var result=[];outer:while(length--&&resIndex<takeCount){index+=dir;var iterIndex=-1,value=array[index];while(++iterIndex<iterLength){var data=iteratees[iterIndex],iteratee=data.iteratee,type=data.type,computed=iteratee(value);if(type==LAZY_MAP_FLAG){value=computed;}else if(!computed){if(type==LAZY_FILTER_FLAG){continue outer;}else{break outer;}}}result[resIndex++]=value;}return result;}/*------------------------------------------------------------------------*//**
     * Creates a cache object to store key/value pairs.
     *
     * @private
     * @static
     * @name Cache
     * @memberOf _.memoize
     */function MapCache(){this.__data__={};}/**
     * Removes `key` and its value from the cache.
     *
     * @private
     * @name delete
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed successfully, else `false`.
     */function mapDelete(key){return this.has(key)&&delete this.__data__[key];}/**
     * Gets the cached value for `key`.
     *
     * @private
     * @name get
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the cached value.
     */function mapGet(key){return key=='__proto__'?undefined:this.__data__[key];}/**
     * Checks if a cached value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */function mapHas(key){return key!='__proto__'&&hasOwnProperty.call(this.__data__,key);}/**
     * Sets `value` to `key` of the cache.
     *
     * @private
     * @name set
     * @memberOf _.memoize.Cache
     * @param {string} key The key of the value to cache.
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache object.
     */function mapSet(key,value){if(key!='__proto__'){this.__data__[key]=value;}return this;}/*------------------------------------------------------------------------*//**
     *
     * Creates a cache object to store unique values.
     *
     * @private
     * @param {Array} [values] The values to cache.
     */function SetCache(values){var length=values?values.length:0;this.data={'hash':nativeCreate(null),'set':new Set()};while(length--){this.push(values[length]);}}/**
     * Checks if `value` is in `cache` mimicking the return signature of
     * `_.indexOf` by returning `0` if the value is found, else `-1`.
     *
     * @private
     * @param {Object} cache The cache to search.
     * @param {*} value The value to search for.
     * @returns {number} Returns `0` if `value` is found, else `-1`.
     */function cacheIndexOf(cache,value){var data=cache.data,result=typeof value=='string'||isObject(value)?data.set.has(value):data.hash[value];return result?0:-1;}/**
     * Adds `value` to the cache.
     *
     * @private
     * @name push
     * @memberOf SetCache
     * @param {*} value The value to cache.
     */function cachePush(value){var data=this.data;if(typeof value=='string'||isObject(value)){data.set.add(value);}else{data.hash[value]=true;}}/*------------------------------------------------------------------------*//**
     * Creates a new array joining `array` with `other`.
     *
     * @private
     * @param {Array} array The array to join.
     * @param {Array} other The other array to join.
     * @returns {Array} Returns the new concatenated array.
     */function arrayConcat(array,other){var index=-1,length=array.length,othIndex=-1,othLength=other.length,result=Array(length+othLength);while(++index<length){result[index]=array[index];}while(++othIndex<othLength){result[index++]=other[othIndex];}return result;}/**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */function arrayCopy(source,array){var index=-1,length=source.length;array||(array=Array(length));while(++index<length){array[index]=source[index];}return array;}/**
     * A specialized version of `_.forEach` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */function arrayEach(array,iteratee){var index=-1,length=array.length;while(++index<length){if(iteratee(array[index],index,array)===false){break;}}return array;}/**
     * A specialized version of `_.forEachRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */function arrayEachRight(array,iteratee){var length=array.length;while(length--){if(iteratee(array[length],length,array)===false){break;}}return array;}/**
     * A specialized version of `_.every` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     */function arrayEvery(array,predicate){var index=-1,length=array.length;while(++index<length){if(!predicate(array[index],index,array)){return false;}}return true;}/**
     * A specialized version of `baseExtremum` for arrays which invokes `iteratee`
     * with one argument: (value).
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */function arrayExtremum(array,iteratee,comparator,exValue){var index=-1,length=array.length,computed=exValue,result=computed;while(++index<length){var value=array[index],current=+iteratee(value);if(comparator(current,computed)){computed=current;result=value;}}return result;}/**
     * A specialized version of `_.filter` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */function arrayFilter(array,predicate){var index=-1,length=array.length,resIndex=-1,result=[];while(++index<length){var value=array[index];if(predicate(value,index,array)){result[++resIndex]=value;}}return result;}/**
     * A specialized version of `_.map` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */function arrayMap(array,iteratee){var index=-1,length=array.length,result=Array(length);while(++index<length){result[index]=iteratee(array[index],index,array);}return result;}/**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */function arrayPush(array,values){var index=-1,length=values.length,offset=array.length;while(++index<length){array[offset+index]=values[index];}return array;}/**
     * A specialized version of `_.reduce` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the first element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */function arrayReduce(array,iteratee,accumulator,initFromArray){var index=-1,length=array.length;if(initFromArray&&length){accumulator=array[++index];}while(++index<length){accumulator=iteratee(accumulator,array[index],index,array);}return accumulator;}/**
     * A specialized version of `_.reduceRight` for arrays without support for
     * callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initFromArray] Specify using the last element of `array`
     *  as the initial value.
     * @returns {*} Returns the accumulated value.
     */function arrayReduceRight(array,iteratee,accumulator,initFromArray){var length=array.length;if(initFromArray&&length){accumulator=array[--length];}while(length--){accumulator=iteratee(accumulator,array[length],length,array);}return accumulator;}/**
     * A specialized version of `_.some` for arrays without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */function arraySome(array,predicate){var index=-1,length=array.length;while(++index<length){if(predicate(array[index],index,array)){return true;}}return false;}/**
     * A specialized version of `_.sum` for arrays without support for callback
     * shorthands and `this` binding..
     *
     * @private
     * @param {Array} array The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */function arraySum(array,iteratee){var length=array.length,result=0;while(length--){result+=+iteratee(array[length])||0;}return result;}/**
     * Used by `_.defaults` to customize its `_.assign` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */function assignDefaults(objectValue,sourceValue){return objectValue===undefined?sourceValue:objectValue;}/**
     * Used by `_.template` to customize its `_.assign` use.
     *
     * **Note:** This function is like `assignDefaults` except that it ignores
     * inherited property values when checking if a property is `undefined`.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @param {string} key The key associated with the object and source values.
     * @param {Object} object The destination object.
     * @returns {*} Returns the value to assign to the destination object.
     */function assignOwnDefaults(objectValue,sourceValue,key,object){return objectValue===undefined||!hasOwnProperty.call(object,key)?sourceValue:objectValue;}/**
     * A specialized version of `_.assign` for customizing assigned values without
     * support for argument juggling, multiple sources, and `this` binding `customizer`
     * functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Object} Returns `object`.
     */function assignWith(object,source,customizer){var index=-1,props=keys(source),length=props.length;while(++index<length){var key=props[index],value=object[key],result=customizer(value,source[key],key,object,source);if((result===result?result!==value:value===value)||value===undefined&&!(key in object)){object[key]=result;}}return object;}/**
     * The base implementation of `_.assign` without support for argument juggling,
     * multiple sources, and `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */function baseAssign(object,source){return source==null?object:baseCopy(source,keys(source),object);}/**
     * The base implementation of `_.at` without support for string collections
     * and individual key arguments.
     *
     * @private
     * @param {Array|Object} collection The collection to iterate over.
     * @param {number[]|string[]} props The property names or indexes of elements to pick.
     * @returns {Array} Returns the new array of picked elements.
     */function baseAt(collection,props){var index=-1,isNil=collection==null,isArr=!isNil&&isArrayLike(collection),length=isArr?collection.length:0,propsLength=props.length,result=Array(propsLength);while(++index<propsLength){var key=props[index];if(isArr){result[index]=isIndex(key,length)?collection[key]:undefined;}else{result[index]=isNil?undefined:collection[key];}}return result;}/**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property names to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @returns {Object} Returns `object`.
     */function baseCopy(source,props,object){object||(object={});var index=-1,length=props.length;while(++index<length){var key=props[index];object[key]=source[key];}return object;}/**
     * The base implementation of `_.callback` which supports specifying the
     * number of arguments to provide to `func`.
     *
     * @private
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */function baseCallback(func,thisArg,argCount){var type=typeof func==="undefined"?"undefined":_typeof(func);if(type=='function'){return thisArg===undefined?func:bindCallback(func,thisArg,argCount);}if(func==null){return identity;}if(type=='object'){return baseMatches(func);}return thisArg===undefined?property(func):baseMatchesProperty(func,thisArg);}/**
     * The base implementation of `_.clone` without support for argument juggling
     * and `this` binding `customizer` functions.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The object `value` belongs to.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */function baseClone(value,isDeep,customizer,key,object,stackA,stackB){var result;if(customizer){result=object?customizer(value,key,object):customizer(value);}if(result!==undefined){return result;}if(!isObject(value)){return value;}var isArr=isArray(value);if(isArr){result=initCloneArray(value);if(!isDeep){return arrayCopy(value,result);}}else{var tag=objToString.call(value),isFunc=tag==funcTag;if(tag==objectTag||tag==argsTag||isFunc&&!object){result=initCloneObject(isFunc?{}:value);if(!isDeep){return baseAssign(result,value);}}else{return cloneableTags[tag]?initCloneByTag(value,tag,isDeep):object?value:{};}}// Check for circular references and return its corresponding clone.
stackA||(stackA=[]);stackB||(stackB=[]);var length=stackA.length;while(length--){if(stackA[length]==value){return stackB[length];}}// Add the source value to the stack of traversed objects and associate it with its clone.
stackA.push(value);stackB.push(result);// Recursively populate clone (susceptible to call stack limits).
(isArr?arrayEach:baseForOwn)(value,function(subValue,key){result[key]=baseClone(subValue,isDeep,customizer,key,value,stackA,stackB);});return result;}/**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */var baseCreate=function(){function object(){}return function(prototype){if(isObject(prototype)){object.prototype=prototype;var result=new object();object.prototype=undefined;}return result||{};};}();/**
     * The base implementation of `_.delay` and `_.defer` which accepts an index
     * of where to slice the arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {Object} args The arguments provide to `func`.
     * @returns {number} Returns the timer id.
     */function baseDelay(func,wait,args){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return setTimeout(function(){func.apply(undefined,args);},wait);}/**
     * The base implementation of `_.difference` which accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     */function baseDifference(array,values){var length=array?array.length:0,result=[];if(!length){return result;}var index=-1,indexOf=getIndexOf(),isCommon=indexOf==baseIndexOf,cache=isCommon&&values.length>=LARGE_ARRAY_SIZE?createCache(values):null,valuesLength=values.length;if(cache){indexOf=cacheIndexOf;isCommon=false;values=cache;}outer:while(++index<length){var value=array[index];if(isCommon&&value===value){var valuesIndex=valuesLength;while(valuesIndex--){if(values[valuesIndex]===value){continue outer;}}result.push(value);}else if(indexOf(values,value,0)<0){result.push(value);}}return result;}/**
     * The base implementation of `_.forEach` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */var baseEach=createBaseEach(baseForOwn);/**
     * The base implementation of `_.forEachRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array|Object|string} Returns `collection`.
     */var baseEachRight=createBaseEach(baseForOwnRight,true);/**
     * The base implementation of `_.every` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`
     */function baseEvery(collection,predicate){var result=true;baseEach(collection,function(value,index,collection){result=!!predicate(value,index,collection);return result;});return result;}/**
     * Gets the extremum value of `collection` invoking `iteratee` for each value
     * in `collection` to generate the criterion by which the value is ranked.
     * The `iteratee` is invoked with three arguments: (value, index|key, collection).
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {*} Returns the extremum value.
     */function baseExtremum(collection,iteratee,comparator,exValue){var computed=exValue,result=computed;baseEach(collection,function(value,index,collection){var current=+iteratee(value,index,collection);if(comparator(current,computed)||current===exValue&&current===result){computed=current;result=value;}});return result;}/**
     * The base implementation of `_.fill` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     */function baseFill(array,value,start,end){var length=array.length;start=start==null?0:+start||0;if(start<0){start=-start>length?0:length+start;}end=end===undefined||end>length?length:+end||0;if(end<0){end+=length;}length=start>end?0:end>>>0;start>>>=0;while(start<length){array[start++]=value;}return array;}/**
     * The base implementation of `_.filter` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */function baseFilter(collection,predicate){var result=[];baseEach(collection,function(value,index,collection){if(predicate(value,index,collection)){result.push(value);}});return result;}/**
     * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
     * without support for callback shorthands and `this` binding, which iterates
     * over `collection` using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function} predicate The function invoked per iteration.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @param {boolean} [retKey] Specify returning the key of the found element
     *  instead of the element itself.
     * @returns {*} Returns the found element or its key, else `undefined`.
     */function baseFind(collection,predicate,eachFunc,retKey){var result;eachFunc(collection,function(value,key,collection){if(predicate(value,key,collection)){result=retKey?key:value;return false;}});return result;}/**
     * The base implementation of `_.flatten` with added support for restricting
     * flattening and specifying the start index.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */function baseFlatten(array,isDeep,isStrict,result){result||(result=[]);var index=-1,length=array.length;while(++index<length){var value=array[index];if(isObjectLike(value)&&isArrayLike(value)&&(isStrict||isArray(value)||isArguments(value))){if(isDeep){// Recursively flatten arrays (susceptible to call stack limits).
baseFlatten(value,isDeep,isStrict,result);}else{arrayPush(result,value);}}else if(!isStrict){result[result.length]=value;}}return result;}/**
     * The base implementation of `baseForIn` and `baseForOwn` which iterates
     * over `object` properties returned by `keysFunc` invoking `iteratee` for
     * each property. Iteratee functions may exit iteration early by explicitly
     * returning `false`.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */var baseFor=createBaseFor();/**
     * This function is like `baseFor` except that it iterates over properties
     * in the opposite order.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @returns {Object} Returns `object`.
     */var baseForRight=createBaseFor(true);/**
     * The base implementation of `_.forIn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */function baseForIn(object,iteratee){return baseFor(object,iteratee,keysIn);}/**
     * The base implementation of `_.forOwn` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */function baseForOwn(object,iteratee){return baseFor(object,iteratee,keys);}/**
     * The base implementation of `_.forOwnRight` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Object} Returns `object`.
     */function baseForOwnRight(object,iteratee){return baseForRight(object,iteratee,keys);}/**
     * The base implementation of `_.functions` which creates an array of
     * `object` function property names filtered from those provided.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} props The property names to filter.
     * @returns {Array} Returns the new array of filtered property names.
     */function baseFunctions(object,props){var index=-1,length=props.length,resIndex=-1,result=[];while(++index<length){var key=props[index];if(isFunction(object[key])){result[++resIndex]=key;}}return result;}/**
     * The base implementation of `get` without support for string paths
     * and default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} path The path of the property to get.
     * @param {string} [pathKey] The key representation of path.
     * @returns {*} Returns the resolved value.
     */function baseGet(object,path,pathKey){if(object==null){return;}if(pathKey!==undefined&&pathKey in toObject(object)){path=[pathKey];}var index=0,length=path.length;while(object!=null&&index<length){object=object[path[index++]];}return index&&index==length?object:undefined;}/**
     * The base implementation of `_.isEqual` without support for `this` binding
     * `customizer` functions.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */function baseIsEqual(value,other,customizer,isLoose,stackA,stackB){if(value===other){return true;}if(value==null||other==null||!isObject(value)&&!isObjectLike(other)){return value!==value&&other!==other;}return baseIsEqualDeep(value,other,baseIsEqual,customizer,isLoose,stackA,stackB);}/**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `value` objects.
     * @param {Array} [stackB=[]] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function baseIsEqualDeep(object,other,equalFunc,customizer,isLoose,stackA,stackB){var objIsArr=isArray(object),othIsArr=isArray(other),objTag=arrayTag,othTag=arrayTag;if(!objIsArr){objTag=objToString.call(object);if(objTag==argsTag){objTag=objectTag;}else if(objTag!=objectTag){objIsArr=isTypedArray(object);}}if(!othIsArr){othTag=objToString.call(other);if(othTag==argsTag){othTag=objectTag;}else if(othTag!=objectTag){othIsArr=isTypedArray(other);}}var objIsObj=objTag==objectTag,othIsObj=othTag==objectTag,isSameTag=objTag==othTag;if(isSameTag&&!(objIsArr||objIsObj)){return equalByTag(object,other,objTag);}if(!isLoose){var objIsWrapped=objIsObj&&hasOwnProperty.call(object,'__wrapped__'),othIsWrapped=othIsObj&&hasOwnProperty.call(other,'__wrapped__');if(objIsWrapped||othIsWrapped){return equalFunc(objIsWrapped?object.value():object,othIsWrapped?other.value():other,customizer,isLoose,stackA,stackB);}}if(!isSameTag){return false;}// Assume cyclic values are equal.
// For more information on detecting circular references see https://es5.github.io/#JO.
stackA||(stackA=[]);stackB||(stackB=[]);var length=stackA.length;while(length--){if(stackA[length]==object){return stackB[length]==other;}}// Add `object` and `other` to the stack of traversed objects.
stackA.push(object);stackB.push(other);var result=(objIsArr?equalArrays:equalObjects)(object,other,equalFunc,customizer,isLoose,stackA,stackB);stackA.pop();stackB.pop();return result;}/**
     * The base implementation of `_.isMatch` without support for callback
     * shorthands and `this` binding.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Array} matchData The propery names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparing objects.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */function baseIsMatch(object,matchData,customizer){var index=matchData.length,length=index,noCustomizer=!customizer;if(object==null){return!length;}object=toObject(object);while(index--){var data=matchData[index];if(noCustomizer&&data[2]?data[1]!==object[data[0]]:!(data[0]in object)){return false;}}while(++index<length){data=matchData[index];var key=data[0],objValue=object[key],srcValue=data[1];if(noCustomizer&&data[2]){if(objValue===undefined&&!(key in object)){return false;}}else{var result=customizer?customizer(objValue,srcValue,key):undefined;if(!(result===undefined?baseIsEqual(srcValue,objValue,customizer,true):result)){return false;}}}return true;}/**
     * The base implementation of `_.map` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */function baseMap(collection,iteratee){var index=-1,result=isArrayLike(collection)?Array(collection.length):[];baseEach(collection,function(value,key,collection){result[++index]=iteratee(value,key,collection);});return result;}/**
     * The base implementation of `_.matches` which does not clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     */function baseMatches(source){var matchData=getMatchData(source);if(matchData.length==1&&matchData[0][2]){var key=matchData[0][0],value=matchData[0][1];return function(object){if(object==null){return false;}return object[key]===value&&(value!==undefined||key in toObject(object));};}return function(object){return baseIsMatch(object,matchData);};}/**
     * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to compare.
     * @returns {Function} Returns the new function.
     */function baseMatchesProperty(path,srcValue){var isArr=isArray(path),isCommon=isKey(path)&&isStrictComparable(srcValue),pathKey=path+'';path=toPath(path);return function(object){if(object==null){return false;}var key=pathKey;object=toObject(object);if((isArr||!isCommon)&&!(key in object)){object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));if(object==null){return false;}key=last(path);object=toObject(object);}return object[key]===srcValue?srcValue!==undefined||key in object:baseIsEqual(srcValue,object[key],undefined,true);};}/**
     * The base implementation of `_.merge` without support for argument juggling,
     * multiple sources, and `this` binding `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {Object} Returns `object`.
     */function baseMerge(object,source,customizer,stackA,stackB){if(!isObject(object)){return object;}var isSrcArr=isArrayLike(source)&&(isArray(source)||isTypedArray(source)),props=isSrcArr?undefined:keys(source);arrayEach(props||source,function(srcValue,key){if(props){key=srcValue;srcValue=source[key];}if(isObjectLike(srcValue)){stackA||(stackA=[]);stackB||(stackB=[]);baseMergeDeep(object,source,key,baseMerge,customizer,stackA,stackB);}else{var value=object[key],result=customizer?customizer(value,srcValue,key,object,source):undefined,isCommon=result===undefined;if(isCommon){result=srcValue;}if((result!==undefined||isSrcArr&&!(key in object))&&(isCommon||(result===result?result!==value:value===value))){object[key]=result;}}});return object;}/**
     * A specialized version of `baseMerge` for arrays and objects which performs
     * deep merges and tracks traversed objects enabling objects with circular
     * references to be merged.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {string} key The key of the value to merge.
     * @param {Function} mergeFunc The function to merge values.
     * @param {Function} [customizer] The function to customize merged values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function baseMergeDeep(object,source,key,mergeFunc,customizer,stackA,stackB){var length=stackA.length,srcValue=source[key];while(length--){if(stackA[length]==srcValue){object[key]=stackB[length];return;}}var value=object[key],result=customizer?customizer(value,srcValue,key,object,source):undefined,isCommon=result===undefined;if(isCommon){result=srcValue;if(isArrayLike(srcValue)&&(isArray(srcValue)||isTypedArray(srcValue))){result=isArray(value)?value:isArrayLike(value)?arrayCopy(value):[];}else if(isPlainObject(srcValue)||isArguments(srcValue)){result=isArguments(value)?toPlainObject(value):isPlainObject(value)?value:{};}else{isCommon=false;}}// Add the source value to the stack of traversed objects and associate
// it with its merged value.
stackA.push(srcValue);stackB.push(result);if(isCommon){// Recursively merge objects and arrays (susceptible to call stack limits).
object[key]=mergeFunc(result,srcValue,customizer,stackA,stackB);}else if(result===result?result!==value:value===value){object[key]=result;}}/**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new function.
     */function baseProperty(key){return function(object){return object==null?undefined:object[key];};}/**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     */function basePropertyDeep(path){var pathKey=path+'';path=toPath(path);return function(object){return baseGet(object,path,pathKey);};}/**
     * The base implementation of `_.pullAt` without support for individual
     * index arguments and capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */function basePullAt(array,indexes){var length=array?indexes.length:0;while(length--){var index=indexes[length];if(index!=previous&&isIndex(index)){var previous=index;splice.call(array,index,1);}}return array;}/**
     * The base implementation of `_.random` without support for argument juggling
     * and returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns the random number.
     */function baseRandom(min,max){return min+nativeFloor(nativeRandom()*(max-min+1));}/**
     * The base implementation of `_.reduce` and `_.reduceRight` without support
     * for callback shorthands and `this` binding, which iterates over `collection`
     * using the provided `eachFunc`.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} accumulator The initial value.
     * @param {boolean} initFromCollection Specify using the first or last element
     *  of `collection` as the initial value.
     * @param {Function} eachFunc The function to iterate over `collection`.
     * @returns {*} Returns the accumulated value.
     */function baseReduce(collection,iteratee,accumulator,initFromCollection,eachFunc){eachFunc(collection,function(value,index,collection){accumulator=initFromCollection?(initFromCollection=false,value):iteratee(accumulator,value,index,collection);});return accumulator;}/**
     * The base implementation of `setData` without support for hot loop detection.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */var baseSetData=!metaMap?identity:function(func,data){metaMap.set(func,data);return func;};/**
     * The base implementation of `_.slice` without an iteratee call guard.
     *
     * @private
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */function baseSlice(array,start,end){var index=-1,length=array.length;start=start==null?0:+start||0;if(start<0){start=-start>length?0:length+start;}end=end===undefined||end>length?length:+end||0;if(end<0){end+=length;}length=start>end?0:end-start>>>0;start>>>=0;var result=Array(length);while(++index<length){result[index]=array[index+start];}return result;}/**
     * The base implementation of `_.some` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */function baseSome(collection,predicate){var result;baseEach(collection,function(value,index,collection){result=predicate(value,index,collection);return!result;});return!!result;}/**
     * The base implementation of `_.sortBy` which uses `comparer` to define
     * the sort order of `array` and replaces criteria objects with their
     * corresponding values.
     *
     * @private
     * @param {Array} array The array to sort.
     * @param {Function} comparer The function to define sort order.
     * @returns {Array} Returns `array`.
     */function baseSortBy(array,comparer){var length=array.length;array.sort(comparer);while(length--){array[length]=array[length].value;}return array;}/**
     * The base implementation of `_.sortByOrder` without param guards.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} orders The sort orders of `iteratees`.
     * @returns {Array} Returns the new sorted array.
     */function baseSortByOrder(collection,iteratees,orders){var callback=getCallback(),index=-1;iteratees=arrayMap(iteratees,function(iteratee){return callback(iteratee);});var result=baseMap(collection,function(value){var criteria=arrayMap(iteratees,function(iteratee){return iteratee(value);});return{'criteria':criteria,'index':++index,'value':value};});return baseSortBy(result,function(object,other){return compareMultiple(object,other,orders);});}/**
     * The base implementation of `_.sum` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {number} Returns the sum.
     */function baseSum(collection,iteratee){var result=0;baseEach(collection,function(value,index,collection){result+=+iteratee(value,index,collection)||0;});return result;}/**
     * The base implementation of `_.uniq` without support for callback shorthands
     * and `this` binding.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} [iteratee] The function invoked per iteration.
     * @returns {Array} Returns the new duplicate-value-free array.
     */function baseUniq(array,iteratee){var index=-1,indexOf=getIndexOf(),length=array.length,isCommon=indexOf==baseIndexOf,isLarge=isCommon&&length>=LARGE_ARRAY_SIZE,seen=isLarge?createCache():null,result=[];if(seen){indexOf=cacheIndexOf;isCommon=false;}else{isLarge=false;seen=iteratee?[]:result;}outer:while(++index<length){var value=array[index],computed=iteratee?iteratee(value,index,array):value;if(isCommon&&value===value){var seenIndex=seen.length;while(seenIndex--){if(seen[seenIndex]===computed){continue outer;}}if(iteratee){seen.push(computed);}result.push(value);}else if(indexOf(seen,computed,0)<0){if(iteratee||isLarge){seen.push(computed);}result.push(value);}}return result;}/**
     * The base implementation of `_.values` and `_.valuesIn` which creates an
     * array of `object` property values corresponding to the property names
     * of `props`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array} props The property names to get values for.
     * @returns {Object} Returns the array of property values.
     */function baseValues(object,props){var index=-1,length=props.length,result=Array(length);while(++index<length){result[index]=object[props[index]];}return result;}/**
     * The base implementation of `_.dropRightWhile`, `_.dropWhile`, `_.takeRightWhile`,
     * and `_.takeWhile` without support for callback shorthands and `this` binding.
     *
     * @private
     * @param {Array} array The array to query.
     * @param {Function} predicate The function invoked per iteration.
     * @param {boolean} [isDrop] Specify dropping elements instead of taking them.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Array} Returns the slice of `array`.
     */function baseWhile(array,predicate,isDrop,fromRight){var length=array.length,index=fromRight?length:-1;while((fromRight?index--:++index<length)&&predicate(array[index],index,array)){}return isDrop?baseSlice(array,fromRight?0:index,fromRight?index+1:length):baseSlice(array,fromRight?index+1:0,fromRight?length:index);}/**
     * The base implementation of `wrapperValue` which returns the result of
     * performing a sequence of actions on the unwrapped `value`, where each
     * successive action is supplied the return value of the previous.
     *
     * @private
     * @param {*} value The unwrapped value.
     * @param {Array} actions Actions to peform to resolve the unwrapped value.
     * @returns {*} Returns the resolved value.
     */function baseWrapperValue(value,actions){var result=value;if(result instanceof LazyWrapper){result=result.value();}var index=-1,length=actions.length;while(++index<length){var action=actions[index];result=action.func.apply(action.thisArg,arrayPush([result],action.args));}return result;}/**
     * Performs a binary search of `array` to determine the index at which `value`
     * should be inserted into `array` in order to maintain its sort order.
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */function binaryIndex(array,value,retHighest){var low=0,high=array?array.length:low;if(typeof value=='number'&&value===value&&high<=HALF_MAX_ARRAY_LENGTH){while(low<high){var mid=low+high>>>1,computed=array[mid];if((retHighest?computed<=value:computed<value)&&computed!==null){low=mid+1;}else{high=mid;}}return high;}return binaryIndexBy(array,value,identity,retHighest);}/**
     * This function is like `binaryIndex` except that it invokes `iteratee` for
     * `value` and each element of `array` to compute their sort ranking. The
     * iteratee is invoked with one argument; (value).
     *
     * @private
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     */function binaryIndexBy(array,value,iteratee,retHighest){value=iteratee(value);var low=0,high=array?array.length:0,valIsNaN=value!==value,valIsNull=value===null,valIsUndef=value===undefined;while(low<high){var mid=nativeFloor((low+high)/2),computed=iteratee(array[mid]),isDef=computed!==undefined,isReflexive=computed===computed;if(valIsNaN){var setLow=isReflexive||retHighest;}else if(valIsNull){setLow=isReflexive&&isDef&&(retHighest||computed!=null);}else if(valIsUndef){setLow=isReflexive&&(retHighest||isDef);}else if(computed==null){setLow=false;}else{setLow=retHighest?computed<=value:computed<value;}if(setLow){low=mid+1;}else{high=mid;}}return nativeMin(high,MAX_ARRAY_INDEX);}/**
     * A specialized version of `baseCallback` which only supports `this` binding
     * and specifying the number of arguments to provide to `func`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {number} [argCount] The number of arguments to provide to `func`.
     * @returns {Function} Returns the callback.
     */function bindCallback(func,thisArg,argCount){if(typeof func!='function'){return identity;}if(thisArg===undefined){return func;}switch(argCount){case 1:return function(value){return func.call(thisArg,value);};case 3:return function(value,index,collection){return func.call(thisArg,value,index,collection);};case 4:return function(accumulator,value,index,collection){return func.call(thisArg,accumulator,value,index,collection);};case 5:return function(value,other,key,object,source){return func.call(thisArg,value,other,key,object,source);};}return function(){return func.apply(thisArg,arguments);};}/**
     * Creates a clone of the given array buffer.
     *
     * @private
     * @param {ArrayBuffer} buffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */function bufferClone(buffer){var result=new ArrayBuffer(buffer.byteLength),view=new Uint8Array(result);view.set(new Uint8Array(buffer));return result;}/**
     * Creates an array that is the composition of partially applied arguments,
     * placeholders, and provided arguments into a single array of arguments.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to prepend to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */function composeArgs(args,partials,holders){var holdersLength=holders.length,argsIndex=-1,argsLength=nativeMax(args.length-holdersLength,0),leftIndex=-1,leftLength=partials.length,result=Array(leftLength+argsLength);while(++leftIndex<leftLength){result[leftIndex]=partials[leftIndex];}while(++argsIndex<holdersLength){result[holders[argsIndex]]=args[argsIndex];}while(argsLength--){result[leftIndex++]=args[argsIndex++];}return result;}/**
     * This function is like `composeArgs` except that the arguments composition
     * is tailored for `_.partialRight`.
     *
     * @private
     * @param {Array|Object} args The provided arguments.
     * @param {Array} partials The arguments to append to those provided.
     * @param {Array} holders The `partials` placeholder indexes.
     * @returns {Array} Returns the new array of composed arguments.
     */function composeArgsRight(args,partials,holders){var holdersIndex=-1,holdersLength=holders.length,argsIndex=-1,argsLength=nativeMax(args.length-holdersLength,0),rightIndex=-1,rightLength=partials.length,result=Array(argsLength+rightLength);while(++argsIndex<argsLength){result[argsIndex]=args[argsIndex];}var offset=argsIndex;while(++rightIndex<rightLength){result[offset+rightIndex]=partials[rightIndex];}while(++holdersIndex<holdersLength){result[offset+holders[holdersIndex]]=args[argsIndex++];}return result;}/**
     * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
     *
     * @private
     * @param {Function} setter The function to set keys and values of the accumulator object.
     * @param {Function} [initializer] The function to initialize the accumulator object.
     * @returns {Function} Returns the new aggregator function.
     */function createAggregator(setter,initializer){return function(collection,iteratee,thisArg){var result=initializer?initializer():{};iteratee=getCallback(iteratee,thisArg,3);if(isArray(collection)){var index=-1,length=collection.length;while(++index<length){var value=collection[index];setter(result,value,iteratee(value,index,collection),collection);}}else{baseEach(collection,function(value,key,collection){setter(result,value,iteratee(value,key,collection),collection);});}return result;};}/**
     * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @returns {Function} Returns the new assigner function.
     */function createAssigner(assigner){return restParam(function(object,sources){var index=-1,length=object==null?0:sources.length,customizer=length>2?sources[length-2]:undefined,guard=length>2?sources[2]:undefined,thisArg=length>1?sources[length-1]:undefined;if(typeof customizer=='function'){customizer=bindCallback(customizer,thisArg,5);length-=2;}else{customizer=typeof thisArg=='function'?thisArg:undefined;length-=customizer?1:0;}if(guard&&isIterateeCall(sources[0],sources[1],guard)){customizer=length<3?undefined:customizer;length=1;}while(++index<length){var source=sources[index];if(source){assigner(object,source,customizer);}}return object;});}/**
     * Creates a `baseEach` or `baseEachRight` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */function createBaseEach(eachFunc,fromRight){return function(collection,iteratee){var length=collection?getLength(collection):0;if(!isLength(length)){return eachFunc(collection,iteratee);}var index=fromRight?length:-1,iterable=toObject(collection);while(fromRight?index--:++index<length){if(iteratee(iterable[index],index,iterable)===false){break;}}return collection;};}/**
     * Creates a base function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new base function.
     */function createBaseFor(fromRight){return function(object,iteratee,keysFunc){var iterable=toObject(object),props=keysFunc(object),length=props.length,index=fromRight?length:-1;while(fromRight?index--:++index<length){var key=props[index];if(iteratee(iterable[key],key,iterable)===false){break;}}return object;};}/**
     * Creates a function that wraps `func` and invokes it with the `this`
     * binding of `thisArg`.
     *
     * @private
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @returns {Function} Returns the new bound function.
     */function createBindWrapper(func,thisArg){var Ctor=createCtorWrapper(func);function wrapper(){var fn=this&&this!==root&&this instanceof wrapper?Ctor:func;return fn.apply(thisArg,arguments);}return wrapper;}/**
     * Creates a `Set` cache object to optimize linear searches of large arrays.
     *
     * @private
     * @param {Array} [values] The values to cache.
     * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
     */function createCache(values){return nativeCreate&&Set?new SetCache(values):null;}/**
     * Creates a function that produces compound words out of the words in a
     * given string.
     *
     * @private
     * @param {Function} callback The function to combine each word.
     * @returns {Function} Returns the new compounder function.
     */function createCompounder(callback){return function(string){var index=-1,array=words(deburr(string)),length=array.length,result='';while(++index<length){result=callback(result,array[index],index);}return result;};}/**
     * Creates a function that produces an instance of `Ctor` regardless of
     * whether it was invoked as part of a `new` expression or by `call` or `apply`.
     *
     * @private
     * @param {Function} Ctor The constructor to wrap.
     * @returns {Function} Returns the new wrapped function.
     */function createCtorWrapper(Ctor){return function(){// Use a `switch` statement to work with class constructors.
// See http://ecma-international.org/ecma-262/6.0/#sec-ecmascript-function-objects-call-thisargument-argumentslist
// for more details.
var args=arguments;switch(args.length){case 0:return new Ctor();case 1:return new Ctor(args[0]);case 2:return new Ctor(args[0],args[1]);case 3:return new Ctor(args[0],args[1],args[2]);case 4:return new Ctor(args[0],args[1],args[2],args[3]);case 5:return new Ctor(args[0],args[1],args[2],args[3],args[4]);case 6:return new Ctor(args[0],args[1],args[2],args[3],args[4],args[5]);case 7:return new Ctor(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);}var thisBinding=baseCreate(Ctor.prototype),result=Ctor.apply(thisBinding,args);// Mimic the constructor's `return` behavior.
// See https://es5.github.io/#x13.2.2 for more details.
return isObject(result)?result:thisBinding;};}/**
     * Creates a `_.curry` or `_.curryRight` function.
     *
     * @private
     * @param {boolean} flag The curry bit flag.
     * @returns {Function} Returns the new curry function.
     */function createCurry(flag){function curryFunc(func,arity,guard){if(guard&&isIterateeCall(func,arity,guard)){arity=undefined;}var result=createWrapper(func,flag,undefined,undefined,undefined,undefined,undefined,arity);result.placeholder=curryFunc.placeholder;return result;}return curryFunc;}/**
     * Creates a `_.defaults` or `_.defaultsDeep` function.
     *
     * @private
     * @param {Function} assigner The function to assign values.
     * @param {Function} customizer The function to customize assigned values.
     * @returns {Function} Returns the new defaults function.
     */function createDefaults(assigner,customizer){return restParam(function(args){var object=args[0];if(object==null){return object;}args.push(customizer);return assigner.apply(undefined,args);});}/**
     * Creates a `_.max` or `_.min` function.
     *
     * @private
     * @param {Function} comparator The function used to compare values.
     * @param {*} exValue The initial extremum value.
     * @returns {Function} Returns the new extremum function.
     */function createExtremum(comparator,exValue){return function(collection,iteratee,thisArg){if(thisArg&&isIterateeCall(collection,iteratee,thisArg)){iteratee=undefined;}iteratee=getCallback(iteratee,thisArg,3);if(iteratee.length==1){collection=isArray(collection)?collection:toIterable(collection);var result=arrayExtremum(collection,iteratee,comparator,exValue);if(!(collection.length&&result===exValue)){return result;}}return baseExtremum(collection,iteratee,comparator,exValue);};}/**
     * Creates a `_.find` or `_.findLast` function.
     *
     * @private
     * @param {Function} eachFunc The function to iterate over a collection.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */function createFind(eachFunc,fromRight){return function(collection,predicate,thisArg){predicate=getCallback(predicate,thisArg,3);if(isArray(collection)){var index=baseFindIndex(collection,predicate,fromRight);return index>-1?collection[index]:undefined;}return baseFind(collection,predicate,eachFunc);};}/**
     * Creates a `_.findIndex` or `_.findLastIndex` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new find function.
     */function createFindIndex(fromRight){return function(array,predicate,thisArg){if(!(array&&array.length)){return-1;}predicate=getCallback(predicate,thisArg,3);return baseFindIndex(array,predicate,fromRight);};}/**
     * Creates a `_.findKey` or `_.findLastKey` function.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new find function.
     */function createFindKey(objectFunc){return function(object,predicate,thisArg){predicate=getCallback(predicate,thisArg,3);return baseFind(object,predicate,objectFunc,true);};}/**
     * Creates a `_.flow` or `_.flowRight` function.
     *
     * @private
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {Function} Returns the new flow function.
     */function createFlow(fromRight){return function(){var wrapper,length=arguments.length,index=fromRight?length:-1,leftIndex=0,funcs=Array(length);while(fromRight?index--:++index<length){var func=funcs[leftIndex++]=arguments[index];if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}if(!wrapper&&LodashWrapper.prototype.thru&&getFuncName(func)=='wrapper'){wrapper=new LodashWrapper([],true);}}index=wrapper?-1:length;while(++index<length){func=funcs[index];var funcName=getFuncName(func),data=funcName=='wrapper'?getData(func):undefined;if(data&&isLaziable(data[0])&&data[1]==(ARY_FLAG|CURRY_FLAG|PARTIAL_FLAG|REARG_FLAG)&&!data[4].length&&data[9]==1){wrapper=wrapper[getFuncName(data[0])].apply(wrapper,data[3]);}else{wrapper=func.length==1&&isLaziable(func)?wrapper[funcName]():wrapper.thru(func);}}return function(){var args=arguments,value=args[0];if(wrapper&&args.length==1&&isArray(value)&&value.length>=LARGE_ARRAY_SIZE){return wrapper.plant(value).value();}var index=0,result=length?funcs[index].apply(this,args):value;while(++index<length){result=funcs[index].call(this,result);}return result;};};}/**
     * Creates a function for `_.forEach` or `_.forEachRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */function createForEach(arrayFunc,eachFunc){return function(collection,iteratee,thisArg){return typeof iteratee=='function'&&thisArg===undefined&&isArray(collection)?arrayFunc(collection,iteratee):eachFunc(collection,bindCallback(iteratee,thisArg,3));};}/**
     * Creates a function for `_.forIn` or `_.forInRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */function createForIn(objectFunc){return function(object,iteratee,thisArg){if(typeof iteratee!='function'||thisArg!==undefined){iteratee=bindCallback(iteratee,thisArg,3);}return objectFunc(object,iteratee,keysIn);};}/**
     * Creates a function for `_.forOwn` or `_.forOwnRight`.
     *
     * @private
     * @param {Function} objectFunc The function to iterate over an object.
     * @returns {Function} Returns the new each function.
     */function createForOwn(objectFunc){return function(object,iteratee,thisArg){if(typeof iteratee!='function'||thisArg!==undefined){iteratee=bindCallback(iteratee,thisArg,3);}return objectFunc(object,iteratee);};}/**
     * Creates a function for `_.mapKeys` or `_.mapValues`.
     *
     * @private
     * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
     * @returns {Function} Returns the new map function.
     */function createObjectMapper(isMapKeys){return function(object,iteratee,thisArg){var result={};iteratee=getCallback(iteratee,thisArg,3);baseForOwn(object,function(value,key,object){var mapped=iteratee(value,key,object);key=isMapKeys?mapped:key;value=isMapKeys?value:mapped;result[key]=value;});return result;};}/**
     * Creates a function for `_.padLeft` or `_.padRight`.
     *
     * @private
     * @param {boolean} [fromRight] Specify padding from the right.
     * @returns {Function} Returns the new pad function.
     */function createPadDir(fromRight){return function(string,length,chars){string=baseToString(string);return(fromRight?string:'')+createPadding(string,length,chars)+(fromRight?'':string);};}/**
     * Creates a `_.partial` or `_.partialRight` function.
     *
     * @private
     * @param {boolean} flag The partial bit flag.
     * @returns {Function} Returns the new partial function.
     */function createPartial(flag){var partialFunc=restParam(function(func,partials){var holders=replaceHolders(partials,partialFunc.placeholder);return createWrapper(func,flag,undefined,partials,holders);});return partialFunc;}/**
     * Creates a function for `_.reduce` or `_.reduceRight`.
     *
     * @private
     * @param {Function} arrayFunc The function to iterate over an array.
     * @param {Function} eachFunc The function to iterate over a collection.
     * @returns {Function} Returns the new each function.
     */function createReduce(arrayFunc,eachFunc){return function(collection,iteratee,accumulator,thisArg){var initFromArray=arguments.length<3;return typeof iteratee=='function'&&thisArg===undefined&&isArray(collection)?arrayFunc(collection,iteratee,accumulator,initFromArray):baseReduce(collection,getCallback(iteratee,thisArg,4),accumulator,initFromArray,eachFunc);};}/**
     * Creates a function that wraps `func` and invokes it with optional `this`
     * binding of, partial application, and currying.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to prepend to those provided to the new function.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [partialsRight] The arguments to append to those provided to the new function.
     * @param {Array} [holdersRight] The `partialsRight` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */function createHybridWrapper(func,bitmask,thisArg,partials,holders,partialsRight,holdersRight,argPos,ary,arity){var isAry=bitmask&ARY_FLAG,isBind=bitmask&BIND_FLAG,isBindKey=bitmask&BIND_KEY_FLAG,isCurry=bitmask&CURRY_FLAG,isCurryBound=bitmask&CURRY_BOUND_FLAG,isCurryRight=bitmask&CURRY_RIGHT_FLAG,Ctor=isBindKey?undefined:createCtorWrapper(func);function wrapper(){// Avoid `arguments` object use disqualifying optimizations by
// converting it to an array before providing it to other functions.
var length=arguments.length,index=length,args=Array(length);while(index--){args[index]=arguments[index];}if(partials){args=composeArgs(args,partials,holders);}if(partialsRight){args=composeArgsRight(args,partialsRight,holdersRight);}if(isCurry||isCurryRight){var placeholder=wrapper.placeholder,argsHolders=replaceHolders(args,placeholder);length-=argsHolders.length;if(length<arity){var newArgPos=argPos?arrayCopy(argPos):undefined,newArity=nativeMax(arity-length,0),newsHolders=isCurry?argsHolders:undefined,newHoldersRight=isCurry?undefined:argsHolders,newPartials=isCurry?args:undefined,newPartialsRight=isCurry?undefined:args;bitmask|=isCurry?PARTIAL_FLAG:PARTIAL_RIGHT_FLAG;bitmask&=~(isCurry?PARTIAL_RIGHT_FLAG:PARTIAL_FLAG);if(!isCurryBound){bitmask&=~(BIND_FLAG|BIND_KEY_FLAG);}var newData=[func,bitmask,thisArg,newPartials,newsHolders,newPartialsRight,newHoldersRight,newArgPos,ary,newArity],result=createHybridWrapper.apply(undefined,newData);if(isLaziable(func)){setData(result,newData);}result.placeholder=placeholder;return result;}}var thisBinding=isBind?thisArg:this,fn=isBindKey?thisBinding[func]:func;if(argPos){args=reorder(args,argPos);}if(isAry&&ary<args.length){args.length=ary;}if(this&&this!==root&&this instanceof wrapper){fn=Ctor||createCtorWrapper(func);}return fn.apply(thisBinding,args);}return wrapper;}/**
     * Creates the padding required for `string` based on the given `length`.
     * The `chars` string is truncated if the number of characters exceeds `length`.
     *
     * @private
     * @param {string} string The string to create padding for.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the pad for `string`.
     */function createPadding(string,length,chars){var strLength=string.length;length=+length;if(strLength>=length||!nativeIsFinite(length)){return'';}var padLength=length-strLength;chars=chars==null?' ':chars+'';return repeat(chars,nativeCeil(padLength/chars.length)).slice(0,padLength);}/**
     * Creates a function that wraps `func` and invokes it with the optional `this`
     * binding of `thisArg` and the `partials` prepended to those provided to
     * the wrapper.
     *
     * @private
     * @param {Function} func The function to partially apply arguments to.
     * @param {number} bitmask The bitmask of flags. See `createWrapper` for more details.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} partials The arguments to prepend to those provided to the new function.
     * @returns {Function} Returns the new bound function.
     */function createPartialWrapper(func,bitmask,thisArg,partials){var isBind=bitmask&BIND_FLAG,Ctor=createCtorWrapper(func);function wrapper(){// Avoid `arguments` object use disqualifying optimizations by
// converting it to an array before providing it `func`.
var argsIndex=-1,argsLength=arguments.length,leftIndex=-1,leftLength=partials.length,args=Array(leftLength+argsLength);while(++leftIndex<leftLength){args[leftIndex]=partials[leftIndex];}while(argsLength--){args[leftIndex++]=arguments[++argsIndex];}var fn=this&&this!==root&&this instanceof wrapper?Ctor:func;return fn.apply(isBind?thisArg:this,args);}return wrapper;}/**
     * Creates a `_.ceil`, `_.floor`, or `_.round` function.
     *
     * @private
     * @param {string} methodName The name of the `Math` method to use when rounding.
     * @returns {Function} Returns the new round function.
     */function createRound(methodName){var func=Math[methodName];return function(number,precision){precision=precision===undefined?0:+precision||0;if(precision){precision=pow(10,precision);return func(number*precision)/precision;}return func(number);};}/**
     * Creates a `_.sortedIndex` or `_.sortedLastIndex` function.
     *
     * @private
     * @param {boolean} [retHighest] Specify returning the highest qualified index.
     * @returns {Function} Returns the new index function.
     */function createSortedIndex(retHighest){return function(array,value,iteratee,thisArg){var callback=getCallback(iteratee);return iteratee==null&&callback===baseCallback?binaryIndex(array,value,retHighest):binaryIndexBy(array,value,callback(iteratee,thisArg,1),retHighest);};}/**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of flags.
     *  The bitmask may be composed of the following flags:
     *     1 - `_.bind`
     *     2 - `_.bindKey`
     *     4 - `_.curry` or `_.curryRight` of a bound function
     *     8 - `_.curry`
     *    16 - `_.curryRight`
     *    32 - `_.partial`
     *    64 - `_.partialRight`
     *   128 - `_.rearg`
     *   256 - `_.ary`
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */function createWrapper(func,bitmask,thisArg,partials,holders,argPos,ary,arity){var isBindKey=bitmask&BIND_KEY_FLAG;if(!isBindKey&&typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}var length=partials?partials.length:0;if(!length){bitmask&=~(PARTIAL_FLAG|PARTIAL_RIGHT_FLAG);partials=holders=undefined;}length-=holders?holders.length:0;if(bitmask&PARTIAL_RIGHT_FLAG){var partialsRight=partials,holdersRight=holders;partials=holders=undefined;}var data=isBindKey?undefined:getData(func),newData=[func,bitmask,thisArg,partials,holders,partialsRight,holdersRight,argPos,ary,arity];if(data){mergeData(newData,data);bitmask=newData[1];arity=newData[9];}newData[9]=arity==null?isBindKey?0:func.length:nativeMax(arity-length,0)||0;if(bitmask==BIND_FLAG){var result=createBindWrapper(newData[0],newData[2]);}else if((bitmask==PARTIAL_FLAG||bitmask==(BIND_FLAG|PARTIAL_FLAG))&&!newData[4].length){result=createPartialWrapper.apply(undefined,newData);}else{result=createHybridWrapper.apply(undefined,newData);}var setter=data?baseSetData:setData;return setter(result,newData);}/**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing arrays.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */function equalArrays(array,other,equalFunc,customizer,isLoose,stackA,stackB){var index=-1,arrLength=array.length,othLength=other.length;if(arrLength!=othLength&&!(isLoose&&othLength>arrLength)){return false;}// Ignore non-index properties.
while(++index<arrLength){var arrValue=array[index],othValue=other[index],result=customizer?customizer(isLoose?othValue:arrValue,isLoose?arrValue:othValue,index):undefined;if(result!==undefined){if(result){continue;}return false;}// Recursively compare arrays (susceptible to call stack limits).
if(isLoose){if(!arraySome(other,function(othValue){return arrValue===othValue||equalFunc(arrValue,othValue,customizer,isLoose,stackA,stackB);})){return false;}}else if(!(arrValue===othValue||equalFunc(arrValue,othValue,customizer,isLoose,stackA,stackB))){return false;}}return true;}/**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function equalByTag(object,other,tag){switch(tag){case boolTag:case dateTag:// Coerce dates and booleans to numbers, dates to milliseconds and booleans
// to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
return+object==+other;case errorTag:return object.name==other.name&&object.message==other.message;case numberTag:// Treat `NaN` vs. `NaN` as equal.
return object!=+object?other!=+other:object==+other;case regexpTag:case stringTag:// Coerce regexes to strings and treat strings primitives and string
// objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
return object==other+'';}return false;}/**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Function} [customizer] The function to customize comparing values.
     * @param {boolean} [isLoose] Specify performing partial comparisons.
     * @param {Array} [stackA] Tracks traversed `value` objects.
     * @param {Array} [stackB] Tracks traversed `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */function equalObjects(object,other,equalFunc,customizer,isLoose,stackA,stackB){var objProps=keys(object),objLength=objProps.length,othProps=keys(other),othLength=othProps.length;if(objLength!=othLength&&!isLoose){return false;}var index=objLength;while(index--){var key=objProps[index];if(!(isLoose?key in other:hasOwnProperty.call(other,key))){return false;}}var skipCtor=isLoose;while(++index<objLength){key=objProps[index];var objValue=object[key],othValue=other[key],result=customizer?customizer(isLoose?othValue:objValue,isLoose?objValue:othValue,key):undefined;// Recursively compare objects (susceptible to call stack limits).
if(!(result===undefined?equalFunc(objValue,othValue,customizer,isLoose,stackA,stackB):result)){return false;}skipCtor||(skipCtor=key=='constructor');}if(!skipCtor){var objCtor=object.constructor,othCtor=other.constructor;// Non `Object` object instances with different constructors are not equal.
if(objCtor!=othCtor&&'constructor'in object&&'constructor'in other&&!(typeof objCtor=='function'&&objCtor instanceof objCtor&&typeof othCtor=='function'&&othCtor instanceof othCtor)){return false;}}return true;}/**
     * Gets the appropriate "callback" function. If the `_.callback` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseCallback` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function} Returns the chosen function or its result.
     */function getCallback(func,thisArg,argCount){var result=lodash.callback||callback;result=result===callback?baseCallback:result;return argCount?result(func,thisArg,argCount):result;}/**
     * Gets metadata for `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {*} Returns the metadata for `func`.
     */var getData=!metaMap?noop:function(func){return metaMap.get(func);};/**
     * Gets the name of `func`.
     *
     * @private
     * @param {Function} func The function to query.
     * @returns {string} Returns the function name.
     */function getFuncName(func){var result=func.name,array=realNames[result],length=array?array.length:0;while(length--){var data=array[length],otherFunc=data.func;if(otherFunc==null||otherFunc==func){return data.name;}}return result;}/**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized this function returns the custom method, otherwise it returns
     * the `baseIndexOf` function. If arguments are provided the chosen function
     * is invoked with them and its result is returned.
     *
     * @private
     * @returns {Function|number} Returns the chosen function or its result.
     */function getIndexOf(collection,target,fromIndex){var result=lodash.indexOf||indexOf;result=result===indexOf?baseIndexOf:result;return collection?result(collection,target,fromIndex):result;}/**
     * Gets the "length" property value of `object`.
     *
     * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
     * that affects Safari on at least iOS 8.1-8.3 ARM64.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {*} Returns the "length" value.
     */var getLength=baseProperty('length');/**
     * Gets the propery names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */function getMatchData(object){var result=pairs(object),length=result.length;while(length--){result[length][2]=isStrictComparable(result[length][1]);}return result;}/**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */function getNative(object,key){var value=object==null?undefined:object[key];return isNative(value)?value:undefined;}/**
     * Gets the view, applying any `transforms` to the `start` and `end` positions.
     *
     * @private
     * @param {number} start The start of the view.
     * @param {number} end The end of the view.
     * @param {Array} transforms The transformations to apply to the view.
     * @returns {Object} Returns an object containing the `start` and `end`
     *  positions of the view.
     */function getView(start,end,transforms){var index=-1,length=transforms.length;while(++index<length){var data=transforms[index],size=data.size;switch(data.type){case'drop':start+=size;break;case'dropRight':end-=size;break;case'take':end=nativeMin(end,start+size);break;case'takeRight':start=nativeMax(start,end-size);break;}}return{'start':start,'end':end};}/**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */function initCloneArray(array){var length=array.length,result=new array.constructor(length);// Add array properties assigned by `RegExp#exec`.
if(length&&typeof array[0]=='string'&&hasOwnProperty.call(array,'index')){result.index=array.index;result.input=array.input;}return result;}/**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */function initCloneObject(object){var Ctor=object.constructor;if(!(typeof Ctor=='function'&&Ctor instanceof Ctor)){Ctor=Object;}return new Ctor();}/**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */function initCloneByTag(object,tag,isDeep){var Ctor=object.constructor;switch(tag){case arrayBufferTag:return bufferClone(object);case boolTag:case dateTag:return new Ctor(+object);case float32Tag:case float64Tag:case int8Tag:case int16Tag:case int32Tag:case uint8Tag:case uint8ClampedTag:case uint16Tag:case uint32Tag:var buffer=object.buffer;return new Ctor(isDeep?bufferClone(buffer):buffer,object.byteOffset,object.length);case numberTag:case stringTag:return new Ctor(object);case regexpTag:var result=new Ctor(object.source,reFlags.exec(object));result.lastIndex=object.lastIndex;}return result;}/**
     * Invokes the method at `path` on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the method to invoke.
     * @param {Array} args The arguments to invoke the method with.
     * @returns {*} Returns the result of the invoked method.
     */function invokePath(object,path,args){if(object!=null&&!isKey(path,object)){path=toPath(path);object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));path=last(path);}var func=object==null?object:object[path];return func==null?undefined:func.apply(object,args);}/**
     * Checks if `value` is array-like.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     */function isArrayLike(value){return value!=null&&isLength(getLength(value));}/**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */function isIndex(value,length){value=typeof value=='number'||reIsUint.test(value)?+value:-1;length=length==null?MAX_SAFE_INTEGER:length;return value>-1&&value%1==0&&value<length;}/**
     * Checks if the provided arguments are from an iteratee call.
     *
     * @private
     * @param {*} value The potential iteratee value argument.
     * @param {*} index The potential iteratee index or key argument.
     * @param {*} object The potential iteratee object argument.
     * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
     */function isIterateeCall(value,index,object){if(!isObject(object)){return false;}var type=typeof index==="undefined"?"undefined":_typeof(index);if(type=='number'?isArrayLike(object)&&isIndex(index,object.length):type=='string'&&index in object){var other=object[index];return value===value?value===other:other!==other;}return false;}/**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */function isKey(value,object){var type=typeof value==="undefined"?"undefined":_typeof(value);if(type=='string'&&reIsPlainProp.test(value)||type=='number'){return true;}if(isArray(value)){return false;}var result=!reIsDeepProp.test(value);return result||object!=null&&value in toObject(object);}/**
     * Checks if `func` has a lazy counterpart.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` has a lazy counterpart, else `false`.
     */function isLaziable(func){var funcName=getFuncName(func);if(!(funcName in LazyWrapper.prototype)){return false;}var other=lodash[funcName];if(func===other){return true;}var data=getData(other);return!!data&&func===data[0];}/**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     */function isLength(value){return typeof value=='number'&&value>-1&&value%1==0&&value<=MAX_SAFE_INTEGER;}/**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */function isStrictComparable(value){return value===value&&!isObject(value);}/**
     * Merges the function metadata of `source` into `data`.
     *
     * Merging metadata reduces the number of wrappers required to invoke a function.
     * This is possible because methods like `_.bind`, `_.curry`, and `_.partial`
     * may be applied regardless of execution order. Methods like `_.ary` and `_.rearg`
     * augment function arguments, making the order in which they are executed important,
     * preventing the merging of metadata. However, we make an exception for a safe
     * common case where curried functions have `_.ary` and or `_.rearg` applied.
     *
     * @private
     * @param {Array} data The destination metadata.
     * @param {Array} source The source metadata.
     * @returns {Array} Returns `data`.
     */function mergeData(data,source){var bitmask=data[1],srcBitmask=source[1],newBitmask=bitmask|srcBitmask,isCommon=newBitmask<ARY_FLAG;var isCombo=srcBitmask==ARY_FLAG&&bitmask==CURRY_FLAG||srcBitmask==ARY_FLAG&&bitmask==REARG_FLAG&&data[7].length<=source[8]||srcBitmask==(ARY_FLAG|REARG_FLAG)&&bitmask==CURRY_FLAG;// Exit early if metadata can't be merged.
if(!(isCommon||isCombo)){return data;}// Use source `thisArg` if available.
if(srcBitmask&BIND_FLAG){data[2]=source[2];// Set when currying a bound function.
newBitmask|=bitmask&BIND_FLAG?0:CURRY_BOUND_FLAG;}// Compose partial arguments.
var value=source[3];if(value){var partials=data[3];data[3]=partials?composeArgs(partials,value,source[4]):arrayCopy(value);data[4]=partials?replaceHolders(data[3],PLACEHOLDER):arrayCopy(source[4]);}// Compose partial right arguments.
value=source[5];if(value){partials=data[5];data[5]=partials?composeArgsRight(partials,value,source[6]):arrayCopy(value);data[6]=partials?replaceHolders(data[5],PLACEHOLDER):arrayCopy(source[6]);}// Use source `argPos` if available.
value=source[7];if(value){data[7]=arrayCopy(value);}// Use source `ary` if it's smaller.
if(srcBitmask&ARY_FLAG){data[8]=data[8]==null?source[8]:nativeMin(data[8],source[8]);}// Use source `arity` if one is not provided.
if(data[9]==null){data[9]=source[9];}// Use source `func` and merge bitmasks.
data[0]=source[0];data[1]=newBitmask;return data;}/**
     * Used by `_.defaultsDeep` to customize its `_.merge` use.
     *
     * @private
     * @param {*} objectValue The destination object property value.
     * @param {*} sourceValue The source object property value.
     * @returns {*} Returns the value to assign to the destination object.
     */function mergeDefaults(objectValue,sourceValue){return objectValue===undefined?sourceValue:merge(objectValue,sourceValue,mergeDefaults);}/**
     * A specialized version of `_.pick` which picks `object` properties specified
     * by `props`.
     *
     * @private
     * @param {Object} object The source object.
     * @param {string[]} props The property names to pick.
     * @returns {Object} Returns the new object.
     */function pickByArray(object,props){object=toObject(object);var index=-1,length=props.length,result={};while(++index<length){var key=props[index];if(key in object){result[key]=object[key];}}return result;}/**
     * A specialized version of `_.pick` which picks `object` properties `predicate`
     * returns truthy for.
     *
     * @private
     * @param {Object} object The source object.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Object} Returns the new object.
     */function pickByCallback(object,predicate){var result={};baseForIn(object,function(value,key,object){if(predicate(value,key,object)){result[key]=value;}});return result;}/**
     * Reorder `array` according to the specified indexes where the element at
     * the first index is assigned as the first element, the element at
     * the second index is assigned as the second element, and so on.
     *
     * @private
     * @param {Array} array The array to reorder.
     * @param {Array} indexes The arranged array indexes.
     * @returns {Array} Returns `array`.
     */function reorder(array,indexes){var arrLength=array.length,length=nativeMin(indexes.length,arrLength),oldArray=arrayCopy(array);while(length--){var index=indexes[length];array[length]=isIndex(index,arrLength)?oldArray[index]:undefined;}return array;}/**
     * Sets metadata for `func`.
     *
     * **Note:** If this function becomes hot, i.e. is invoked a lot in a short
     * period of time, it will trip its breaker and transition to an identity function
     * to avoid garbage collection pauses in V8. See [V8 issue 2070](https://code.google.com/p/v8/issues/detail?id=2070)
     * for more details.
     *
     * @private
     * @param {Function} func The function to associate metadata with.
     * @param {*} data The metadata.
     * @returns {Function} Returns `func`.
     */var setData=function(){var count=0,lastCalled=0;return function(key,value){var stamp=now(),remaining=HOT_SPAN-(stamp-lastCalled);lastCalled=stamp;if(remaining>0){if(++count>=HOT_COUNT){return key;}}else{count=0;}return baseSetData(key,value);};}();/**
     * A fallback implementation of `Object.keys` which creates an array of the
     * own enumerable property names of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */function shimKeys(object){var props=keysIn(object),propsLength=props.length,length=propsLength&&object.length;var allowIndexes=!!length&&isLength(length)&&(isArray(object)||isArguments(object));var index=-1,result=[];while(++index<propsLength){var key=props[index];if(allowIndexes&&isIndex(key,length)||hasOwnProperty.call(object,key)){result.push(key);}}return result;}/**
     * Converts `value` to an array-like object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array|Object} Returns the array-like object.
     */function toIterable(value){if(value==null){return[];}if(!isArrayLike(value)){return values(value);}return isObject(value)?value:Object(value);}/**
     * Converts `value` to an object if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Object} Returns the object.
     */function toObject(value){return isObject(value)?value:Object(value);}/**
     * Converts `value` to property path array if it's not one.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {Array} Returns the property path array.
     */function toPath(value){if(isArray(value)){return value;}var result=[];baseToString(value).replace(rePropName,function(match,number,quote,string){result.push(quote?string.replace(reEscapeChar,'$1'):number||match);});return result;}/**
     * Creates a clone of `wrapper`.
     *
     * @private
     * @param {Object} wrapper The wrapper to clone.
     * @returns {Object} Returns the cloned wrapper.
     */function wrapperClone(wrapper){return wrapper instanceof LazyWrapper?wrapper.clone():new LodashWrapper(wrapper.__wrapped__,wrapper.__chain__,arrayCopy(wrapper.__actions__));}/*------------------------------------------------------------------------*//**
     * Creates an array of elements split into groups the length of `size`.
     * If `collection` can't be split evenly, the final chunk will be the remaining
     * elements.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to process.
     * @param {number} [size=1] The length of each chunk.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new array containing chunks.
     * @example
     *
     * _.chunk(['a', 'b', 'c', 'd'], 2);
     * // => [['a', 'b'], ['c', 'd']]
     *
     * _.chunk(['a', 'b', 'c', 'd'], 3);
     * // => [['a', 'b', 'c'], ['d']]
     */function chunk(array,size,guard){if(guard?isIterateeCall(array,size,guard):size==null){size=1;}else{size=nativeMax(nativeFloor(size)||1,1);}var index=0,length=array?array.length:0,resIndex=-1,result=Array(nativeCeil(length/size));while(index<length){result[++resIndex]=baseSlice(array,index,index+=size);}return result;}/**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are falsey.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to compact.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */function compact(array){var index=-1,length=array?array.length:0,resIndex=-1,result=[];while(++index<length){var value=array[index];if(value){result[++resIndex]=value;}}return result;}/**
     * Creates an array of unique `array` values not included in the other
     * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3], [4, 2]);
     * // => [1, 3]
     */var difference=restParam(function(array,values){return isObjectLike(array)&&isArrayLike(array)?baseDifference(array,baseFlatten(values,false,true)):[];});/**
     * Creates a slice of `array` with `n` elements dropped from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.drop([1, 2, 3]);
     * // => [2, 3]
     *
     * _.drop([1, 2, 3], 2);
     * // => [3]
     *
     * _.drop([1, 2, 3], 5);
     * // => []
     *
     * _.drop([1, 2, 3], 0);
     * // => [1, 2, 3]
     */function drop(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}return baseSlice(array,n<0?0:n);}/**
     * Creates a slice of `array` with `n` elements dropped from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to drop.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRight([1, 2, 3]);
     * // => [1, 2]
     *
     * _.dropRight([1, 2, 3], 2);
     * // => [1]
     *
     * _.dropRight([1, 2, 3], 5);
     * // => []
     *
     * _.dropRight([1, 2, 3], 0);
     * // => [1, 2, 3]
     */function dropRight(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}n=length-(+n||0);return baseSlice(array,0,n<0?0:n);}/**
     * Creates a slice of `array` excluding elements dropped from the end.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that match the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [1]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active', false), 'user');
     * // => ['barney']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropRightWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */function dropRightWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3),true,true):[];}/**
     * Creates a slice of `array` excluding elements dropped from the beginning.
     * Elements are dropped until `predicate` returns falsey. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.dropWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.dropWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.dropWhile(users, 'active', false), 'user');
     * // => ['pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.dropWhile(users, 'active'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */function dropWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3),true):[];}/**
     * Fills elements of `array` with `value` from `start` up to, but not
     * including, `end`.
     *
     * **Note:** This method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to fill.
     * @param {*} value The value to fill `array` with.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _.fill(array, 'a');
     * console.log(array);
     * // => ['a', 'a', 'a']
     *
     * _.fill(Array(3), 2);
     * // => [2, 2, 2]
     *
     * _.fill([4, 6, 8], '*', 1, 2);
     * // => [4, '*', 8]
     */function fill(array,value,start,end){var length=array?array.length:0;if(!length){return[];}if(start&&typeof start!='number'&&isIterateeCall(array,value,start)){start=0;end=length;}return baseFill(array,value,start,end);}/**
     * This method is like `_.find` except that it returns the index of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * _.findIndex(users, function(chr) {
     *   return chr.user == 'barney';
     * });
     * // => 0
     *
     * // using the `_.matches` callback shorthand
     * _.findIndex(users, { 'user': 'fred', 'active': false });
     * // => 1
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findIndex(users, 'active', false);
     * // => 0
     *
     * // using the `_.property` callback shorthand
     * _.findIndex(users, 'active');
     * // => 2
     */var findIndex=createFindIndex();/**
     * This method is like `_.findIndex` except that it iterates over elements
     * of `collection` from right to left.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * _.findLastIndex(users, function(chr) {
     *   return chr.user == 'pebbles';
     * });
     * // => 2
     *
     * // using the `_.matches` callback shorthand
     * _.findLastIndex(users, { 'user': 'barney', 'active': true });
     * // => 0
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastIndex(users, 'active', false);
     * // => 2
     *
     * // using the `_.property` callback shorthand
     * _.findLastIndex(users, 'active');
     * // => 0
     */var findLastIndex=createFindIndex(true);/**
     * Gets the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias head
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the first element of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([]);
     * // => undefined
     */function first(array){return array?array[0]:undefined;}/**
     * Flattens a nested array. If `isDeep` is `true` the array is recursively
     * flattened, otherwise it is only flattened a single level.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to flatten.
     * @param {boolean} [isDeep] Specify a deep flatten.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flatten([1, [2, 3, [4]]]);
     * // => [1, 2, 3, [4]]
     *
     * // using `isDeep`
     * _.flatten([1, [2, 3, [4]]], true);
     * // => [1, 2, 3, 4]
     */function flatten(array,isDeep,guard){var length=array?array.length:0;if(guard&&isIterateeCall(array,isDeep,guard)){isDeep=false;}return length?baseFlatten(array,isDeep):[];}/**
     * Recursively flattens a nested array.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to recursively flatten.
     * @returns {Array} Returns the new flattened array.
     * @example
     *
     * _.flattenDeep([1, [2, 3, [4]]]);
     * // => [1, 2, 3, 4]
     */function flattenDeep(array){var length=array?array.length:0;return length?baseFlatten(array,true):[];}/**
     * Gets the index at which the first occurrence of `value` is found in `array`
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `array`. If `array` is sorted providing `true` for `fromIndex`
     * performs a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.indexOf([1, 2, 1, 2], 2);
     * // => 1
     *
     * // using `fromIndex`
     * _.indexOf([1, 2, 1, 2], 2, 2);
     * // => 3
     *
     * // performing a binary search
     * _.indexOf([1, 1, 2, 2], 2, true);
     * // => 2
     */function indexOf(array,value,fromIndex){var length=array?array.length:0;if(!length){return-1;}if(typeof fromIndex=='number'){fromIndex=fromIndex<0?nativeMax(length+fromIndex,0):fromIndex;}else if(fromIndex){var index=binaryIndex(array,value);if(index<length&&(value===value?value===array[index]:array[index]!==array[index])){return index;}return-1;}return baseIndexOf(array,value,fromIndex||0);}/**
     * Gets all but the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     */function initial(array){return dropRight(array,1);}/**
     * Creates an array of unique values that are included in all of the provided
     * arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of shared values.
     * @example
     * _.intersection([1, 2], [4, 2], [2, 1]);
     * // => [2]
     */var intersection=restParam(function(arrays){var othLength=arrays.length,othIndex=othLength,caches=Array(length),indexOf=getIndexOf(),isCommon=indexOf==baseIndexOf,result=[];while(othIndex--){var value=arrays[othIndex]=isArrayLike(value=arrays[othIndex])?value:[];caches[othIndex]=isCommon&&value.length>=120?createCache(othIndex&&value):null;}var array=arrays[0],index=-1,length=array?array.length:0,seen=caches[0];outer:while(++index<length){value=array[index];if((seen?cacheIndexOf(seen,value):indexOf(result,value,0))<0){var othIndex=othLength;while(--othIndex){var cache=caches[othIndex];if((cache?cacheIndexOf(cache,value):indexOf(arrays[othIndex],value,0))<0){continue outer;}}if(seen){seen.push(value);}result.push(value);}}return result;});/**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */function last(array){var length=array?array.length:0;return length?array[length-1]:undefined;}/**
     * This method is like `_.indexOf` except that it iterates over elements of
     * `array` from right to left.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=array.length-1] The index to search from
     *  or `true` to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value, else `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 1, 2], 2);
     * // => 3
     *
     * // using `fromIndex`
     * _.lastIndexOf([1, 2, 1, 2], 2, 2);
     * // => 1
     *
     * // performing a binary search
     * _.lastIndexOf([1, 1, 2, 2], 2, true);
     * // => 3
     */function lastIndexOf(array,value,fromIndex){var length=array?array.length:0;if(!length){return-1;}var index=length;if(typeof fromIndex=='number'){index=(fromIndex<0?nativeMax(length+fromIndex,0):nativeMin(fromIndex||0,length-1))+1;}else if(fromIndex){index=binaryIndex(array,value,true)-1;var other=array[index];if(value===value?value===other:other!==other){return index;}return-1;}if(value!==value){return indexOfNaN(array,index,true);}while(index--){if(array[index]===value){return index;}}return-1;}/**
     * Removes all provided values from `array` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * **Note:** Unlike `_.without`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...*} [values] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     *
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */function pull(){var args=arguments,array=args[0];if(!(array&&array.length)){return array;}var index=0,indexOf=getIndexOf(),length=args.length;while(++index<length){var fromIndex=0,value=args[index];while((fromIndex=indexOf(array,value,fromIndex))>-1){splice.call(array,fromIndex,1);}}return array;}/**
     * Removes elements from `array` corresponding to the given indexes and returns
     * an array of the removed elements. Indexes may be specified as an array of
     * indexes or as individual arguments.
     *
     * **Note:** Unlike `_.at`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {...(number|number[])} [indexes] The indexes of elements to remove,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [5, 10, 15, 20];
     * var evens = _.pullAt(array, 1, 3);
     *
     * console.log(array);
     * // => [5, 15]
     *
     * console.log(evens);
     * // => [10, 20]
     */var pullAt=restParam(function(array,indexes){indexes=baseFlatten(indexes);var result=baseAt(array,indexes);basePullAt(array,indexes.sort(baseCompareAscending));return result;});/**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // => [1, 3]
     *
     * console.log(evens);
     * // => [2, 4]
     */function remove(array,predicate,thisArg){var result=[];if(!(array&&array.length)){return result;}var index=-1,indexes=[],length=array.length;predicate=getCallback(predicate,thisArg,3);while(++index<length){var value=array[index];if(predicate(value,index,array)){result.push(value);indexes.push(index);}}basePullAt(array,indexes);return result;}/**
     * Gets all but the first element of `array`.
     *
     * @static
     * @memberOf _
     * @alias tail
     * @category Array
     * @param {Array} array The array to query.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     */function rest(array){return drop(array,1);}/**
     * Creates a slice of `array` from `start` up to, but not including, `end`.
     *
     * **Note:** This method is used instead of `Array#slice` to support node
     * lists in IE < 9 and to ensure dense arrays are returned.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to slice.
     * @param {number} [start=0] The start position.
     * @param {number} [end=array.length] The end position.
     * @returns {Array} Returns the slice of `array`.
     */function slice(array,start,end){var length=array?array.length:0;if(!length){return[];}if(end&&typeof end!='number'&&isIterateeCall(array,start,end)){start=0;end=length;}return baseSlice(array,start,end);}/**
     * Uses a binary search to determine the lowest index at which `value` should
     * be inserted into `array` in order to maintain its sort order. If an iteratee
     * function is provided it is invoked for `value` and each element of `array`
     * to compute their sort ranking. The iteratee is bound to `thisArg` and
     * invoked with one argument; (value).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([30, 50], 40);
     * // => 1
     *
     * _.sortedIndex([4, 4, 5, 5], 5);
     * // => 2
     *
     * var dict = { 'data': { 'thirty': 30, 'forty': 40, 'fifty': 50 } };
     *
     * // using an iteratee function
     * _.sortedIndex(['thirty', 'fifty'], 'forty', function(word) {
     *   return this.data[word];
     * }, dict);
     * // => 1
     *
     * // using the `_.property` callback shorthand
     * _.sortedIndex([{ 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 1
     */var sortedIndex=createSortedIndex();/**
     * This method is like `_.sortedIndex` except that it returns the highest
     * index at which `value` should be inserted into `array` in order to
     * maintain its sort order.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The sorted array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedLastIndex([4, 4, 5, 5], 5);
     * // => 4
     */var sortedLastIndex=createSortedIndex(true);/**
     * Creates a slice of `array` with `n` elements taken from the beginning.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.take([1, 2, 3]);
     * // => [1]
     *
     * _.take([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.take([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.take([1, 2, 3], 0);
     * // => []
     */function take(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}return baseSlice(array,0,n<0?0:n);}/**
     * Creates a slice of `array` with `n` elements taken from the end.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {number} [n=1] The number of elements to take.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRight([1, 2, 3]);
     * // => [3]
     *
     * _.takeRight([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.takeRight([1, 2, 3], 5);
     * // => [1, 2, 3]
     *
     * _.takeRight([1, 2, 3], 0);
     * // => []
     */function takeRight(array,n,guard){var length=array?array.length:0;if(!length){return[];}if(guard?isIterateeCall(array,n,guard):n==null){n=1;}n=length-(+n||0);return baseSlice(array,n<0?0:n);}/**
     * Creates a slice of `array` with elements taken from the end. Elements are
     * taken until `predicate` returns falsey. The predicate is bound to `thisArg`
     * and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeRightWhile([1, 2, 3], function(n) {
     *   return n > 1;
     * });
     * // => [2, 3]
     *
     * var users = [
     *   { 'user': 'barney',  'active': true },
     *   { 'user': 'fred',    'active': false },
     *   { 'user': 'pebbles', 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeRightWhile(users, { 'user': 'pebbles', 'active': false }), 'user');
     * // => ['pebbles']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active', false), 'user');
     * // => ['fred', 'pebbles']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeRightWhile(users, 'active'), 'user');
     * // => []
     */function takeRightWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3),false,true):[];}/**
     * Creates a slice of `array` with elements taken from the beginning. Elements
     * are taken until `predicate` returns falsey. The predicate is bound to
     * `thisArg` and invoked with three arguments: (value, index, array).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to query.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the slice of `array`.
     * @example
     *
     * _.takeWhile([1, 2, 3], function(n) {
     *   return n < 3;
     * });
     * // => [1, 2]
     *
     * var users = [
     *   { 'user': 'barney',  'active': false },
     *   { 'user': 'fred',    'active': false},
     *   { 'user': 'pebbles', 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.takeWhile(users, { 'user': 'barney', 'active': false }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.takeWhile(users, 'active', false), 'user');
     * // => ['barney', 'fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.takeWhile(users, 'active'), 'user');
     * // => []
     */function takeWhile(array,predicate,thisArg){return array&&array.length?baseWhile(array,getCallback(predicate,thisArg,3)):[];}/**
     * Creates an array of unique values, in order, from all of the provided arrays
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of combined values.
     * @example
     *
     * _.union([1, 2], [4, 2], [2, 1]);
     * // => [1, 2, 4]
     */var union=restParam(function(arrays){return baseUniq(baseFlatten(arrays,false,true));});/**
     * Creates a duplicate-free version of an array, using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons, in which only the first occurence of each element
     * is kept. Providing `true` for `isSorted` performs a faster search algorithm
     * for sorted arrays. If an iteratee function is provided it is invoked for
     * each element in the array to generate the criterion by which uniqueness
     * is computed. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, array).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {boolean} [isSorted] Specify the array is sorted.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new duplicate-value-free array.
     * @example
     *
     * _.uniq([2, 1, 2]);
     * // => [2, 1]
     *
     * // using `isSorted`
     * _.uniq([1, 1, 2], true);
     * // => [1, 2]
     *
     * // using an iteratee function
     * _.uniq([1, 2.5, 1.5, 2], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => [1, 2.5]
     *
     * // using the `_.property` callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */function uniq(array,isSorted,iteratee,thisArg){var length=array?array.length:0;if(!length){return[];}if(isSorted!=null&&typeof isSorted!='boolean'){thisArg=iteratee;iteratee=isIterateeCall(array,isSorted,thisArg)?undefined:isSorted;isSorted=false;}var callback=getCallback();if(!(iteratee==null&&callback===baseCallback)){iteratee=callback(iteratee,thisArg,3);}return isSorted&&getIndexOf()==baseIndexOf?sortedUniq(array,iteratee):baseUniq(array,iteratee);}/**
     * This method is like `_.zip` except that it accepts an array of grouped
     * elements and creates an array regrouping the elements to their pre-zip
     * configuration.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     *
     * _.unzip(zipped);
     * // => [['fred', 'barney'], [30, 40], [true, false]]
     */function unzip(array){if(!(array&&array.length)){return[];}var index=-1,length=0;array=arrayFilter(array,function(group){if(isArrayLike(group)){length=nativeMax(group.length,length);return true;}});var result=Array(length);while(++index<length){result[index]=arrayMap(array,baseProperty(index));}return result;}/**
     * This method is like `_.unzip` except that it accepts an iteratee to specify
     * how regrouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array of grouped elements to process.
     * @param {Function} [iteratee] The function to combine regrouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of regrouped elements.
     * @example
     *
     * var zipped = _.zip([1, 2], [10, 20], [100, 200]);
     * // => [[1, 10, 100], [2, 20, 200]]
     *
     * _.unzipWith(zipped, _.add);
     * // => [3, 30, 300]
     */function unzipWith(array,iteratee,thisArg){var length=array?array.length:0;if(!length){return[];}var result=unzip(array);if(iteratee==null){return result;}iteratee=bindCallback(iteratee,thisArg,4);return arrayMap(result,function(group){return arrayReduce(group,iteratee,undefined,true);});}/**
     * Creates an array excluding all provided values using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {Array} array The array to filter.
     * @param {...*} [values] The values to exclude.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 3], 1, 2);
     * // => [3]
     */var without=restParam(function(array,values){return isArrayLike(array)?baseDifference(array,values):[];});/**
     * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
     * of the provided arrays.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to inspect.
     * @returns {Array} Returns the new array of values.
     * @example
     *
     * _.xor([1, 2], [4, 2]);
     * // => [1, 4]
     */function xor(){var index=-1,length=arguments.length;while(++index<length){var array=arguments[index];if(isArrayLike(array)){var result=result?arrayPush(baseDifference(result,array),baseDifference(array,result)):array;}}return result?baseUniq(result):[];}/**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second elements
     * of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */var zip=restParam(unzip);/**
     * The inverse of `_.pairs`; this method returns an object composed from arrays
     * of property names and values. Provide either a single two dimensional array,
     * e.g. `[[key1, value1], [key2, value2]]` or two arrays, one of property names
     * and one of corresponding values.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Array
     * @param {Array} props The property names.
     * @param {Array} [values=[]] The property values.
     * @returns {Object} Returns the new object.
     * @example
     *
     * _.zipObject([['fred', 30], ['barney', 40]]);
     * // => { 'fred': 30, 'barney': 40 }
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */function zipObject(props,values){var index=-1,length=props?props.length:0,result={};if(length&&!values&&!isArray(props[0])){values=[];}while(++index<length){var key=props[index];if(values){result[key]=values[index];}else if(key){result[key[0]]=key[1];}}return result;}/**
     * This method is like `_.zip` except that it accepts an iteratee to specify
     * how grouped values should be combined. The `iteratee` is bound to `thisArg`
     * and invoked with four arguments: (accumulator, value, index, group).
     *
     * @static
     * @memberOf _
     * @category Array
     * @param {...Array} [arrays] The arrays to process.
     * @param {Function} [iteratee] The function to combine grouped values.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new array of grouped elements.
     * @example
     *
     * _.zipWith([1, 2], [10, 20], [100, 200], _.add);
     * // => [111, 222]
     */var zipWith=restParam(function(arrays){var length=arrays.length,iteratee=length>2?arrays[length-2]:undefined,thisArg=length>1?arrays[length-1]:undefined;if(length>2&&typeof iteratee=='function'){length-=2;}else{iteratee=length>1&&typeof thisArg=='function'?(--length,thisArg):undefined;thisArg=undefined;}arrays.length=length;return unzipWith(arrays,iteratee,thisArg);});/*------------------------------------------------------------------------*//**
     * Creates a `lodash` object that wraps `value` with explicit method
     * chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36 },
     *   { 'user': 'fred',    'age': 40 },
     *   { 'user': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(users)
     *   .sortBy('age')
     *   .map(function(chr) {
     *     return chr.user + ' is ' + chr.age;
     *   })
     *   .first()
     *   .value();
     * // => 'pebbles is 1'
     */function chain(value){var result=lodash(value);result.__chain__=true;return result;}/**
     * This method invokes `interceptor` and returns `value`. The interceptor is
     * bound to `thisArg` and invoked with one argument; (value). The purpose of
     * this method is to "tap into" a method chain in order to perform operations
     * on intermediate results within the chain.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3])
     *  .tap(function(array) {
     *    array.pop();
     *  })
     *  .reverse()
     *  .value();
     * // => [2, 1]
     */function tap(value,interceptor,thisArg){interceptor.call(thisArg,value);return value;}/**
     * This method is like `_.tap` except that it returns the result of `interceptor`.
     *
     * @static
     * @memberOf _
     * @category Chain
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @param {*} [thisArg] The `this` binding of `interceptor`.
     * @returns {*} Returns the result of `interceptor`.
     * @example
     *
     * _('  abc  ')
     *  .chain()
     *  .trim()
     *  .thru(function(value) {
     *    return [value];
     *  })
     *  .value();
     * // => ['abc']
     */function thru(value,interceptor,thisArg){return interceptor.call(thisArg,value);}/**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(users).first();
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(users).chain()
     *   .first()
     *   .pick('user')
     *   .value();
     * // => { 'user': 'barney' }
     */function wrapperChain(){return chain(this);}/**
     * Executes the chained sequence and returns the wrapped result.
     *
     * @name commit
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).push(3);
     *
     * console.log(array);
     * // => [1, 2]
     *
     * wrapped = wrapped.commit();
     * console.log(array);
     * // => [1, 2, 3]
     *
     * wrapped.last();
     * // => 3
     *
     * console.log(array);
     * // => [1, 2, 3]
     */function wrapperCommit(){return new LodashWrapper(this.value(),this.__chain__);}/**
     * Creates a new array joining a wrapped array with any additional arrays
     * and/or values.
     *
     * @name concat
     * @memberOf _
     * @category Chain
     * @param {...*} [values] The values to concatenate.
     * @returns {Array} Returns the new concatenated array.
     * @example
     *
     * var array = [1];
     * var wrapped = _(array).concat(2, [3], [[4]]);
     *
     * console.log(wrapped.value());
     * // => [1, 2, 3, [4]]
     *
     * console.log(array);
     * // => [1]
     */var wrapperConcat=restParam(function(values){values=baseFlatten(values);return this.thru(function(array){return arrayConcat(isArray(array)?array:[toObject(array)],values);});});/**
     * Creates a clone of the chained sequence planting `value` as the wrapped value.
     *
     * @name plant
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2];
     * var wrapped = _(array).map(function(value) {
     *   return Math.pow(value, 2);
     * });
     *
     * var other = [3, 4];
     * var otherWrapped = wrapped.plant(other);
     *
     * otherWrapped.value();
     * // => [9, 16]
     *
     * wrapped.value();
     * // => [1, 4]
     */function wrapperPlant(value){var result,parent=this;while(parent instanceof baseLodash){var clone=wrapperClone(parent);if(result){previous.__wrapped__=clone;}else{result=clone;}var previous=clone;parent=parent.__wrapped__;}previous.__wrapped__=value;return result;}/**
     * Reverses the wrapped array so the first element becomes the last, the
     * second element becomes the second to last, and so on.
     *
     * **Note:** This method mutates the wrapped array.
     *
     * @name reverse
     * @memberOf _
     * @category Chain
     * @returns {Object} Returns the new reversed `lodash` wrapper instance.
     * @example
     *
     * var array = [1, 2, 3];
     *
     * _(array).reverse().value()
     * // => [3, 2, 1]
     *
     * console.log(array);
     * // => [3, 2, 1]
     */function wrapperReverse(){var value=this.__wrapped__;var interceptor=function interceptor(value){return wrapped&&wrapped.__dir__<0?value:value.reverse();};if(value instanceof LazyWrapper){var wrapped=value;if(this.__actions__.length){wrapped=new LazyWrapper(this);}wrapped=wrapped.reverse();wrapped.__actions__.push({'func':thru,'args':[interceptor],'thisArg':undefined});return new LodashWrapper(wrapped,this.__chain__);}return this.thru(interceptor);}/**
     * Produces the result of coercing the unwrapped value to a string.
     *
     * @name toString
     * @memberOf _
     * @category Chain
     * @returns {string} Returns the coerced string value.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */function wrapperToString(){return this.value()+'';}/**
     * Executes the chained sequence to extract the unwrapped value.
     *
     * @name value
     * @memberOf _
     * @alias run, toJSON, valueOf
     * @category Chain
     * @returns {*} Returns the resolved unwrapped value.
     * @example
     *
     * _([1, 2, 3]).value();
     * // => [1, 2, 3]
     */function wrapperValue(){return baseWrapperValue(this.__wrapped__,this.__actions__);}/*------------------------------------------------------------------------*//**
     * Creates an array of elements corresponding to the given keys, or indexes,
     * of `collection`. Keys may be specified as individual arguments or as arrays
     * of keys.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [props] The property names
     *  or indexes of elements to pick, specified individually or in arrays.
     * @returns {Array} Returns the new array of picked elements.
     * @example
     *
     * _.at(['a', 'b', 'c'], [0, 2]);
     * // => ['a', 'c']
     *
     * _.at(['barney', 'fred', 'pebbles'], 0, 2);
     * // => ['barney', 'pebbles']
     */var at=restParam(function(collection,props){return baseAt(collection,baseFlatten(props));});/**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the number of times the key was returned by `iteratee`.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */var countBy=createAggregator(function(result,value,key){hasOwnProperty.call(result,key)?++result[key]:result[key]=1;});/**
     * Checks if `predicate` returns truthy for **all** elements of `collection`.
     * The predicate is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if all elements pass the predicate check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes'], Boolean);
     * // => false
     *
     * var users = [
     *   { 'user': 'barney', 'active': false },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.every(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.every(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.every(users, 'active');
     * // => false
     */function every(collection,predicate,thisArg){var func=isArray(collection)?arrayEvery:baseEvery;if(thisArg&&isIterateeCall(collection,predicate,thisArg)){predicate=undefined;}if(typeof predicate!='function'||thisArg!==undefined){predicate=getCallback(predicate,thisArg,3);}return func(collection,predicate);}/**
     * Iterates over elements of `collection`, returning an array of all elements
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.filter([4, 5, 6], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [4, 6]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.filter(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.filter(users, 'active'), 'user');
     * // => ['barney']
     */function filter(collection,predicate,thisArg){var func=isArray(collection)?arrayFilter:baseFilter;predicate=getCallback(predicate,thisArg,3);return func(collection,predicate);}/**
     * Iterates over elements of `collection`, returning the first element
     * `predicate` returns truthy for. The predicate is bound to `thisArg` and
     * invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': true },
     *   { 'user': 'fred',    'age': 40, 'active': false },
     *   { 'user': 'pebbles', 'age': 1,  'active': true }
     * ];
     *
     * _.result(_.find(users, function(chr) {
     *   return chr.age < 40;
     * }), 'user');
     * // => 'barney'
     *
     * // using the `_.matches` callback shorthand
     * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.result(_.find(users, 'active', false), 'user');
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.result(_.find(users, 'active'), 'user');
     * // => 'barney'
     */var find=createFind(baseEach);/**
     * This method is like `_.find` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(n) {
     *   return n % 2 == 1;
     * });
     * // => 3
     */var findLast=createFind(baseEachRight,true);/**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning the first element that has equivalent property
     * values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {*} Returns the matched element, else `undefined`.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.result(_.findWhere(users, { 'age': 36, 'active': true }), 'user');
     * // => 'barney'
     *
     * _.result(_.findWhere(users, { 'age': 40, 'active': false }), 'user');
     * // => 'fred'
     */function findWhere(collection,source){return find(collection,baseMatches(source));}/**
     * Iterates over elements of `collection` invoking `iteratee` for each element.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection). Iteratee functions may exit iteration early
     * by explicitly returning `false`.
     *
     * **Note:** As with other "Collections" methods, objects with a "length" property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEach(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from left to right and returns the array
     *
     * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
     *   console.log(n, key);
     * });
     * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
     */var forEach=createForEach(arrayEach,baseEach);/**
     * This method is like `_.forEach` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2]).forEachRight(function(n) {
     *   console.log(n);
     * }).value();
     * // => logs each value from right to left and returns the array
     */var forEachRight=createForEach(arrayEachRight,baseEachRight);/**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return Math.floor(n);
     * });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(n) {
     *   return this.floor(n);
     * }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using the `_.property` callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */var groupBy=createAggregator(function(result,value,key){if(hasOwnProperty.call(result,key)){result[key].push(value);}else{result[key]=[value];}});/**
     * Checks if `value` is in `collection` using
     * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
     * for equality comparisons. If `fromIndex` is negative, it is used as the offset
     * from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @alias contains, include
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {*} target The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {boolean} Returns `true` if a matching element is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.includes('pebbles', 'eb');
     * // => true
     */function includes(collection,target,fromIndex,guard){var length=collection?getLength(collection):0;if(!isLength(length)){collection=values(collection);length=collection.length;}if(typeof fromIndex!='number'||guard&&isIterateeCall(target,fromIndex,guard)){fromIndex=0;}else{fromIndex=fromIndex<0?nativeMax(length+fromIndex,0):fromIndex||0;}return typeof collection=='string'||!isArray(collection)&&isString(collection)?fromIndex<=length&&collection.indexOf(target,fromIndex)>-1:!!length&&getIndexOf(collection,target,fromIndex)>-1;}/**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through `iteratee`. The corresponding value
     * of each key is the last element responsible for generating the key. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keyData = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keyData, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return String.fromCharCode(object.code);
     * });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keyData, function(object) {
     *   return this.fromCharCode(object.code);
     * }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */var indexBy=createAggregator(function(result,value,key){result[key]=value;});/**
     * Invokes the method at `path` of each element in `collection`, returning
     * an array of the results of each invoked method. Any additional arguments
     * are provided to each invoked method. If `methodName` is a function it is
     * invoked for, and `this` bound to, each element in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|string} path The path of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */var invoke=restParam(function(collection,path,args){var index=-1,isFunc=typeof path=='function',isProp=isKey(path),result=isArrayLike(collection)?Array(collection.length):[];baseEach(collection,function(value){var func=isFunc?path:isProp&&value!=null?value[path]:undefined;result[++index]=func?func.apply(value,args):invokePath(value,path,args);});return result;});/**
     * Creates an array of values by running each element in `collection` through
     * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
     *
     * The guarded methods are:
     * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
     * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
     * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
     * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
     * `sum`, `uniq`, and `words`
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new mapped array.
     * @example
     *
     * function timesThree(n) {
     *   return n * 3;
     * }
     *
     * _.map([1, 2], timesThree);
     * // => [3, 6]
     *
     * _.map({ 'a': 1, 'b': 2 }, timesThree);
     * // => [3, 6] (iteration order is not guaranteed)
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.map(users, 'user');
     * // => ['barney', 'fred']
     */function map(collection,iteratee,thisArg){var func=isArray(collection)?arrayMap:baseMap;iteratee=getCallback(iteratee,thisArg,3);return func(collection,iteratee);}/**
     * Creates an array of elements split into two groups, the first of which
     * contains elements `predicate` returns truthy for, while the second of which
     * contains elements `predicate` returns falsey for. The predicate is bound
     * to `thisArg` and invoked with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the array of grouped elements.
     * @example
     *
     * _.partition([1, 2, 3], function(n) {
     *   return n % 2;
     * });
     * // => [[1, 3], [2]]
     *
     * _.partition([1.2, 2.3, 3.4], function(n) {
     *   return this.floor(n) % 2;
     * }, Math);
     * // => [[1.2, 3.4], [2.3]]
     *
     * var users = [
     *   { 'user': 'barney',  'age': 36, 'active': false },
     *   { 'user': 'fred',    'age': 40, 'active': true },
     *   { 'user': 'pebbles', 'age': 1,  'active': false }
     * ];
     *
     * var mapper = function(array) {
     *   return _.pluck(array, 'user');
     * };
     *
     * // using the `_.matches` callback shorthand
     * _.map(_.partition(users, { 'age': 1, 'active': false }), mapper);
     * // => [['pebbles'], ['barney', 'fred']]
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.map(_.partition(users, 'active', false), mapper);
     * // => [['barney', 'pebbles'], ['fred']]
     *
     * // using the `_.property` callback shorthand
     * _.map(_.partition(users, 'active'), mapper);
     * // => [['fred'], ['barney', 'pebbles']]
     */var partition=createAggregator(function(result,value,key){result[key?0:1].push(value);},function(){return[[],[]];});/**
     * Gets the property value of `path` from all elements in `collection`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|string} path The path of the property to pluck.
     * @returns {Array} Returns the property values.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(users, 'user');
     * // => ['barney', 'fred']
     *
     * var userIndex = _.indexBy(users, 'user');
     * _.pluck(userIndex, 'age');
     * // => [36, 40] (iteration order is not guaranteed)
     */function pluck(collection,path){return map(collection,property(path));}/**
     * Reduces `collection` to a value which is the accumulated result of running
     * each element in `collection` through `iteratee`, where each successive
     * invocation is supplied the return value of the previous. If `accumulator`
     * is not provided the first element of `collection` is used as the initial
     * value. The `iteratee` is bound to `thisArg` and invoked with four arguments:
     * (accumulator, value, index|key, collection).
     *
     * Many lodash methods are guarded to work as iteratees for methods like
     * `_.reduce`, `_.reduceRight`, and `_.transform`.
     *
     * The guarded methods are:
     * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `sortByAll`,
     * and `sortByOrder`
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.reduce([1, 2], function(total, n) {
     *   return total + n;
     * });
     * // => 3
     *
     * _.reduce({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6 } (iteration order is not guaranteed)
     */var reduce=createReduce(arrayReduce,baseEach);/**
     * This method is like `_.reduce` except that it iterates over elements of
     * `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var array = [[0, 1], [2, 3], [4, 5]];
     *
     * _.reduceRight(array, function(flattened, other) {
     *   return flattened.concat(other);
     * }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */var reduceRight=createReduce(arrayReduceRight,baseEachRight);/**
     * The opposite of `_.filter`; this method returns the elements of `collection`
     * that `predicate` does **not** return truthy for.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * _.reject([1, 2, 3, 4], function(n) {
     *   return n % 2 == 0;
     * });
     * // => [1, 3]
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false },
     *   { 'user': 'fred',   'age': 40, 'active': true }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.pluck(_.reject(users, { 'age': 40, 'active': true }), 'user');
     * // => ['barney']
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.pluck(_.reject(users, 'active', false), 'user');
     * // => ['fred']
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.reject(users, 'active'), 'user');
     * // => ['barney']
     */function reject(collection,predicate,thisArg){var func=isArray(collection)?arrayFilter:baseFilter;predicate=getCallback(predicate,thisArg,3);return func(collection,function(value,index,collection){return!predicate(value,index,collection);});}/**
     * Gets a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {*} Returns the random sample(s).
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */function sample(collection,n,guard){if(guard?isIterateeCall(collection,n,guard):n==null){collection=toIterable(collection);var length=collection.length;return length>0?collection[baseRandom(0,length-1)]:undefined;}var index=-1,result=toArray(collection),length=result.length,lastIndex=length-1;n=nativeMin(n<0?0:+n||0,length);while(++index<n){var rand=baseRandom(index,lastIndex),value=result[rand];result[rand]=result[index];result[index]=value;}result.length=n;return result;}/**
     * Creates an array of shuffled values, using a version of the
     * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns the new shuffled array.
     * @example
     *
     * _.shuffle([1, 2, 3, 4]);
     * // => [4, 1, 3, 2]
     */function shuffle(collection){return sample(collection,POSITIVE_INFINITY);}/**
     * Gets the size of `collection` by returning its length for array-like
     * values or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns the size of `collection`.
     * @example
     *
     * _.size([1, 2, 3]);
     * // => 3
     *
     * _.size({ 'a': 1, 'b': 2 });
     * // => 2
     *
     * _.size('pebbles');
     * // => 7
     */function size(collection){var length=collection?getLength(collection):0;return isLength(length)?length:keys(collection).length;}/**
     * Checks if `predicate` returns truthy for **any** element of `collection`.
     * The function returns as soon as it finds a passing value and does not iterate
     * over the entire collection. The predicate is bound to `thisArg` and invoked
     * with three arguments: (value, index|key, collection).
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var users = [
     *   { 'user': 'barney', 'active': true },
     *   { 'user': 'fred',   'active': false }
     * ];
     *
     * // using the `_.matches` callback shorthand
     * _.some(users, { 'user': 'barney', 'active': false });
     * // => false
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.some(users, 'active', false);
     * // => true
     *
     * // using the `_.property` callback shorthand
     * _.some(users, 'active');
     * // => true
     */function some(collection,predicate,thisArg){var func=isArray(collection)?arraySome:baseSome;if(thisArg&&isIterateeCall(collection,predicate,thisArg)){predicate=undefined;}if(typeof predicate!='function'||thisArg!==undefined){predicate=getCallback(predicate,thisArg,3);}return func(collection,predicate);}/**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through `iteratee`. This method performs
     * a stable sort, that is, it preserves the original sort order of equal elements.
     * The `iteratee` is bound to `thisArg` and invoked with three arguments:
     * (value, index|key, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return Math.sin(n);
     * });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(n) {
     *   return this.sin(n);
     * }, Math);
     * // => [3, 1, 2]
     *
     * var users = [
     *   { 'user': 'fred' },
     *   { 'user': 'pebbles' },
     *   { 'user': 'barney' }
     * ];
     *
     * // using the `_.property` callback shorthand
     * _.pluck(_.sortBy(users, 'user'), 'user');
     * // => ['barney', 'fred', 'pebbles']
     */function sortBy(collection,iteratee,thisArg){if(collection==null){return[];}if(thisArg&&isIterateeCall(collection,iteratee,thisArg)){iteratee=undefined;}var index=-1;iteratee=getCallback(iteratee,thisArg,3);var result=baseMap(collection,function(value,key,collection){return{'criteria':iteratee(value,key,collection),'index':++index,'value':value};});return baseSortBy(result,compareAscending);}/**
     * This method is like `_.sortBy` except that it can sort by multiple iteratees
     * or property names.
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(Function|Function[]|Object|Object[]|string|string[])} iteratees
     *  The iteratees to sort by, specified as individual values or arrays of values.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 34 }
     * ];
     *
     * _.map(_.sortByAll(users, ['user', 'age']), _.values);
     * // => [['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]
     *
     * _.map(_.sortByAll(users, 'user', function(chr) {
     *   return Math.floor(chr.age / 10);
     * }), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */var sortByAll=restParam(function(collection,iteratees){if(collection==null){return[];}var guard=iteratees[2];if(guard&&isIterateeCall(iteratees[0],iteratees[1],guard)){iteratees.length=1;}return baseSortByOrder(collection,baseFlatten(iteratees),[]);});/**
     * This method is like `_.sortByAll` except that it allows specifying the
     * sort orders of the iteratees to sort by. If `orders` is unspecified, all
     * values are sorted in ascending order. Otherwise, a value is sorted in
     * ascending order if its corresponding order is "asc", and descending if "desc".
     *
     * If a property name is provided for an iteratee the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If an object is provided for an iteratee the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
     * @param {boolean[]} [orders] The sort orders of `iteratees`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.reduce`.
     * @returns {Array} Returns the new sorted array.
     * @example
     *
     * var users = [
     *   { 'user': 'fred',   'age': 48 },
     *   { 'user': 'barney', 'age': 34 },
     *   { 'user': 'fred',   'age': 42 },
     *   { 'user': 'barney', 'age': 36 }
     * ];
     *
     * // sort by `user` in ascending order and by `age` in descending order
     * _.map(_.sortByOrder(users, ['user', 'age'], ['asc', 'desc']), _.values);
     * // => [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
     */function sortByOrder(collection,iteratees,orders,guard){if(collection==null){return[];}if(guard&&isIterateeCall(iteratees,orders,guard)){orders=undefined;}if(!isArray(iteratees)){iteratees=iteratees==null?[]:[iteratees];}if(!isArray(orders)){orders=orders==null?[]:[orders];}return baseSortByOrder(collection,iteratees,orders);}/**
     * Performs a deep comparison between each element in `collection` and the
     * source object, returning an array of all elements that have equivalent
     * property values.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Collection
     * @param {Array|Object|string} collection The collection to search.
     * @param {Object} source The object of property values to match.
     * @returns {Array} Returns the new filtered array.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': false, 'pets': ['hoppy'] },
     *   { 'user': 'fred',   'age': 40, 'active': true, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.pluck(_.where(users, { 'age': 36, 'active': false }), 'user');
     * // => ['barney']
     *
     * _.pluck(_.where(users, { 'pets': ['dino'] }), 'user');
     * // => ['fred']
     */function where(collection,source){return filter(collection,baseMatches(source));}/*------------------------------------------------------------------------*//**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Date
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => logs the number of milliseconds it took for the deferred function to be invoked
     */var now=nativeNow||function(){return new Date().getTime();};/*------------------------------------------------------------------------*//**
     * The opposite of `_.before`; this method creates a function that invokes
     * `func` once it is called `n` or more times.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls before `func` is invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'done saving!' after the two async saves have completed
     */function after(n,func){if(typeof func!='function'){if(typeof n=='function'){var temp=n;n=func;func=temp;}else{throw new TypeError(FUNC_ERROR_TEXT);}}n=nativeIsFinite(n=+n)?n:0;return function(){if(--n<1){return func.apply(this,arguments);}};}/**
     * Creates a function that accepts up to `n` arguments ignoring any
     * additional arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to cap arguments for.
     * @param {number} [n=func.length] The arity cap.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new function.
     * @example
     *
     * _.map(['6', '8', '10'], _.ary(parseInt, 1));
     * // => [6, 8, 10]
     */function ary(func,n,guard){if(guard&&isIterateeCall(func,n,guard)){n=undefined;}n=func&&n==null?func.length:nativeMax(+n||0,0);return createWrapper(func,ARY_FLAG,undefined,undefined,undefined,undefined,n);}/**
     * Creates a function that invokes `func`, with the `this` binding and arguments
     * of the created function, while it is called less than `n` times. Subsequent
     * calls to the created function return the result of the last `func` invocation.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {number} n The number of calls at which `func` is no longer invoked.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * jQuery('#add').on('click', _.before(5, addContactToList));
     * // => allows adding up to 4 contacts to the list
     */function before(n,func){var result;if(typeof func!='function'){if(typeof n=='function'){var temp=n;n=func;func=temp;}else{throw new TypeError(FUNC_ERROR_TEXT);}}return function(){if(--n>0){result=func.apply(this,arguments);}if(n<=1){func=undefined;}return result;};}/**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and prepends any additional `_.bind` arguments to those provided to the
     * bound function.
     *
     * The `_.bind.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for partially applied arguments.
     *
     * **Note:** Unlike native `Function#bind` this method does not set the "length"
     * property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to bind.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var greet = function(greeting, punctuation) {
     *   return greeting + ' ' + this.user + punctuation;
     * };
     *
     * var object = { 'user': 'fred' };
     *
     * var bound = _.bind(greet, object, 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * // using placeholders
     * var bound = _.bind(greet, object, _, '!');
     * bound('hi');
     * // => 'hi fred!'
     */var bind=restParam(function(func,thisArg,partials){var bitmask=BIND_FLAG;if(partials.length){var holders=replaceHolders(partials,bind.placeholder);bitmask|=PARTIAL_FLAG;}return createWrapper(func,bitmask,thisArg,partials,holders);});/**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all enumerable function
     * properties, own and inherited, of `object` are bound.
     *
     * **Note:** This method does not set the "length" property of bound functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...(string|string[])} [methodNames] The object method names to bind,
     *  specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() {
     *     console.log('clicked ' + this.label);
     *   }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs' when the element is clicked
     */var bindAll=restParam(function(object,methodNames){methodNames=methodNames.length?baseFlatten(methodNames):functions(object);var index=-1,length=methodNames.length;while(++index<length){var key=methodNames[index];object[key]=createWrapper(object[key],BIND_FLAG,object);}return object;});/**
     * Creates a function that invokes the method at `object[key]` and prepends
     * any additional `_.bindKey` arguments to those provided to the bound function.
     *
     * This method differs from `_.bind` by allowing bound functions to reference
     * methods that may be redefined or don't yet exist.
     * See [Peter Michaux's article](http://peter.michaux.ca/articles/lazy-function-definition-pattern)
     * for more details.
     *
     * The `_.bindKey.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'user': 'fred',
     *   'greet': function(greeting, punctuation) {
     *     return greeting + ' ' + this.user + punctuation;
     *   }
     * };
     *
     * var bound = _.bindKey(object, 'greet', 'hi');
     * bound('!');
     * // => 'hi fred!'
     *
     * object.greet = function(greeting, punctuation) {
     *   return greeting + 'ya ' + this.user + punctuation;
     * };
     *
     * bound('!');
     * // => 'hiya fred!'
     *
     * // using placeholders
     * var bound = _.bindKey(object, 'greet', _, '!');
     * bound('hi');
     * // => 'hiya fred!'
     */var bindKey=restParam(function(object,key,partials){var bitmask=BIND_FLAG|BIND_KEY_FLAG;if(partials.length){var holders=replaceHolders(partials,bindKey.placeholder);bitmask|=PARTIAL_FLAG;}return createWrapper(key,bitmask,object,partials,holders);});/**
     * Creates a function that accepts one or more arguments of `func` that when
     * called either invokes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` may be specified
     * if `func.length` is not sufficient.
     *
     * The `_.curry.placeholder` value, which defaults to `_` in monolithic builds,
     * may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curry(abc);
     *
     * curried(1)(2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2)(3);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(1)(_, 3)(2);
     * // => [1, 2, 3]
     */var curry=createCurry(CURRY_FLAG);/**
     * This method is like `_.curry` except that arguments are applied to `func`
     * in the manner of `_.partialRight` instead of `_.partial`.
     *
     * The `_.curryRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for provided arguments.
     *
     * **Note:** This method does not set the "length" property of curried functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var abc = function(a, b, c) {
     *   return [a, b, c];
     * };
     *
     * var curried = _.curryRight(abc);
     *
     * curried(3)(2)(1);
     * // => [1, 2, 3]
     *
     * curried(2, 3)(1);
     * // => [1, 2, 3]
     *
     * curried(1, 2, 3);
     * // => [1, 2, 3]
     *
     * // using placeholders
     * curried(3)(1, _)(2);
     * // => [1, 2, 3]
     */var curryRight=createCurry(CURRY_RIGHT_FLAG);/**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed invocations. Provide an options object to indicate that `func`
     * should be invoked on the leading and/or trailing edge of the `wait` timeout.
     * Subsequent calls to the debounced function return the result of the last
     * `func` invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify invoking on the leading
     *  edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be
     *  delayed before it is invoked.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // ensure `batchLog` is invoked once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }));
     *
     * // cancel a debounced call
     * var todoChanges = _.debounce(batchLog, 1000);
     * Object.observe(models.todo, todoChanges);
     *
     * Object.observe(models, function(changes) {
     *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
     *     todoChanges.cancel();
     *   }
     * }, ['delete']);
     *
     * // ...at some point `models.todo` is changed
     * models.todo.completed = true;
     *
     * // ...before 1 second has passed `models.todo` is deleted
     * // which cancels the debounced `todoChanges` call
     * delete models.todo;
     */function debounce(func,wait,options){var args,maxTimeoutId,result,stamp,thisArg,timeoutId,trailingCall,lastCalled=0,maxWait=false,trailing=true;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}wait=wait<0?0:+wait||0;if(options===true){var leading=true;trailing=false;}else if(isObject(options)){leading=!!options.leading;maxWait='maxWait'in options&&nativeMax(+options.maxWait||0,wait);trailing='trailing'in options?!!options.trailing:trailing;}function cancel(){if(timeoutId){clearTimeout(timeoutId);}if(maxTimeoutId){clearTimeout(maxTimeoutId);}lastCalled=0;maxTimeoutId=timeoutId=trailingCall=undefined;}function complete(isCalled,id){if(id){clearTimeout(id);}maxTimeoutId=timeoutId=trailingCall=undefined;if(isCalled){lastCalled=now();result=func.apply(thisArg,args);if(!timeoutId&&!maxTimeoutId){args=thisArg=undefined;}}}function delayed(){var remaining=wait-(now()-stamp);if(remaining<=0||remaining>wait){complete(trailingCall,maxTimeoutId);}else{timeoutId=setTimeout(delayed,remaining);}}function maxDelayed(){complete(trailing,timeoutId);}function debounced(){args=arguments;stamp=now();thisArg=this;trailingCall=trailing&&(timeoutId||!leading);if(maxWait===false){var leadingCall=leading&&!timeoutId;}else{if(!maxTimeoutId&&!leading){lastCalled=stamp;}var remaining=maxWait-(stamp-lastCalled),isCalled=remaining<=0||remaining>maxWait;if(isCalled){if(maxTimeoutId){maxTimeoutId=clearTimeout(maxTimeoutId);}lastCalled=stamp;result=func.apply(thisArg,args);}else if(!maxTimeoutId){maxTimeoutId=setTimeout(maxDelayed,remaining);}}if(isCalled&&timeoutId){timeoutId=clearTimeout(timeoutId);}else if(!timeoutId&&wait!==maxWait){timeoutId=setTimeout(delayed,wait);}if(leadingCall){isCalled=true;result=func.apply(thisArg,args);}if(isCalled&&!timeoutId&&!maxTimeoutId){args=thisArg=undefined;}return result;}debounced.cancel=cancel;return debounced;}/**
     * Defers invoking the `func` until the current call stack has cleared. Any
     * additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to defer.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) {
     *   console.log(text);
     * }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */var defer=restParam(function(func,args){return baseDelay(func,1,args);});/**
     * Invokes `func` after `wait` milliseconds. Any additional arguments are
     * provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay invocation.
     * @param {...*} [args] The arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) {
     *   console.log(text);
     * }, 1000, 'later');
     * // => logs 'later' after one second
     */var delay=restParam(function(func,wait,args){return baseDelay(func,wait,args);});/**
     * Creates a function that returns the result of invoking the provided
     * functions with the `this` binding of the created function, where each
     * successive invocation is supplied the return value of the previous.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flow(_.add, square);
     * addSquare(1, 2);
     * // => 9
     */var flow=createFlow();/**
     * This method is like `_.flow` except that it creates a function that
     * invokes the provided functions from right to left.
     *
     * @static
     * @memberOf _
     * @alias backflow, compose
     * @category Function
     * @param {...Function} [funcs] Functions to invoke.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var addSquare = _.flowRight(square, _.add);
     * addSquare(1, 2);
     * // => 9
     */var flowRight=createFlow(true);/**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is coerced to a string and used as the
     * cache key. The `func` is invoked with the `this` binding of the memoized
     * function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var upperCase = _.memoize(function(string) {
     *   return string.toUpperCase();
     * });
     *
     * upperCase('fred');
     * // => 'FRED'
     *
     * // modifying the result cache
     * upperCase.cache.set('fred', 'BARNEY');
     * upperCase('fred');
     * // => 'BARNEY'
     *
     * // replacing `_.memoize.Cache`
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'barney' };
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'fred' }
     *
     * _.memoize.Cache = WeakMap;
     * var identity = _.memoize(_.identity);
     *
     * identity(object);
     * // => { 'user': 'fred' }
     * identity(other);
     * // => { 'user': 'barney' }
     */function memoize(func,resolver){if(typeof func!='function'||resolver&&typeof resolver!='function'){throw new TypeError(FUNC_ERROR_TEXT);}var memoized=function memoized(){var args=arguments,key=resolver?resolver.apply(this,args):args[0],cache=memoized.cache;if(cache.has(key)){return cache.get(key);}var result=func.apply(this,args);memoized.cache=cache.set(key,result);return result;};memoized.cache=new memoize.Cache();return memoized;}/**
     * Creates a function that runs each argument through a corresponding
     * transform function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to wrap.
     * @param {...(Function|Function[])} [transforms] The functions to transform
     * arguments, specified as individual functions or arrays of functions.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function doubled(n) {
     *   return n * 2;
     * }
     *
     * function square(n) {
     *   return n * n;
     * }
     *
     * var modded = _.modArgs(function(x, y) {
     *   return [x, y];
     * }, square, doubled);
     *
     * modded(1, 2);
     * // => [1, 4]
     *
     * modded(5, 10);
     * // => [25, 20]
     */var modArgs=restParam(function(func,transforms){transforms=baseFlatten(transforms);if(typeof func!='function'||!arrayEvery(transforms,baseIsFunction)){throw new TypeError(FUNC_ERROR_TEXT);}var length=transforms.length;return restParam(function(args){var index=nativeMin(args.length,length);while(index--){args[index]=transforms[index](args[index]);}return func.apply(this,args);});});/**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0;
     * }
     *
     * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
     * // => [1, 3, 5]
     */function negate(predicate){if(typeof predicate!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return function(){return!predicate.apply(this,arguments);};}/**
     * Creates a function that is restricted to invoking `func` once. Repeat calls
     * to the function return the value of the first call. The `func` is invoked
     * with the `this` binding and arguments of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` invokes `createApplication` once
     */function once(func){return before(2,func);}/**
     * Creates a function that invokes `func` with `partial` arguments prepended
     * to those provided to the new function. This method is like `_.bind` except
     * it does **not** alter the `this` binding.
     *
     * The `_.partial.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var sayHelloTo = _.partial(greet, 'hello');
     * sayHelloTo('fred');
     * // => 'hello fred'
     *
     * // using placeholders
     * var greetFred = _.partial(greet, _, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     */var partial=createPartial(PARTIAL_FLAG);/**
     * This method is like `_.partial` except that partially applied arguments
     * are appended to those provided to the new function.
     *
     * The `_.partialRight.placeholder` value, which defaults to `_` in monolithic
     * builds, may be used as a placeholder for partially applied arguments.
     *
     * **Note:** This method does not set the "length" property of partially
     * applied functions.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [partials] The arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) {
     *   return greeting + ' ' + name;
     * };
     *
     * var greetFred = _.partialRight(greet, 'fred');
     * greetFred('hi');
     * // => 'hi fred'
     *
     * // using placeholders
     * var sayHelloTo = _.partialRight(greet, 'hello', _);
     * sayHelloTo('fred');
     * // => 'hello fred'
     */var partialRight=createPartial(PARTIAL_RIGHT_FLAG);/**
     * Creates a function that invokes `func` with arguments arranged according
     * to the specified indexes where the argument value at the first index is
     * provided as the first argument, the argument value at the second index is
     * provided as the second argument, and so on.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to rearrange arguments for.
     * @param {...(number|number[])} indexes The arranged argument indexes,
     *  specified as individual indexes or arrays of indexes.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var rearged = _.rearg(function(a, b, c) {
     *   return [a, b, c];
     * }, 2, 0, 1);
     *
     * rearged('b', 'c', 'a')
     * // => ['a', 'b', 'c']
     *
     * var map = _.rearg(_.map, [1, 0]);
     * map(function(n) {
     *   return n * 3;
     * }, [1, 2, 3]);
     * // => [3, 6, 9]
     */var rearg=restParam(function(func,indexes){return createWrapper(func,REARG_FLAG,undefined,undefined,undefined,baseFlatten(indexes));});/**
     * Creates a function that invokes `func` with the `this` binding of the
     * created function and arguments from `start` and beyond provided as an array.
     *
     * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.restParam(function(what, names) {
     *   return what + ' ' + _.initial(names).join(', ') +
     *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
     * });
     *
     * say('hello', 'fred', 'barney', 'pebbles');
     * // => 'hello fred, barney, & pebbles'
     */function restParam(func,start){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}start=nativeMax(start===undefined?func.length-1:+start||0,0);return function(){var args=arguments,index=-1,length=nativeMax(args.length-start,0),rest=Array(length);while(++index<length){rest[index]=args[start+index];}switch(start){case 0:return func.call(this,rest);case 1:return func.call(this,args[0],rest);case 2:return func.call(this,args[0],args[1],rest);}var otherArgs=Array(start+1);index=-1;while(++index<start){otherArgs[index]=args[index];}otherArgs[start]=rest;return func.apply(this,otherArgs);};}/**
     * Creates a function that invokes `func` with the `this` binding of the created
     * function and an array of arguments much like [`Function#apply`](https://es5.github.io/#x15.3.4.3).
     *
     * **Note:** This method is based on the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator).
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to spread arguments over.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var say = _.spread(function(who, what) {
     *   return who + ' says ' + what;
     * });
     *
     * say(['fred', 'hello']);
     * // => 'fred says hello'
     *
     * // with a Promise
     * var numbers = Promise.all([
     *   Promise.resolve(40),
     *   Promise.resolve(36)
     * ]);
     *
     * numbers.then(_.spread(function(x, y) {
     *   return x + y;
     * }));
     * // => a Promise of 76
     */function spread(func){if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}return function(array){return func.apply(this,array);};}/**
     * Creates a throttled function that only invokes `func` at most once per
     * every `wait` milliseconds. The throttled function comes with a `cancel`
     * method to cancel delayed invocations. Provide an options object to indicate
     * that `func` should be invoked on the leading and/or trailing edge of the
     * `wait` timeout. Subsequent calls to the throttled function return the
     * result of the last `func` call.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
     * for details over the differences between `_.throttle` and `_.debounce`.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {Function} func The function to throttle.
     * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify invoking on the leading
     *  edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify invoking on the trailing
     *  edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
     *
     * // invoke `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     *
     * // cancel a trailing throttled call
     * jQuery(window).on('popstate', throttled.cancel);
     */function throttle(func,wait,options){var leading=true,trailing=true;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}if(options===false){leading=false;}else if(isObject(options)){leading='leading'in options?!!options.leading:leading;trailing='trailing'in options?!!options.trailing:trailing;}return debounce(func,wait,{'leading':leading,'maxWait':+wait,'trailing':trailing});}/**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Any additional arguments provided to the function are
     * appended to those provided to the wrapper function. The wrapper is invoked
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Function
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('fred, barney, & pebbles');
     * // => '<p>fred, barney, &amp; pebbles</p>'
     */function wrap(value,wrapper){wrapper=wrapper==null?identity:wrapper;return createWrapper(wrapper,PARTIAL_FLAG,undefined,[value],[]);}/*------------------------------------------------------------------------*//**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
     * otherwise they are assigned by reference. If `customizer` is provided it is
     * invoked to produce the cloned values. If `customizer` returns `undefined`
     * cloning is handled by the method instead. The `customizer` is bound to
     * `thisArg` and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var shallow = _.clone(users);
     * shallow[0] === users[0];
     * // => true
     *
     * var deep = _.clone(users, true);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.clone(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(false);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 0
     */function clone(value,isDeep,customizer,thisArg){if(isDeep&&typeof isDeep!='boolean'&&isIterateeCall(value,isDeep,customizer)){isDeep=false;}else if(typeof isDeep=='function'){thisArg=customizer;customizer=isDeep;isDeep=false;}return typeof customizer=='function'?baseClone(value,isDeep,bindCallback(customizer,thisArg,1)):baseClone(value,isDeep);}/**
     * Creates a deep clone of `value`. If `customizer` is provided it is invoked
     * to produce the cloned values. If `customizer` returns `undefined` cloning
     * is handled by the method instead. The `customizer` is bound to `thisArg`
     * and invoked with two argument; (value [, index|key, object]).
     *
     * **Note:** This method is loosely based on the
     * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
     * The enumerable properties of `arguments` objects and objects created by
     * constructors other than `Object` are cloned to plain `Object` objects. An
     * empty object is returned for uncloneable values such as functions, DOM nodes,
     * Maps, Sets, and WeakMaps.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to deep clone.
     * @param {Function} [customizer] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * var deep = _.cloneDeep(users);
     * deep[0] === users[0];
     * // => false
     *
     * // using a customizer callback
     * var el = _.cloneDeep(document.body, function(value) {
     *   if (_.isElement(value)) {
     *     return value.cloneNode(true);
     *   }
     * });
     *
     * el === document.body
     * // => false
     * el.nodeName
     * // => BODY
     * el.childNodes.length;
     * // => 20
     */function cloneDeep(value,customizer,thisArg){return typeof customizer=='function'?baseClone(value,true,bindCallback(customizer,thisArg,1)):baseClone(value,true);}/**
     * Checks if `value` is greater than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than `other`, else `false`.
     * @example
     *
     * _.gt(3, 1);
     * // => true
     *
     * _.gt(3, 3);
     * // => false
     *
     * _.gt(1, 3);
     * // => false
     */function gt(value,other){return value>other;}/**
     * Checks if `value` is greater than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is greater than or equal to `other`, else `false`.
     * @example
     *
     * _.gte(3, 1);
     * // => true
     *
     * _.gte(3, 3);
     * // => true
     *
     * _.gte(1, 3);
     * // => false
     */function gte(value,other){return value>=other;}/**
     * Checks if `value` is classified as an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */function isArguments(value){return isObjectLike(value)&&isArrayLike(value)&&hasOwnProperty.call(value,'callee')&&!propertyIsEnumerable.call(value,'callee');}/**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(function() { return arguments; }());
     * // => false
     */var isArray=nativeIsArray||function(value){return isObjectLike(value)&&isLength(value.length)&&objToString.call(value)==arrayTag;};/**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isBoolean(false);
     * // => true
     *
     * _.isBoolean(null);
     * // => false
     */function isBoolean(value){return value===true||value===false||isObjectLike(value)&&objToString.call(value)==boolTag;}/**
     * Checks if `value` is classified as a `Date` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     *
     * _.isDate('Mon April 23 2012');
     * // => false
     */function isDate(value){return isObjectLike(value)&&objToString.call(value)==dateTag;}/**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     *
     * _.isElement('<body>');
     * // => false
     */function isElement(value){return!!value&&value.nodeType===1&&isObjectLike(value)&&!isPlainObject(value);}/**
     * Checks if `value` is empty. A value is considered empty unless it is an
     * `arguments` object, array, string, or jQuery-like collection with a length
     * greater than `0` or an object with own enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty(null);
     * // => true
     *
     * _.isEmpty(true);
     * // => true
     *
     * _.isEmpty(1);
     * // => true
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({ 'a': 1 });
     * // => false
     */function isEmpty(value){if(value==null){return true;}if(isArrayLike(value)&&(isArray(value)||isString(value)||isArguments(value)||isObjectLike(value)&&isFunction(value.splice))){return!value.length;}return!keys(value).length;}/**
     * Performs a deep comparison between two values to determine if they are
     * equivalent. If `customizer` is provided it is invoked to compare values.
     * If `customizer` returns `undefined` comparisons are handled by the method
     * instead. The `customizer` is bound to `thisArg` and invoked with three
     * arguments: (value, other [, index|key]).
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. Functions and DOM nodes
     * are **not** supported. Provide a customizer function to extend support
     * for comparing other values.
     *
     * @static
     * @memberOf _
     * @alias eq
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var other = { 'user': 'fred' };
     *
     * object == other;
     * // => false
     *
     * _.isEqual(object, other);
     * // => true
     *
     * // using a customizer callback
     * var array = ['hello', 'goodbye'];
     * var other = ['hi', 'goodbye'];
     *
     * _.isEqual(array, other, function(value, other) {
     *   if (_.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/)) {
     *     return true;
     *   }
     * });
     * // => true
     */function isEqual(value,other,customizer,thisArg){customizer=typeof customizer=='function'?bindCallback(customizer,thisArg,3):undefined;var result=customizer?customizer(value,other):undefined;return result===undefined?baseIsEqual(value,other,customizer):!!result;}/**
     * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
     * `SyntaxError`, `TypeError`, or `URIError` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
     * @example
     *
     * _.isError(new Error);
     * // => true
     *
     * _.isError(Error);
     * // => false
     */function isError(value){return isObjectLike(value)&&typeof value.message=='string'&&objToString.call(value)==errorTag;}/**
     * Checks if `value` is a finite primitive number.
     *
     * **Note:** This method is based on [`Number.isFinite`](http://ecma-international.org/ecma-262/6.0/#sec-number.isfinite).
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a finite number, else `false`.
     * @example
     *
     * _.isFinite(10);
     * // => true
     *
     * _.isFinite('10');
     * // => false
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite(Object(10));
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */function isFinite(value){return typeof value=='number'&&nativeIsFinite(value);}/**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */function isFunction(value){// The use of `Object#toString` avoids issues with the `typeof` operator
// in older versions of Chrome and Safari which return 'function' for regexes
// and Safari 8 equivalents which return 'object' for typed array constructors.
return isObject(value)&&objToString.call(value)==funcTag;}/**
     * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */function isObject(value){// Avoid a V8 JIT bug in Chrome 19-20.
// See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
var type=typeof value==="undefined"?"undefined":_typeof(value);return!!value&&(type=='object'||type=='function');}/**
     * Performs a deep comparison between `object` and `source` to determine if
     * `object` contains equivalent property values. If `customizer` is provided
     * it is invoked to compare values. If `customizer` returns `undefined`
     * comparisons are handled by the method instead. The `customizer` is bound
     * to `thisArg` and invoked with three arguments: (value, other, index|key).
     *
     * **Note:** This method supports comparing properties of arrays, booleans,
     * `Date` objects, numbers, `Object` objects, regexes, and strings. Functions
     * and DOM nodes are **not** supported. Provide a customizer function to extend
     * support for comparing other values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Function} [customizer] The function to customize value comparisons.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.isMatch(object, { 'age': 40 });
     * // => true
     *
     * _.isMatch(object, { 'age': 36 });
     * // => false
     *
     * // using a customizer callback
     * var object = { 'greeting': 'hello' };
     * var source = { 'greeting': 'hi' };
     *
     * _.isMatch(object, source, function(value, other) {
     *   return _.every([value, other], RegExp.prototype.test, /^h(?:i|ello)$/) || undefined;
     * });
     * // => true
     */function isMatch(object,source,customizer,thisArg){customizer=typeof customizer=='function'?bindCallback(customizer,thisArg,3):undefined;return baseIsMatch(object,getMatchData(source),customizer);}/**
     * Checks if `value` is `NaN`.
     *
     * **Note:** This method is not the same as [`isNaN`](https://es5.github.io/#x15.1.2.4)
     * which returns `true` for `undefined` and other non-numeric values.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */function isNaN(value){// An `NaN` primitive is the only value that is not equal to itself.
// Perform the `toStringTag` check first to avoid errors with some host objects in IE.
return isNumber(value)&&value!=+value;}/**
     * Checks if `value` is a native function.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
     * @example
     *
     * _.isNative(Array.prototype.push);
     * // => true
     *
     * _.isNative(_);
     * // => false
     */function isNative(value){if(value==null){return false;}if(isFunction(value)){return reIsNative.test(fnToString.call(value));}return isObjectLike(value)&&reIsHostCtor.test(value);}/**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(void 0);
     * // => false
     */function isNull(value){return value===null;}/**
     * Checks if `value` is classified as a `Number` primitive or object.
     *
     * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
     * as numbers, use the `_.isFinite` method.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isNumber(8.4);
     * // => true
     *
     * _.isNumber(NaN);
     * // => true
     *
     * _.isNumber('8.4');
     * // => false
     */function isNumber(value){return typeof value=='number'||isObjectLike(value)&&objToString.call(value)==numberTag;}/**
     * Checks if `value` is a plain object, that is, an object created by the
     * `Object` constructor or one with a `[[Prototype]]` of `null`.
     *
     * **Note:** This method assumes objects created by the `Object` constructor
     * have no inherited enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     * }
     *
     * _.isPlainObject(new Foo);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     *
     * _.isPlainObject(Object.create(null));
     * // => true
     */function isPlainObject(value){var Ctor;// Exit early for non `Object` objects.
if(!(isObjectLike(value)&&objToString.call(value)==objectTag&&!isArguments(value))||!hasOwnProperty.call(value,'constructor')&&(Ctor=value.constructor,typeof Ctor=='function'&&!(Ctor instanceof Ctor))){return false;}// IE < 9 iterates inherited properties before own properties. If the first
// iterated property is an object's own property then there are no inherited
// enumerable properties.
var result;// In most environments an object's own properties are iterated before
// its inherited properties. If the last iterated property is an object's
// own property then there are no inherited enumerable properties.
baseForIn(value,function(subValue,key){result=key;});return result===undefined||hasOwnProperty.call(value,result);}/**
     * Checks if `value` is classified as a `RegExp` object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isRegExp(/abc/);
     * // => true
     *
     * _.isRegExp('/abc/');
     * // => false
     */function isRegExp(value){return isObject(value)&&objToString.call(value)==regexpTag;}/**
     * Checks if `value` is classified as a `String` primitive or object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isString('abc');
     * // => true
     *
     * _.isString(1);
     * // => false
     */function isString(value){return typeof value=='string'||isObjectLike(value)&&objToString.call(value)==stringTag;}/**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */function isTypedArray(value){return isObjectLike(value)&&isLength(value.length)&&!!typedArrayTags[objToString.call(value)];}/**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     *
     * _.isUndefined(null);
     * // => false
     */function isUndefined(value){return value===undefined;}/**
     * Checks if `value` is less than `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than `other`, else `false`.
     * @example
     *
     * _.lt(1, 3);
     * // => true
     *
     * _.lt(3, 3);
     * // => false
     *
     * _.lt(3, 1);
     * // => false
     */function lt(value,other){return value<other;}/**
     * Checks if `value` is less than or equal to `other`.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if `value` is less than or equal to `other`, else `false`.
     * @example
     *
     * _.lte(1, 3);
     * // => true
     *
     * _.lte(3, 3);
     * // => true
     *
     * _.lte(3, 1);
     * // => false
     */function lte(value,other){return value<=other;}/**
     * Converts `value` to an array.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Array} Returns the converted array.
     * @example
     *
     * (function() {
     *   return _.toArray(arguments).slice(1);
     * }(1, 2, 3));
     * // => [2, 3]
     */function toArray(value){var length=value?getLength(value):0;if(!isLength(length)){return values(value);}if(!length){return[];}return arrayCopy(value);}/**
     * Converts `value` to a plain object flattening inherited enumerable
     * properties of `value` to own properties of the plain object.
     *
     * @static
     * @memberOf _
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {Object} Returns the converted plain object.
     * @example
     *
     * function Foo() {
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.assign({ 'a': 1 }, new Foo);
     * // => { 'a': 1, 'b': 2 }
     *
     * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
     * // => { 'a': 1, 'b': 2, 'c': 3 }
     */function toPlainObject(value){return baseCopy(value,keysIn(value));}/*------------------------------------------------------------------------*//**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * overwrite property assignments of previous sources. If `customizer` is
     * provided it is invoked to produce the merged values of the destination and
     * source properties. If `customizer` returns `undefined` merging is handled
     * by the method instead. The `customizer` is bound to `thisArg` and invoked
     * with five arguments: (objectValue, sourceValue, key, object, source).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var users = {
     *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
     * };
     *
     * var ages = {
     *   'data': [{ 'age': 36 }, { 'age': 40 }]
     * };
     *
     * _.merge(users, ages);
     * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
     *
     * // using a customizer callback
     * var object = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var other = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(object, other, function(a, b) {
     *   if (_.isArray(a)) {
     *     return a.concat(b);
     *   }
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
     */var merge=createAssigner(baseMerge);/**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources overwrite property assignments of previous sources.
     * If `customizer` is provided it is invoked to produce the assigned values.
     * The `customizer` is bound to `thisArg` and invoked with five arguments:
     * (objectValue, sourceValue, key, object, source).
     *
     * **Note:** This method mutates `object` and is based on
     * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
     *
     * @static
     * @memberOf _
     * @alias extend
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @param {Function} [customizer] The function to customize assigned values.
     * @param {*} [thisArg] The `this` binding of `customizer`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using a customizer callback
     * var defaults = _.partialRight(_.assign, function(value, other) {
     *   return _.isUndefined(value) ? other : value;
     * });
     *
     * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */var assign=createAssigner(function(object,source,customizer){return customizer?assignWith(object,source,customizer):baseAssign(object,source);});/**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, {
     *   'constructor': Circle
     * });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */function create(prototype,properties,guard){var result=baseCreate(prototype);if(guard&&isIterateeCall(prototype,properties,guard)){properties=undefined;}return properties?baseAssign(result,properties):result;}/**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional values of the same property are ignored.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
     * // => { 'user': 'barney', 'age': 36 }
     */var defaults=createDefaults(assign,assignDefaults);/**
     * This method is like `_.defaults` except that it recursively assigns
     * default properties.
     *
     * **Note:** This method mutates `object`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The destination object.
     * @param {...Object} [sources] The source objects.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
     * // => { 'user': { 'name': 'barney', 'age': 36 } }
     *
     */var defaultsDeep=createDefaults(merge,mergeDefaults);/**
     * This method is like `_.find` except that it returns the key of the first
     * element `predicate` returns truthy for instead of the element itself.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (iteration order is not guaranteed)
     *
     * // using the `_.matches` callback shorthand
     * _.findKey(users, { 'age': 1, 'active': true });
     * // => 'pebbles'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findKey(users, 'active');
     * // => 'barney'
     */var findKey=createFindKey(baseForOwn);/**
     * This method is like `_.findKey` except that it iterates over elements of
     * a collection in the opposite order.
     *
     * If a property name is provided for `predicate` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `predicate` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [predicate=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {string|undefined} Returns the key of the matched element, else `undefined`.
     * @example
     *
     * var users = {
     *   'barney':  { 'age': 36, 'active': true },
     *   'fred':    { 'age': 40, 'active': false },
     *   'pebbles': { 'age': 1,  'active': true }
     * };
     *
     * _.findLastKey(users, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles` assuming `_.findKey` returns `barney`
     *
     * // using the `_.matches` callback shorthand
     * _.findLastKey(users, { 'age': 36, 'active': true });
     * // => 'barney'
     *
     * // using the `_.matchesProperty` callback shorthand
     * _.findLastKey(users, 'active', false);
     * // => 'fred'
     *
     * // using the `_.property` callback shorthand
     * _.findLastKey(users, 'active');
     * // => 'pebbles'
     */var findLastKey=createFindKey(baseForOwnRight);/**
     * Iterates over own and inherited enumerable properties of an object invoking
     * `iteratee` for each property. The `iteratee` is bound to `thisArg` and invoked
     * with three arguments: (value, key, object). Iteratee functions may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forIn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a', 'b', and 'c' (iteration order is not guaranteed)
     */var forIn=createForIn(baseFor);/**
     * This method is like `_.forIn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forInRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'c', 'b', and 'a' assuming `_.forIn ` logs 'a', 'b', and 'c'
     */var forInRight=createForIn(baseForRight);/**
     * Iterates over own enumerable properties of an object invoking `iteratee`
     * for each property. The `iteratee` is bound to `thisArg` and invoked with
     * three arguments: (value, key, object). Iteratee functions may exit iteration
     * early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwn(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'a' and 'b' (iteration order is not guaranteed)
     */var forOwn=createForOwn(baseForOwn);/**
     * This method is like `_.forOwn` except that it iterates over properties of
     * `object` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.forOwnRight(new Foo, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'b' and 'a' assuming `_.forOwn` logs 'a' and 'b'
     */var forOwnRight=createForOwn(baseForOwnRight);/**
     * Creates an array of function property names from all enumerable properties,
     * own and inherited, of `object`.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Object
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns the new array of property names.
     * @example
     *
     * _.functions(_);
     * // => ['after', 'ary', 'assign', ...]
     */function functions(object){return baseFunctions(object,keysIn(object));}/**
     * Gets the property value at `path` of `object`. If the resolved value is
     * `undefined` the `defaultValue` is used in its place.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */function get(object,path,defaultValue){var result=object==null?undefined:baseGet(object,toPath(path),path+'');return result===undefined?defaultValue:result;}/**
     * Checks if `path` is a direct property.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` is a direct property, else `false`.
     * @example
     *
     * var object = { 'a': { 'b': { 'c': 3 } } };
     *
     * _.has(object, 'a');
     * // => true
     *
     * _.has(object, 'a.b.c');
     * // => true
     *
     * _.has(object, ['a', 'b', 'c']);
     * // => true
     */function has(object,path){if(object==null){return false;}var result=hasOwnProperty.call(object,path);if(!result&&!isKey(path)){path=toPath(path);object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));if(object==null){return false;}path=last(path);result=hasOwnProperty.call(object,path);}return result||isLength(object.length)&&isIndex(path,object.length)&&(isArray(object)||isArguments(object));}/**
     * Creates an object composed of the inverted keys and values of `object`.
     * If `object` contains duplicate values, subsequent values overwrite property
     * assignments of previous values unless `multiValue` is `true`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to invert.
     * @param {boolean} [multiValue] Allow multiple values per key.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Object} Returns the new inverted object.
     * @example
     *
     * var object = { 'a': 1, 'b': 2, 'c': 1 };
     *
     * _.invert(object);
     * // => { '1': 'c', '2': 'b' }
     *
     * // with `multiValue`
     * _.invert(object, true);
     * // => { '1': ['a', 'c'], '2': ['b'] }
     */function invert(object,multiValue,guard){if(guard&&isIterateeCall(object,multiValue,guard)){multiValue=undefined;}var index=-1,props=keys(object),length=props.length,result={};while(++index<length){var key=props[index],value=object[key];if(multiValue){if(hasOwnProperty.call(result,value)){result[value].push(key);}else{result[value]=[key];}}else{result[value]=key;}}return result;}/**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */var keys=!nativeKeys?shimKeys:function(object){var Ctor=object==null?undefined:object.constructor;if(typeof Ctor=='function'&&Ctor.prototype===object||typeof object!='function'&&isArrayLike(object)){return shimKeys(object);}return isObject(object)?nativeKeys(object):[];};/**
     * Creates an array of the own and inherited enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keysIn(new Foo);
     * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
     */function keysIn(object){if(object==null){return[];}if(!isObject(object)){object=Object(object);}var length=object.length;length=length&&isLength(length)&&(isArray(object)||isArguments(object))&&length||0;var Ctor=object.constructor,index=-1,isProto=typeof Ctor=='function'&&Ctor.prototype===object,result=Array(length),skipIndexes=length>0;while(++index<length){result[index]=index+'';}for(var key in object){if(!(skipIndexes&&isIndex(key,length))&&!(key=='constructor'&&(isProto||!hasOwnProperty.call(object,key)))){result.push(key);}}return result;}/**
     * The opposite of `_.mapValues`; this method creates an object with the
     * same values as `object` and keys generated by running each own enumerable
     * property of `object` through `iteratee`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
     *   return key + value;
     * });
     * // => { 'a1': 1, 'b2': 2 }
     */var mapKeys=createObjectMapper(true);/**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through `iteratee`. The
     * iteratee function is bound to `thisArg` and invoked with three arguments:
     * (value, key, object).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [iteratee=_.identity] The function invoked
     *  per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Object} Returns the new mapped object.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
     *   return n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     *
     * var users = {
     *   'fred':    { 'user': 'fred',    'age': 40 },
     *   'pebbles': { 'user': 'pebbles', 'age': 1 }
     * };
     *
     * // using the `_.property` callback shorthand
     * _.mapValues(users, 'age');
     * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
     */var mapValues=createObjectMapper();/**
     * The opposite of `_.pick`; this method creates an object composed of the
     * own and inherited enumerable properties of `object` that are not omitted.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to omit, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.omit(object, 'age');
     * // => { 'user': 'fred' }
     *
     * _.omit(object, _.isNumber);
     * // => { 'user': 'fred' }
     */var omit=restParam(function(object,props){if(object==null){return{};}if(typeof props[0]!='function'){var props=arrayMap(baseFlatten(props),String);return pickByArray(object,baseDifference(keysIn(object),props));}var predicate=bindCallback(props[0],props[1],3);return pickByCallback(object,function(value,key,object){return!predicate(value,key,object);});});/**
     * Creates a two dimensional array of the key-value pairs for `object`,
     * e.g. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
     */function pairs(object){object=toObject(object);var index=-1,props=keys(object),length=props.length,result=Array(length);while(++index<length){var key=props[index];result[index]=[key,object[key]];}return result;}/**
     * Creates an object composed of the picked `object` properties. Property
     * names may be specified as individual arguments or as arrays of property
     * names. If `predicate` is provided it is invoked for each property of `object`
     * picking the properties `predicate` returns truthy for. The predicate is
     * bound to `thisArg` and invoked with three arguments: (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The source object.
     * @param {Function|...(string|string[])} [predicate] The function invoked per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `predicate`.
     * @returns {Object} Returns the new object.
     * @example
     *
     * var object = { 'user': 'fred', 'age': 40 };
     *
     * _.pick(object, 'user');
     * // => { 'user': 'fred' }
     *
     * _.pick(object, _.isString);
     * // => { 'user': 'fred' }
     */var pick=restParam(function(object,props){if(object==null){return{};}return typeof props[0]=='function'?pickByCallback(object,bindCallback(props[0],props[1],3)):pickByArray(object,baseFlatten(props));});/**
     * This method is like `_.get` except that if the resolved value is a function
     * it is invoked with the `this` binding of its parent object and its result
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to resolve.
     * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c1': 3, 'c2': _.constant(4) } }] };
     *
     * _.result(object, 'a[0].b.c1');
     * // => 3
     *
     * _.result(object, 'a[0].b.c2');
     * // => 4
     *
     * _.result(object, 'a.b.c', 'default');
     * // => 'default'
     *
     * _.result(object, 'a.b.c', _.constant('default'));
     * // => 'default'
     */function result(object,path,defaultValue){var result=object==null?undefined:object[path];if(result===undefined){if(object!=null&&!isKey(path,object)){path=toPath(path);object=path.length==1?object:baseGet(object,baseSlice(path,0,-1));result=object==null?undefined:object[last(path)];}result=result===undefined?defaultValue:result;}return isFunction(result)?result.call(object):result;}/**
     * Sets the property value of `path` on `object`. If a portion of `path`
     * does not exist it is created.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to augment.
     * @param {Array|string} path The path of the property to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.set(object, 'a[0].b.c', 4);
     * console.log(object.a[0].b.c);
     * // => 4
     *
     * _.set(object, 'x[0].y.z', 5);
     * console.log(object.x[0].y.z);
     * // => 5
     */function set(object,path,value){if(object==null){return object;}var pathKey=path+'';path=object[pathKey]!=null||isKey(path,object)?[pathKey]:toPath(path);var index=-1,length=path.length,lastIndex=length-1,nested=object;while(nested!=null&&++index<length){var key=path[index];if(isObject(nested)){if(index==lastIndex){nested[key]=value;}else if(nested[key]==null){nested[key]=isIndex(path[index+1])?[]:{};}}nested=nested[key];}return object;}/**
     * An alternative to `_.reduce`; this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own enumerable
     * properties through `iteratee`, with each invocation potentially mutating
     * the `accumulator` object. The `iteratee` is bound to `thisArg` and invoked
     * with four arguments: (accumulator, value, key, object). Iteratee functions
     * may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * _.transform([2, 3, 4], function(result, n) {
     *   result.push(n *= n);
     *   return n % 2 == 0;
     * });
     * // => [4, 9]
     *
     * _.transform({ 'a': 1, 'b': 2 }, function(result, n, key) {
     *   result[key] = n * 3;
     * });
     * // => { 'a': 3, 'b': 6 }
     */function transform(object,iteratee,accumulator,thisArg){var isArr=isArray(object)||isTypedArray(object);iteratee=getCallback(iteratee,thisArg,4);if(accumulator==null){if(isArr||isObject(object)){var Ctor=object.constructor;if(isArr){accumulator=isArray(object)?new Ctor():[];}else{accumulator=baseCreate(isFunction(Ctor)?Ctor.prototype:undefined);}}else{accumulator={};}}(isArr?arrayEach:baseForOwn)(object,function(value,index,object){return iteratee(accumulator,value,index,object);});return accumulator;}/**
     * Creates an array of the own enumerable property values of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.values(new Foo);
     * // => [1, 2] (iteration order is not guaranteed)
     *
     * _.values('hi');
     * // => ['h', 'i']
     */function values(object){return baseValues(object,keys(object));}/**
     * Creates an array of the own and inherited enumerable property values
     * of `object`.
     *
     * **Note:** Non-object values are coerced to objects.
     *
     * @static
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property values.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.valuesIn(new Foo);
     * // => [1, 2, 3] (iteration order is not guaranteed)
     */function valuesIn(object){return baseValues(object,keysIn(object));}/*------------------------------------------------------------------------*//**
     * Checks if `n` is between `start` and up to but not including, `end`. If
     * `end` is not specified it is set to `start` with `start` then set to `0`.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} n The number to check.
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @returns {boolean} Returns `true` if `n` is in the range, else `false`.
     * @example
     *
     * _.inRange(3, 2, 4);
     * // => true
     *
     * _.inRange(4, 8);
     * // => true
     *
     * _.inRange(4, 2);
     * // => false
     *
     * _.inRange(2, 2);
     * // => false
     *
     * _.inRange(1.2, 2);
     * // => true
     *
     * _.inRange(5.2, 4);
     * // => false
     */function inRange(value,start,end){start=+start||0;if(end===undefined){end=start;start=0;}else{end=+end||0;}return value>=nativeMin(start,end)&&value<nativeMax(start,end);}/**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number is returned.
     * If `floating` is `true`, or either `min` or `max` are floats, a floating-point
     * number is returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Number
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating] Specify returning a floating-point number.
     * @returns {number} Returns the random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */function random(min,max,floating){if(floating&&isIterateeCall(min,max,floating)){max=floating=undefined;}var noMin=min==null,noMax=max==null;if(floating==null){if(noMax&&typeof min=='boolean'){floating=min;min=1;}else if(typeof max=='boolean'){floating=max;noMax=true;}}if(noMin&&noMax){max=1;noMax=false;}min=+min||0;if(noMax){max=min;min=0;}else{max=+max||0;}if(floating||min%1||max%1){var rand=nativeRandom();return nativeMin(min+rand*(max-min+parseFloat('1e-'+((rand+'').length-1))),max);}return baseRandom(min,max);}/*------------------------------------------------------------------------*//**
     * Converts `string` to [camel case](https://en.wikipedia.org/wiki/CamelCase).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the camel cased string.
     * @example
     *
     * _.camelCase('Foo Bar');
     * // => 'fooBar'
     *
     * _.camelCase('--foo-bar');
     * // => 'fooBar'
     *
     * _.camelCase('__foo_bar__');
     * // => 'fooBar'
     */var camelCase=createCompounder(function(result,word,index){word=word.toLowerCase();return result+(index?word.charAt(0).toUpperCase()+word.slice(1):word);});/**
     * Capitalizes the first character of `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to capitalize.
     * @returns {string} Returns the capitalized string.
     * @example
     *
     * _.capitalize('fred');
     * // => 'Fred'
     */function capitalize(string){string=baseToString(string);return string&&string.charAt(0).toUpperCase()+string.slice(1);}/**
     * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
     * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to deburr.
     * @returns {string} Returns the deburred string.
     * @example
     *
     * _.deburr('déjà vu');
     * // => 'deja vu'
     */function deburr(string){string=baseToString(string);return string&&string.replace(reLatin1,deburrLetter).replace(reComboMark,'');}/**
     * Checks if `string` ends with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=string.length] The position to search from.
     * @returns {boolean} Returns `true` if `string` ends with `target`, else `false`.
     * @example
     *
     * _.endsWith('abc', 'c');
     * // => true
     *
     * _.endsWith('abc', 'b');
     * // => false
     *
     * _.endsWith('abc', 'b', 2);
     * // => true
     */function endsWith(string,target,position){string=baseToString(string);target=target+'';var length=string.length;position=position===undefined?length:nativeMin(position<0?0:+position||0,length);position-=target.length;return position>=0&&string.indexOf(target,position)==position;}/**
     * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
     * their corresponding HTML entities.
     *
     * **Note:** No other characters are escaped. To escape additional characters
     * use a third-party library like [_he_](https://mths.be/he).
     *
     * Though the ">" character is escaped for symmetry, characters like
     * ">" and "/" don't need escaping in HTML and have no special meaning
     * unless they're part of a tag or unquoted attribute value.
     * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
     * (under "semi-related fun fact") for more details.
     *
     * Backticks are escaped because in Internet Explorer < 9, they can break out
     * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
     * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
     * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
     * for more details.
     *
     * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
     * to reduce XSS vectors.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('fred, barney, & pebbles');
     * // => 'fred, barney, &amp; pebbles'
     */function escape(string){// Reset `lastIndex` because in IE < 9 `String#replace` does not.
string=baseToString(string);return string&&reHasUnescapedHtml.test(string)?string.replace(reUnescapedHtml,escapeHtmlChar):string;}/**
     * Escapes the `RegExp` special characters "\", "/", "^", "$", ".", "|", "?",
     * "*", "+", "(", ")", "[", "]", "{" and "}" in `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escapeRegExp('[lodash](https://lodash.com/)');
     * // => '\[lodash\]\(https:\/\/lodash\.com\/\)'
     */function escapeRegExp(string){string=baseToString(string);return string&&reHasRegExpChars.test(string)?string.replace(reRegExpChars,escapeRegExpChar):string||'(?:)';}/**
     * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the kebab cased string.
     * @example
     *
     * _.kebabCase('Foo Bar');
     * // => 'foo-bar'
     *
     * _.kebabCase('fooBar');
     * // => 'foo-bar'
     *
     * _.kebabCase('__foo_bar__');
     * // => 'foo-bar'
     */var kebabCase=createCompounder(function(result,word,index){return result+(index?'-':'')+word.toLowerCase();});/**
     * Pads `string` on the left and right sides if it's shorter than `length`.
     * Padding characters are truncated if they can't be evenly divided by `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.pad('abc', 8);
     * // => '  abc   '
     *
     * _.pad('abc', 8, '_-');
     * // => '_-abc_-_'
     *
     * _.pad('abc', 3);
     * // => 'abc'
     */function pad(string,length,chars){string=baseToString(string);length=+length;var strLength=string.length;if(strLength>=length||!nativeIsFinite(length)){return string;}var mid=(length-strLength)/2,leftLength=nativeFloor(mid),rightLength=nativeCeil(mid);chars=createPadding('',rightLength,chars);return chars.slice(0,leftLength)+string+chars;}/**
     * Pads `string` on the left side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padLeft('abc', 6);
     * // => '   abc'
     *
     * _.padLeft('abc', 6, '_-');
     * // => '_-_abc'
     *
     * _.padLeft('abc', 3);
     * // => 'abc'
     */var padLeft=createPadDir();/**
     * Pads `string` on the right side if it's shorter than `length`. Padding
     * characters are truncated if they exceed `length`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to pad.
     * @param {number} [length=0] The padding length.
     * @param {string} [chars=' '] The string used as padding.
     * @returns {string} Returns the padded string.
     * @example
     *
     * _.padRight('abc', 6);
     * // => 'abc   '
     *
     * _.padRight('abc', 6, '_-');
     * // => 'abc_-_'
     *
     * _.padRight('abc', 3);
     * // => 'abc'
     */var padRight=createPadDir(true);/**
     * Converts `string` to an integer of the specified radix. If `radix` is
     * `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal,
     * in which case a `radix` of `16` is used.
     *
     * **Note:** This method aligns with the [ES5 implementation](https://es5.github.io/#E)
     * of `parseInt`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} string The string to convert.
     * @param {number} [radix] The radix to interpret `value` by.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     *
     * _.map(['6', '08', '10'], _.parseInt);
     * // => [6, 8, 10]
     */function parseInt(string,radix,guard){// Firefox < 21 and Opera < 15 follow ES3 for `parseInt`.
// Chrome fails to trim leading <BOM> whitespace characters.
// See https://code.google.com/p/v8/issues/detail?id=3109 for more details.
if(guard?isIterateeCall(string,radix,guard):radix==null){radix=0;}else if(radix){radix=+radix;}string=trim(string);return nativeParseInt(string,radix||(reHasHexPrefix.test(string)?16:10));}/**
     * Repeats the given string `n` times.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to repeat.
     * @param {number} [n=0] The number of times to repeat the string.
     * @returns {string} Returns the repeated string.
     * @example
     *
     * _.repeat('*', 3);
     * // => '***'
     *
     * _.repeat('abc', 2);
     * // => 'abcabc'
     *
     * _.repeat('abc', 0);
     * // => ''
     */function repeat(string,n){var result='';string=baseToString(string);n=+n;if(n<1||!string||!nativeIsFinite(n)){return result;}// Leverage the exponentiation by squaring algorithm for a faster repeat.
// See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
do{if(n%2){result+=string;}n=nativeFloor(n/2);string+=string;}while(n);return result;}/**
     * Converts `string` to [snake case](https://en.wikipedia.org/wiki/Snake_case).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the snake cased string.
     * @example
     *
     * _.snakeCase('Foo Bar');
     * // => 'foo_bar'
     *
     * _.snakeCase('fooBar');
     * // => 'foo_bar'
     *
     * _.snakeCase('--foo-bar');
     * // => 'foo_bar'
     */var snakeCase=createCompounder(function(result,word,index){return result+(index?'_':'')+word.toLowerCase();});/**
     * Converts `string` to [start case](https://en.wikipedia.org/wiki/Letter_case#Stylistic_or_specialised_usage).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to convert.
     * @returns {string} Returns the start cased string.
     * @example
     *
     * _.startCase('--foo-bar');
     * // => 'Foo Bar'
     *
     * _.startCase('fooBar');
     * // => 'Foo Bar'
     *
     * _.startCase('__foo_bar__');
     * // => 'Foo Bar'
     */var startCase=createCompounder(function(result,word,index){return result+(index?' ':'')+(word.charAt(0).toUpperCase()+word.slice(1));});/**
     * Checks if `string` starts with the given target string.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to search.
     * @param {string} [target] The string to search for.
     * @param {number} [position=0] The position to search from.
     * @returns {boolean} Returns `true` if `string` starts with `target`, else `false`.
     * @example
     *
     * _.startsWith('abc', 'a');
     * // => true
     *
     * _.startsWith('abc', 'b');
     * // => false
     *
     * _.startsWith('abc', 'b', 1);
     * // => true
     */function startsWith(string,target,position){string=baseToString(string);position=position==null?0:nativeMin(position<0?0:+position||0,string.length);return string.lastIndexOf(target,position)==position;}/**
     * Creates a compiled template function that can interpolate data properties
     * in "interpolate" delimiters, HTML-escape interpolated data properties in
     * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
     * properties may be accessed as free variables in the template. If a setting
     * object is provided it takes precedence over `_.templateSettings` values.
     *
     * **Note:** In the development build `_.template` utilizes
     * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
     * for easier debugging.
     *
     * For more information on precompiling templates see
     * [lodash's custom builds documentation](https://lodash.com/custom-builds).
     *
     * For more information on Chrome extension sandboxes see
     * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The template string.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The HTML "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as free variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [options.sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [options.variable] The data object variable name.
     * @param- {Object} [otherOptions] Enables the legacy `options` param signature.
     * @returns {Function} Returns the compiled template function.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= user %>!');
     * compiled({ 'user': 'fred' });
     * // => 'hello fred!'
     *
     * // using the HTML "escape" delimiter to escape data property values
     * var compiled = _.template('<b><%- value %></b>');
     * compiled({ 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to execute JavaScript and generate HTML
     * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * var compiled = _.template('<% print("hello " + user); %>!');
     * compiled({ 'user': 'barney' });
     * // => 'hello barney!'
     *
     * // using the ES delimiter as an alternative to the default "interpolate" delimiter
     * var compiled = _.template('hello ${ user }!');
     * compiled({ 'user': 'pebbles' });
     * // => 'hello pebbles!'
     *
     * // using custom template delimiters
     * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
     * var compiled = _.template('hello {{ user }}!');
     * compiled({ 'user': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using backslashes to treat delimiters as plain text
     * var compiled = _.template('<%= "\\<%- value %\\>" %>');
     * compiled({ 'value': 'ignored' });
     * // => '<%- value %>'
     *
     * // using the `imports` option to import `jQuery` as `jq`
     * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
     * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
     * compiled({ 'users': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     * //   var __t, __p = '';
     * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
     * //   return __p;
     * // }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */function template(string,options,otherOptions){// Based on John Resig's `tmpl` implementation (http://ejohn.org/blog/javascript-micro-templating/)
// and Laura Doktorova's doT.js (https://github.com/olado/doT).
var settings=lodash.templateSettings;if(otherOptions&&isIterateeCall(string,options,otherOptions)){options=otherOptions=undefined;}string=baseToString(string);options=assignWith(baseAssign({},otherOptions||options),settings,assignOwnDefaults);var imports=assignWith(baseAssign({},options.imports),settings.imports,assignOwnDefaults),importsKeys=keys(imports),importsValues=baseValues(imports,importsKeys);var isEscaping,isEvaluating,index=0,interpolate=options.interpolate||reNoMatch,source="__p += '";// Compile the regexp to match each delimiter.
var reDelimiters=RegExp((options.escape||reNoMatch).source+'|'+interpolate.source+'|'+(interpolate===reInterpolate?reEsTemplate:reNoMatch).source+'|'+(options.evaluate||reNoMatch).source+'|$','g');// Use a sourceURL for easier debugging.
var sourceURL='//# sourceURL='+('sourceURL'in options?options.sourceURL:'lodash.templateSources['+ ++templateCounter+']')+'\n';string.replace(reDelimiters,function(match,escapeValue,interpolateValue,esTemplateValue,evaluateValue,offset){interpolateValue||(interpolateValue=esTemplateValue);// Escape characters that can't be included in string literals.
source+=string.slice(index,offset).replace(reUnescapedString,escapeStringChar);// Replace delimiters with snippets.
if(escapeValue){isEscaping=true;source+="' +\n__e("+escapeValue+") +\n'";}if(evaluateValue){isEvaluating=true;source+="';\n"+evaluateValue+";\n__p += '";}if(interpolateValue){source+="' +\n((__t = ("+interpolateValue+")) == null ? '' : __t) +\n'";}index=offset+match.length;// The JS engine embedded in Adobe products requires returning the `match`
// string in order to produce the correct `offset` value.
return match;});source+="';\n";// If `variable` is not specified wrap a with-statement around the generated
// code to add the data object to the top of the scope chain.
var variable=options.variable;if(!variable){source='with (obj) {\n'+source+'\n}\n';}// Cleanup code by stripping empty strings.
source=(isEvaluating?source.replace(reEmptyStringLeading,''):source).replace(reEmptyStringMiddle,'$1').replace(reEmptyStringTrailing,'$1;');// Frame code as the function body.
source='function('+(variable||'obj')+') {\n'+(variable?'':'obj || (obj = {});\n')+"var __t, __p = ''"+(isEscaping?', __e = _.escape':'')+(isEvaluating?', __j = Array.prototype.join;\n'+"function print() { __p += __j.call(arguments, '') }\n":';\n')+source+'return __p\n}';var result=attempt(function(){return Function(importsKeys,sourceURL+'return '+source).apply(undefined,importsValues);});// Provide the compiled function's source by its `toString` method or
// the `source` property as a convenience for inlining compiled templates.
result.source=source;if(isError(result)){throw result;}return result;}/**
     * Removes leading and trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trim('  abc  ');
     * // => 'abc'
     *
     * _.trim('-_-abc-_-', '_-');
     * // => 'abc'
     *
     * _.map(['  foo  ', '  bar  '], _.trim);
     * // => ['foo', 'bar']
     */function trim(string,chars,guard){var value=string;string=baseToString(string);if(!string){return string;}if(guard?isIterateeCall(value,chars,guard):chars==null){return string.slice(trimmedLeftIndex(string),trimmedRightIndex(string)+1);}chars=chars+'';return string.slice(charsLeftIndex(string,chars),charsRightIndex(string,chars)+1);}/**
     * Removes leading whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimLeft('  abc  ');
     * // => 'abc  '
     *
     * _.trimLeft('-_-abc-_-', '_-');
     * // => 'abc-_-'
     */function trimLeft(string,chars,guard){var value=string;string=baseToString(string);if(!string){return string;}if(guard?isIterateeCall(value,chars,guard):chars==null){return string.slice(trimmedLeftIndex(string));}return string.slice(charsLeftIndex(string,chars+''));}/**
     * Removes trailing whitespace or specified characters from `string`.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to trim.
     * @param {string} [chars=whitespace] The characters to trim.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the trimmed string.
     * @example
     *
     * _.trimRight('  abc  ');
     * // => '  abc'
     *
     * _.trimRight('-_-abc-_-', '_-');
     * // => '-_-abc'
     */function trimRight(string,chars,guard){var value=string;string=baseToString(string);if(!string){return string;}if(guard?isIterateeCall(value,chars,guard):chars==null){return string.slice(0,trimmedRightIndex(string)+1);}return string.slice(0,charsRightIndex(string,chars+'')+1);}/**
     * Truncates `string` if it's longer than the given maximum string length.
     * The last characters of the truncated string are replaced with the omission
     * string which defaults to "...".
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to truncate.
     * @param {Object|number} [options] The options object or maximum string length.
     * @param {number} [options.length=30] The maximum string length.
     * @param {string} [options.omission='...'] The string to indicate text is omitted.
     * @param {RegExp|string} [options.separator] The separator pattern to truncate to.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {string} Returns the truncated string.
     * @example
     *
     * _.trunc('hi-diddly-ho there, neighborino');
     * // => 'hi-diddly-ho there, neighbo...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', 24);
     * // => 'hi-diddly-ho there, n...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': ' '
     * });
     * // => 'hi-diddly-ho there,...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'length': 24,
     *   'separator': /,? +/
     * });
     * // => 'hi-diddly-ho there...'
     *
     * _.trunc('hi-diddly-ho there, neighborino', {
     *   'omission': ' [...]'
     * });
     * // => 'hi-diddly-ho there, neig [...]'
     */function trunc(string,options,guard){if(guard&&isIterateeCall(string,options,guard)){options=undefined;}var length=DEFAULT_TRUNC_LENGTH,omission=DEFAULT_TRUNC_OMISSION;if(options!=null){if(isObject(options)){var separator='separator'in options?options.separator:separator;length='length'in options?+options.length||0:length;omission='omission'in options?baseToString(options.omission):omission;}else{length=+options||0;}}string=baseToString(string);if(length>=string.length){return string;}var end=length-omission.length;if(end<1){return omission;}var result=string.slice(0,end);if(separator==null){return result+omission;}if(isRegExp(separator)){if(string.slice(end).search(separator)){var match,newEnd,substring=string.slice(0,end);if(!separator.global){separator=RegExp(separator.source,(reFlags.exec(separator)||'')+'g');}separator.lastIndex=0;while(match=separator.exec(substring)){newEnd=match.index;}result=result.slice(0,newEnd==null?end:newEnd);}}else if(string.indexOf(separator,end)!=end){var index=result.lastIndexOf(separator);if(index>-1){result=result.slice(0,index);}}return result+omission;}/**
     * The inverse of `_.escape`; this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, and `&#96;` in `string` to their
     * corresponding characters.
     *
     * **Note:** No other HTML entities are unescaped. To unescape additional HTML
     * entities use a third-party library like [_he_](https://mths.be/he).
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('fred, barney, &amp; pebbles');
     * // => 'fred, barney, & pebbles'
     */function unescape(string){string=baseToString(string);return string&&reHasEscapedHtml.test(string)?string.replace(reEscapedHtml,unescapeHtmlChar):string;}/**
     * Splits `string` into an array of its words.
     *
     * @static
     * @memberOf _
     * @category String
     * @param {string} [string=''] The string to inspect.
     * @param {RegExp|string} [pattern] The pattern to match words.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Array} Returns the words of `string`.
     * @example
     *
     * _.words('fred, barney, & pebbles');
     * // => ['fred', 'barney', 'pebbles']
     *
     * _.words('fred, barney, & pebbles', /[^, ]+/g);
     * // => ['fred', 'barney', '&', 'pebbles']
     */function words(string,pattern,guard){if(guard&&isIterateeCall(string,pattern,guard)){pattern=undefined;}string=baseToString(string);return string.match(pattern||reWords)||[];}/*------------------------------------------------------------------------*//**
     * Attempts to invoke `func`, returning either the result or the caught error
     * object. Any additional arguments are provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function} func The function to attempt.
     * @returns {*} Returns the `func` result or error object.
     * @example
     *
     * // avoid throwing errors for invalid selectors
     * var elements = _.attempt(function(selector) {
     *   return document.querySelectorAll(selector);
     * }, '>_>');
     *
     * if (_.isError(elements)) {
     *   elements = [];
     * }
     */var attempt=restParam(function(func,args){try{return func.apply(undefined,args);}catch(e){return isError(e)?e:new Error(e);}});/**
     * Creates a function that invokes `func` with the `this` binding of `thisArg`
     * and arguments of the created function. If `func` is a property name the
     * created callback returns the property value for a given element. If `func`
     * is an object the created callback returns `true` for elements that contain
     * the equivalent object properties, otherwise it returns `false`.
     *
     * @static
     * @memberOf _
     * @alias iteratee
     * @category Utility
     * @param {*} [func=_.identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
     * @returns {Function} Returns the callback.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
     *   if (!match) {
     *     return callback(func, thisArg);
     *   }
     *   return function(object) {
     *     return match[2] == 'gt'
     *       ? object[match[1]] > match[3]
     *       : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(users, 'age__gt36');
     * // => [{ 'user': 'fred', 'age': 40 }]
     */function callback(func,thisArg,guard){if(guard&&isIterateeCall(func,thisArg,guard)){thisArg=undefined;}return isObjectLike(func)?matches(func):baseCallback(func,thisArg);}/**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'user': 'fred' };
     * var getter = _.constant(object);
     *
     * getter() === object;
     * // => true
     */function constant(value){return function(){return value;};}/**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.identity(object) === object;
     * // => true
     */function identity(value){return value;}/**
     * Creates a function that performs a deep comparison between a given object
     * and `source`, returning `true` if the given object has equivalent property
     * values, else `false`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties. For comparing a single
     * own or inherited property value see `_.matchesProperty`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36, 'active': true },
     *   { 'user': 'fred',   'age': 40, 'active': false }
     * ];
     *
     * _.filter(users, _.matches({ 'age': 40, 'active': false }));
     * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
     */function matches(source){return baseMatches(baseClone(source,true));}/**
     * Creates a function that compares the property value of `path` on a given
     * object to `value`.
     *
     * **Note:** This method supports comparing arrays, booleans, `Date` objects,
     * numbers, `Object` objects, regexes, and strings. Objects are compared by
     * their own, not inherited, enumerable properties.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var users = [
     *   { 'user': 'barney' },
     *   { 'user': 'fred' }
     * ];
     *
     * _.find(users, _.matchesProperty('user', 'fred'));
     * // => { 'user': 'fred' }
     */function matchesProperty(path,srcValue){return baseMatchesProperty(path,baseClone(srcValue,true));}/**
     * Creates a function that invokes the method at `path` on a given object.
     * Any additional arguments are provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the method to invoke.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': _.constant(2) } } },
     *   { 'a': { 'b': { 'c': _.constant(1) } } }
     * ];
     *
     * _.map(objects, _.method('a.b.c'));
     * // => [2, 1]
     *
     * _.invoke(_.sortBy(objects, _.method(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */var method=restParam(function(path,args){return function(object){return invokePath(object,path,args);};});/**
     * The opposite of `_.method`; this method creates a function that invokes
     * the method at a given path on `object`. Any additional arguments are
     * provided to the invoked method.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @param {...*} [args] The arguments to invoke the method with.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = _.times(3, _.constant),
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.methodOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.methodOf(object));
     * // => [2, 0]
     */var methodOf=restParam(function(object,args){return function(path){return invokePath(object,path,args);};});/**
     * Adds all own enumerable function properties of a source object to the
     * destination object. If `object` is a function then methods are added to
     * its prototype as well.
     *
     * **Note:** Use `_.runInContext` to create a pristine `lodash` function to
     * avoid conflicts caused by modifying the original.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Function|Object} [object=lodash] The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added
     *  are chainable.
     * @returns {Function|Object} Returns `object`.
     * @example
     *
     * function vowels(string) {
     *   return _.filter(string, function(v) {
     *     return /[aeiou]/i.test(v);
     *   });
     * }
     *
     * _.mixin({ 'vowels': vowels });
     * _.vowels('fred');
     * // => ['e']
     *
     * _('fred').vowels().value();
     * // => ['e']
     *
     * _.mixin({ 'vowels': vowels }, { 'chain': false });
     * _('fred').vowels();
     * // => ['e']
     */function mixin(object,source,options){if(options==null){var isObj=isObject(source),props=isObj?keys(source):undefined,methodNames=props&&props.length?baseFunctions(source,props):undefined;if(!(methodNames?methodNames.length:isObj)){methodNames=false;options=source;source=object;object=this;}}if(!methodNames){methodNames=baseFunctions(source,keys(source));}var chain=true,index=-1,isFunc=isFunction(object),length=methodNames.length;if(options===false){chain=false;}else if(isObject(options)&&'chain'in options){chain=options.chain;}while(++index<length){var methodName=methodNames[index],func=source[methodName];object[methodName]=func;if(isFunc){object.prototype[methodName]=function(func){return function(){var chainAll=this.__chain__;if(chain||chainAll){var result=object(this.__wrapped__),actions=result.__actions__=arrayCopy(this.__actions__);actions.push({'func':func,'args':arguments,'thisArg':object});result.__chain__=chainAll;return result;}return func.apply(object,arrayPush([this.value()],arguments));};}(func);}}return object;}/**
     * Reverts the `_` variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */function noConflict(){root._=oldDash;return this;}/**
     * A no-operation function that returns `undefined` regardless of the
     * arguments it receives.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @example
     *
     * var object = { 'user': 'fred' };
     *
     * _.noop(object) === undefined;
     * // => true
     */function noop(){}// No operation performed.
/**
     * Creates a function that returns the property value at `path` on a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': { 'c': 2 } } },
     *   { 'a': { 'b': { 'c': 1 } } }
     * ];
     *
     * _.map(objects, _.property('a.b.c'));
     * // => [2, 1]
     *
     * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
     * // => [1, 2]
     */function property(path){return isKey(path)?baseProperty(path):basePropertyDeep(path);}/**
     * The opposite of `_.property`; this method creates a function that returns
     * the property value at a given path on `object`.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {Object} object The object to query.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var array = [0, 1, 2],
     *     object = { 'a': array, 'b': array, 'c': array };
     *
     * _.map(['a[2]', 'c[0]'], _.propertyOf(object));
     * // => [2, 0]
     *
     * _.map([['a', '2'], ['c', '0']], _.propertyOf(object));
     * // => [2, 0]
     */function propertyOf(object){return function(path){return baseGet(object,toPath(path),path+'');};}/**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to, but not including, `end`. If `end` is not specified it is
     * set to `start` with `start` then set to `0`. If `end` is less than `start`
     * a zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns the new array of numbers.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */function range(start,end,step){if(step&&isIterateeCall(start,end,step)){end=step=undefined;}start=+start||0;step=step==null?1:+step||0;if(end==null){end=start;start=0;}else{end=+end||0;}// Use `Array(length)` so engines like Chakra and V8 avoid slower modes.
// See https://youtu.be/XAqIpGU8ZZk#t=17m25s for more details.
var index=-1,length=nativeMax(nativeCeil((end-start)/(step||1)),0),result=Array(length);while(++index<length){result[index]=start;start+=step;}return result;}/**
     * Invokes the iteratee function `n` times, returning an array of the results
     * of each invocation. The `iteratee` is bound to `thisArg` and invoked with
     * one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} [iteratee=_.identity] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {Array} Returns the array of results.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6, false));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) {
     *   mage.castSpell(n);
     * });
     * // => invokes `mage.castSpell(n)` three times with `n` of `0`, `1`, and `2`
     *
     * _.times(3, function(n) {
     *   this.cast(n);
     * }, mage);
     * // => also invokes `mage.castSpell(n)` three times
     */function times(n,iteratee,thisArg){n=nativeFloor(n);// Exit early to avoid a JSC JIT bug in Safari 8
// where `Array(0)` is treated as `Array(1)`.
if(n<1||!nativeIsFinite(n)){return[];}var index=-1,result=Array(nativeMin(n,MAX_ARRAY_LENGTH));iteratee=bindCallback(iteratee,thisArg,1);while(++index<n){if(index<MAX_ARRAY_LENGTH){result[index]=iteratee(index);}else{iteratee(index);}}return result;}/**
     * Generates a unique ID. If `prefix` is provided the ID is appended to it.
     *
     * @static
     * @memberOf _
     * @category Utility
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */function uniqueId(prefix){var id=++idCounter;return baseToString(prefix)+id;}/*------------------------------------------------------------------------*//**
     * Adds two numbers.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} augend The first number to add.
     * @param {number} addend The second number to add.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.add(6, 4);
     * // => 10
     */function add(augend,addend){return(+augend||0)+(+addend||0);}/**
     * Calculates `n` rounded up to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round up.
     * @param {number} [precision=0] The precision to round up to.
     * @returns {number} Returns the rounded up number.
     * @example
     *
     * _.ceil(4.006);
     * // => 5
     *
     * _.ceil(6.004, 2);
     * // => 6.01
     *
     * _.ceil(6040, -2);
     * // => 6100
     */var ceil=createRound('ceil');/**
     * Calculates `n` rounded down to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round down.
     * @param {number} [precision=0] The precision to round down to.
     * @returns {number} Returns the rounded down number.
     * @example
     *
     * _.floor(4.006);
     * // => 4
     *
     * _.floor(0.046, 2);
     * // => 0.04
     *
     * _.floor(4060, -2);
     * // => 4000
     */var floor=createRound('floor');/**
     * Gets the maximum value of `collection`. If `collection` is empty or falsey
     * `-Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * _.max([]);
     * // => -Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.max(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'fred', 'age': 40 }
     *
     * // using the `_.property` callback shorthand
     * _.max(users, 'age');
     * // => { 'user': 'fred', 'age': 40 }
     */var max=createExtremum(gt,NEGATIVE_INFINITY);/**
     * Gets the minimum value of `collection`. If `collection` is empty or falsey
     * `Infinity` is returned. If an iteratee function is provided it is invoked
     * for each value in `collection` to generate the criterion by which the value
     * is ranked. The `iteratee` is bound to `thisArg` and invoked with three
     * arguments: (value, index, collection).
     *
     * If a property name is provided for `iteratee` the created `_.property`
     * style callback returns the property value of the given element.
     *
     * If a value is also provided for `thisArg` the created `_.matchesProperty`
     * style callback returns `true` for elements that have a matching property
     * value, else `false`.
     *
     * If an object is provided for `iteratee` the created `_.matches` style
     * callback returns `true` for elements that have the properties of the given
     * object, else `false`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * _.min([]);
     * // => Infinity
     *
     * var users = [
     *   { 'user': 'barney', 'age': 36 },
     *   { 'user': 'fred',   'age': 40 }
     * ];
     *
     * _.min(users, function(chr) {
     *   return chr.age;
     * });
     * // => { 'user': 'barney', 'age': 36 }
     *
     * // using the `_.property` callback shorthand
     * _.min(users, 'age');
     * // => { 'user': 'barney', 'age': 36 }
     */var min=createExtremum(lt,POSITIVE_INFINITY);/**
     * Calculates `n` rounded to `precision`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {number} n The number to round.
     * @param {number} [precision=0] The precision to round to.
     * @returns {number} Returns the rounded number.
     * @example
     *
     * _.round(4.006);
     * // => 4
     *
     * _.round(4.006, 2);
     * // => 4.01
     *
     * _.round(4060, -2);
     * // => 4100
     */var round=createRound('round');/**
     * Gets the sum of the values in `collection`.
     *
     * @static
     * @memberOf _
     * @category Math
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [iteratee] The function invoked per iteration.
     * @param {*} [thisArg] The `this` binding of `iteratee`.
     * @returns {number} Returns the sum.
     * @example
     *
     * _.sum([4, 6]);
     * // => 10
     *
     * _.sum({ 'a': 4, 'b': 6 });
     * // => 10
     *
     * var objects = [
     *   { 'n': 4 },
     *   { 'n': 6 }
     * ];
     *
     * _.sum(objects, function(object) {
     *   return object.n;
     * });
     * // => 10
     *
     * // using the `_.property` callback shorthand
     * _.sum(objects, 'n');
     * // => 10
     */function sum(collection,iteratee,thisArg){if(thisArg&&isIterateeCall(collection,iteratee,thisArg)){iteratee=undefined;}iteratee=getCallback(iteratee,thisArg,3);return iteratee.length==1?arraySum(isArray(collection)?collection:toIterable(collection),iteratee):baseSum(collection,iteratee);}/*------------------------------------------------------------------------*/// Ensure wrappers are instances of `baseLodash`.
lodash.prototype=baseLodash.prototype;LodashWrapper.prototype=baseCreate(baseLodash.prototype);LodashWrapper.prototype.constructor=LodashWrapper;LazyWrapper.prototype=baseCreate(baseLodash.prototype);LazyWrapper.prototype.constructor=LazyWrapper;// Add functions to the `Map` cache.
MapCache.prototype['delete']=mapDelete;MapCache.prototype.get=mapGet;MapCache.prototype.has=mapHas;MapCache.prototype.set=mapSet;// Add functions to the `Set` cache.
SetCache.prototype.push=cachePush;// Assign cache to `_.memoize`.
memoize.Cache=MapCache;// Add functions that return wrapped values when chaining.
lodash.after=after;lodash.ary=ary;lodash.assign=assign;lodash.at=at;lodash.before=before;lodash.bind=bind;lodash.bindAll=bindAll;lodash.bindKey=bindKey;lodash.callback=callback;lodash.chain=chain;lodash.chunk=chunk;lodash.compact=compact;lodash.constant=constant;lodash.countBy=countBy;lodash.create=create;lodash.curry=curry;lodash.curryRight=curryRight;lodash.debounce=debounce;lodash.defaults=defaults;lodash.defaultsDeep=defaultsDeep;lodash.defer=defer;lodash.delay=delay;lodash.difference=difference;lodash.drop=drop;lodash.dropRight=dropRight;lodash.dropRightWhile=dropRightWhile;lodash.dropWhile=dropWhile;lodash.fill=fill;lodash.filter=filter;lodash.flatten=flatten;lodash.flattenDeep=flattenDeep;lodash.flow=flow;lodash.flowRight=flowRight;lodash.forEach=forEach;lodash.forEachRight=forEachRight;lodash.forIn=forIn;lodash.forInRight=forInRight;lodash.forOwn=forOwn;lodash.forOwnRight=forOwnRight;lodash.functions=functions;lodash.groupBy=groupBy;lodash.indexBy=indexBy;lodash.initial=initial;lodash.intersection=intersection;lodash.invert=invert;lodash.invoke=invoke;lodash.keys=keys;lodash.keysIn=keysIn;lodash.map=map;lodash.mapKeys=mapKeys;lodash.mapValues=mapValues;lodash.matches=matches;lodash.matchesProperty=matchesProperty;lodash.memoize=memoize;lodash.merge=merge;lodash.method=method;lodash.methodOf=methodOf;lodash.mixin=mixin;lodash.modArgs=modArgs;lodash.negate=negate;lodash.omit=omit;lodash.once=once;lodash.pairs=pairs;lodash.partial=partial;lodash.partialRight=partialRight;lodash.partition=partition;lodash.pick=pick;lodash.pluck=pluck;lodash.property=property;lodash.propertyOf=propertyOf;lodash.pull=pull;lodash.pullAt=pullAt;lodash.range=range;lodash.rearg=rearg;lodash.reject=reject;lodash.remove=remove;lodash.rest=rest;lodash.restParam=restParam;lodash.set=set;lodash.shuffle=shuffle;lodash.slice=slice;lodash.sortBy=sortBy;lodash.sortByAll=sortByAll;lodash.sortByOrder=sortByOrder;lodash.spread=spread;lodash.take=take;lodash.takeRight=takeRight;lodash.takeRightWhile=takeRightWhile;lodash.takeWhile=takeWhile;lodash.tap=tap;lodash.throttle=throttle;lodash.thru=thru;lodash.times=times;lodash.toArray=toArray;lodash.toPlainObject=toPlainObject;lodash.transform=transform;lodash.union=union;lodash.uniq=uniq;lodash.unzip=unzip;lodash.unzipWith=unzipWith;lodash.values=values;lodash.valuesIn=valuesIn;lodash.where=where;lodash.without=without;lodash.wrap=wrap;lodash.xor=xor;lodash.zip=zip;lodash.zipObject=zipObject;lodash.zipWith=zipWith;// Add aliases.
lodash.backflow=flowRight;lodash.collect=map;lodash.compose=flowRight;lodash.each=forEach;lodash.eachRight=forEachRight;lodash.extend=assign;lodash.iteratee=callback;lodash.methods=functions;lodash.object=zipObject;lodash.select=filter;lodash.tail=rest;lodash.unique=uniq;// Add functions to `lodash.prototype`.
mixin(lodash,lodash);/*------------------------------------------------------------------------*/// Add functions that return unwrapped values when chaining.
lodash.add=add;lodash.attempt=attempt;lodash.camelCase=camelCase;lodash.capitalize=capitalize;lodash.ceil=ceil;lodash.clone=clone;lodash.cloneDeep=cloneDeep;lodash.deburr=deburr;lodash.endsWith=endsWith;lodash.escape=escape;lodash.escapeRegExp=escapeRegExp;lodash.every=every;lodash.find=find;lodash.findIndex=findIndex;lodash.findKey=findKey;lodash.findLast=findLast;lodash.findLastIndex=findLastIndex;lodash.findLastKey=findLastKey;lodash.findWhere=findWhere;lodash.first=first;lodash.floor=floor;lodash.get=get;lodash.gt=gt;lodash.gte=gte;lodash.has=has;lodash.identity=identity;lodash.includes=includes;lodash.indexOf=indexOf;lodash.inRange=inRange;lodash.isArguments=isArguments;lodash.isArray=isArray;lodash.isBoolean=isBoolean;lodash.isDate=isDate;lodash.isElement=isElement;lodash.isEmpty=isEmpty;lodash.isEqual=isEqual;lodash.isError=isError;lodash.isFinite=isFinite;lodash.isFunction=isFunction;lodash.isMatch=isMatch;lodash.isNaN=isNaN;lodash.isNative=isNative;lodash.isNull=isNull;lodash.isNumber=isNumber;lodash.isObject=isObject;lodash.isPlainObject=isPlainObject;lodash.isRegExp=isRegExp;lodash.isString=isString;lodash.isTypedArray=isTypedArray;lodash.isUndefined=isUndefined;lodash.kebabCase=kebabCase;lodash.last=last;lodash.lastIndexOf=lastIndexOf;lodash.lt=lt;lodash.lte=lte;lodash.max=max;lodash.min=min;lodash.noConflict=noConflict;lodash.noop=noop;lodash.now=now;lodash.pad=pad;lodash.padLeft=padLeft;lodash.padRight=padRight;lodash.parseInt=parseInt;lodash.random=random;lodash.reduce=reduce;lodash.reduceRight=reduceRight;lodash.repeat=repeat;lodash.result=result;lodash.round=round;lodash.runInContext=runInContext;lodash.size=size;lodash.snakeCase=snakeCase;lodash.some=some;lodash.sortedIndex=sortedIndex;lodash.sortedLastIndex=sortedLastIndex;lodash.startCase=startCase;lodash.startsWith=startsWith;lodash.sum=sum;lodash.template=template;lodash.trim=trim;lodash.trimLeft=trimLeft;lodash.trimRight=trimRight;lodash.trunc=trunc;lodash.unescape=unescape;lodash.uniqueId=uniqueId;lodash.words=words;// Add aliases.
lodash.all=every;lodash.any=some;lodash.contains=includes;lodash.eq=isEqual;lodash.detect=find;lodash.foldl=reduce;lodash.foldr=reduceRight;lodash.head=first;lodash.include=includes;lodash.inject=reduce;mixin(lodash,function(){var source={};baseForOwn(lodash,function(func,methodName){if(!lodash.prototype[methodName]){source[methodName]=func;}});return source;}(),false);/*------------------------------------------------------------------------*/// Add functions capable of returning wrapped and unwrapped values when chaining.
lodash.sample=sample;lodash.prototype.sample=function(n){if(!this.__chain__&&n==null){return sample(this.value());}return this.thru(function(value){return sample(value,n);});};/*------------------------------------------------------------------------*//**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */lodash.VERSION=VERSION;// Assign default placeholders.
arrayEach(['bind','bindKey','curry','curryRight','partial','partialRight'],function(methodName){lodash[methodName].placeholder=lodash;});// Add `LazyWrapper` methods for `_.drop` and `_.take` variants.
arrayEach(['drop','take'],function(methodName,index){LazyWrapper.prototype[methodName]=function(n){var filtered=this.__filtered__;if(filtered&&!index){return new LazyWrapper(this);}n=n==null?1:nativeMax(nativeFloor(n)||0,0);var result=this.clone();if(filtered){result.__takeCount__=nativeMin(result.__takeCount__,n);}else{result.__views__.push({'size':n,'type':methodName+(result.__dir__<0?'Right':'')});}return result;};LazyWrapper.prototype[methodName+'Right']=function(n){return this.reverse()[methodName](n).reverse();};});// Add `LazyWrapper` methods that accept an `iteratee` value.
arrayEach(['filter','map','takeWhile'],function(methodName,index){var type=index+1,isFilter=type!=LAZY_MAP_FLAG;LazyWrapper.prototype[methodName]=function(iteratee,thisArg){var result=this.clone();result.__iteratees__.push({'iteratee':getCallback(iteratee,thisArg,1),'type':type});result.__filtered__=result.__filtered__||isFilter;return result;};});// Add `LazyWrapper` methods for `_.first` and `_.last`.
arrayEach(['first','last'],function(methodName,index){var takeName='take'+(index?'Right':'');LazyWrapper.prototype[methodName]=function(){return this[takeName](1).value()[0];};});// Add `LazyWrapper` methods for `_.initial` and `_.rest`.
arrayEach(['initial','rest'],function(methodName,index){var dropName='drop'+(index?'':'Right');LazyWrapper.prototype[methodName]=function(){return this.__filtered__?new LazyWrapper(this):this[dropName](1);};});// Add `LazyWrapper` methods for `_.pluck` and `_.where`.
arrayEach(['pluck','where'],function(methodName,index){var operationName=index?'filter':'map',createCallback=index?baseMatches:property;LazyWrapper.prototype[methodName]=function(value){return this[operationName](createCallback(value));};});LazyWrapper.prototype.compact=function(){return this.filter(identity);};LazyWrapper.prototype.reject=function(predicate,thisArg){predicate=getCallback(predicate,thisArg,1);return this.filter(function(value){return!predicate(value);});};LazyWrapper.prototype.slice=function(start,end){start=start==null?0:+start||0;var result=this;if(result.__filtered__&&(start>0||end<0)){return new LazyWrapper(result);}if(start<0){result=result.takeRight(-start);}else if(start){result=result.drop(start);}if(end!==undefined){end=+end||0;result=end<0?result.dropRight(-end):result.take(end-start);}return result;};LazyWrapper.prototype.takeRightWhile=function(predicate,thisArg){return this.reverse().takeWhile(predicate,thisArg).reverse();};LazyWrapper.prototype.toArray=function(){return this.take(POSITIVE_INFINITY);};// Add `LazyWrapper` methods to `lodash.prototype`.
baseForOwn(LazyWrapper.prototype,function(func,methodName){var checkIteratee=/^(?:filter|map|reject)|While$/.test(methodName),retUnwrapped=/^(?:first|last)$/.test(methodName),lodashFunc=lodash[retUnwrapped?'take'+(methodName=='last'?'Right':''):methodName];if(!lodashFunc){return;}lodash.prototype[methodName]=function(){var args=retUnwrapped?[1]:arguments,chainAll=this.__chain__,value=this.__wrapped__,isHybrid=!!this.__actions__.length,isLazy=value instanceof LazyWrapper,iteratee=args[0],useLazy=isLazy||isArray(value);if(useLazy&&checkIteratee&&typeof iteratee=='function'&&iteratee.length!=1){// Avoid lazy use if the iteratee has a "length" value other than `1`.
isLazy=useLazy=false;}var interceptor=function interceptor(value){return retUnwrapped&&chainAll?lodashFunc(value,1)[0]:lodashFunc.apply(undefined,arrayPush([value],args));};var action={'func':thru,'args':[interceptor],'thisArg':undefined},onlyLazy=isLazy&&!isHybrid;if(retUnwrapped&&!chainAll){if(onlyLazy){value=value.clone();value.__actions__.push(action);return func.call(value);}return lodashFunc.call(undefined,this.value())[0];}if(!retUnwrapped&&useLazy){value=onlyLazy?value:new LazyWrapper(this);var result=func.apply(value,args);result.__actions__.push(action);return new LodashWrapper(result,chainAll);}return this.thru(interceptor);};});// Add `Array` and `String` methods to `lodash.prototype`.
arrayEach(['join','pop','push','replace','shift','sort','splice','split','unshift'],function(methodName){var func=(/^(?:replace|split)$/.test(methodName)?stringProto:arrayProto)[methodName],chainName=/^(?:push|sort|unshift)$/.test(methodName)?'tap':'thru',retUnwrapped=/^(?:join|pop|replace|shift)$/.test(methodName);lodash.prototype[methodName]=function(){var args=arguments;if(retUnwrapped&&!this.__chain__){return func.apply(this.value(),args);}return this[chainName](function(value){return func.apply(value,args);});};});// Map minified function names to their real names.
baseForOwn(LazyWrapper.prototype,function(func,methodName){var lodashFunc=lodash[methodName];if(lodashFunc){var key=lodashFunc.name,names=realNames[key]||(realNames[key]=[]);names.push({'name':methodName,'func':lodashFunc});}});realNames[createHybridWrapper(undefined,BIND_KEY_FLAG).name]=[{'name':'wrapper','func':undefined}];// Add functions to the lazy wrapper.
LazyWrapper.prototype.clone=lazyClone;LazyWrapper.prototype.reverse=lazyReverse;LazyWrapper.prototype.value=lazyValue;// Add chaining functions to the `lodash` wrapper.
lodash.prototype.chain=wrapperChain;lodash.prototype.commit=wrapperCommit;lodash.prototype.concat=wrapperConcat;lodash.prototype.plant=wrapperPlant;lodash.prototype.reverse=wrapperReverse;lodash.prototype.toString=wrapperToString;lodash.prototype.run=lodash.prototype.toJSON=lodash.prototype.valueOf=lodash.prototype.value=wrapperValue;// Add function aliases to the `lodash` wrapper.
lodash.prototype.collect=lodash.prototype.map;lodash.prototype.head=lodash.prototype.first;lodash.prototype.select=lodash.prototype.filter;lodash.prototype.tail=lodash.prototype.rest;return lodash;}/*--------------------------------------------------------------------------*/// Export lodash.
var _=runInContext();// Some AMD build optimizers like r.js check for condition patterns like the following:
if(typeof define=='function'&&_typeof(define.amd)=='object'&&define.amd){// Expose lodash to the global object when an AMD loader is present to avoid
// errors in cases where lodash is loaded by a script tag and not intended
// as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
// more details.
root._=_;// Define as an anonymous module so, through path mapping, it can be
// referenced as the "underscore" module.
define(function(){return _;});}// Check for `exports` after `define` in case a build optimizer adds an `exports` object.
else if(freeExports&&freeModule){// Export for Node.js or RingoJS.
if(moduleExports){(freeModule.exports=_)._=_;}// Export for Rhino with CommonJS support.
else{freeExports._=_;}}else{// Export for a browser or Rhino.
root._=_;}}).call(commonjsGlobal);});var __moduleExports$23=createCommonjsModule(function(module){/* global window */var lodash;if('function'==="function"){try{lodash=__moduleExports$24;}catch(e){}}if(!lodash){lodash=window._;}module.exports=lodash;});var __moduleExports$27=createCommonjsModule(function(module){/*
 * Simple doubly linked list implementation derived from Cormen, et al.,
 * "Introduction to Algorithms".
 */module.exports=List;function List(){var sentinel={};sentinel._next=sentinel._prev=sentinel;this._sentinel=sentinel;}List.prototype.dequeue=function(){var sentinel=this._sentinel,entry=sentinel._prev;if(entry!==sentinel){unlink(entry);return entry;}};List.prototype.enqueue=function(entry){var sentinel=this._sentinel;if(entry._prev&&entry._next){unlink(entry);}entry._next=sentinel._next;sentinel._next._prev=entry;sentinel._next=entry;entry._prev=sentinel;};List.prototype.toString=function(){var strs=[],sentinel=this._sentinel,curr=sentinel._prev;while(curr!==sentinel){strs.push(JSON.stringify(curr,filterOutLinks));curr=curr._prev;}return"["+strs.join(", ")+"]";};function unlink(entry){entry._prev._next=entry._next;entry._next._prev=entry._prev;delete entry._next;delete entry._prev;}function filterOutLinks(k,v){if(k!=="_next"&&k!=="_prev"){return v;}}});var __moduleExports$26=createCommonjsModule(function(module){var _=__moduleExports$23,Graph=__moduleExports.Graph,List=__moduleExports$27;/*
 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
 * arc set is a set of edges that can be removed to make a graph acyclic.
 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
 * effective heuristic for the feedback arc set problem." This implementation
 * adjusts that from the paper to allow for weighted edges.
 */module.exports=greedyFAS;var DEFAULT_WEIGHT_FN=_.constant(1);function greedyFAS(g,weightFn){if(g.nodeCount()<=1){return[];}var state=buildState(g,weightFn||DEFAULT_WEIGHT_FN);var results=doGreedyFAS(state.graph,state.buckets,state.zeroIdx);// Expand multi-edges
return _.flatten(_.map(results,function(e){return g.outEdges(e.v,e.w);}),true);}function doGreedyFAS(g,buckets,zeroIdx){var results=[],sources=buckets[buckets.length-1],sinks=buckets[0];var entry;while(g.nodeCount()){while(entry=sinks.dequeue()){removeNode(g,buckets,zeroIdx,entry);}while(entry=sources.dequeue()){removeNode(g,buckets,zeroIdx,entry);}if(g.nodeCount()){for(var i=buckets.length-2;i>0;--i){entry=buckets[i].dequeue();if(entry){results=results.concat(removeNode(g,buckets,zeroIdx,entry,true));break;}}}}return results;}function removeNode(g,buckets,zeroIdx,entry,collectPredecessors){var results=collectPredecessors?[]:undefined;_.each(g.inEdges(entry.v),function(edge){var weight=g.edge(edge),uEntry=g.node(edge.v);if(collectPredecessors){results.push({v:edge.v,w:edge.w});}uEntry.out-=weight;assignBucket(buckets,zeroIdx,uEntry);});_.each(g.outEdges(entry.v),function(edge){var weight=g.edge(edge),w=edge.w,wEntry=g.node(w);wEntry["in"]-=weight;assignBucket(buckets,zeroIdx,wEntry);});g.removeNode(entry.v);return results;}function buildState(g,weightFn){var fasGraph=new Graph(),maxIn=0,maxOut=0;_.each(g.nodes(),function(v){fasGraph.setNode(v,{v:v,"in":0,out:0});});// Aggregate weights on nodes, but also sum the weights across multi-edges
// into a single edge for the fasGraph.
_.each(g.edges(),function(e){var prevWeight=fasGraph.edge(e.v,e.w)||0,weight=weightFn(e),edgeWeight=prevWeight+weight;fasGraph.setEdge(e.v,e.w,edgeWeight);maxOut=Math.max(maxOut,fasGraph.node(e.v).out+=weight);maxIn=Math.max(maxIn,fasGraph.node(e.w)["in"]+=weight);});var buckets=_.range(maxOut+maxIn+3).map(function(){return new List();});var zeroIdx=maxIn+1;_.each(fasGraph.nodes(),function(v){assignBucket(buckets,zeroIdx,fasGraph.node(v));});return{graph:fasGraph,buckets:buckets,zeroIdx:zeroIdx};}function assignBucket(buckets,zeroIdx,entry){if(!entry.out){buckets[0].enqueue(entry);}else if(!entry["in"]){buckets[buckets.length-1].enqueue(entry);}else{buckets[entry.out-entry["in"]+zeroIdx].enqueue(entry);}}});var __moduleExports$25=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,greedyFAS=__moduleExports$26;module.exports={run:run,undo:undo};function run(g){var fas=g.graph().acyclicer==="greedy"?greedyFAS(g,weightFn(g)):dfsFAS(g);_.each(fas,function(e){var label=g.edge(e);g.removeEdge(e);label.forwardName=e.name;label.reversed=true;g.setEdge(e.w,e.v,label,_.uniqueId("rev"));});function weightFn(g){return function(e){return g.edge(e).weight;};}}function dfsFAS(g){var fas=[],stack={},visited={};function dfs(v){if(_.has(visited,v)){return;}visited[v]=true;stack[v]=true;_.each(g.outEdges(v),function(e){if(_.has(stack,e.w)){fas.push(e);}else{dfs(e.w);}});delete stack[v];}_.each(g.nodes(),dfs);return fas;}function undo(g){_.each(g.edges(),function(e){var label=g.edge(e);if(label.reversed){g.removeEdge(e);var forwardName=label.forwardName;delete label.reversed;delete label.forwardName;g.setEdge(e.w,e.v,label,forwardName);}});}});var __moduleExports$29=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,Graph=__moduleExports.Graph;module.exports={addDummyNode:addDummyNode,simplify:simplify,asNonCompoundGraph:asNonCompoundGraph,successorWeights:successorWeights,predecessorWeights:predecessorWeights,intersectRect:intersectRect,buildLayerMatrix:buildLayerMatrix,normalizeRanks:normalizeRanks,removeEmptyRanks:removeEmptyRanks,addBorderNode:addBorderNode,maxRank:maxRank,partition:partition,time:time,notime:notime};/*
 * Adds a dummy node to the graph and return v.
 */function addDummyNode(g,type,attrs,name){var v;do{v=_.uniqueId(name);}while(g.hasNode(v));attrs.dummy=type;g.setNode(v,attrs);return v;}/*
 * Returns a new graph with only simple edges. Handles aggregation of data
 * associated with multi-edges.
 */function simplify(g){var simplified=new Graph().setGraph(g.graph());_.each(g.nodes(),function(v){simplified.setNode(v,g.node(v));});_.each(g.edges(),function(e){var simpleLabel=simplified.edge(e.v,e.w)||{weight:0,minlen:1},label=g.edge(e);simplified.setEdge(e.v,e.w,{weight:simpleLabel.weight+label.weight,minlen:Math.max(simpleLabel.minlen,label.minlen)});});return simplified;}function asNonCompoundGraph(g){var simplified=new Graph({multigraph:g.isMultigraph()}).setGraph(g.graph());_.each(g.nodes(),function(v){if(!g.children(v).length){simplified.setNode(v,g.node(v));}});_.each(g.edges(),function(e){simplified.setEdge(e,g.edge(e));});return simplified;}function successorWeights(g){var weightMap=_.map(g.nodes(),function(v){var sucs={};_.each(g.outEdges(v),function(e){sucs[e.w]=(sucs[e.w]||0)+g.edge(e).weight;});return sucs;});return _.zipObject(g.nodes(),weightMap);}function predecessorWeights(g){var weightMap=_.map(g.nodes(),function(v){var preds={};_.each(g.inEdges(v),function(e){preds[e.v]=(preds[e.v]||0)+g.edge(e).weight;});return preds;});return _.zipObject(g.nodes(),weightMap);}/*
 * Finds where a line starting at point ({x, y}) would intersect a rectangle
 * ({x, y, width, height}) if it were pointing at the rectangle's center.
 */function intersectRect(rect,point){var x=rect.x;var y=rect.y;// Rectangle intersection algorithm from:
// http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
var dx=point.x-x;var dy=point.y-y;var w=rect.width/2;var h=rect.height/2;if(!dx&&!dy){throw new Error("Not possible to find intersection inside of the rectangle");}var sx,sy;if(Math.abs(dy)*w>Math.abs(dx)*h){// Intersection is top or bottom of rect.
if(dy<0){h=-h;}sx=h*dx/dy;sy=h;}else{// Intersection is left or right of rect.
if(dx<0){w=-w;}sx=w;sy=w*dy/dx;}return{x:x+sx,y:y+sy};}/*
 * Given a DAG with each node assigned "rank" and "order" properties, this
 * function will produce a matrix with the ids of each node.
 */function buildLayerMatrix(g){var layering=_.map(_.range(maxRank(g)+1),function(){return[];});_.each(g.nodes(),function(v){var node=g.node(v),rank=node.rank;if(!_.isUndefined(rank)){layering[rank][node.order]=v;}});return layering;}/*
 * Adjusts the ranks for all nodes in the graph such that all nodes v have
 * rank(v) >= 0 and at least one node w has rank(w) = 0.
 */function normalizeRanks(g){var min=_.min(_.map(g.nodes(),function(v){return g.node(v).rank;}));_.each(g.nodes(),function(v){var node=g.node(v);if(_.has(node,"rank")){node.rank-=min;}});}function removeEmptyRanks(g){// Ranks may not start at 0, so we need to offset them
var offset=_.min(_.map(g.nodes(),function(v){return g.node(v).rank;}));var layers=[];_.each(g.nodes(),function(v){var rank=g.node(v).rank-offset;if(!layers[rank]){layers[rank]=[];}layers[rank].push(v);});var delta=0,nodeRankFactor=g.graph().nodeRankFactor;_.each(layers,function(vs,i){if(_.isUndefined(vs)&&i%nodeRankFactor!==0){--delta;}else if(delta){_.each(vs,function(v){g.node(v).rank+=delta;});}});}function addBorderNode(g,prefix,rank,order){var node={width:0,height:0};if(arguments.length>=4){node.rank=rank;node.order=order;}return addDummyNode(g,"border",node,prefix);}function maxRank(g){return _.max(_.map(g.nodes(),function(v){var rank=g.node(v).rank;if(!_.isUndefined(rank)){return rank;}}));}/*
 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
 * function returns true for an entry it goes into `lhs`. Otherwise it goes
 * into `rhs.
 */function partition(collection,fn){var result={lhs:[],rhs:[]};_.each(collection,function(value){if(fn(value)){result.lhs.push(value);}else{result.rhs.push(value);}});return result;}/*
 * Returns a new function that wraps `fn` with a timer. The wrapper logs the
 * time it takes to execute the function.
 */function time(name,fn){var start=_.now();try{return fn();}finally{console.log(name+" time: "+(_.now()-start)+"ms");}}function notime(name,fn){return fn();}});var __moduleExports$28=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,util=__moduleExports$29;module.exports={run:run,undo:undo};/*
 * Breaks any long edges in the graph into short segments that span 1 layer
 * each. This operation is undoable with the denormalize function.
 *
 * Pre-conditions:
 *
 *    1. The input graph is a DAG.
 *    2. Each node in the graph has a "rank" property.
 *
 * Post-condition:
 *
 *    1. All edges in the graph have a length of 1.
 *    2. Dummy nodes are added where edges have been split into segments.
 *    3. The graph is augmented with a "dummyChains" attribute which contains
 *       the first dummy in each chain of dummy nodes produced.
 */function run(g){g.graph().dummyChains=[];_.each(g.edges(),function(edge){normalizeEdge(g,edge);});}function normalizeEdge(g,e){var v=e.v,vRank=g.node(v).rank,w=e.w,wRank=g.node(w).rank,name=e.name,edgeLabel=g.edge(e),labelRank=edgeLabel.labelRank;if(wRank===vRank+1)return;g.removeEdge(e);var dummy,attrs,i;for(i=0,++vRank;vRank<wRank;++i,++vRank){edgeLabel.points=[];attrs={width:0,height:0,edgeLabel:edgeLabel,edgeObj:e,rank:vRank};dummy=util.addDummyNode(g,"edge",attrs,"_d");if(vRank===labelRank){attrs.width=edgeLabel.width;attrs.height=edgeLabel.height;attrs.dummy="edge-label";attrs.labelpos=edgeLabel.labelpos;}g.setEdge(v,dummy,{weight:edgeLabel.weight},name);if(i===0){g.graph().dummyChains.push(dummy);}v=dummy;}g.setEdge(v,w,{weight:edgeLabel.weight},name);}function undo(g){_.each(g.graph().dummyChains,function(v){var node=g.node(v),origLabel=node.edgeLabel,w;g.setEdge(node.edgeObj,origLabel);while(node.dummy){w=g.successors(v)[0];g.removeNode(v);origLabel.points.push({x:node.x,y:node.y});if(node.dummy==="edge-label"){origLabel.x=node.x;origLabel.y=node.y;origLabel.width=node.width;origLabel.height=node.height;}v=w;node=g.node(v);}});}});var __moduleExports$31=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23;module.exports={longestPath:longestPath,slack:slack};/*
 * Initializes ranks for the input graph using the longest path algorithm. This
 * algorithm scales well and is fast in practice, it yields rather poor
 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
 * ranks wide and leaving edges longer than necessary. However, due to its
 * speed, this algorithm is good for getting an initial ranking that can be fed
 * into other algorithms.
 *
 * This algorithm does not normalize layers because it will be used by other
 * algorithms in most cases. If using this algorithm directly, be sure to
 * run normalize at the end.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG.
 *    2. Input graph node labels can be assigned properties.
 *
 * Post-conditions:
 *
 *    1. Each node will be assign an (unnormalized) "rank" property.
 */function longestPath(g){var visited={};function dfs(v){var label=g.node(v);if(_.has(visited,v)){return label.rank;}visited[v]=true;var rank=_.min(_.map(g.outEdges(v),function(e){return dfs(e.w)-g.edge(e).minlen;}));if(rank===Number.POSITIVE_INFINITY){rank=0;}return label.rank=rank;}_.each(g.sources(),dfs);}/*
 * Returns the amount of slack for the given edge. The slack is defined as the
 * difference between the length of the edge and its minimum length.
 */function slack(g,e){return g.node(e.w).rank-g.node(e.v).rank-g.edge(e).minlen;}});var __moduleExports$32=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,Graph=__moduleExports.Graph,slack=__moduleExports$31.slack;module.exports=feasibleTree;/*
 * Constructs a spanning tree with tight edges and adjusted the input node's
 * ranks to achieve this. A tight edge is one that is has a length that matches
 * its "minlen" attribute.
 *
 * The basic structure for this function is derived from Gansner, et al., "A
 * Technique for Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a DAG.
 *    2. Graph must be connected.
 *    3. Graph must have at least one node.
 *    5. Graph nodes must have been previously assigned a "rank" property that
 *       respects the "minlen" property of incident edges.
 *    6. Graph edges must have a "minlen" property.
 *
 * Post-conditions:
 *
 *    - Graph nodes will have their rank adjusted to ensure that all edges are
 *      tight.
 *
 * Returns a tree (undirected graph) that is constructed using only "tight"
 * edges.
 */function feasibleTree(g){var t=new Graph({directed:false});// Choose arbitrary node from which to start our tree
var start=g.nodes()[0],size=g.nodeCount();t.setNode(start,{});var edge,delta;while(tightTree(t,g)<size){edge=findMinSlackEdge(t,g);delta=t.hasNode(edge.v)?slack(g,edge):-slack(g,edge);shiftRanks(t,g,delta);}return t;}/*
 * Finds a maximal tree of tight edges and returns the number of nodes in the
 * tree.
 */function tightTree(t,g){function dfs(v){_.each(g.nodeEdges(v),function(e){var edgeV=e.v,w=v===edgeV?e.w:edgeV;if(!t.hasNode(w)&&!slack(g,e)){t.setNode(w,{});t.setEdge(v,w,{});dfs(w);}});}_.each(t.nodes(),dfs);return t.nodeCount();}/*
 * Finds the edge with the smallest slack that is incident on tree and returns
 * it.
 */function findMinSlackEdge(t,g){return _.min(g.edges(),function(e){if(t.hasNode(e.v)!==t.hasNode(e.w)){return slack(g,e);}});}function shiftRanks(t,g,delta){_.each(t.nodes(),function(v){g.node(v).rank+=delta;});}});var __moduleExports$33=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,feasibleTree=__moduleExports$32,slack=__moduleExports$31.slack,initRank=__moduleExports$31.longestPath,preorder=__moduleExports.alg.preorder,postorder=__moduleExports.alg.postorder,simplify=__moduleExports$29.simplify;module.exports=networkSimplex;// Expose some internals for testing purposes
networkSimplex.initLowLimValues=initLowLimValues;networkSimplex.initCutValues=initCutValues;networkSimplex.calcCutValue=calcCutValue;networkSimplex.leaveEdge=leaveEdge;networkSimplex.enterEdge=enterEdge;networkSimplex.exchangeEdges=exchangeEdges;/*
 * The network simplex algorithm assigns ranks to each node in the input graph
 * and iteratively improves the ranking to reduce the length of edges.
 *
 * Preconditions:
 *
 *    1. The input graph must be a DAG.
 *    2. All nodes in the graph must have an object value.
 *    3. All edges in the graph must have "minlen" and "weight" attributes.
 *
 * Postconditions:
 *
 *    1. All nodes in the graph will have an assigned "rank" attribute that has
 *       been optimized by the network simplex algorithm. Ranks start at 0.
 *
 *
 * A rough sketch of the algorithm is as follows:
 *
 *    1. Assign initial ranks to each node. We use the longest path algorithm,
 *       which assigns ranks to the lowest position possible. In general this
 *       leads to very wide bottom ranks and unnecessarily long edges.
 *    2. Construct a feasible tight tree. A tight tree is one such that all
 *       edges in the tree have no slack (difference between length of edge
 *       and minlen for the edge). This by itself greatly improves the assigned
 *       rankings by shorting edges.
 *    3. Iteratively find edges that have negative cut values. Generally a
 *       negative cut value indicates that the edge could be removed and a new
 *       tree edge could be added to produce a more compact graph.
 *
 * Much of the algorithms here are derived from Gansner, et al., "A Technique
 * for Drawing Directed Graphs." The structure of the file roughly follows the
 * structure of the overall algorithm.
 */function networkSimplex(g){g=simplify(g);initRank(g);var t=feasibleTree(g);initLowLimValues(t);initCutValues(t,g);var e,f;while(e=leaveEdge(t)){f=enterEdge(t,g,e);exchangeEdges(t,g,e,f);}}/*
 * Initializes cut values for all edges in the tree.
 */function initCutValues(t,g){var vs=postorder(t,t.nodes());vs=vs.slice(0,vs.length-1);_.each(vs,function(v){assignCutValue(t,g,v);});}function assignCutValue(t,g,child){var childLab=t.node(child),parent=childLab.parent;t.edge(child,parent).cutvalue=calcCutValue(t,g,child);}/*
 * Given the tight tree, its graph, and a child in the graph calculate and
 * return the cut value for the edge between the child and its parent.
 */function calcCutValue(t,g,child){var childLab=t.node(child),parent=childLab.parent,// True if the child is on the tail end of the edge in the directed graph
childIsTail=true,// The graph's view of the tree edge we're inspecting
graphEdge=g.edge(child,parent),// The accumulated cut value for the edge between this node and its parent
cutValue=0;if(!graphEdge){childIsTail=false;graphEdge=g.edge(parent,child);}cutValue=graphEdge.weight;_.each(g.nodeEdges(child),function(e){var isOutEdge=e.v===child,other=isOutEdge?e.w:e.v;if(other!==parent){var pointsToHead=isOutEdge===childIsTail,otherWeight=g.edge(e).weight;cutValue+=pointsToHead?otherWeight:-otherWeight;if(isTreeEdge(t,child,other)){var otherCutValue=t.edge(child,other).cutvalue;cutValue+=pointsToHead?-otherCutValue:otherCutValue;}}});return cutValue;}function initLowLimValues(tree,root){if(arguments.length<2){root=tree.nodes()[0];}dfsAssignLowLim(tree,{},1,root);}function dfsAssignLowLim(tree,visited,nextLim,v,parent){var low=nextLim,label=tree.node(v);visited[v]=true;_.each(tree.neighbors(v),function(w){if(!_.has(visited,w)){nextLim=dfsAssignLowLim(tree,visited,nextLim,w,v);}});label.low=low;label.lim=nextLim++;if(parent){label.parent=parent;}else{// TODO should be able to remove this when we incrementally update low lim
delete label.parent;}return nextLim;}function leaveEdge(tree){return _.find(tree.edges(),function(e){return tree.edge(e).cutvalue<0;});}function enterEdge(t,g,edge){var v=edge.v,w=edge.w;// For the rest of this function we assume that v is the tail and w is the
// head, so if we don't have this edge in the graph we should flip it to
// match the correct orientation.
if(!g.hasEdge(v,w)){v=edge.w;w=edge.v;}var vLabel=t.node(v),wLabel=t.node(w),tailLabel=vLabel,flip=false;// If the root is in the tail of the edge then we need to flip the logic that
// checks for the head and tail nodes in the candidates function below.
if(vLabel.lim>wLabel.lim){tailLabel=wLabel;flip=true;}var candidates=_.filter(g.edges(),function(edge){return flip===isDescendant(t,t.node(edge.v),tailLabel)&&flip!==isDescendant(t,t.node(edge.w),tailLabel);});return _.min(candidates,function(edge){return slack(g,edge);});}function exchangeEdges(t,g,e,f){var v=e.v,w=e.w;t.removeEdge(v,w);t.setEdge(f.v,f.w,{});initLowLimValues(t);initCutValues(t,g);updateRanks(t,g);}function updateRanks(t,g){var root=_.find(t.nodes(),function(v){return!g.node(v).parent;}),vs=preorder(t,root);vs=vs.slice(1);_.each(vs,function(v){var parent=t.node(v).parent,edge=g.edge(v,parent),flipped=false;if(!edge){edge=g.edge(parent,v);flipped=true;}g.node(v).rank=g.node(parent).rank+(flipped?edge.minlen:-edge.minlen);});}/*
 * Returns true if the edge is in the tree.
 */function isTreeEdge(tree,u,v){return tree.hasEdge(u,v);}/*
 * Returns true if the specified node is descendant of the root node per the
 * assigned low and lim attributes in the tree.
 */function isDescendant(tree,vLabel,rootLabel){return rootLabel.low<=vLabel.lim&&vLabel.lim<=rootLabel.lim;}});var __moduleExports$30=createCommonjsModule(function(module){"use strict";var rankUtil=__moduleExports$31,longestPath=rankUtil.longestPath,feasibleTree=__moduleExports$32,networkSimplex=__moduleExports$33;module.exports=rank;/*
 * Assigns a rank to each node in the input graph that respects the "minlen"
 * constraint specified on edges between nodes.
 *
 * This basic structure is derived from Gansner, et al., "A Technique for
 * Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a connected DAG
 *    2. Graph nodes must be objects
 *    3. Graph edges must have "weight" and "minlen" attributes
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have a "rank" attribute based on the results of the
 *       algorithm. Ranks can start at any index (including negative), we'll
 *       fix them up later.
 */function rank(g){switch(g.graph().ranker){case"network-simplex":networkSimplexRanker(g);break;case"tight-tree":tightTreeRanker(g);break;case"longest-path":longestPathRanker(g);break;default:networkSimplexRanker(g);}}// A fast and simple ranker, but results are far from optimal.
var longestPathRanker=longestPath;function tightTreeRanker(g){longestPath(g);feasibleTree(g);}function networkSimplexRanker(g){networkSimplex(g);}});var __moduleExports$34=createCommonjsModule(function(module){var _=__moduleExports$23;module.exports=parentDummyChains;function parentDummyChains(g){var postorderNums=postorder(g);_.each(g.graph().dummyChains,function(v){var node=g.node(v),edgeObj=node.edgeObj,pathData=findPath(g,postorderNums,edgeObj.v,edgeObj.w),path=pathData.path,lca=pathData.lca,pathIdx=0,pathV=path[pathIdx],ascending=true;while(v!==edgeObj.w){node=g.node(v);if(ascending){while((pathV=path[pathIdx])!==lca&&g.node(pathV).maxRank<node.rank){pathIdx++;}if(pathV===lca){ascending=false;}}if(!ascending){while(pathIdx<path.length-1&&g.node(pathV=path[pathIdx+1]).minRank<=node.rank){pathIdx++;}pathV=path[pathIdx];}g.setParent(v,pathV);v=g.successors(v)[0];}});}// Find a path from v to w through the lowest common ancestor (LCA). Return the
// full path and the LCA.
function findPath(g,postorderNums,v,w){var vPath=[],wPath=[],low=Math.min(postorderNums[v].low,postorderNums[w].low),lim=Math.max(postorderNums[v].lim,postorderNums[w].lim),parent,lca;// Traverse up from v to find the LCA
parent=v;do{parent=g.parent(parent);vPath.push(parent);}while(parent&&(postorderNums[parent].low>low||lim>postorderNums[parent].lim));lca=parent;// Traverse from w to LCA
parent=w;while((parent=g.parent(parent))!==lca){wPath.push(parent);}return{path:vPath.concat(wPath.reverse()),lca:lca};}function postorder(g){var result={},lim=0;function dfs(v){var low=lim;_.each(g.children(v),dfs);result[v]={low:low,lim:lim++};}_.each(g.children(),dfs);return result;}});var __moduleExports$35=createCommonjsModule(function(module){var _=__moduleExports$23,util=__moduleExports$29;module.exports={run:run,cleanup:cleanup};/*
 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
 * adds appropriate edges to ensure that all cluster nodes are placed between
 * these boundries, and ensures that the graph is connected.
 *
 * In addition we ensure, through the use of the minlen property, that nodes
 * and subgraph border nodes to not end up on the same rank.
 *
 * Preconditions:
 *
 *    1. Input graph is a DAG
 *    2. Nodes in the input graph has a minlen attribute
 *
 * Postconditions:
 *
 *    1. Input graph is connected.
 *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
 *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
 *       get placed on the same rank as subgraph border nodes.
 *
 * The nesting graph idea comes from Sander, "Layout of Compound Directed
 * Graphs."
 */function run(g){var root=util.addDummyNode(g,"root",{},"_root"),depths=treeDepths(g),height=_.max(depths)-1,nodeSep=2*height+1;g.graph().nestingRoot=root;// Multiply minlen by nodeSep to align nodes on non-border ranks.
_.each(g.edges(),function(e){g.edge(e).minlen*=nodeSep;});// Calculate a weight that is sufficient to keep subgraphs vertically compact
var weight=sumWeights(g)+1;// Create border nodes and link them up
_.each(g.children(),function(child){dfs(g,root,nodeSep,weight,height,depths,child);});// Save the multiplier for node layers for later removal of empty border
// layers.
g.graph().nodeRankFactor=nodeSep;}function dfs(g,root,nodeSep,weight,height,depths,v){var children=g.children(v);if(!children.length){if(v!==root){g.setEdge(root,v,{weight:0,minlen:nodeSep});}return;}var top=util.addBorderNode(g,"_bt"),bottom=util.addBorderNode(g,"_bb"),label=g.node(v);g.setParent(top,v);label.borderTop=top;g.setParent(bottom,v);label.borderBottom=bottom;_.each(children,function(child){dfs(g,root,nodeSep,weight,height,depths,child);var childNode=g.node(child),childTop=childNode.borderTop?childNode.borderTop:child,childBottom=childNode.borderBottom?childNode.borderBottom:child,thisWeight=childNode.borderTop?weight:2*weight,minlen=childTop!==childBottom?1:height-depths[v]+1;g.setEdge(top,childTop,{weight:thisWeight,minlen:minlen,nestingEdge:true});g.setEdge(childBottom,bottom,{weight:thisWeight,minlen:minlen,nestingEdge:true});});if(!g.parent(v)){g.setEdge(root,top,{weight:0,minlen:height+depths[v]});}}function treeDepths(g){var depths={};function dfs(v,depth){var children=g.children(v);if(children&&children.length){_.each(children,function(child){dfs(child,depth+1);});}depths[v]=depth;}_.each(g.children(),function(v){dfs(v,1);});return depths;}function sumWeights(g){return _.reduce(g.edges(),function(acc,e){return acc+g.edge(e).weight;},0);}function cleanup(g){var graphLabel=g.graph();g.removeNode(graphLabel.nestingRoot);delete graphLabel.nestingRoot;_.each(g.edges(),function(e){var edge=g.edge(e);if(edge.nestingEdge){g.removeEdge(e);}});}});var __moduleExports$36=createCommonjsModule(function(module){var _=__moduleExports$23,util=__moduleExports$29;module.exports=addBorderSegments;function addBorderSegments(g){function dfs(v){var children=g.children(v),node=g.node(v);if(children.length){_.each(children,dfs);}if(_.has(node,"minRank")){node.borderLeft=[];node.borderRight=[];for(var rank=node.minRank,maxRank=node.maxRank+1;rank<maxRank;++rank){addBorderNode(g,"borderLeft","_bl",v,node,rank);addBorderNode(g,"borderRight","_br",v,node,rank);}}}_.each(g.children(),dfs);}function addBorderNode(g,prop,prefix,sg,sgNode,rank){var label={width:0,height:0,rank:rank,borderType:prop},prev=sgNode[prop][rank-1],curr=util.addDummyNode(g,"border",label,prefix);sgNode[prop][rank]=curr;g.setParent(curr,sg);if(prev){g.setEdge(prev,curr,{weight:1});}}});var __moduleExports$37=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23;module.exports={adjust:adjust,undo:undo};function adjust(g){var rankDir=g.graph().rankdir.toLowerCase();if(rankDir==="lr"||rankDir==="rl"){swapWidthHeight(g);}}function undo(g){var rankDir=g.graph().rankdir.toLowerCase();if(rankDir==="bt"||rankDir==="rl"){reverseY(g);}if(rankDir==="lr"||rankDir==="rl"){swapXY(g);swapWidthHeight(g);}}function swapWidthHeight(g){_.each(g.nodes(),function(v){swapWidthHeightOne(g.node(v));});_.each(g.edges(),function(e){swapWidthHeightOne(g.edge(e));});}function swapWidthHeightOne(attrs){var w=attrs.width;attrs.width=attrs.height;attrs.height=w;}function reverseY(g){_.each(g.nodes(),function(v){reverseYOne(g.node(v));});_.each(g.edges(),function(e){var edge=g.edge(e);_.each(edge.points,reverseYOne);if(_.has(edge,"y")){reverseYOne(edge);}});}function reverseYOne(attrs){attrs.y=-attrs.y;}function swapXY(g){_.each(g.nodes(),function(v){swapXYOne(g.node(v));});_.each(g.edges(),function(e){var edge=g.edge(e);_.each(edge.points,swapXYOne);if(_.has(edge,"x")){swapXYOne(edge);}});}function swapXYOne(attrs){var x=attrs.x;attrs.x=attrs.y;attrs.y=x;}});var __moduleExports$39=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23;module.exports=initOrder;/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */function initOrder(g){var visited={},simpleNodes=_.filter(g.nodes(),function(v){return!g.children(v).length;}),maxRank=_.max(_.map(simpleNodes,function(v){return g.node(v).rank;})),layers=_.map(_.range(maxRank+1),function(){return[];});function dfs(v){if(_.has(visited,v))return;visited[v]=true;var node=g.node(v);layers[node.rank].push(v);_.each(g.successors(v),dfs);}var orderedVs=_.sortBy(simpleNodes,function(v){return g.node(v).rank;});_.each(orderedVs,dfs);return layers;}});var __moduleExports$40=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23;module.exports=crossCount;/*
 * A function that takes a layering (an array of layers, each with an array of
 * ordererd nodes) and a graph and returns a weighted crossing count.
 *
 * Pre-conditions:
 *
 *    1. Input graph must be simple (not a multigraph), directed, and include
 *       only simple edges.
 *    2. Edges in the input graph must have assigned weights.
 *
 * Post-conditions:
 *
 *    1. The graph and layering matrix are left unchanged.
 *
 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
 */function crossCount(g,layering){var cc=0;for(var i=1;i<layering.length;++i){cc+=twoLayerCrossCount(g,layering[i-1],layering[i]);}return cc;}function twoLayerCrossCount(g,northLayer,southLayer){// Sort all of the edges between the north and south layers by their position
// in the north layer and then the south. Map these edges to the position of
// their head in the south layer.
var southPos=_.zipObject(southLayer,_.map(southLayer,function(v,i){return i;}));var southEntries=_.flatten(_.map(northLayer,function(v){return _.chain(g.outEdges(v)).map(function(e){return{pos:southPos[e.w],weight:g.edge(e).weight};}).sortBy("pos").value();}),true);// Build the accumulator tree
var firstIndex=1;while(firstIndex<southLayer.length){firstIndex<<=1;}var treeSize=2*firstIndex-1;firstIndex-=1;var tree=_.map(new Array(treeSize),function(){return 0;});// Calculate the weighted crossings
var cc=0;_.each(southEntries.forEach(function(entry){var index=entry.pos+firstIndex;tree[index]+=entry.weight;var weightSum=0;while(index>0){if(index%2){weightSum+=tree[index+1];}index=index-1>>1;tree[index]+=entry.weight;}cc+=entry.weight*weightSum;}));return cc;}});var __moduleExports$42=createCommonjsModule(function(module){var _=__moduleExports$23;module.exports=barycenter;function barycenter(g,movable){return _.map(movable,function(v){var inV=g.inEdges(v);if(!inV.length){return{v:v};}else{var result=_.reduce(inV,function(acc,e){var edge=g.edge(e),nodeU=g.node(e.v);return{sum:acc.sum+edge.weight*nodeU.order,weight:acc.weight+edge.weight};},{sum:0,weight:0});return{v:v,barycenter:result.sum/result.weight,weight:result.weight};}});}});var __moduleExports$43=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23;module.exports=resolveConflicts;/*
 * Given a list of entries of the form {v, barycenter, weight} and a
 * constraint graph this function will resolve any conflicts between the
 * constraint graph and the barycenters for the entries. If the barycenters for
 * an entry would violate a constraint in the constraint graph then we coalesce
 * the nodes in the conflict into a new node that respects the contraint and
 * aggregates barycenter and weight information.
 *
 * This implementation is based on the description in Forster, "A Fast and
 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
 * differs in some specific details.
 *
 * Pre-conditions:
 *
 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
 *       no barycenter, then {v}.
 *
 * Returns:
 *
 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
 *    `vs` may either be a singleton or it may be an aggregation of nodes
 *    ordered such that they do not violate constraints from the constraint
 *    graph. The property `i` is the lowest original index of any of the
 *    elements in `vs`.
 */function resolveConflicts(entries,cg){var mappedEntries={};_.each(entries,function(entry,i){var tmp=mappedEntries[entry.v]={indegree:0,"in":[],out:[],vs:[entry.v],i:i};if(!_.isUndefined(entry.barycenter)){tmp.barycenter=entry.barycenter;tmp.weight=entry.weight;}});_.each(cg.edges(),function(e){var entryV=mappedEntries[e.v],entryW=mappedEntries[e.w];if(!_.isUndefined(entryV)&&!_.isUndefined(entryW)){entryW.indegree++;entryV.out.push(mappedEntries[e.w]);}});var sourceSet=_.filter(mappedEntries,function(entry){return!entry.indegree;});return doResolveConflicts(sourceSet);}function doResolveConflicts(sourceSet){var entries=[];function handleIn(vEntry){return function(uEntry){if(uEntry.merged){return;}if(_.isUndefined(uEntry.barycenter)||_.isUndefined(vEntry.barycenter)||uEntry.barycenter>=vEntry.barycenter){mergeEntries(vEntry,uEntry);}};}function handleOut(vEntry){return function(wEntry){wEntry["in"].push(vEntry);if(--wEntry.indegree===0){sourceSet.push(wEntry);}};}while(sourceSet.length){var entry=sourceSet.pop();entries.push(entry);_.each(entry["in"].reverse(),handleIn(entry));_.each(entry.out,handleOut(entry));}return _.chain(entries).filter(function(entry){return!entry.merged;}).map(function(entry){return _.pick(entry,["vs","i","barycenter","weight"]);}).value();}function mergeEntries(target,source){var sum=0,weight=0;if(target.weight){sum+=target.barycenter*target.weight;weight+=target.weight;}if(source.weight){sum+=source.barycenter*source.weight;weight+=source.weight;}target.vs=source.vs.concat(target.vs);target.barycenter=sum/weight;target.weight=weight;target.i=Math.min(source.i,target.i);source.merged=true;}});var __moduleExports$44=createCommonjsModule(function(module){var _=__moduleExports$23,util=__moduleExports$29;module.exports=sort;function sort(entries,biasRight){var parts=util.partition(entries,function(entry){return _.has(entry,"barycenter");});var sortable=parts.lhs,unsortable=_.sortBy(parts.rhs,function(entry){return-entry.i;}),vs=[],sum=0,weight=0,vsIndex=0;sortable.sort(compareWithBias(!!biasRight));vsIndex=consumeUnsortable(vs,unsortable,vsIndex);_.each(sortable,function(entry){vsIndex+=entry.vs.length;vs.push(entry.vs);sum+=entry.barycenter*entry.weight;weight+=entry.weight;vsIndex=consumeUnsortable(vs,unsortable,vsIndex);});var result={vs:_.flatten(vs,true)};if(weight){result.barycenter=sum/weight;result.weight=weight;}return result;}function consumeUnsortable(vs,unsortable,index){var last;while(unsortable.length&&(last=_.last(unsortable)).i<=index){unsortable.pop();vs.push(last.vs);index++;}return index;}function compareWithBias(bias){return function(entryV,entryW){if(entryV.barycenter<entryW.barycenter){return-1;}else if(entryV.barycenter>entryW.barycenter){return 1;}return!bias?entryV.i-entryW.i:entryW.i-entryV.i;};}});var __moduleExports$41=createCommonjsModule(function(module){var _=__moduleExports$23,barycenter=__moduleExports$42,resolveConflicts=__moduleExports$43,sort=__moduleExports$44;module.exports=sortSubgraph;function sortSubgraph(g,v,cg,biasRight){var movable=g.children(v),node=g.node(v),bl=node?node.borderLeft:undefined,br=node?node.borderRight:undefined,subgraphs={};if(bl){movable=_.filter(movable,function(w){return w!==bl&&w!==br;});}var barycenters=barycenter(g,movable);_.each(barycenters,function(entry){if(g.children(entry.v).length){var subgraphResult=sortSubgraph(g,entry.v,cg,biasRight);subgraphs[entry.v]=subgraphResult;if(_.has(subgraphResult,"barycenter")){mergeBarycenters(entry,subgraphResult);}}});var entries=resolveConflicts(barycenters,cg);expandSubgraphs(entries,subgraphs);var result=sort(entries,biasRight);if(bl){result.vs=_.flatten([bl,result.vs,br],true);if(g.predecessors(bl).length){var blPred=g.node(g.predecessors(bl)[0]),brPred=g.node(g.predecessors(br)[0]);if(!_.has(result,"barycenter")){result.barycenter=0;result.weight=0;}result.barycenter=(result.barycenter*result.weight+blPred.order+brPred.order)/(result.weight+2);result.weight+=2;}}return result;}function expandSubgraphs(entries,subgraphs){_.each(entries,function(entry){entry.vs=_.flatten(entry.vs.map(function(v){if(subgraphs[v]){return subgraphs[v].vs;}return v;}),true);});}function mergeBarycenters(target,other){if(!_.isUndefined(target.barycenter)){target.barycenter=(target.barycenter*target.weight+other.barycenter*other.weight)/(target.weight+other.weight);target.weight+=other.weight;}else{target.barycenter=other.barycenter;target.weight=other.weight;}}});var __moduleExports$45=createCommonjsModule(function(module){var _=__moduleExports$23,Graph=__moduleExports.Graph;module.exports=buildLayerGraph;/*
 * Constructs a graph that can be used to sort a layer of nodes. The graph will
 * contain all base and subgraph nodes from the request layer in their original
 * hierarchy and any edges that are incident on these nodes and are of the type
 * requested by the "relationship" parameter.
 *
 * Nodes from the requested rank that do not have parents are assigned a root
 * node in the output graph, which is set in the root graph attribute. This
 * makes it easy to walk the hierarchy of movable nodes during ordering.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG
 *    2. Base nodes in the input graph have a rank attribute
 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
 *    4. Edges have an assigned weight
 *
 * Post-conditions:
 *
 *    1. Output graph has all nodes in the movable rank with preserved
 *       hierarchy.
 *    2. Root nodes in the movable layer are made children of the node
 *       indicated by the root attribute of the graph.
 *    3. Non-movable nodes incident on movable nodes, selected by the
 *       relationship parameter, are included in the graph (without hierarchy).
 *    4. Edges incident on movable nodes, selected by the relationship
 *       parameter, are added to the output graph.
 *    5. The weights for copied edges are aggregated as need, since the output
 *       graph is not a multi-graph.
 */function buildLayerGraph(g,rank,relationship){var root=createRootNode(g),result=new Graph({compound:true}).setGraph({root:root}).setDefaultNodeLabel(function(v){return g.node(v);});_.each(g.nodes(),function(v){var node=g.node(v),parent=g.parent(v);if(node.rank===rank||node.minRank<=rank&&rank<=node.maxRank){result.setNode(v);result.setParent(v,parent||root);// This assumes we have only short edges!
_.each(g[relationship](v),function(e){var u=e.v===v?e.w:e.v,edge=result.edge(u,v),weight=!_.isUndefined(edge)?edge.weight:0;result.setEdge(u,v,{weight:g.edge(e).weight+weight});});if(_.has(node,"minRank")){result.setNode(v,{borderLeft:node.borderLeft[rank],borderRight:node.borderRight[rank]});}}});return result;}function createRootNode(g){var v;while(g.hasNode(v=_.uniqueId("_root"))){}return v;}});var __moduleExports$46=createCommonjsModule(function(module){var _=__moduleExports$23;module.exports=addSubgraphConstraints;function addSubgraphConstraints(g,cg,vs){var prev={},rootPrev;_.each(vs,function(v){var child=g.parent(v),parent,prevChild;while(child){parent=g.parent(child);if(parent){prevChild=prev[parent];prev[parent]=child;}else{prevChild=rootPrev;rootPrev=child;}if(prevChild&&prevChild!==child){cg.setEdge(prevChild,child);return;}child=parent;}});/*
  function dfs(v) {
    var children = v ? g.children(v) : g.children();
    if (children.length) {
      var min = Number.POSITIVE_INFINITY,
          subgraphs = [];
      _.each(children, function(child) {
        var childMin = dfs(child);
        if (g.children(child).length) {
          subgraphs.push({ v: child, order: childMin });
        }
        min = Math.min(min, childMin);
      });
      _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
        cg.setEdge(prev.v, curr.v);
        return curr;
      });
      return min;
    }
    return g.node(v).order;
  }
  dfs(undefined);
  */}});var __moduleExports$38=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,initOrder=__moduleExports$39,crossCount=__moduleExports$40,sortSubgraph=__moduleExports$41,buildLayerGraph=__moduleExports$45,addSubgraphConstraints=__moduleExports$46,Graph=__moduleExports.Graph,util=__moduleExports$29;module.exports=order;/*
 * Applies heuristics to minimize edge crossings in the graph and sets the best
 * order solution as an order attribute on each node.
 *
 * Pre-conditions:
 *
 *    1. Graph must be DAG
 *    2. Graph nodes must be objects with a "rank" attribute
 *    3. Graph edges must have the "weight" attribute
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have an "order" attribute based on the results of the
 *       algorithm.
 */function order(g){var maxRank=util.maxRank(g),downLayerGraphs=buildLayerGraphs(g,_.range(1,maxRank+1),"inEdges"),upLayerGraphs=buildLayerGraphs(g,_.range(maxRank-1,-1,-1),"outEdges");var layering=initOrder(g);assignOrder(g,layering);var bestCC=Number.POSITIVE_INFINITY,best;for(var i=0,lastBest=0;lastBest<4;++i,++lastBest){sweepLayerGraphs(i%2?downLayerGraphs:upLayerGraphs,i%4>=2);layering=util.buildLayerMatrix(g);var cc=crossCount(g,layering);if(cc<bestCC){lastBest=0;best=_.cloneDeep(layering);bestCC=cc;}}assignOrder(g,best);}function buildLayerGraphs(g,ranks,relationship){return _.map(ranks,function(rank){return buildLayerGraph(g,rank,relationship);});}function sweepLayerGraphs(layerGraphs,biasRight){var cg=new Graph();_.each(layerGraphs,function(lg){var root=lg.graph().root;var sorted=sortSubgraph(lg,root,cg,biasRight);_.each(sorted.vs,function(v,i){lg.node(v).order=i;});addSubgraphConstraints(lg,cg,sorted.vs);});}function assignOrder(g,layering){_.each(layering,function(layer){_.each(layer,function(v,i){g.node(v).order=i;});});}});var __moduleExports$48=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,Graph=__moduleExports.Graph,util=__moduleExports$29;/*
 * This module provides coordinate assignment based on Brandes and Köpf, "Fast
 * and Simple Horizontal Coordinate Assignment."
 */module.exports={positionX:positionX,findType1Conflicts:findType1Conflicts,findType2Conflicts:findType2Conflicts,addConflict:addConflict,hasConflict:hasConflict,verticalAlignment:verticalAlignment,horizontalCompaction:horizontalCompaction,alignCoordinates:alignCoordinates,findSmallestWidthAlignment:findSmallestWidthAlignment,balance:balance};/*
 * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
 * property. A type-1 conflict is one where a non-inner segment crosses an
 * inner segment. An inner segment is an edge with both incident nodes marked
 * with the "dummy" property.
 *
 * This algorithm scans layer by layer, starting with the second, for type-1
 * conflicts between the current layer and the previous layer. For each layer
 * it scans the nodes from left to right until it reaches one that is incident
 * on an inner segment. It then scans predecessors to determine if they have
 * edges that cross that inner segment. At the end a final scan is done for all
 * nodes on the current rank to see if they cross the last visited inner
 * segment.
 *
 * This algorithm (safely) assumes that a dummy node will only be incident on a
 * single node in the layers being scanned.
 */function findType1Conflicts(g,layering){var conflicts={};function visitLayer(prevLayer,layer){var// last visited node in the previous layer that is incident on an inner
// segment.
k0=0,// Tracks the last node in this layer scanned for crossings with a type-1
// segment.
scanPos=0,prevLayerLength=prevLayer.length,lastNode=_.last(layer);_.each(layer,function(v,i){var w=findOtherInnerSegmentNode(g,v),k1=w?g.node(w).order:prevLayerLength;if(w||v===lastNode){_.each(layer.slice(scanPos,i+1),function(scanNode){_.each(g.predecessors(scanNode),function(u){var uLabel=g.node(u),uPos=uLabel.order;if((uPos<k0||k1<uPos)&&!(uLabel.dummy&&g.node(scanNode).dummy)){addConflict(conflicts,u,scanNode);}});});scanPos=i+1;k0=k1;}});return layer;}_.reduce(layering,visitLayer);return conflicts;}function findType2Conflicts(g,layering){var conflicts={};function scan(south,southPos,southEnd,prevNorthBorder,nextNorthBorder){var v;_.each(_.range(southPos,southEnd),function(i){v=south[i];if(g.node(v).dummy){_.each(g.predecessors(v),function(u){var uNode=g.node(u);if(uNode.dummy&&(uNode.order<prevNorthBorder||uNode.order>nextNorthBorder)){addConflict(conflicts,u,v);}});}});}function visitLayer(north,south){var prevNorthPos=-1,nextNorthPos,southPos=0;_.each(south,function(v,southLookahead){if(g.node(v).dummy==="border"){var predecessors=g.predecessors(v);if(predecessors.length){nextNorthPos=g.node(predecessors[0]).order;scan(south,southPos,southLookahead,prevNorthPos,nextNorthPos);southPos=southLookahead;prevNorthPos=nextNorthPos;}}scan(south,southPos,south.length,nextNorthPos,north.length);});return south;}_.reduce(layering,visitLayer);return conflicts;}function findOtherInnerSegmentNode(g,v){if(g.node(v).dummy){return _.find(g.predecessors(v),function(u){return g.node(u).dummy;});}}function addConflict(conflicts,v,w){if(v>w){var tmp=v;v=w;w=tmp;}var conflictsV=conflicts[v];if(!conflictsV){conflicts[v]=conflictsV={};}conflictsV[w]=true;}function hasConflict(conflicts,v,w){if(v>w){var tmp=v;v=w;w=tmp;}return _.has(conflicts[v],w);}/*
 * Try to align nodes into vertical "blocks" where possible. This algorithm
 * attempts to align a node with one of its median neighbors. If the edge
 * connecting a neighbor is a type-1 conflict then we ignore that possibility.
 * If a previous node has already formed a block with a node after the node
 * we're trying to form a block with, we also ignore that possibility - our
 * blocks would be split in that scenario.
 */function verticalAlignment(g,layering,conflicts,neighborFn){var root={},align={},pos={};// We cache the position here based on the layering because the graph and
// layering may be out of sync. The layering matrix is manipulated to
// generate different extreme alignments.
_.each(layering,function(layer){_.each(layer,function(v,order){root[v]=v;align[v]=v;pos[v]=order;});});_.each(layering,function(layer){var prevIdx=-1;_.each(layer,function(v){var ws=neighborFn(v);if(ws.length){ws=_.sortBy(ws,function(w){return pos[w];});var mp=(ws.length-1)/2;for(var i=Math.floor(mp),il=Math.ceil(mp);i<=il;++i){var w=ws[i];if(align[v]===v&&prevIdx<pos[w]&&!hasConflict(conflicts,v,w)){align[w]=v;align[v]=root[v]=root[w];prevIdx=pos[w];}}}});});return{root:root,align:align};}function horizontalCompaction(g,layering,root,align,reverseSep){// This portion of the algorithm differs from BK due to a number of problems.
// Instead of their algorithm we construct a new block graph and do two
// sweeps. The first sweep places blocks with the smallest possible
// coordinates. The second sweep removes unused space by moving blocks to the
// greatest coordinates without violating separation.
var xs={},blockG=buildBlockGraph(g,layering,root,reverseSep);// First pass, assign smallest coordinates via DFS
var visited={};function pass1(v){if(!_.has(visited,v)){visited[v]=true;xs[v]=_.reduce(blockG.inEdges(v),function(max,e){pass1(e.v);return Math.max(max,xs[e.v]+blockG.edge(e));},0);}}_.each(blockG.nodes(),pass1);var borderType=reverseSep?"borderLeft":"borderRight";function pass2(v){if(visited[v]!==2){visited[v]++;var node=g.node(v);var min=_.reduce(blockG.outEdges(v),function(min,e){pass2(e.w);return Math.min(min,xs[e.w]-blockG.edge(e));},Number.POSITIVE_INFINITY);if(min!==Number.POSITIVE_INFINITY&&node.borderType!==borderType){xs[v]=Math.max(xs[v],min);}}}_.each(blockG.nodes(),pass2);// Assign x coordinates to all nodes
_.each(align,function(v){xs[v]=xs[root[v]];});return xs;}function buildBlockGraph(g,layering,root,reverseSep){var blockGraph=new Graph(),graphLabel=g.graph(),sepFn=sep(graphLabel.nodesep,graphLabel.edgesep,reverseSep);_.each(layering,function(layer){var u;_.each(layer,function(v){var vRoot=root[v];blockGraph.setNode(vRoot);if(u){var uRoot=root[u],prevMax=blockGraph.edge(uRoot,vRoot);blockGraph.setEdge(uRoot,vRoot,Math.max(sepFn(g,v,u),prevMax||0));}u=v;});});return blockGraph;}/*
 * Returns the alignment that has the smallest width of the given alignments.
 */function findSmallestWidthAlignment(g,xss){return _.min(xss,function(xs){var min=_.min(xs,function(x,v){return x-width(g,v)/2;}),max=_.max(xs,function(x,v){return x+width(g,v)/2;});return max-min;});}/*
 * Align the coordinates of each of the layout alignments such that
 * left-biased alignments have their minimum coordinate at the same point as
 * the minimum coordinate of the smallest width alignment and right-biased
 * alignments have their maximum coordinate at the same point as the maximum
 * coordinate of the smallest width alignment.
 */function alignCoordinates(xss,alignTo){var alignToMin=_.min(alignTo),alignToMax=_.max(alignTo);_.each(["u","d"],function(vert){_.each(["l","r"],function(horiz){var alignment=vert+horiz,xs=xss[alignment],delta;if(xs===alignTo)return;delta=horiz==="l"?alignToMin-_.min(xs):alignToMax-_.max(xs);if(delta){xss[alignment]=_.mapValues(xs,function(x){return x+delta;});}});});}function balance(xss,align){return _.mapValues(xss.ul,function(ignore,v){if(align){return xss[align.toLowerCase()][v];}else{var xs=_.sortBy(_.pluck(xss,v));return(xs[1]+xs[2])/2;}});}function positionX(g){var layering=util.buildLayerMatrix(g),conflicts=_.merge(findType1Conflicts(g,layering),findType2Conflicts(g,layering));var xss={},adjustedLayering;_.each(["u","d"],function(vert){adjustedLayering=vert==="u"?layering:_.values(layering).reverse();_.each(["l","r"],function(horiz){if(horiz==="r"){adjustedLayering=_.map(adjustedLayering,function(inner){return _.values(inner).reverse();});}var neighborFn=_.bind(vert==="u"?g.predecessors:g.successors,g);var align=verticalAlignment(g,adjustedLayering,conflicts,neighborFn);var xs=horizontalCompaction(g,adjustedLayering,align.root,align.align,horiz==="r");if(horiz==="r"){xs=_.mapValues(xs,function(x){return-x;});}xss[vert+horiz]=xs;});});var smallestWidth=findSmallestWidthAlignment(g,xss);alignCoordinates(xss,smallestWidth);return balance(xss,g.graph().align);}function sep(nodeSep,edgeSep,reverseSep){return function(g,v,w){var vLabel=g.node(v),wLabel=g.node(w),sum=0,delta;sum+=vLabel.width/2;if(_.has(vLabel,"labelpos")){switch(vLabel.labelpos.toLowerCase()){case"l":delta=-vLabel.width/2;break;case"r":delta=vLabel.width/2;break;}}if(delta){sum+=reverseSep?delta:-delta;}delta=0;sum+=(vLabel.dummy?edgeSep:nodeSep)/2;sum+=(wLabel.dummy?edgeSep:nodeSep)/2;sum+=wLabel.width/2;if(_.has(wLabel,"labelpos")){switch(wLabel.labelpos.toLowerCase()){case"l":delta=wLabel.width/2;break;case"r":delta=-wLabel.width/2;break;}}if(delta){sum+=reverseSep?delta:-delta;}delta=0;return sum;};}function width(g,v){return g.node(v).width;}});var __moduleExports$47=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,util=__moduleExports$29,positionX=__moduleExports$48.positionX;module.exports=position;function position(g){g=util.asNonCompoundGraph(g);positionY(g);_.each(positionX(g),function(x,v){g.node(v).x=x;});}function positionY(g){var layering=util.buildLayerMatrix(g),rankSep=g.graph().ranksep,prevY=0;_.each(layering,function(layer){var maxHeight=_.max(_.map(layer,function(v){return g.node(v).height;}));_.each(layer,function(v){g.node(v).y=prevY+maxHeight/2;});prevY+=maxHeight+rankSep;});}});var __moduleExports$22=createCommonjsModule(function(module){"use strict";var _=__moduleExports$23,acyclic=__moduleExports$25,normalize=__moduleExports$28,rank=__moduleExports$30,normalizeRanks=__moduleExports$29.normalizeRanks,parentDummyChains=__moduleExports$34,removeEmptyRanks=__moduleExports$29.removeEmptyRanks,nestingGraph=__moduleExports$35,addBorderSegments=__moduleExports$36,coordinateSystem=__moduleExports$37,order=__moduleExports$38,position=__moduleExports$47,util=__moduleExports$29,Graph=__moduleExports.Graph;module.exports=layout;function layout(g,opts){var time=opts&&opts.debugTiming?util.time:util.notime;time("layout",function(){var layoutGraph=time("  buildLayoutGraph",function(){return buildLayoutGraph(g);});time("  runLayout",function(){runLayout(layoutGraph,time);});time("  updateInputGraph",function(){updateInputGraph(g,layoutGraph);});});}function runLayout(g,time){time("    makeSpaceForEdgeLabels",function(){makeSpaceForEdgeLabels(g);});time("    removeSelfEdges",function(){removeSelfEdges(g);});time("    acyclic",function(){acyclic.run(g);});time("    nestingGraph.run",function(){nestingGraph.run(g);});time("    rank",function(){rank(util.asNonCompoundGraph(g));});time("    injectEdgeLabelProxies",function(){injectEdgeLabelProxies(g);});time("    removeEmptyRanks",function(){removeEmptyRanks(g);});time("    nestingGraph.cleanup",function(){nestingGraph.cleanup(g);});time("    normalizeRanks",function(){normalizeRanks(g);});time("    assignRankMinMax",function(){assignRankMinMax(g);});time("    removeEdgeLabelProxies",function(){removeEdgeLabelProxies(g);});time("    normalize.run",function(){normalize.run(g);});time("    parentDummyChains",function(){parentDummyChains(g);});time("    addBorderSegments",function(){addBorderSegments(g);});time("    order",function(){order(g);});time("    insertSelfEdges",function(){insertSelfEdges(g);});time("    adjustCoordinateSystem",function(){coordinateSystem.adjust(g);});time("    position",function(){position(g);});time("    positionSelfEdges",function(){positionSelfEdges(g);});time("    removeBorderNodes",function(){removeBorderNodes(g);});time("    normalize.undo",function(){normalize.undo(g);});time("    fixupEdgeLabelCoords",function(){fixupEdgeLabelCoords(g);});time("    undoCoordinateSystem",function(){coordinateSystem.undo(g);});time("    translateGraph",function(){translateGraph(g);});time("    assignNodeIntersects",function(){assignNodeIntersects(g);});time("    reversePoints",function(){reversePointsForReversedEdges(g);});time("    acyclic.undo",function(){acyclic.undo(g);});}/*
 * Copies final layout information from the layout graph back to the input
 * graph. This process only copies whitelisted attributes from the layout graph
 * to the input graph, so it serves as a good place to determine what
 * attributes can influence layout.
 */function updateInputGraph(inputGraph,layoutGraph){_.each(inputGraph.nodes(),function(v){var inputLabel=inputGraph.node(v),layoutLabel=layoutGraph.node(v);if(inputLabel){inputLabel.x=layoutLabel.x;inputLabel.y=layoutLabel.y;if(layoutGraph.children(v).length){inputLabel.width=layoutLabel.width;inputLabel.height=layoutLabel.height;}}});_.each(inputGraph.edges(),function(e){var inputLabel=inputGraph.edge(e),layoutLabel=layoutGraph.edge(e);inputLabel.points=layoutLabel.points;if(_.has(layoutLabel,"x")){inputLabel.x=layoutLabel.x;inputLabel.y=layoutLabel.y;}});inputGraph.graph().width=layoutGraph.graph().width;inputGraph.graph().height=layoutGraph.graph().height;}var graphNumAttrs=["nodesep","edgesep","ranksep","marginx","marginy"],graphDefaults={ranksep:50,edgesep:20,nodesep:50,rankdir:"tb"},graphAttrs=["acyclicer","ranker","rankdir","align"],nodeNumAttrs=["width","height"],nodeDefaults={width:0,height:0},edgeNumAttrs=["minlen","weight","width","height","labeloffset"],edgeDefaults={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},edgeAttrs=["labelpos"];/*
 * Constructs a new graph from the input graph, which can be used for layout.
 * This process copies only whitelisted attributes from the input graph to the
 * layout graph. Thus this function serves as a good place to determine what
 * attributes can influence layout.
 */function buildLayoutGraph(inputGraph){var g=new Graph({multigraph:true,compound:true}),graph=canonicalize(inputGraph.graph());g.setGraph(_.merge({},graphDefaults,selectNumberAttrs(graph,graphNumAttrs),_.pick(graph,graphAttrs)));_.each(inputGraph.nodes(),function(v){var node=canonicalize(inputGraph.node(v));g.setNode(v,_.defaults(selectNumberAttrs(node,nodeNumAttrs),nodeDefaults));g.setParent(v,inputGraph.parent(v));});_.each(inputGraph.edges(),function(e){var edge=canonicalize(inputGraph.edge(e));g.setEdge(e,_.merge({},edgeDefaults,selectNumberAttrs(edge,edgeNumAttrs),_.pick(edge,edgeAttrs)));});return g;}/*
 * This idea comes from the Gansner paper: to account for edge labels in our
 * layout we split each rank in half by doubling minlen and halving ranksep.
 * Then we can place labels at these mid-points between nodes.
 *
 * We also add some minimal padding to the width to push the label for the edge
 * away from the edge itself a bit.
 */function makeSpaceForEdgeLabels(g){var graph=g.graph();graph.ranksep/=2;_.each(g.edges(),function(e){var edge=g.edge(e);edge.minlen*=2;if(edge.labelpos.toLowerCase()!=="c"){if(graph.rankdir==="TB"||graph.rankdir==="BT"){edge.width+=edge.labeloffset;}else{edge.height+=edge.labeloffset;}}});}/*
 * Creates temporary dummy nodes that capture the rank in which each edge's
 * label is going to, if it has one of non-zero width and height. We do this
 * so that we can safely remove empty ranks while preserving balance for the
 * label's position.
 */function injectEdgeLabelProxies(g){_.each(g.edges(),function(e){var edge=g.edge(e);if(edge.width&&edge.height){var v=g.node(e.v),w=g.node(e.w),label={rank:(w.rank-v.rank)/2+v.rank,e:e};util.addDummyNode(g,"edge-proxy",label,"_ep");}});}function assignRankMinMax(g){var maxRank=0;_.each(g.nodes(),function(v){var node=g.node(v);if(node.borderTop){node.minRank=g.node(node.borderTop).rank;node.maxRank=g.node(node.borderBottom).rank;maxRank=_.max(maxRank,node.maxRank);}});g.graph().maxRank=maxRank;}function removeEdgeLabelProxies(g){_.each(g.nodes(),function(v){var node=g.node(v);if(node.dummy==="edge-proxy"){g.edge(node.e).labelRank=node.rank;g.removeNode(v);}});}function translateGraph(g){var minX=Number.POSITIVE_INFINITY,maxX=0,minY=Number.POSITIVE_INFINITY,maxY=0,graphLabel=g.graph(),marginX=graphLabel.marginx||0,marginY=graphLabel.marginy||0;function getExtremes(attrs){var x=attrs.x,y=attrs.y,w=attrs.width,h=attrs.height;minX=Math.min(minX,x-w/2);maxX=Math.max(maxX,x+w/2);minY=Math.min(minY,y-h/2);maxY=Math.max(maxY,y+h/2);}_.each(g.nodes(),function(v){getExtremes(g.node(v));});_.each(g.edges(),function(e){var edge=g.edge(e);if(_.has(edge,"x")){getExtremes(edge);}});minX-=marginX;minY-=marginY;_.each(g.nodes(),function(v){var node=g.node(v);node.x-=minX;node.y-=minY;});_.each(g.edges(),function(e){var edge=g.edge(e);_.each(edge.points,function(p){p.x-=minX;p.y-=minY;});if(_.has(edge,"x")){edge.x-=minX;}if(_.has(edge,"y")){edge.y-=minY;}});graphLabel.width=maxX-minX+marginX;graphLabel.height=maxY-minY+marginY;}function assignNodeIntersects(g){_.each(g.edges(),function(e){var edge=g.edge(e),nodeV=g.node(e.v),nodeW=g.node(e.w),p1,p2;if(!edge.points){edge.points=[];p1=nodeW;p2=nodeV;}else{p1=edge.points[0];p2=edge.points[edge.points.length-1];}edge.points.unshift(util.intersectRect(nodeV,p1));edge.points.push(util.intersectRect(nodeW,p2));});}function fixupEdgeLabelCoords(g){_.each(g.edges(),function(e){var edge=g.edge(e);if(_.has(edge,"x")){if(edge.labelpos==="l"||edge.labelpos==="r"){edge.width-=edge.labeloffset;}switch(edge.labelpos){case"l":edge.x-=edge.width/2+edge.labeloffset;break;case"r":edge.x+=edge.width/2+edge.labeloffset;break;}}});}function reversePointsForReversedEdges(g){_.each(g.edges(),function(e){var edge=g.edge(e);if(edge.reversed){edge.points.reverse();}});}function removeBorderNodes(g){_.each(g.nodes(),function(v){if(g.children(v).length){var node=g.node(v),t=g.node(node.borderTop),b=g.node(node.borderBottom),l=g.node(_.last(node.borderLeft)),r=g.node(_.last(node.borderRight));node.width=Math.abs(r.x-l.x);node.height=Math.abs(b.y-t.y);node.x=l.x+node.width/2;node.y=t.y+node.height/2;}});_.each(g.nodes(),function(v){if(g.node(v).dummy==="border"){g.removeNode(v);}});}function removeSelfEdges(g){_.each(g.edges(),function(e){if(e.v===e.w){var node=g.node(e.v);if(!node.selfEdges){node.selfEdges=[];}node.selfEdges.push({e:e,label:g.edge(e)});g.removeEdge(e);}});}function insertSelfEdges(g){var layers=util.buildLayerMatrix(g);_.each(layers,function(layer){var orderShift=0;_.each(layer,function(v,i){var node=g.node(v);node.order=i+orderShift;_.each(node.selfEdges,function(selfEdge){util.addDummyNode(g,"selfedge",{width:selfEdge.label.width,height:selfEdge.label.height,rank:node.rank,order:i+ ++orderShift,e:selfEdge.e,label:selfEdge.label},"_se");});delete node.selfEdges;});});}function positionSelfEdges(g){_.each(g.nodes(),function(v){var node=g.node(v);if(node.dummy==="selfedge"){var selfNode=g.node(node.e.v),x=selfNode.x+selfNode.width/2,y=selfNode.y,dx=node.x-x,dy=selfNode.height/2;g.setEdge(node.e,node.label);g.removeNode(v);node.label.points=[{x:x+2*dx/3,y:y-dy},{x:x+5*dx/6,y:y-dy},{x:x+dx,y:y},{x:x+5*dx/6,y:y+dy},{x:x+2*dx/3,y:y+dy}];node.label.x=node.x;node.label.y=node.y;}});}function selectNumberAttrs(obj,attrs){return _.mapValues(_.pick(obj,attrs),Number);}function canonicalize(attrs){var newAttrs={};_.each(attrs,function(v,k){newAttrs[k.toLowerCase()]=v;});return newAttrs;}});var __moduleExports$49=createCommonjsModule(function(module){var _=__moduleExports$23,util=__moduleExports$29,Graph=__moduleExports.Graph;module.exports={debugOrdering:debugOrdering};/* istanbul ignore next */function debugOrdering(g){var layerMatrix=util.buildLayerMatrix(g);var h=new Graph({compound:true,multigraph:true}).setGraph({});_.each(g.nodes(),function(v){h.setNode(v,{label:v});h.setParent(v,"layer"+g.node(v).rank);});_.each(g.edges(),function(e){h.setEdge(e.v,e.w,{},e.name);});_.each(layerMatrix,function(layer,i){var layerV="layer"+i;h.setNode(layerV,{rank:"same"});_.reduce(layer,function(u,v){h.setEdge(u,v,{style:"invis"});return v;});});return h;}});var __moduleExports$50=createCommonjsModule(function(module){module.exports="0.7.4";});var index=createCommonjsModule(function(module){/*
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/module.exports={graphlib:__moduleExports,layout:__moduleExports$22,debug:__moduleExports$49,util:{time:__moduleExports$29.time,notime:__moduleExports$29.notime},version:__moduleExports$50};});var graphlib=index.graphlib;var _layout=index.layout;var DagreLayout=function(){function DagreLayout(){_classCallCheck(this,DagreLayout);}_createClass(DagreLayout,[{key:"layout",value:function layout(graph){var model=graph.model;var g=new graphlib.Graph();g.setGraph({marginx:0,marginy:0}).setDefaultEdgeLabel(function(){return{};});if(model.nodes){for(var id in model.nodes){var node=model.nodes[id];g.setNode(id,{width:node.getSize().x,height:node.getSize().y});}}if(model.edges){for(var _id2 in model.edges){var edge=model.edges[_id2];g.setEdge(edge.$sNode.id,edge.$tNode.id);}}_layout(g);g.nodes().forEach(function(v){model.nodes[v].pos.x=g.node(v).x;model.nodes[v].pos.y=g.node(v).y;});g.edges().forEach(function(e){for(var _id3 in model.edges){var _edge=model.edges[_id3];if(_edge.$sNode.id===e.v&&_edge.$tNode.id===e.w){var size=g.edge(e).points.length;for(var _i17=0;_i17<size;_i17++){var point=g.edge(e).points[_i17];_edge.addLine(point.x,point.y);}}}});}}]);return DagreLayout;}();var Random=function(){function Random(){_classCallCheck(this,Random);}_createClass(Random,[{key:"layout",value:function layout(graph){var model=graph.model;if(model.nodes){for(var id in model.nodes){var node=model.nodes[id];var pos=node.getPos();if(pos.x===0&&pos.y===0){var x=util.getRandomInt(0,graph.canvasSize.width);var y=util.getRandomInt(0,graph.canvasSize.height);node.withPos(x,y);}}}}}]);return Random;}();new DagreLayout();new Random();var layouts=Object.freeze({DagreLayout:DagreLayout,Random:Random});var Model=function(_DiagramElement5){_inherits(Model,_DiagramElement5);function Model(graph){_classCallCheck(this,Model);var _this22=_possibleConstructorReturn(this,(Model.__proto__||Object.getPrototypeOf(Model)).call(this,null));_this22.nodes={};_this22.edges={};_this22.counter=0;_this22.$graph=graph;return _this22;}_createClass(Model,[{key:"init",value:function init(data){data=data||{};this.property=data.type||'classdiagram';this.id='RootElement';if(data.nodes){var _iteratorNormalCompletion11=true;var _didIteratorError11=false;var _iteratorError11=undefined;try{for(var _iterator11=data.nodes[Symbol.iterator](),_step11;!(_iteratorNormalCompletion11=(_step11=_iterator11.next()).done);_iteratorNormalCompletion11=true){var node=_step11.value;this.addNode(node);}}catch(err){_didIteratorError11=true;_iteratorError11=err;}finally{try{if(!_iteratorNormalCompletion11&&_iterator11.return){_iterator11.return();}}finally{if(_didIteratorError11){throw _iteratorError11;}}}}if(data.edges){var _iteratorNormalCompletion12=true;var _didIteratorError12=false;var _iteratorError12=undefined;try{for(var _iterator12=data.edges[Symbol.iterator](),_step12;!(_iteratorNormalCompletion12=(_step12=_iterator12.next()).done);_iteratorNormalCompletion12=true){var edge=_step12.value;this.addEdge(edge);}}catch(err){_didIteratorError12=true;_iteratorError12=err;}finally{try{if(!_iteratorNormalCompletion12&&_iterator12.return){_iterator12.return();}}finally{if(_didIteratorError12){throw _iteratorError12;}}}}this.initCanvas();}},{key:"addElement",value:function addElement(type){type=util.toPascalCase(type);var id=this.getNewId(type);var element=this.getElement(type,id,{});if(element){return true;}return false;}},{key:"removeElement",value:function removeElement(id){if(this.nodes[id]){var node=this.nodes[id];delete this.nodes[id];var _iteratorNormalCompletion13=true;var _didIteratorError13=false;var _iteratorError13=undefined;try{for(var _iterator13=node.edges[Symbol.iterator](),_step13;!(_iteratorNormalCompletion13=(_step13=_iterator13.next()).done);_iteratorNormalCompletion13=true){var edge=_step13.value;delete this.edges[edge.id];}}catch(err){_didIteratorError13=true;_iteratorError13=err;}finally{try{if(!_iteratorNormalCompletion13&&_iterator13.return){_iterator13.return();}}finally{if(_didIteratorError13){throw _iteratorError13;}}}}else if(this.edges[id]){delete this.edges[id];}else{return false;}this.$graph.layout();return true;}},{key:"getSVG",value:function getSVG(){var size=10;var path="M"+-size+" 0 L"+ +size+" 0 M0 "+-size+" L0 "+ +size;var attr={tag:'path',id:'origin',d:path,stroke:'#999','stroke-width':'1',fill:'none'};var shape=this.createShape(attr);var attrText={tag:'text',x:0-size,y:0-size/1.5,'text-anchor':'end','font-family':'Verdana','font-size':'9',fill:'#999'};var text=this.createShape(attrText);text.textContent='(0, 0)';var group=this.createShape({tag:'g'});group.appendChild(shape);group.appendChild(text);return group;}},{key:"initCanvas",value:function initCanvas(){this.$graph.canvasSize={width:this.$graph.root.clientWidth,height:this.$graph.root.clientHeight};this.$graph.canvas=util.createShape({tag:'svg',id:'root',width:this.$graph.canvasSize.width,height:this.$graph.canvasSize.height});this.$viewElement=this.$graph.canvas;this.$graph.root.appendChild(this.$graph.canvas);var mousewheel='onwheel'in document.createElement('div')?'wheel':document.onmousewheel!==undefined?'mousewheel':'DOMMouseScroll';}},{key:"getNewId",value:function getNewId(prefix){this.counter++;var id=(prefix?prefix.toLowerCase()+'-':'')+Math.floor(Math.random()*100000);return id;}},{key:"addNode",value:function addNode(node){var type=node["type"]||node.property||'Node';type=util.toPascalCase(type);var id=this.getNewId(type);return this.getElement(type,id,node);}},{key:"findNodeById",value:function findNodeById(id){if(this.nodes[id]){return this.nodes[id];}return false;}},{key:"findNodeByLabel",value:function findNodeByLabel(label){for(var _index in this.nodes){var node=this.nodes[_index];if(node.label===label){return node;}}}},{key:"addEdge",value:function addEdge(edge){var type=edge.type||'Edge';type=util.toPascalCase(type);var id=this.getNewId(type);var newEdge=this.getElement(type,id,edge);var source=this.findNodeByLabel(edge.source)||this.addNode(new Node(this).init({label:edge.source}));var target=this.findNodeByLabel(edge.target)||this.addNode(new Node(this).init({label:edge.target}));newEdge.withItem(source,target);return newEdge;}},{key:"getElement",value:function getElement(type,id,data){if(this.$graph.nodeFactory[type]){var element=new this.$graph.nodeFactory[type](this,id,type);element.init(data);this.nodes[id]=element;return element;}if(this.$graph.edgeFactory[type]){var _element2=new this.$graph.edgeFactory[type](this,id,type);_element2.init(data);this.edges[id]=_element2;return _element2;}}}]);return Model;}(DiagramElement);var buttons={clazz:'<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><rect width="500" height="125" x="25" y="180" stroke-width="7" stroke="black" fill="none"/><text x="275" y="140" text-anchor="middle" font-size="111">Class</text><text x="50" y="240" font-size="50">+ field: type</text><text x="50" y="360" font-size="50">+ method(type)</text></g></svg>',object:'<svg width="100%" height="100%" viewbox="0 0 550 450"><g><rect width="500" height="400" x="25" y="25" rx="5" ry="5" stroke-width="10" stroke="black" fill="none"/><text x="275" y="150" text-anchor="middle" font-size="111" text-decoration="underline">:Object</text><line x1="25" y1="275" x2="525" y2="275" stroke-width="7" stroke="black"/><text x="50" y="350" font-size="50">attribute = value</text></g></svg>',edge:'<svg width="100%" height="100%" viewbox="-100 0 600 500"><text x="125" y="250" font-size="140" text-anchor="middle" transform="rotate(-45 125 250)">Edge</text><polygon points="25,510 40,525 450,115 490,180 525,25 370,60 435,100"/></svg>'};var Palette=function(){function Palette(graph){_classCallCheck(this,Palette);this.graph=graph;var div=document.createElement('div');div.className='palette';document.body.appendChild(div);this.palette=div;this.addButtons();}_createClass(Palette,[{key:"addButtons",value:function addButtons(){var _this23=this;var _loop2=function _loop2(btn){var button=document.createElement('button');button.className='add'+btn+'Btn';button.innerHTML=buttons[btn];button.onclick=function(e){return _this23.graph.addElement(btn);};if(btn==='object'||btn==='edge'){button.disabled=true;}_this23.palette.appendChild(button);};for(var btn in buttons){_loop2(btn);}}}]);return Palette;}();;var EventBus=function(){function EventBus(){_classCallCheck(this,EventBus);}_createClass(EventBus,null,[{key:"register",value:function register(diagramElement){for(var _len=arguments.length,eventTypes=Array(_len>1?_len-1:0),_key=1; _key<_len; _key++){eventTypes[_key-1]=arguments[_key];}var _iteratorNormalCompletion14=true;var _didIteratorError14=false;var _iteratorError14=undefined;try{for(var _iterator14=eventTypes[Symbol.iterator](),_step14; !(_iteratorNormalCompletion14=(_step14=_iterator14.next()).done); _iteratorNormalCompletion14=true){var event=_step14.value;diagramElement.$viewElement.addEventListener(event,EventBus.publish.bind(null,diagramElement));}}catch(err){_didIteratorError14=true;_iteratorError14=err;}finally{try{if(!_iteratorNormalCompletion14&&_iterator14.return){_iterator14.return();}}finally{if(_didIteratorError14){throw _iteratorError14;}}}}},{key:"registerSVG",value:function registerSVG(diagramElement){for(var type in EventBus.handlers.keys()){console.log(type);}}},{key:"publish",value:function publish(element, event){var handlers=EventBus.handlers.get(event.type);if(handlers){var _iteratorNormalCompletion15=true;var _didIteratorError15=false;var _iteratorError15=undefined;try{for(var _iterator15=handlers[Symbol.iterator](),_step15;!(_iteratorNormalCompletion15=(_step15=_iterator15.next()).done);_iteratorNormalCompletion15=true){var handler=_step15.value;handler.handle(event,element);}}catch(err){_didIteratorError15=true;_iteratorError15=err;}finally{try{if(!_iteratorNormalCompletion15&&_iterator15.return){_iterator15.return();}}finally{if(_didIteratorError15){throw _iteratorError15;}}}}}},{key:"subscribe",value:function subscribe(handler){for(var _len2=arguments.length,eventTypes=Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){eventTypes[_key2-1]=arguments[_key2];}var _iteratorNormalCompletion16=true;var _didIteratorError16=false;var _iteratorError16=undefined;try{for(var _iterator16=eventTypes[Symbol.iterator](),_step16;!(_iteratorNormalCompletion16=(_step16=_iterator16.next()).done);_iteratorNormalCompletion16=true){var event=_step16.value;var handlers=EventBus.handlers.get(event);if(handlers===null||handlers===undefined){handlers=[];EventBus.handlers.set(event,handlers);}handlers.push(handler);}}catch(err){_didIteratorError16=true;_iteratorError16=err;}finally{try{if(!_iteratorNormalCompletion16&&_iterator16.return){_iterator16.return();}}finally{if(_didIteratorError16){throw _iteratorError16;}}}}}]);return EventBus;}();EventBus.ELEMENTCREATE="ELEMENT:CREATE";EventBus.ELEMENTMOUSEDOWN="ELEMENT:MOUSEDOWN";EventBus.ELEMENTMOUSEUP="ELEMENT:MOUSEUP";EventBus.ELEMENTMOUSELEAVE="ELEMENT:MOUSELEAVE";EventBus.ELEMENTMOUSEMOVE="ELEMENT:MOUSEMOVE";EventBus.ELEMENTMOUSEWHEEL="ELEMENT:MOUSEWHEEL";EventBus.ELEMENTCLICK="ELEMENT:CLICK";EventBus.ELEMENTDRAG="ELEMENT:DRAG";EventBus.handlers=new Map();var Editor=function(){function Editor(graph){_classCallCheck(this,Editor);this.graph=graph;}_createClass(Editor,[{key:"isEnable",value:function isEnable(){return true;}},{key:"handle",value:function handle(event,element){var _this24=this;if(element instanceof Clazz){var clazz=element;var attributes=clazz.getPropertyAsString('attributes');var methods=clazz.getPropertyAsString('methods');var div=document.createElement('div');div.className='editor';div.innerHTML="<h2>Class Editor</h2><hr><div><h4>ID: "+clazz.id+"</h4></div><div><h3>Name:</h3><input id=\"input_name\" type=\"text\" value=\""+clazz.label+"\"></input></div><div class=\"attributes\"><h3>Attributes:</h3><textarea id=\"attributes_area\">"+attributes+"</textarea></div><div class=\"methods\"><h3>Methods:</h3><textarea id=\"methods_area\">"+methods+"</textarea></div>";var _buttons=document.createElement('div');_buttons.className='buttons';var okBtn=document.createElement('button');okBtn.innerHTML='OK';okBtn.onclick=function(e){return _this24.edit();};_buttons.appendChild(okBtn);var cancelBtn=document.createElement('button');cancelBtn.innerHTML='CANCEL';cancelBtn.onclick=function(e){return _this24.cancel();};_buttons.appendChild(cancelBtn);div.appendChild(_buttons);this.editorElement=div;this.clazz=clazz;document.body.appendChild(div);}return true;}},{key:"cancel",value:function cancel(){this.editorElement.remove();}},{key:"edit",value:function edit(){var hasChanged=false;var name=document.getElementById('input_name').value;if(name!==this.clazz.label){this.clazz.label=name;hasChanged=true;}var attributes=document.getElementById('attributes_area').value;hasChanged=this.clazz.convertStringToProperty(attributes,'attributes')||hasChanged;var methods=document.getElementById('methods_area').value;hasChanged=this.clazz.convertStringToProperty(methods,'methods')||hasChanged;if(hasChanged){this.graph.layout();}this.cancel();}}]);return Editor;}();var Drag=function(){function Drag(){_classCallCheck(this,Drag);this.dragging=false;this.reinsert=false;this.mouseOffset=new Point();this.svgRoot=document.getElementById('root');}_createClass(Drag,[{key:"handle",value:function handle(event, element){switch(event.type){case'mousedown':if(!this.dragging||element.id!=='RootElement'){this.element=element;this.svgElement=element.$viewElement;this.start(event,element);}break;case'mouseup':if(this.dragging){this.reset();}break;case'mousemove':if(this.dragging){this.drag(event,element);}break;case'mouseleave':if(this.dragging){this.reset();}break;default:break;}return true;}},{key:"isEnable",value:function isEnable(){return true;}},{key:"reset",value:function reset(){this.dragging=false;this.svgElement.style.cursor='pointer';this.svgRoot.style.cursor='default';}},{key:"start",value:function start(evt, element){this.dragging=true;this.mouseOffset.x=evt.clientX;this.mouseOffset.y=evt.clientY;if(this.element.id==='RootElement'){this.svgRoot.style.cursor='move';this.svgRoot.style.cursor='grabbing';this.svgRoot.style.cursor='-moz-grabbin';this.svgRoot.style.cursor='-webkit-grabbing';}else{this.reinsert=true;}}},{key:"drag",value:function drag(evt, element){if(this.reinsert){if(this.element.id!=='RootElement'){this.svgRoot.appendChild(this.svgElement);}this.reinsert=false;var dragEvent=new Event('drag');element.$viewElement.dispatchEvent(dragEvent);}if(element.id==='RootElement'){if(element.id!==this.element.id){return;}var model=this.element;var x=evt.clientX-this.mouseOffset.x;var y=evt.clientY-this.mouseOffset.y;var newOrigin=model.$graph.options.origin.add(new Point(x,y));var values=this.svgRoot.getAttribute('viewBox').split(' ');var newViewBox=newOrigin.x*-1+" "+newOrigin.y*-1+" "+values[2]+" "+values[3];this.svgRoot.setAttribute('viewBox',newViewBox);}else{var node=element;var translation=this.svgElement.getAttributeNS(null,'transform').slice(10,-1).split(' ');var sx=parseInt(translation[0]);var sy=parseInt(translation[1]);var transX=sx+evt.clientX-this.mouseOffset.x;var transY=sy+evt.clientY-this.mouseOffset.y;this.svgElement.setAttributeNS(null,'transform','translate('+transX+' '+transY+')');node.getPos().addNum(transX-sx,transY-sy);node.redrawEdges();}this.mouseOffset.x=evt.clientX;this.mouseOffset.y=evt.clientY;}}]);return Drag;}();var Select=function(){function Select(model){_classCallCheck(this,Select);this.padding=5;this.model=model;this.svgRoot=document.getElementById('root');var attrCircle={tag:'circle',cx:20,cy:20,r:17,stroke:'#888','stroke-width':2,fill:'#DDD'};var editPath='M6 20 L12 23 L33 23 L33 17 L12 17 Z M30 17 L30 23 M12 17 L12 23 M15 19 L28 19 M15 21 L28 21';var editAttr={tag:'path',d:editPath,stroke:'#000','stroke-width':1,fill:'white'};var editShape=util.createShape(editAttr);var editBkg=util.createShape(attrCircle);var editGroup=util.createShape({tag:'g',id:'edit',transform:'rotate(-45, 20, 20) translate(0 0)'});editGroup.appendChild(editBkg);editGroup.appendChild(editShape);this.editShape=editGroup;var deletePath='M12 12 L18 12 L18 11 L22 11 L22 12 L28 12 L28 14 L27 14 L27 29 L13 29 L13 14 L12 14 Z M13 14 L27 14 M20 17 L20 26 M17 16 L17 27 M23 16 L23 27';var deleteAttrPath={tag:'path',d:deletePath,stroke:'#000','stroke-width':1,fill:'white'};var deleteShape=util.createShape(deleteAttrPath);var deleteBkg=util.createShape(attrCircle);var deleteGroup=util.createShape({tag:'g',id:'trashcan',transform:'translate(0 0)'});deleteGroup.appendChild(deleteBkg);deleteGroup.appendChild(deleteShape);this.deleteShape=deleteGroup;}_createClass(Select,[{key:"handle",value:function handle(event,element){var _this25=this;event.stopPropagation();if(event.type==='drag'||event.srcElement.id==='background'||element===this.model){this.editShape.setAttributeNS(null,'visibility','hidden');this.deleteShape.setAttributeNS(null,'visibility','hidden');}else if(element instanceof Node){(function(){var e=element;if(document.getElementById('trashcan')===null){_this25.svgRoot.appendChild(_this25.deleteShape);}if(document.getElementById('edit')===null){_this25.svgRoot.appendChild(_this25.editShape);}_this25.editShape.setAttributeNS(null,'visibility','visible');_this25.deleteShape.setAttributeNS(null,'visibility','visible');var pos=e.getPos();var size=e.getSize();var x=pos.x+size.x/2+_this25.padding;var y=pos.y-size.y/2+_this25.padding/2;var editorEvent=new Event('editor');_this25.editShape.setAttributeNS(null,'transform',"rotate(-45, "+(x+20)+", "+(y+20)+") translate("+x+" "+y+")");_this25.editShape.onclick=function(e){return element.$viewElement.dispatchEvent(editorEvent);};_this25.deleteShape.setAttributeNS(null,'transform',"translate("+x+" "+(y+34+_this25.padding)+")");_this25.deleteShape.onclick=function(e){return _this25.model.removeElement(element.id);};})();}else if(element instanceof Edge){var _e2=element;if(document.getElementById('trashcan')===null){this.svgRoot.appendChild(this.deleteShape);}this.editShape.setAttributeNS(null,'visibility','hidden');this.deleteShape.setAttributeNS(null,'visibility','visible');var _x=void 0,_y2=void 0;if(_e2.$points.length===2){_x=(_e2.$points[0].getPos().x+_e2.$points[1].getPos().x)/2;_y2=(_e2.$points[0].getPos().y+_e2.$points[1].getPos().y)/2;}else{var _i18=Math.floor(_e2.$points.length/2);_x=_e2.$points[_i18].getPos().x;_y2=_e2.$points[_i18].getPos().y;}this.deleteShape.setAttributeNS(null,'transform',"translate("+_x+" "+_y2+")");this.deleteShape.onclick=function(e){return _this25.model.removeElement(element.id);};}return true;}},{key:"isEnable",value:function isEnable(){return true;}}]);return Select;}();var Zoom=function(){function Zoom(){_classCallCheck(this,Zoom);this.svgRoot=document.getElementById('root');}_createClass(Zoom,[{key:"handle",value:function handle(e,element){var delta=e.deltaY||e.wheelDeltaY||-e.wheelDelta;var d=1+delta/1000;var values=this.svgRoot.getAttribute('viewBox').split(' ');var newViewBox=values[0]+" "+values[1]+" "+parseInt(values[2])*d+" "+parseInt(values[3])*d;this.svgRoot.setAttribute('viewBox',newViewBox);e.preventDefault();return true;}},{key:"isEnable",value:function isEnable(){return true;}}]);return Zoom;}();var Graph=function(_Control9){_inherits(Graph,_Control9);function Graph(json,options){_classCallCheck(this,Graph);var _this26=_possibleConstructorReturn(this,(Graph.__proto__||Object.getPrototypeOf(Graph)).call(this,null));var autoLayout=void 0;if((typeof json==="undefined"?"undefined":_typeof(json))==="object"&&json.constructor.name==="Bridge"){_this26.$owner=json;json=options["data"];options=options["options"];autoLayout=true;}json=json||{};_this26.options=options||{};if(json["init"]){return _possibleConstructorReturn(_this26);}if(!_this26.options.origin){_this26.options.origin=new Point(150,45);}_this26.initFactories();_this26.initCanvas();_this26.model=new Model(_this26);_this26.model.init(json);_this26.initFeatures(options.features);if(autoLayout){_this26.layout();}return _this26;}_createClass(Graph,[{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){}},{key:"addElement",value:function addElement(type){var success=this.model.addElement(type);if(success===true){this.layout();}return success;}},{key:"layout",value:function layout(){this.getLayout().layout(this,this.model);this.draw();}},{key:"draw",value:function draw(){this.clearCanvas();var model=this.model;var canvas=this.canvas;var max=new Point();if(model.nodes){for(var id in model.nodes){var node=model.nodes[id];var svg=node.getSVG();EventBus.registerSVG(svg);canvas.appendChild(svg);var temp=void 0;temp=node.getPos().x+node.getSize().x;if(temp>max.x){max.x=temp;}temp=node.getPos().y+node.getSize().y;if(temp>max.y){max.y=temp;}}}util.setSize(this.canvas,max.x,max.y);if(model.edges){for(var _id4 in model.edges){var edge=model.edges[_id4];var _svg=edge.getSVG();EventBus.registerSVG(_svg);canvas.appendChild(_svg);}}}},{key:"clearCanvas",value:function clearCanvas(){var canvas=this.canvas;while(canvas.firstChild){canvas.removeChild(canvas.firstChild);}canvas.appendChild(Graph.createPattern());var background=util.createShape({tag:'rect',id:'background',width:5000,height:5000,x:-1500,y:-1500,stroke:'#999','stroke-width':'1',fill:'url(#raster)'});canvas.appendChild(background);canvas.appendChild(this.model.getSVG());}},{key:"getLayout",value:function getLayout(){var layout=this.options.layout||'';if(this.layoutFactory[layout]){return new this.layoutFactory[layout]();}return new DagreLayout();}},{key:"initFactories",value:function initFactories(){var noder=nodes;this.nodeFactory={};for(var id in noder){if(noder.hasOwnProperty(id)===true){this.nodeFactory[id]=noder[id];}}var edger=edges;this.edgeFactory={};for(var _id5 in edger){if(edger.hasOwnProperty(_id5)===true){this.edgeFactory[_id5]=edger[_id5];}}var layouter=layouts;this.layoutFactory={};for(var _id6 in layouter){if(layouter.hasOwnProperty(_id6)===true){this.layoutFactory[_id6]=layouter[_id6];}}}},{key:"initCanvas",value:function initCanvas(){if(this.options.canvas){this.root=document.getElementById(this.options.canvas);}if(!this.root){this.root=document.createElement('div');this.root.setAttribute('class','diagram');document.body.appendChild(this.root);}}},{key:"initFeatures",value:function initFeatures(features){if(features){if(features.zoom){var mousewheel='onwheel'in document.createElement('div')?'wheel':document.onmousewheel!==undefined?'mousewheel':'DOMMouseScroll';EventBus.subscribe(new Zoom(),mousewheel);}if(features.editor){EventBus.subscribe(new Editor(this),'dblclick','editor');}if(features.drag){EventBus.subscribe(new Drag(),'mousedown','mouseup','mousemove','mouseleave');}if(features.select){EventBus.subscribe(new Select(this.model),'click','drag');}if(features.palette){new Palette(this);}}}}],[{key:"createPattern",value:function createPattern(){var defs=util.createShape({tag:'defs'});var pattern=util.createShape({tag:'pattern',id:'raster',patternUnits:'userSpaceOnUse',width:40,height:40});var path='M0 4 L0 0 L4 0 M36 0 L40 0 L40 4 M40 36 L40 40 L36 40 M4 40 L0 40 L0 36';var cross=util.createShape({tag:'path',d:path,stroke:'#DDD','stroke-width':1,fill:'none'});pattern.appendChild(cross);defs.appendChild(pattern);return defs;}}]);return Graph;}(Control);var Bridge=function(){function Bridge(){_classCallCheck(this,Bridge);this.listener=[];this.controlFactory={};this.controls={};this.adapters=new Map();this.items={};this.controlNo=1;this.online=true;this.language=navigator.language.toUpperCase();this.addListener=function(listener){this.listener.push(listener);};var i=void 0;var keys=Object.keys(nodes);for(i=0;i<keys.length;i++){this.addControl(nodes[keys[i]]);}this.addControl(Graph);var that=this;window.addEventListener('load',function(){var updateOnlineStatus=function updateOnlineStatus(){that.setOnline(navigator.onLine);};window.addEventListener('online',updateOnlineStatus);window.addEventListener('offline',updateOnlineStatus);});}_createClass(Bridge,[{key:"setOnline",value:function setOnline(value){this.online=value;if(this.toolBar.children[0]){this.toolBar.children[0].className=value?"online":"offline";}}},{key:"addToolbar",value:function addToolbar(){if(this.toolBar){return false;}this.toolBar=document.createElement("div");this.toolBar.className="onlineStatus";var child=document.createElement("div");child.className="online";this.toolBar.appendChild(child);child=document.createElement("div");child.className="lang";child.innerHTML=this.language;this.toolBar.appendChild(child);var body=document.getElementsByTagName("body")[0];body.insertBefore(this.toolBar,body.firstChild);this.setOnline(this.online);}},{key:"addControl",value:function addControl(control){if(control&&control.name){this.controlFactory[control.name.toLowerCase()]=control;}}},{key:"getId",value:function getId(){return"control"+this.controlNo++;}},{key:"load",value:function load(json){var className=void 0;var id=void 0;if((typeof json==="undefined"?"undefined":_typeof(json))==="object"){if(!json["id"]){json["id"]=this.getId();}if(json["class"]){className=json["class"].toLowerCase();}id=json["id"];if(json["prop"]||json["upd"]||json["rem"]){var newData=!this.hasItem(id);var item=this.getItem(id);if(className){item.property=className;}if(newData){for(var _i19 in this.controls){if(this.controls.hasOwnProperty(_i19)===false){continue;}this.controls[_i19].addItem(this,item);}}Bridge.addProperties(json["prop"],item);Bridge.addProperties(json["upd"],item);for(var adapter in this.adapters){this.adapters[adapter].update(JSON.stringify(json));}return item;}}else{id=json;var _item3=document.getElementById(id);if(_item3){className=_item3.getAttribute("class");if(className){className=className.toLowerCase();}else{className="";}}else{className=json;}}var control=void 0;if(this.controls[id]){control=this.controls[id];control.initControl(json);return control;}if(_typeof(this.controlFactory[className])==="object"||typeof this.controlFactory[className]==="function"){var obj=this.controlFactory[className];control=new obj(this,json);this.controls[control.id]=control;return control;}return null;}},{key:"propertyChange",value:function propertyChange(entity,property,oldValue,newValue){}},{key:"hasItem",value:function hasItem(id){return this.items[id]!=null;}},{key:"getItem",value:function getItem(id){var item=this.items[id];if(!item){item=new Data();item.id=id;this.items[id]=item;}return item;}},{key:"setValue",value:function setValue(object,attribute,value){var obj=void 0;var id=void 0;if(object instanceof String||typeof object==="string"){id=object.toString();obj=this.getItem(id);}else if(object.hasOwnProperty("id")){obj=object;id=object['id'];}else{console.log("object is neither Data nor String..");return false;}if(obj){}var upd={};upd[attribute]=value;this.load({'id':id,upd:upd});return true;}},{key:"getValue",value:function getValue(object,attribute){var obj=void 0;var id=void 0;if(object instanceof String||typeof object==="string"){id=object.toString();obj=this.getItem(id);}else if(object.hasOwnProperty("id")){obj=object;id=object['id'];}else{console.log("object is neither Data nor String..");return;}if(obj){if(obj.hasOwnProperty(attribute)){return obj[attribute];}else if(obj instanceof Data){return obj.getValue(attribute);}else{return null;}}}},{key:"getNumber",value:function getNumber(object,attribute){var defaultValue=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;var res=this.getValue(object,attribute);if(typeof res==="number"){return res;}else if(typeof res==="string"){var number=Number(res);if(!Number.isNaN(number)){return number;}}return defaultValue;}},{key:"getControl",value:function getControl(controlId){return this.controls[controlId];}},{key:"registerEventListener",value:function registerListener(eventType, control, callBackfunction){if(typeof control==="string"){control=this.getControl(control);}if(!control){return null;}if(eventType){eventType=eventType.toLowerCase();}control.registerListenerOnHTMLObject(eventType);if(callBackfunction){var adapter=new DelegateAdapter();adapter.callBackfunction=callBackfunction;adapter.id=control.getId();this.addAdapter(adapter,eventType);}return control;}},{key:"addAdapter",value:function addAdapter(adapter, eventType){if(!eventType){eventType=null;}var handlers=this.adapters.get(eventType);if(handlers===null||handlers===undefined){handlers=[];this.adapters.set(eventType,handlers);}handlers.push(adapter);return adapter;}},{key:"fireEvent",value:function fireEvent(evt){var handlers=this.adapters.get(null);if(handlers){for(var _i20=0;_i20<handlers.length;_i20++){var adapter=handlers[_i20];if(adapter.id==null||adapter.id===evt["id"]){adapter.update(evt);}}}handlers=this.adapters.get(evt["eventType"]);if(handlers){for(var _i21=0;_i21<handlers.length;_i21++){var _adapter=handlers[_i21];if(_adapter.id==null||_adapter.id===evt["id"]){_adapter.update(evt);}}}}}],[{key:"addProperties",value:function addProperties(prop,item){if(!prop){return;}for(var property in prop){if(prop.hasOwnProperty(property)===false){continue;}if(prop[property]!=null&&""!==prop[property]){item.setValue(property,prop[property]);}}}}]);return Bridge;}();Bridge.version="0.42.01.1601007-1739";var DelegateAdapter=function(_Adapter){_inherits(DelegateAdapter,_Adapter);function DelegateAdapter(){_classCallCheck(this,DelegateAdapter);var _this27=_possibleConstructorReturn(this,(DelegateAdapter.__proto__||Object.getPrototypeOf(DelegateAdapter)).apply(this,arguments));_this27.executeFunction=function(string){var scope=window;var scopeSplit=string.split('.');for(var _i22=0;_i22<scopeSplit.length-1;_i22++){scope=scope[scopeSplit[_i22]];if(scope==undefined)return false;}var fn=scope[scopeSplit[scopeSplit.length-1]];if(typeof fn==='function'){fn.call(scope);return true;}return false;};return _this27;}_createClass(DelegateAdapter,[{key:"update",value:function update(evt){if(this.adapter){this.adapter.update(evt);return true;}else if(this.callBackfunction){return this.executeFunction(this.callBackfunction);}return false;}}]);return DelegateAdapter;}(Adapter);var bridge=new Bridge();var BridgeAdapter=function BridgeAdapter(){_classCallCheck(this,BridgeAdapter);this.bridge=new Bridge();};(function(){var bridgeloader=new BridgeAdapter();})();
//# sourceMappingURL=output.js.map