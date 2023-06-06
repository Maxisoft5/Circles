
window.onload = function() {

    let about = document.getElementById("about");
    about.addEventListener('click', function() {

        swal(`- Select 4 points on canvas to create 2 circles, first - blue circle with radius as disatance between first and second points `
            + `and second - yellow circle with radius as distance between third and fourth points, also you will get information about intersection points of the circles if they exists.`
            + ` \n - As well, you can see the coordinates of each point hovering on them or drag and drop first 4 points to chage position. \n - To reset all canvas, click clear button.` 
            + ` \n \n \n - \u00A9 Maksym Gryniuk`); 	

    });
    const reset = document.getElementById("reset");

    reset.addEventListener('click', () => {
        resetPoints();
    });

    let drawCoords = (ctx, x, y, color = "green") => {
        ctx.save();
        ctx.globalCompositeOperation='source-over';
        ctx.translate(x, y);
        ctx.fillStyle = color;
        ctx.fillRect(-45, -7, 37, 14);
        ctx.fillStyle = 'white';
        ctx.fillText("X: " + Math.floor(x), -30, 0);
        ctx.rotate(Math.PI / 2);
        ctx.fillStyle = color;
        ctx.fillRect(-45, -7, 37, 14);
        ctx.fillStyle = 'white';
        ctx.fillText("Y: " + Math.floor(y), -30, 0);
        ctx.restore();
    };

    let getDistance = (from, to) => {
        const result = Math.hypot(to.X - from.X , to.Y - from.Y);
        return result;
    };

    let drawCircles = (ctx) => {
        const firstCircleRadius = getDistance(points[0], points[1]);
        const secondCircleRadius = getDistance(points[2], points[3]);
        ctx.globalCompositeOperation='multiply';
        ctx.beginPath();
        ctx.fillStyle = "#FFFFFF";
        ctx.arc(points[0].X, points[0].Y, firstCircleRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = "#FFFFFF";
        ctx.arc(points[2].X, points[2].Y, secondCircleRadius, 0, 2*Math.PI);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'yellow';
        ctx.stroke();
    }

    let drawIntersectionCirclesPoints = () => {
        const circleA = points[0];
        const circleB = points[2];
    
        let dx = circleB.X - circleA.X;
        let dy = circleB.Y - circleA.Y;
        let distance = Math.hypot(dx, dy);
        const radius1 = getDistance(points[0], points[1]);
        const radius2 = getDistance(points[2], points[3]);
        
        if (distance <= radius1 + radius2 && (distance > Math.abs(radius1-radius2)) ) { 
            drawIntersection(radius1, radius2, distance, dx, dy, circleA);
        } else {
            points = points.filter(x => x.draggable);
        }
    }

      
    let drawIntersection = (sideA, sideB, sideC, dx, dy, circle) => {

        let aSquare = Math.pow(sideA, 2);
        let bSquare = Math.pow(sideB, 2);
        let cSquare = Math.pow(sideC, 2);
    
        let cosineA = (aSquare - bSquare + cSquare) / (sideA * sideC * 2);
        let angleOfRotation = Math.acos(cosineA);
        let angleCorrection = Math.atan2(dy, dx);
    
        let pontOneX = circle.X + Math.cos(angleCorrection - angleOfRotation) * sideA;
        let pontOneY = circle.Y + Math.sin(angleCorrection - angleOfRotation) * sideA;
        let pontTwoX = circle.X + Math.cos(angleCorrection + angleOfRotation) * sideA;
        let pontTwoY = circle.Y + Math.sin(angleCorrection + angleOfRotation) * sideA;
        points = points.filter(x => x.draggable);
        points.push(new Point(pontOneX, pontOneY, " red", false));
        points.push(new Point(pontTwoX, pontTwoY, "red", false));
    }

    let canvas = document.getElementById('mycanvas');
    
    let ctx = canvas.getContext('2d');
    
    let w = canvas.width = window.innerWidth * 0.9;
    let h = canvas.height = window.innerHeight * 0.9;

    canvas.style.backgroundColor = 'transparent';

    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '11px Arial';


    let drawCanvas = context => {

        context.save();
        context.fillStyle = 'white';
        context.fillRect(0, 0, w, h);
        context.lineWidth = 0.3;
        context.strokeStyle = 'lightgray';
        context.fillStyle = 'black';
        context.closePath();
        context.stroke();
        context.restore();
    }

    drawCanvas(ctx);

    class Point {
        constructor(x, y, color, draggable) {
            this.draggable = draggable;
            this.x = x;
            this.y = y;
            this.color = color;
            this.selected = false;
            this.active = false;
        }
        draw(context, canvas) {
            context.fillStyle = this.color;
            if (this.active && this.draggable) {
                context.fillStyle = this.color;
                context.save();
                context.beginPath();
                context.moveTo(this.x, this.y);
                context.lineTo(0, this.y);
                context.moveTo(this.x, this.y);
                context.lineTo(this.x, 0);
                context.moveTo(this.x, this.y);
                context.lineTo(this.x, canvas.getBoundingClientRect().height);
                context.moveTo(this.x, this.y);
                context.lineTo(canvas.getBoundingClientRect().width, this.y);
                context.moveTo(this.x, this.y);
                context.closePath();
                context.lineWidth = 0.5;
                context.strokeStyle = this.color;
                context.stroke();

                drawCoords(context, this.x, this.y, "black");

                context.restore();
            }
            context.beginPath();
            context.fillStyle = this.color;
            context.arc(this.x, this.y, 5, 0, 2*Math.PI);
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = this.color;
            context.stroke();
            if (points.length == 4 || points.length == 6) {
                drawIntersectionCirclesPoints();
                drawCircles(context);
                let title = document.getElementById("help-title");
                if (points.length == 6) {
                    title.textContent = `Intersection Points: top - X: ${points[4].X.toFixed(0)}, Y: ${points[4].Y.toFixed(0)}, bottom - X: ${points[5].X.toFixed(0)}, Y: ${points[4].Y.toFixed(0)}`; 
                } else {
                    title.textContent = '';
                }
            }
        }
        update() {
            this.x += 0.1;
        }

        select() {
            this.selected = !this.selected;
        }

        activate() {
            this.active = !this.active;
        }

        get X() {
            return this.x;
        }

        get Y() {
            return this.y;
        }

    }

    var points = new Array();

    let getMouseCoords = (canvas, e) => {
        let rect = canvas.getBoundingClientRect();
        const elementRelativeX = e.clientX - rect.left;
        const elementRelativeY = e.clientY - rect.top;
        const canvasRelativeX = elementRelativeX * canvas.width / rect.width;
        const canvasRelativeY = elementRelativeY * canvas.height / rect.height;
        return {
            x: canvasRelativeX,
            y: canvasRelativeY
        }
    }

    let getOffsetCoords = (mouse, rect) => {
        return {
            x: mouse.x - rect.x,
            y: mouse.y - rect.y
        }
    }

    let resetPoints = () => {
        const title = document.getElementById("help-title");
        title.textContent = `Choose 4 points by clicking anywhere`;
        points = [];
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    let cursorInCircle = (mouseX, mouseY, cirX, cirY, cirW, cirH) => {
        return Math.abs(mouseX - cirX) <= cirW && Math.abs(mouseY - cirY) <= cirH;
    }


    canvas.addEventListener('click', e => {
        let mouse = getMouseCoords(canvas, e);
        if (points.some(p => Math.abs(p.X - mouse.x) < 5 ||  Math.abs(p.Y - mouse.y) < 5)) {
            return;
        }
        if (points.length < 4) {
            points.push(new Point(mouse.x, mouse.y, "black", true));
            if (points.length == 4) {
                drawIntersectionCirclesPoints();
                drawCircles(ctx);
                let title = document.getElementById("help-title");
                if (points.length == 6) {
                    title.textContent = `Intersection Points: top - X: ${points[4].X.toFixed(0)}, Y: ${points[4].Y.toFixed(0)}, bottom - X: ${points[5].X.toFixed(0)}, Y: ${points[4].Y.toFixed(0)}`; 
                } else {
                    title.textContent = ``; 
                }
            } else {
                let title = document.getElementById("help-title");
                title.textContent = `Click in the frame to set point, still ${4 - points.length}`;
            }
        }
    });

    canvas.addEventListener('mousemove', e => {
        let mouse = getMouseCoords(canvas, e);

        let arr = points.filter(x => x.draggable).map(e => cursorInCircle(mouse.x, mouse.y, e.x, e.y, 10, 10));
        !arr.every(e => e === false) ? canvas.classList.add('pointer') : canvas.classList.remove('pointer');

        points.forEach(e => {

            if (e.selected) {
                e.x = mouse.x - e.offset.x;
                e.y = mouse.y - e.offset.y;
            }

            cursorInCircle(mouse.x, mouse.y, e.x, e.y, 10, 10) ?
                e.active != true ? e.activate() : false
                : e.active = false
        })
    });


    canvas.addEventListener('mousedown', e => {
        let mouse = getMouseCoords(canvas, e)
        points.filter(x => x.draggable).forEach(e => {
            if (cursorInCircle(mouse.x, mouse.y, e.x, e.y, 10, 10)) {
                e.selected = true
                e.offset = getOffsetCoords(mouse, e)
            } else {
                e.selected = false 
            }
        })
    })

    canvas.addEventListener('mouseup', e => {
        points.filter(x => x.draggable).forEach(e => e.selected = false)
    })

    function animate() {
        ctx.clearRect(0, 0, w, ctx.canvas.height)
        ctx.fillStyle = 'white';
        points.forEach(e => {
            e.draw(ctx, canvas);
        })
        window.requestAnimationFrame(animate);
    }

    animate();

}