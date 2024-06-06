const n1 = 3;
const n2 = 3;
const n3 = 0;
const n4 = 7;
const totalSize = 10 + n3;
const scale = 1 - n3 * 0.005 - n4 * 0.005 - 0.27;
const rad = 150;
const xCenter = 400;
const yCenter = 300;
const stepAngle = (2 * Math.PI) / (totalSize - 1);

function CustomRandon(seed) {
    this.seed = seed;
    const mod = Math.pow(2, 31);

    this.nextValue = function () {
        this.seed = (705205 * this.seed + 220) % mod;
        return (this.seed / mod) * 2;
    };
}

function calculateNodePositions(centerX, centerY) {
    const coords = [];
    for (let i = 0; i < totalSize - 1; i++) {
        const x = centerX - rad * Math.cos(i * stepAngle);
        const y = centerY - rad * Math.sin(i * stepAngle);
        coords.push({ x, y });
    }
    coords.push({ x: centerX, y: centerY });
    return coords;
}

function drawDirectionArrow(x, y, angle) {
    const arrowSize = 5;
    context.save();
    context.translate(x, y);
    context.rotate(angle);
    context.strokeStyle = 'green';
    context.fillStyle = 'green';
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-arrowSize, arrowSize / 2);
    context.lineTo(-arrowSize, -arrowSize / 2);
    context.closePath();
    context.fill();
    context.restore();
}


function drawArcLoop(index, angle, x, y) {
    let offsetX = (x >= canvasElement.width / 4 && x <= canvasElement.width / 2) || x >= (3 * canvasElement.width) / 4 ? 20 : -20;
    x += offsetX;
    context.strokeStyle = 'green';
    context.beginPath();
    context.arc(x, y - 7.5, 10, Math.PI / 1.3, (Math.PI * 6.5) / 2);
    context.stroke();
    context.closePath();
    if (angle !== 0) {
        drawDirectionArrow(x, y + 3, angle);
    }
}

function renderEdges(matrix, positions) {
    for (let i = 0; i < totalSize; i++) {
        for (let j = 0; j < totalSize; j++) {
            if (matrix[i][j] === 1) {
                context.strokeStyle = 'green';
                context.beginPath();
                context.moveTo(positions[i].x, positions[i].y);
                context.lineTo(positions[j].x, positions[j].y);
                context.stroke();
            }
        }
    }
}



function renderNodes(coords) {
    for (let i = 0; i < totalSize; i++) {
        context.fillStyle = '#FF5733';
        context.beginPath();
        context.arc(coords[i].x, coords[i].y, 20, 0, Math.PI * 2);
        context.fill();
        context.strokeStyle = '#E5E7E9';
        context.stroke();
        context.closePath();
        context.fillStyle = '#E5E7E9';
        context.font = '10px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${i + 1}`, coords[i].x, coords[i].y);
    }
}

function logGraphInfo(matrix) {
    const degrees = [];
    const consoleElement = document.getElementById('console');
    for (let i = 0; i < totalSize; i++) {
        let degree = 0;
        for (let j = 0; j < totalSize; j++) {
            if (matrix[i][j] === 1) {
                degree += (i === j) ? 2 : 1;
            }
        }
        degrees[i] = degree;
        consoleElement.innerHTML += `Vertex: ${i + 1}. Degree: ${degree}<br>`;
    }
}
function wayTwoLength(arr, twoWay, n) {

    console.log("Ways length 2:\n");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (twoWay[i][j] > 0) {
                for (let k = 0; k < n; k++) {
                    if (arr[k][j] === 1 && arr[i][k] === 1) {
                        console.log(`${i + 1} -> ${k + 1} -> ${j + 1}`);
                    }
                }
            }
        }
    }
    console.log("\n");
}

function findCubedMatrix(matrix1, matrix2) {
    const size = matrix1.length;
    let result = new Array(size).fill(0).map(() => new Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }
    return result;
}

const rng = new CustomRandon(3307);
let graphUndirected = [];

for (let i = 0; i < totalSize; i++) {
    graphUndirected[i] = [];
    for (let j = 0; j < totalSize; j++) {
        let randValue = rng.nextValue();
        graphUndirected[i][j] = Math.floor(randValue * scale);
    }
}

let graphCopy = [];
for (let i = 0; i < graphUndirected.length; i++) {
    graphCopy[i] = [];
    for (let j = 0; j < graphUndirected[i].length; j++) {
        graphCopy[i][j] = graphUndirected[i][j];
    }
}

for (let i = 0; i < graphCopy.length; i++) {
    for (let j = i; j < graphCopy[i].length; j++) {
        if (graphCopy[i][j] !== graphCopy[j][i]) {
            graphCopy[i][j] = graphCopy[j][i] = Math.max(
                graphCopy[i][j],
                graphCopy[j][i]
            );
        }
    }
}

const nodeCoordinates = calculateNodePositions(xCenter, yCenter);

const canvasElement = document.getElementById('graphCanvas');
const context = canvasElement.getContext('2d');

context.clearRect(0, 0, canvasElement.width, canvasElement.height);
renderEdges(graphCopy, nodeCoordinates);
renderNodes(nodeCoordinates);

const consoleElement = document.getElementById('console');
consoleElement.innerHTML += 'Undirected graph information:<br>';
logGraphInfo(graphCopy);
