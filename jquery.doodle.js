;(function($, window, undefined) {
	
	var defaults = {
		format: 'png',
		palette: ["black", "silver", "limegreen", "deepskyblue", "red", "orange", "darkviolet"]
	};

	$.fn.doodle = function(options) {
		
		var config = $.extend({}, defaults, options);
		var $singleton = this.first(); 
		var html;
		var history = [];
		var start = 0; 
		var end = 2 * Math.PI;
		var active = false;
		var mode;
		var color;
		var palette;
		var availableColors = ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
			"blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate",
			"coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod",
			"darkgray", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
			"darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
			"dimgray", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
			"gold", "goldenrod", "gray", "green", "greenyellow", "honeydew", "hotpink", "indianred",
			"indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue",
			"lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightpink", "lightsalmon", 
			"lightseagreen", "lightskyblue", "lightslategray", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", 
			"magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", 
			"mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
			"navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", 
			"palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", 
			"plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", 
			"salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", 
			"slategray", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", 
			"tomato", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"];  

		//Enforce image format
		(function checkFormat(){
			config.format = config.format.replace(/\./g, '');
			config.format = config.format.toLowerCase().trim();
			
			if(config.format !== 'png' && config.format !== 'jpeg'){
				console.log('Invalid image format: "'+ config.format +'"! Defaulting to "png".');
				config.format = 'png';
			}
		})();

		//Create the colorpalette
		function createPalette(){
			var colorsOut = '';

			//Limit number of colors in palette
			if(config.palette.length > 7){
				config.palette = config.palette.slice(0, 7);
			}

			for(var i = 0; i < config.palette.length; i++){

				if($.inArray(config.palette[i].toLowerCase(), availableColors) !== -1){
					colorsOut += '<span style="background-color:'+ config.palette[i].toLowerCase() +'; "class="doodle-color"></span>';
				}else{
					console.log('Invalid color name! "'+ config.palette[i] +'" was excluded from the palette.');
				}	
			}
			return colorsOut;	
		}
		
		//Configure the container-element
		$singleton.css({"padding":"0", "min-width":"640px", "min-height":"480px", "position":"relative", "overflow":"hidden"}).addClass('doodle-wrapper');

		//Prevent multiple instances of the doodle-canvas 
		if($("#doodle").length === 0){

			//Menu
			html = '<div id="doodle-menu" class="doodle-menu" style="position: absolute; top: 0; min-height: 25px; width: 100%;">' +
				'<div class="doodle-slider-wrapper"><label class="doodle-slider-lable">Brush size</label><input  id="doodle-slider" class="doodle-slider" type="range" value="10" min="1" max="20"></div>' +
				'</div>';
			$(html).appendTo($singleton);

			//Canvas
			html = '<canvas id="doodle-canvas" class="doodle-canvas" style="background-color: #FFF; display: block;" width="'+$singleton.width()+'" height="'+$singleton.height()+'">' +
			'<p>This browser does not support the canvas element!</p>' +
			'</canvas>';
			$(html).appendTo($singleton);

			//Toolbar
			html = 	'<div class="doodle-controlpanel" style="width:'+$singleton.width()+'px;">'+
					'<ul id="doodle-toolbar" class="doodle-toolbar">' +
						'<li class="doodle-item">' +
							'<a href="#" id="draw" class="doodle-button doodle-first">Draw</a>' +
						'</li>' + 
						'<li class="doodle-item">' + 
							'<a href="#" id="erase" class="doodle-button ">Erase</a>' + 
						'</li>' + 
						'<li class="doodle-item">' + 
							'<a href="#" id="undo" class="doodle-button doodle-disabled">Undo</a>' + 
						'</li>' + 
						'<li class="doodle-item">' + 
							'<a href="#" id="clear" class="doodle-button doodle-disabled">Clear</a>' +
						'</li>' +
						'<li class="doodle-item">' + 
							'<a href="#" id="save" class="doodle-button doodle-last doodle-disabled" download="myDoodle.'+config.format+'">Save</a>' + 
						'</li>' + 
					'</ul>' +
					createPalette() +						
					'</div>';
			$singleton.after(html);

			//Cache the DOM
			var $menu = $('#doodle-menu');	
			var $buttons = $('.doodle-button');	
			var $slider = $('#doodle-slider');
			var $canvas = $('#doodle-canvas');
			var $palette = $('.doodle-color');
			
			color = $palette.first().css("background-color");
			$palette.first().addClass('doodle-color-focus');
			var width = $canvas[0].width;
			var height = $canvas[0].height;
			var eraseColor = $canvas[0].style.backgroundColor;
			
			//Set context
			var ctx = $canvas[0].getContext("2d");

			//Save the current sate of the doodle-canvas
			var saveState = function(){
				var currentState = ctx.getImageData(0, 0, width, height);
				history.push(currentState);
				
				//Enable undo, clear and save buttons if history is not empty 
				if(history.length > 0){
					buttonsOnOff('on');
				}	
			};

			//Fetch the previous state of the doodle-canvas
			var loadState = function(state){
				ctx.putImageData(history[state], 0, 0);
				history.pop();

				//Disable undo, clear and save buttons if history is empty 
				if(history.length <= 0){
					buttonsOnOff('off');
				}
			};

			//Image downloading with fallback
			var downloadImage = function(){
				var imageData = $canvas[0].toDataURL('image/'+config.format);
				var save = $buttons.slice(4);

				//Check if attribute "download" is supported
				if(typeof save[0].download !== "undefined"){
   					save[0].href = imageData;
				}
				//Fallback, open new window and embed imageData into img-tag
				else{
  			 		var newWindow = window.open("", '_blank', "width=" + width + ",height=" + height + ",menubar=0" + ",toolbar=0" + ",status=0" + ",scrollbars=0" + ",resizable=0");
    				newWindow.document.body.innerHTML = '<html><head><title>Image</title></head><body><img src="'+imageData+'" /></body></html>';
				}		
			};

			//Change color of the brush
			var selectColor = function(color){
				
				//Set brush color
				if(mode === 'draw'){
					ctx.strokeStyle = color;
					ctx.fillStyle = color;
  				}

  				//Set eraser to the background-color of the doodle-canvas
  				if(mode === 'erase'){
  					ctx.strokeStyle = eraseColor;
					ctx.fillStyle = eraseColor;
  				}
			};

			//Unset draw mode on focusout
			var unsetFocus = function(){
				if(mode !== 'draw' || mode !== 'erase')
				{
					mode = undefined;
					$canvas.removeClass('doodle-crosshair');
					$(this).removeClass('doodle-button-focus');
				}				
			};

			//Toggle disabled-class on undo, clear and save buttons 
			var buttonsOnOff = function(buttonState){
					if(buttonState === 'off'){
						$buttons.slice(-3).addClass('doodle-disabled');
					}else{
						$buttons.slice(-3).removeClass('doodle-disabled');
					}				
			};

			//Function to fix offset for firefox
			var offsetFix = function(event){
				var position = {};

				if(event.offsetX === undefined || event.offsetY === undefined){
    				position.x = event.pageX - $canvas.offset().left;
    				position.y = event.pageY - $canvas.offset().top;
  				}
  				else{
  					position.x = event.offsetX;
  					position.y = event.offsetY;
  				}

  				return position;
			};

			//Fire the plot function while mouse moves over the doodle-canvas
			var plot = function(event){
				var position = offsetFix(event);
				var size = $slider.val();
				ctx.lineWidth = size * 2;

  				if(active && mode){
  					//Plot point
  					ctx.lineTo(position.x, position.y);
  					ctx.stroke();

					ctx.beginPath();
					ctx.arc(position.x, position.y, size, start, end);
					ctx.fill();

					ctx.beginPath();
					ctx.moveTo(position.x, position.y);
				}				
			};

			//Only draw on doodle-canvas when the user is holding down the mouse button
			var mouseDown = function(event){
				event.preventDefault();
				active = true;
				selectColor(color);
				//Only save state of canvas when it has new pixelinformation
				if(mode === 'draw' || mode === 'erase' && history.length > 0){
					saveState();
				}
				plot(event);
			};

			//Prevent drawing on the doodle-canvas if mouse button is not down
			var mouseUp = function(event){
				event.preventDefault();
				active = false;
				ctx.beginPath();
			};

			//Eventhandlers
			$canvas.on('mousemove', plot);
			$canvas.on('mousedown', mouseDown);
			$canvas.on('mouseup', mouseUp);
			$canvas.on('mouseleave', mouseUp);

			$palette.on('click', function(event){
				color = $(this).css("background-color");
				$palette.removeClass('doodle-color-focus');
				$(this).addClass('doodle-color-focus');
			});

			$buttons.slice(0, 2).on('focusout', unsetFocus);
			$buttons.on('click', function(event){
				switch($(this)[0].id){
					
					case 'draw':
						mode = 'draw';
						$canvas.addClass('doodle-crosshair');
						$(this).addClass('doodle-button-focus');	
						break;
					
					case 'erase':
						mode = 'erase';
						$canvas.addClass('doodle-crosshair');
						$(this).addClass('doodle-button-focus');
						break;
					
					case 'clear':
						ctx.clearRect(0, 0, width, height);
						history = [];
						buttonsOnOff('off');
						break;
					
					case 'undo':
						if(history.length >= 1){
							loadState(history.length - 1);
						}
						break;
					
					case 'save':
						downloadImage();
						break;
				}
			});
		}
		return $singleton;
	};
})(jQuery, window);