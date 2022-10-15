var stage = {w:1000, h:600 }
		var ball = {obj:null, x:0, y:0, vx:5, vy:5, w:20, h:20}
		$(document).ready(function(){
			ball.obj = $("#ball1");
 
			requestAnimationFrame(runGame);
		})
		

		function runGame() {
			if( ball.x<0 || ball.x>=(stage.w-ball.w)){
				ball.vx=-ball.vx; 
			}
			if( ball.y<0 || ball.y>=(stage.h-ball.h)){
				ball.vy=-ball.vy; 
			}
			
			ball.x += ball.vx;
			ball.y += ball.vy;
			 
			ball.obj.css({"left":ball.x+"px", "top":ball.y+"px"})
			
 		  	requestAnimationFrame(runGame);
		}