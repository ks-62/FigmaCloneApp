
//startX = 0;
//startY = 0;
//preX = 0;
//preY = 0;
//curX = 0;
//curY = 0;
//mousedown = false;

//$(() => {
//	/*canvas = document.getElementById("canvas-area");*/

//	$('#canvas-area').mousedown(e => {
//		console.log("down");
//		mousedown = true;

//		if (!mousedown) {
//			return;
//		}

//		startX = e.offsetX;
//		startY = e.offsetY;

//		preX = startX;
//		preY = startY;

//		console.log("down");
//		console.log(startX, startY);
//	});

//	$('#canvas-area').mousemove(e => {
//		console.log("move");

//		if (!mousedown) {
//			return;
//		}

//		curX = e.offsetX();
//		curY = e.offsetY();

//		drawRect(startX, startY, curX, curY);

//		preX = curX;
//		preY = curY;

//		console.log("move");
//		console.log(curX, curY);
//	});

//	$('#canvas-area').mouseup(e => {
//		mousedown = false;
//	});

//	$('#canvas-area').mouseout(e => {
//		onmousedown = false;
//	});
//});

////window.onload = function () {
////	canvas = document.getElementById("canvas-area");
////	console.log("load");

	
////}

////canvas.onmousedown = function (e) {
	
////}

////canvas.onmousemove = function (e) {
	
////}

////canvas.onmouseup = function (e) {
	
////}

//////canvas.addEventListener("mouseout", (e) => {
//////	onmousedown = false;
//////});



//function drawRect(fromX, fromY, toX, toY) {
//	let context = target.getContext('2d');
//	context.strokeStyle = "purple";
//	context.beginPath();
//	context.clearRect(fromX, fromY, preX - fromX, preY - fromY)
//	context.rect(fromX, fromY, toX - fromX, toY - fromY);
//	context.stroke();

//}


