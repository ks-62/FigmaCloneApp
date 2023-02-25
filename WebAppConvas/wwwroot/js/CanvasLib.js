let ObjectList = new Array();

let StartPosX = 0,
    StartPosY = 0,
    EndPosX = 0,
    EndPostY = 0,
    PrePosX = 0,
    PrePosY = 0,
    CurPosX = 0,
    CurPosY = 0;

let IsDrawing = false;

let SelectObject;

let MoveDistanceX = 0,
    MoveDistanceY = 0,
    MoveStartX = 0,
    MoveStartY = 0,
    MoveEndX = 0,
    MoveEndY = 0;

let OprModeEnum = {
    normal: 1,
    rectMode: 2,
    selectMode: 3,
    clearMode: 4
};


$(document).ready(function (CanvasElement) {

    CanvasElement.addEventListener('mousedown', e => {

    });

    CanvasElement.addEventListener('mousemove', e => {

    });

    CanvasElement.addEventListener('mouseup', e => {

    });

    CanvasElement.addEventListener('mouseout', e => {

    });

});

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

function RenderObjects(objList) {
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

function DetectOrientation(startPointX, endPointX, startPointY, endPointY) {
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