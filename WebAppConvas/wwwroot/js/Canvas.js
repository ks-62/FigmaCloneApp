
let crdData = new Array();
let filteredData = new Array();

let startX = 0,
    startY = 0,
    curX = 0,
    curY = 0,
    preX = 0,
    preY = 0;

let drawFlag = false;

let selectX = 0,
    selectY = 0,
    selectDrag = false,
    selectedRectX = 0,
    selectedRectY = 0;

let moveDistanceX = 0,
    moveDistanceY = 0,
    moveStartX = 0,
    moveStartY = 0,
    moveEndX = 0,
    moveEndY = 0;

let savedX,
    savedY,
    savedXLen,
    savedYLen;

let getObj = false;
let selectedObj;
let movingObj;

let OprModeEnum = {
    normal: 1,
    rectMode: 2,
    selectMode: 3,
    clearMode: 4
};

let OprMode = OprModeEnum.normal;

let activeObj;

$(document).ready(function () {

    let connection = new signalR.HubConnectionBuilder().withUrl("/CanvasHub").build();

    canvas = $('canvas');
    let btnRect = $('btn-rect');
    let btnSelect = $('btn-select');
    let btnClear = $('btn-clear');
    let textObjName = $('txtObjName');
    let textObjFillColor = $('txtObjFillColor');
    let txtObjWidth = $('txtObjWidth');
    let txtObjHeight = $('txtObjHeight');
    let txtLineWidth = $('txtLineWidth');
    let txtBorderColor = $('txtBorderColor');

    connection.start().then(function () {
        console.log("connection start...");
    }).catch(function (err) {
        return console.error(err.toString());
    });

    connection.on("ReceiveCoordinate", function (crdList) {
        crdData = crdList;
        console.log("receiced!!!!!");
        console.log(crdData);

        drawRectObjects(crdData);

    });

    connection.on("DeletedCoordinate", function (crdList) {
        crdData = crdList;
        let context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    btnRect.addEventListener('click', e => {
        if (OprMode != OprModeEnum.rectMode) {
            OprMode = OprModeEnum.rectMode;
            btnRect.style.backgroundColor = '#333333';

            btnSelect.style.backgroundColor = '#ffffff';
            btnClear.style.backgroundColor = '#ffffff';
        }
        else {
            OprMode = OprModeEnum.normal;
            btnRect.style.backgroundColor = '#ffffff';
        }

    });

    btnSelect.addEventListener('click', e => {
        if (OprMode != OprModeEnum.selectMode) {
            OprMode = OprModeEnum.selectMode;
            btnSelect.style.backgroundColor = '#333333';

            btnRect.style.backgroundColor = '#ffffff';
            btnClear.style.backgroundColor = '#ffffff';
        }
        else {
            OprMode = OprModeEnum.normal;
            btnSelect.style.backgroundColor = '#ffffff';
        }
    });

    btnClear.addEventListener('click', e => {
        if (OprMode != OprModeEnum.clearMode) {
            OprMode = OprModeEnum.clearMode;
            btnClear.style.backgroundColor = '#333333';

            btnRect.style.backgroundColor = '#ffffff';
            btnSelect.style.backgroundColor = '#ffffff';

            connection.invoke("ClearCoordinate").catch(function (err) {
                return console.error(err.toString());
            });
        }
        else {
            OprMode = OprModeEnum.normal;
            btnClear.style.backgroundColor = '#ffffff';
        }
    });

    txtObjWidth.addEventListener('change', e => {
        console.log("textWidth changed");
        console.log(selectedObj);
        console.log(txtObjWidth.value);
        if (selectedObj != null && txtObjWidth.value > 0) {
            
            connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
                return console.error(err.toString());
            });

            const sendCrd = changeValue("width", txtObjWidth.value);
            console.log(sendCrd);
            activeObj = sendCrd;

            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.log(err.toString());
            });

            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("changed");
        }
        
    });

    txtObjHeight.addEventListener('change', e => {
        console.log("textHeight changed");
        console.log(selectedObj);
        console.log(txtObjHeight.value);
        if (selectedObj != null && txtObjHeight.value > 0) {

            connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
                return console.error(err.toString());
            });

            const sendCrd = changeValue("height", txtObjHeight.value);
            console.log(sendCrd);
            activeObj = sendCrd;

            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.log(err.toString());
            });

            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("changed");
        }

    });

    textObjFillColor.addEventListener('change', e => {
        console.log("textFillColor changed");
        console.log(selectedObj);
        console.log(textObjFillColor.value);
        if (selectedObj != null) {

            connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
                return console.error(err.toString());
            });

            const sendCrd = changeValue("fillColor", textObjFillColor.value);
            console.log(sendCrd);
            activeObj = sendCrd;

            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.log(err.toString());
            });

            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("changed");
        }

    });

    txtLineWidth.addEventListener('change', e => {
        console.log("txtLineWidth changed");
        console.log(selectedObj);
        console.log(txtLineWidth.value);
        if (selectedObj != null) {

            connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
                return console.error(err.toString());
            });

            const sendCrd = changeValue("lineWidth", txtLineWidth.value);
            console.log(sendCrd);
            activeObj = sendCrd;

            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.log(err.toString());
            });

            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("changed");
        }

    });

    txtBorderColor.addEventListener('change', e => {
        console.log("txtBorderColor changed");
        console.log(selectedObj);
        console.log(txtBorderColor.value);
        if (selectedObj != null) {

            connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
                return console.error(err.toString());
            });

            const sendCrd = changeValue("borderColor", txtBorderColor.value);
            console.log(sendCrd);
            activeObj = sendCrd;

            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.log(err.toString());
            });

            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            console.log("changed");
        }

    });

    canvas.addEventListener('mousedown', e => {
        if (OprMode == OprModeEnum.rectMode) {
            drawFlag = true;

            startX = e.offsetX;
            startY = e.offsetY;

            preX = startX;
            preY = startY;
        }
        else if (OprMode == OprModeEnum.selectMode) {
            selectX = e.offsetX;
            selectY = e.offsetY;
            selectedObj = checkSelect(selectX, selectY);
            
            if (selectedObj != "") {
                selectDrag = true;

                textObjName.value = selectedObj.name;
                txtObjWidth.value = selectedObj.width;
                txtObjHeight.value = selectedObj.height;
                txtLocX.value = selectedObj.leftTopX;
                txtLocY.value = selectedObj.leftTopY;
                textObjFillColor.value = selectedObj.fillColor;
                txtLineWidth.value = selectedObj.lineWidth;
                txtBorderColor.value = selectedObj.borderColor;

                
            } 
            
        }
    });

    canvas.addEventListener('mousemove', e => {
        if (OprMode == OprModeEnum.rectMode) {
            if (!drawFlag) {
                return;
            }

            // get coordinate in which origin is leftTop in the canvas
            curX = e.offsetX;
            curY = e.offsetY;

            drawWithFillRect(startX, startY, curX, curY, OprMode, true);

            //keep the coordinate
            preX = curX;
            preY = curY;
        }
        else if (OprMode == OprModeEnum.selectMode) {
            if (!selectDrag) {
                return;
            }

            curX = e.offsetX;
            curY = e.offsetY;

            moveDistanceX = curX - selectX;
            moveDistanceY = curY - selectY;

            moveStartX = selectedObj.leftTopX + moveDistanceX;
            moveStartY = selectedObj.leftTopY + moveDistanceY;
            moveEndX = selectedObj.rightBottomX + moveDistanceX;
            moveEndY = selectedObj.rightBottomY + moveDistanceY;

            connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
                return console.error(err.toString());
            });

            //---rendering
            movingObj = generateCrd(selectedObj.figure, selectedObj.name,
                moveStartX, moveStartY, moveEndX, moveEndY,
                selectedObj.lineWidth, selectedObj.borderColor, selectedObj.fillColor);
            drawWithFillRect(moveStartX, moveStartY, moveEndX, moveEndY, OprMode, true);

            

            //let context = canvas.getContext("2d");
            //context.clearRect(0, 0, canvas.width, canvas.height);
            //console.log("clear");
            //drawRectObjects(crdData);
            //drawRectObject(movingObj);
            //console.log("moving drawing");
            //---

            txtLocX.value = moveStartX;
            txtLocY.value = moveStartY;


            

            //connection.invoke("SaveCoordinate", movingObj).catch(function (err) {
            //    return console.log(err.toString());
            //});

        }

    });

    canvas.addEventListener('mouseup', e => {
        if (OprMode == OprModeEnum.rectMode) {
            if (!drawFlag) {
                return;
            }

            let endX = e.offsetX;
            let endY = e.offsetY;
            drawWithFillRect(startX, startY, endX, endY, OprMode, false);

            let lineWidth = "";
            let borderColor = "";
            let sendCrd = generateCrd("Rectangle", "", startX, startY, endX, endY, lineWidth, borderColor, "");

            drawFlag = false;

            console.log(sendCrd);
            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.error(err.toString());
            });


        }
        else if (OprMode == OprModeEnum.selectMode) {
            let endX = e.offsetX;
            let endY = e.offsetY;

            moveDistanceX = endX - selectX;
            moveDistanceY = endY - selectY;

            moveStartX = selectedObj.leftTopX + moveDistanceX;
            moveStartY = selectedObj.leftTopY + moveDistanceY;
            moveEndX = selectedObj.rightBottomX + moveDistanceX;
            moveEndY = selectedObj.rightBottomY + moveDistanceY;

            drawWithFillRect(moveStartX, moveStartY, moveEndX, moveEndY, OprMode, false);

            txtLocX.value = moveStartX;
            txtLocY.value = moveStartY;

            const sendCrd = generateCrd(selectedObj.figure, selectedObj.name, moveStartX, moveStartY, moveEndX, moveEndY, selectedObj.lineWidth, selectedObj.borderColor, selectedObj.fillColor);
            activeObj = sendCrd;

            
            //connection.invoke("RemoveCoordinate", selectedObj).catch(function (err) {
            //    return console.error(err.toString());
            //});

            selectDrag = false;
            moveDistanceX = 0;
            moveDistanceY = 0;

            connection.invoke("SaveCoordinate", sendCrd).catch(function (err) {
                return console.log(err.toString());
            });

            let context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

    });

    canvas.addEventListener('mouseout', e => {
        if (OprMode == OprModeEnum.rectMode) {
            drawFlag = false;
        }
    });

    function $(id) {
        return document.getElementById(id);
    }

    function generateCrd(objFigure, objName,
        startPointX, startPointY, endPointX, endPointY,
        lineWidth, borderColor, fillColor) {

        let crdStartX = parseInt(startPointX, 10),
            crdStartY = parseInt(startPointY, 10),
            crdEndX = parseInt(endPointX, 10),
            crdEndY = parseInt(endPointY);

        let sendXLength = parseInt(endPointX, 10) - parseInt(startPointX, 10);
        let sendYLength = parseInt(endPointY, 10) - parseInt(startPointY, 10);

        let sendName = objName;
        let sendFigure = objFigure;

        let sendLineWidth;
        if (lineWidth == "") {
            sendLineWidth = 1;
        }
        else {
            sendLineWidth = parseInt(lineWidth, 10);
        }
         
        let sendBorderColor = borderColor;
        let sendFillColor = fillColor;

        if (sendLineWidth == 0) sendLineWidth = parseInt(1, 10);
        if (sendBorderColor == "") sendBorderColor = "#000000";
        if (sendFillColor == "") sendFillColor = "#ffffff";

        let sendOrientation;

        let sendLeftTopX = 0,
            sendLeftTopY = 0,
            sendRightTopX = 0,
            sendRightTopY = 0,
            sendLeftBottomX = 0,
            sendLeftBottomY = 0,
            sendRightBottomX = 0,
            sendRightBottomY = 0;

        let sendBorderStartX = 0,
            sendBorderStartY = 0,
            sendBorderEndX = 0,
            sendBorderEndY = 0,
            sendBorderWidth = 0,
            sendBorderHeight = 0;

        sendOrientation = detectOrientation(crdStartX, crdEndX, crdStartY, crdEndY);
        console.log(sendOrientation);

        if (sendOrientation == "RIGHT_BOTTOM") {
            //RightBottomOriented
            sendBorderStartX = crdStartX - sendLineWidth;
            sendBorderStartY = crdStartY - sendLineWidth;
            sendBorderEndX = crdEndX + sendLineWidth;
            sendBorderEndY = crdEndY + sendLineWidth;
            sendBorderWidth = sendXLength + (sendLineWidth * 2);
            sendBorderHeight = sendYLength + (sendLineWidth * 2);

            if (sendLineWidth > 0) {
                sendLeftTopX = sendBorderStartX;
                sendLeftTopY = sendBorderStartY;

                sendRightTopX = sendBorderEndX;
                sendRightTopY = sendBorderStartY;

                sendLeftBottomX = sendBorderStartX;
                sendLeftBottomY = sendBorderEndY;

                sendRightBottomX = sendBorderEndX;
                sendRightBottomY = sendBorderEndY;
            }
            else {
                sendLeftTopX = crdStartX;
                sendLeftTopY = crdStartY;

                sendRightTopX = crdEndX;
                sendRightTopY = crdStartY;

                sendLeftBottomX = crdStartX;
                sendLeftBottomY = crdEndY;

                sendRightBottomX = crdEndX;
                sendRightBottomY = crdEndY;
            }

            
        }
        else if (sendOrientation == "LEFT_BOTTOM") {
            //LeftBottomOriented
            sendBorderStartX = crdStartX + sendLineWidth;
            sendBorderStartY = crdStartY - sendLineWidth;
            sendBorderEndX = crdEndX - sendLineWidth;
            sendBorderEndY = crdEndY + sendLineWidth;
            sendBorderWidth = sendXLength - (sendLineWidth * 2);
            sendBorderHeight = sendYLength + (sendLineWidth * 2);

            if (sendLineWidth > 0) {
                sendLeftTopX = sendBorderEndX;
                sendLeftTopY = sendBorderStartY;

                sendRightTopX = sendBorderStartX;
                sendRightTopY = sendBorderStartY;

                sendLeftBottomX = sendBorderEndX;
                sendLeftBottomY = sendBorderEndY;

                sendRightBottomX = sendBorderStartX;
                sendRightBottomY = sendBorderEndY;
            }
            else {
                sendLeftTopX = crdEndX;
                sendLeftTopY = crdStartY;

                sendRightTopX = crdStartX;
                sendRightTopY = crdStartY;

                sendLeftBottomX = crdEndX;
                sendLeftBottomY = crdEndY;

                sendRightBottomX = crdStartX;
                sendRightBottomY = crdEndY;
            }
            
        }
        else if (sendOrientation == "LEFT_TOP") {
            //LeftTopOriented
            sendBorderStartX = crdStartX + sendLineWidth;
            sendBorderStartY = crdStartY + sendLineWidth;
            sendBorderEndX = crdEndX - sendLineWidth;
            sendBorderEndY = crdEndY - sendLineWidth;
            sendBorderWidth = sendXLength - (sendLineWidth * 2);
            sendBorderHeight = sendYLength - (sendLineWidth * 2);
            console.log(sendBorderStartX, sendBorderStartY, sendBorderEndX, sendBorderEndY, sendBorderWidth, sendBorderHeight);

            if (sendLineWidth > 0) {
                sendLeftTopX = sendBorderEndX;
                sendLeftTopY = sendBorderEndY;

                sendRightTopX = sendBorderStartX;
                sendRightTopY = sendBorderEndY;

                sendLeftBottomX = sendBorderEndX;
                sendLeftBottomY = sendBorderStartY;

                sendRightBottomX = sendBorderStartX;
                sendRightBottomY = sendBorderStartY;
            }
            else {
                sendLeftTopX = crdEndX;
                sendLeftTopY = crdEndY;

                sendRightTopX = crdStartX;
                sendRightTopY = crdEndY;

                sendLeftBottomX = crdEndX;
                sendLeftBottomY = crdStartY;

                sendRightBottomX = crdStartX;
                sendRightBottomY = crdStartY;
            }
            
        }
        else if (sendOrientation == "RIGHT_TOP") {
            //RightTopOriented
            sendBorderStartX = crdStartX - sendLineWidth;
            sendBorderStartY = crdStartY + sendLineWidth;
            sendBorderEndX = crdEndX + sendLineWidth;
            sendBorderEndY = crdEndY - sendLineWidth;
            sendBorderWidth = sendXLength + (sendLineWidth * 2);
            sendBorderHeight = sendYLength - (sendLineWidth * 2);

            if (sendLineWidth > 0) {
                sendLeftTopX = sendBorderStartX;
                sendLeftTopY = sendBorderEndY;

                sendRightTopX = sendBorderEndX;
                sendRightTopY = sendBorderEndY;

                sendLeftBottomX = sendBorderStartX;
                sendLeftBottomY = sendBorderStartY;

                sendRightBottomX = sendBorderEndX;
                sendRightBottomY = sendBorderStartY;
            }
            else {
                sendLeftTopX = crdStartX;
                sendLeftTopY = crdEndY;

                sendRightTopX = crdEndX;
                sendRightTopY = crdEndY;

                sendLeftBottomX = crdStartX;
                sendLeftBottomY = crdStartY;

                sendRightBottomX = crdEndX;
                sendRightBottomY = crdStartY;
            }

        }

        //const newCrd = {
        //    Name: name,
        //    Figure: figure,
        //    Orientation: sendOrientation,
        //    StartX: crdStartX,
        //    StartY: crdStartY,
        //    EndX: crdEndX,
        //    EndY: crdEndY,
        //    LeftTopX: sendLeftTopX,
        //    LeftTopY: sendLeftTopY,
        //    RightTopX: sendRightTopX,
        //    RightTopY: sendRightTopY,
        //    LeftBottomX: sendLeftBottomX,
        //    LeftBottomY: sendLeftBottomY,
        //    RightBottomX: sendRightBottomX,
        //    RightBottomY: sendRightBottomY,
        //    Width: sendXLength,
        //    Height: sendYLength,
        //    BorderStartX: sendBorderStartX,
        //    BorderEndX: sendBorderEndX,
        //    BorderStartY: sendBorderStartY,
        //    BorderEndY: sendBorderEndY,
        //    BorderWidth: sendBorderWidth,
        //    BorderHeight: sendBorderHeight,
        //    LineWidth: sendLineWidth,
        //    BorderColor: sendBorderColor,
        //    FillColor: sendFillColor
        //}

        const newCrd = {
            name: sendName,
            figure: sendFigure,
            orientation: sendOrientation,
            startX: crdStartX,
            startY: crdStartY,
            endX: crdEndX,
            endY: crdEndY,
            leftTopX: sendLeftTopX,
            leftTopY: sendLeftTopY,
            rightTopX: sendRightTopX,
            rightTopY: sendRightTopY,
            leftBottomX: sendLeftBottomX,
            leftBottomY: sendLeftBottomY,
            rightBottomX: sendRightBottomX,
            rightBottomY: sendRightBottomY,
            width: sendXLength,
            height: sendYLength,
            borderStartX: sendBorderStartX,
            borderEndX: sendBorderEndX,
            borderStartY: sendBorderStartY,
            borderEndY: sendBorderEndY,
            borderWidth: sendBorderWidth,
            borderHeight: sendBorderHeight,
            lineWidth: sendLineWidth,
            borderColor: sendBorderColor,
            fillColor: sendFillColor
        }
        
        return newCrd;
    }

    function checkSelect(slctX, slctY) {
        let reObj = ["none"];

        for (let i = 0; i < crdData.length; i++) {
            let value = crdData[i];
            if ((value.leftTopX <= slctX) && (slctX <= value.rightTopX) &&
                (value.leftTopY <= slctY) && (slctY <= value.leftBottomY)) {
                let context = canvas.getContext("2d");

                context.clearRect(0, 0, canvas.width, canvas.height);
                drawRectObjects(crdData);

                drawRectObject(value);

                selectedRectX = value.leftTopX;
                selectedRectY = value.leftTopY;
                selectedRectEndX = value.rightBottomX;
                selectedRectEndY = value.rightBottomY;

                reObj = value;

                break;
            }
            else {
                reObj = "";
            }
        }
        return reObj;
    }

    function drawWithFillRect(fromX, fromY, toX, toY, selectFlg, isDrawing) {

        let lineWidth = 1; // border width

        let rectWidth = toX - fromX;
        let rectHeight = toY - fromY;

        let borderRectX;
        let borderRectY;
        let borderRectWidth;
        let borderRectHeight;

        let rectOrientation = detectOrientation(fromX, toX, fromY, toY);
        
        if (rectOrientation == "RIGHT_BOTTOM") {
            //RightBottomOriented
            borderRectX = fromX - lineWidth;
            borderRectY = fromY - lineWidth;
            borderRectWidth = rectWidth + (lineWidth * 2);
            borderRectHeight = rectHeight + (lineWidth * 2);
        }
        else if (rectOrientation == "LEFT_BOTTOM") {
            //LeftBottomOriented
            borderRectX = fromX + lineWidth;
            borderRectY = fromY - lineWidth;
            borderRectWidth = rectWidth - (lineWidth * 2);
            borderRectHeight = rectHeight + (lineWidth * 2);
        }
        else if (rectOrientation == "LEFT_TOP") {
            //LeftTopOriented
            borderRectX = fromX + lineWidth;
            borderRectY = fromY + lineWidth;
            borderRectWidth = rectWidth - (lineWidth * 2);
            borderRectHeight = rectHeight - (lineWidth * 2);
        }
        else if (rectOrientation == "RIGHT_TOP") {
            //RightTopOriented
            borderRectX = fromX - lineWidth;
            borderRectY = fromY + lineWidth;
            borderRectWidth = rectWidth + (lineWidth * 2);
            borderRectHeight = rectHeight - (lineWidth * 2);
        }
        

        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawRectObjects(crdData);
        //define line and color
        
        context.fillStyle = "#000000";// object color

        if (isDrawing == true) {
            if (selectFlg == OprModeEnum.selectMode) {
                //selectedObj.startX = fromX;
                //selectedObj.startY = fromY;
                //selectedObj.width = rectWidth;
                //selectedObj.height = rectHeight;
                drawRectObject(movingObj);

            }
            else {
                context.fillStyle = "#bfbfbf";// border color
                context.fillRect(borderRectX, borderRectY, borderRectWidth, borderRectHeight);// render rectangle
                context.fillStyle = "#ffffff";// object color
                context.fillRect(fromX, fromY, rectWidth, rectHeight);// render rectangle
            }
        }
        else {
            //when it's about to finish
            context.fillStyle = "#000000";// border color
            context.fillRect(borderRectX, borderRectY, borderRectWidth, borderRectHeight);// render rectangle
            context.fillStyle = "#ffffff";// object color
            context.fillRect(fromX, fromY, rectWidth, rectHeight);// render rectangle

            drawRectObjects(crdData);
        }

        
    }

    function drawRectObjects(objList) {
        if (objList.length != 0) {
            objList.forEach(function (value) {
                let context = canvas.getContext("2d");
                context.fillStyle = value.borderColor;// border color
                context.fillRect(value.borderStartX, value.borderStartY, value.borderWidth, value.borderHeight);// render rectangle

                context.fillStyle = value.fillColor;// object color
                context.fillRect(value.startX, value.startY, value.width, value.height);// render rectangle
            });
        }
    }

    //for selectObject
    function drawRectObject(rectObject) {
        
        let selectBorder = 5;
        let selectBorderRectX = 0,
            selectBorderRectY = 0,
            selectBorderRectWidth = 0,
            selectBorderRectHeight = 0;

        let rectOrientation = detectOrientation(rectObject.borderStartX, rectObject.borderEndX, rectObject.borderStartY, rectObject.borderEndY);
        
        if (rectOrientation == "RIGHT_BOTTOM") {
            //RightBottomOriented
            selectBorderRectX = rectObject.borderStartX - selectBorder;
            selectBorderRectY = rectObject.borderStartY - selectBorder;
            selectBorderRectWidth = rectObject.borderWidth + (selectBorder * 2);
            selectBorderRectHeight = rectObject.borderHeight + (selectBorder * 2);
        }
        else if (rectOrientation == "LEFT_BOTTOM") {
            //LeftBottomOriented
            selectBorderRectX = rectObject.borderStartX + selectBorder;
            selectBorderRectY = rectObject.borderStartY - selectBorder;
            selectBorderRectWidth = rectObject.borderWidth - (selectBorder * 2);
            selectBorderRectHeight = rectObject.borderHeight + (selectBorder * 2);
        }
        else if (rectOrientation == "LEFT_TOP") {
            //LeftTopOriented
            selectBorderRectX = rectObject.borderStartX + selectBorder;
            selectBorderRectY = rectObject.borderStartY + selectBorder;
            selectBorderRectWidth = rectObject.borderWidth - (selectBorder * 2);
            selectBorderRectHeight = rectObject.borderHeight - (selectBorder * 2);
        }
        else if (rectOrientation == "RIGHT_TOP") {
            //RightTopOriented
            selectBorderRectX = rectObject.borderStartX - selectBorder;
            selectBorderRectY = rectObject.borderStartY + selectBorder;
            selectBorderRectWidth = rectObject.borderWidth + (selectBorder * 2);
            selectBorderRectHeight = rectObject.borderHeight - (selectBorder * 2);
        }

        let context = canvas.getContext("2d");

        context.fillStyle = "#F54242"; // Red color
        context.fillRect(selectBorderRectX, selectBorderRectY, selectBorderRectWidth, selectBorderRectHeight);

        context.fillStyle = rectObject.borderColor;// border color
        context.fillRect(rectObject.borderStartX, rectObject.borderStartY, rectObject.borderWidth, rectObject.borderHeight);// render rectangle

        context.fillStyle = rectObject.fillColor;// object color
        context.fillRect(rectObject.startX, rectObject.startY, rectObject.width, rectObject.height);// render rectangle

    }

    function detectOrientation(startPointX, endPointX, startPointY, endPointY) {
        let returnOrientation = "";

        if (startPointX < endPointX && startPointY < endPointY) {
            //RightBottomOriented
            returnOrientation = "RIGHT_BOTTOM";
        }
        else if (startPointX > endPointX && startPointY < endPointY) {
            //LeftBottomOriented
            returnOrientation = "LEFT_BOTTOM";
        }
        else if (startPointX > endPointX && startPointY > endPointY) {
            //LeftTopOriented
            returnOrientation = "LEFT_TOP";
        }
        else if (startPointX < endPointX && startPointY > endPointY) {
            //RightTopOriented
            returnOrientation = "RIGHT_TOP";
        }

        return returnOrientation;
    }

    function changeValue(param, value) {
        //1. startX
        //2. endX
        //3. width
        //4. height
        //5. fill color
        //6. border width
        //7. border color

        let changeObj;

        if (param == "startX") {
            changeObj = generateCrd(selectedObj.figure, selectedObj.name, value, selectedObj.startY, selectedObj.endX, selectedObj.endY, selectedObj.lineWidth, selectedObj.borderColor, selectedObj.fillColor);
        }
        else if (param == "startY") {
            changeObj = generateCrd(selectedObj.figure, selectedObj.name, selectedObj.startX, value, selectedObj.endX, selectedObj.endY, selectedObj.lineWidth, selectedObj.borderColor, selectedObj.fillColor);
        }
        else if (param == "width") {
            // probably in order to change width parameter, you need to reculculate the endX/Y.

            let changeEndX = 0;
            if (selectedObj.width < 0) {
                // -width = endPointX - startPointX;
                // endPointX - startPointX = -selectObj.width
                changeEndX = parseInt(`-${selectedObj.startX}`, 10) - parseInt(value, 10);
            }
            else {
                // width = endPointX - startPointX;
                // endPointX - startPointX = selectObj.width
                changeEndX = parseInt(selectedObj.startX, 10) + parseInt(value, 10);
            }
            console.log("changeEndXValue is");
            console.log(selectedObj.startX);
            console.log(value);
            console.log(parseInt(value, 10));
            console.log(changeEndX);
            changeObj = generateCrd(selectedObj.figure, selectedObj.name, selectedObj.startX, selectedObj.startY, changeEndX, selectedObj.endY, selectedObj.lineWidth, selectedObj.borderColor, selectedObj.fillColor);
        }
        else if (param == "height") {
            let changeEndY = 0;
            // height = endY - startY
            if (selectedObj.height < 0) {
                // -height = endY - startY
                // endY = -height + startY
                changeEndY = parseInt(`-${value}`, 10) + parseInt(selectedObj.startY, 10);
            }
            else {
                // height = endY - startY
                // endY = height + startY
                changeEndY = parseInt(value, 10) + parseInt(selectedObj.startY, 10);
            }
            console.log("changeEndYValue is");
            console.log(selectedObj.startY);
            console.log(value);
            console.log(changeEndY);
            changeObj = generateCrd(selectedObj.figure, selectedObj.name, selectedObj.startX, selectedObj.startY, selectedObj.endX, changeEndY, selectedObj.lineWidth, selectedObj.borderColor, selectedObj.fillColor);
        }
        else if (param == "fillColor") {
            let changeColorCode = value;

            changeObj = generateCrd(selectedObj.figure, selectedObj.name, selectedObj.startX, selectedObj.startY, selectedObj.endX, selectedObj.endY, selectedObj.lineWidth, selectedObj.borderColor, changeColorCode);
        }
        else if (param == "lineWidth") {
            let changeLineWidth = value;
            changeObj = generateCrd(selectedObj.figure, selectedObj.name, selectedObj.startX, selectedObj.startY, selectedObj.endX, selectedObj.endY, changeLineWidth, selectedObj.borderColor, selectedObj.fillColor);
        }
        else if (param == "borderColor") {
            let changeBorderColor = value;
            changeObj = generateCrd(selectedObj.figure, selectedObj.name, selectedObj.startX, selectedObj.startY, selectedObj.endX, selectedObj.endY, selectedObj.lineWidth, changeBorderColor, selectedObj.fillColor);
        }

        return changeObj;
    }


});

