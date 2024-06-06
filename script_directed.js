const n1 = 3;
const n2 = 3;
const n3 = 0;
const n4 = 7;
const matrixTotalSize = 10 + n3;
const scaleFactor1 = 1 - n3 * 0.01 - n4 * 0.01 - 0.3;
const graphRadius = 150;
const canvasCenterX = 400;
const canvasCenterY = 300;
const stepAngle = (2 * Math.PI) / (matrixTotalSize - 1);

function CustomRandomGenerator(seedValue) {
    this.seedValue = seedValue;
    const modulusValue = Math.pow(2, 31);

    this.nextValue = function () {
        this.seedValue = (705205 * this.seedValue + 220) % modulusValue;
        return (this.seedValue / modulusValue) * 2;
    };
}

function renderEdges(matrix, positions) {
    for (let i = 0; i < matrixTotalSize; i++) {
        for (let j = 0; j < matrixTotalSize; j++) {
            if (matrix[i][j] === 1) {
                if (i !== j) {
                    ctx.strokeStyle = 'green';
                    ctx.beginPath();
                    ctx.moveTo(positions[j].x, positions[j].y);
                    ctx.lineTo(positions[i].x, positions[i].y);
                    ctx.stroke();
                    const angle = Math.atan2(positions[j].y - positions[i].y, positions[j].x - positions[i].x);
                    const offsetX = Math.cos(angle) * 20;
                    const offsetY = Math.sin(angle) * 20;
                    drawArrow(positions[j].x - offsetX, positions[j].y - offsetY, angle);
                } else {
                    const loopAngle = positions[i].x < canvas.width / 4 ? Math.PI / 6 : (Math.PI * 7) / 8;
                    drawLoop(i, loopAngle, positions[i].x, positions[i].y);
                }
            }
        }
    }
}

function drawLoop(nodeIndex, angle, x, y) {
    let offsetX = (x >= canvas.width / 4 && x <= canvas.width / 2) || x >= (3 * canvas.width) / 4 ? 20 : -20;
    x += offsetX;
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    ctx.arc(x, y - 7.5, 10, Math.PI / 1.3, (Math.PI * 6.5) / 2);
    ctx.stroke();
    ctx.closePath();
    if (angle !== 0) {
        drawArrow(x, y + 3, angle);
    }
}

function renderNodes(coords) {
    for (let i = 0; i < matrixTotalSize; i++) {
        ctx.fillStyle = '#FF5733';
        ctx.beginPath();
        ctx.arc(coords[i].x, coords[i].y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#E5E7E9';
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = '#E5E7E9';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${i + 1}`, coords[i].x, coords[i].y);
    }
}

function drawArrow(x, y, angle) {
    const arrowSize = 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = 'green';
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowSize, arrowSize / 2);
    ctx.lineTo(-arrowSize, -arrowSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function logGraphInfo(matrix) {
    const degrees = [];
    const consoleElement = document.getElementById('console');
    for (let i = 0; i < matrixTotalSize; i++) {
        let inDegree = 0;
        let outDegree = 0;
        for (let j = 0; j < matrixTotalSize; j++) {
            if (matrix[i][j] === 1) outDegree++;
            if (matrix[j][i] === 1) inDegree++;
        }
        degrees[i] = inDegree + outDegree;
        consoleElement.innerHTML += `Vertex: ${i + 1}. InDegree: ${inDegree}. OutDegree: ${outDegree}<br>`;
    }
}


const randomGen = new CustomRandomGenerator(3307);
let directedGraphMatrix = [];

for (let i = 0; i < matrixTotalSize; i++) {
    directedGraphMatrix[i] = [];
    for (let j = 0; j < matrixTotalSize; j++) {
        let randomValue = randomGen.nextValue();
        directedGraphMatrix[i][j] = Math.floor(randomValue * scaleFactor1);
    }
}

function calculateNodeCoords(centerX, centerY) {
    const coords = [];
    for (let i = 0; i < matrixTotalSize - 1; i++) {
        const x = centerX - graphRadius * Math.cos(i * stepAngle);
        const y = centerY - graphRadius * Math.sin(i * stepAngle);
        coords.push({ x, y });
    }
    coords.push({ x: centerX, y: centerY });
    return coords;
}

const nodeCoords = calculateNodeCoords(canvasCenterX, canvasCenterY);

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

function wayTwoLength(adjMatrix, twoWay, n) {
    console.log("Ways length 2:\n");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (twoWay[i][j] > 0) {
                for (let k = 0; k < n; k++) {
                    if (adjMatrix[k][j] === 1 && adjMatrix[i][k] === 1) {
                        console.log(`${i + 1} -> ${k + 1} -> ${j + 1}`);
                    }
                }
            }
        }
    }
    console.log("\n");
}

function multiplyMatrices(matrix1, matrix2) {
    const size = matrix1.length;
    const result = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                result[i][j] += matrix1[i][k] * matrix2[k][j];
            }
        }
    }

    return result;
}

function wayThreeLength(adjMatrix, threeWay, n) {
    console.log("Ways length 3:\n");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (threeWay[i][j] > 0) {
                for (let k = 0; k < n; k++) {
                    if (adjMatrix[k][j] === 1) {
                        for (let l = 0; l < n; l++) {
                            if (adjMatrix[l][k] === 1 && adjMatrix[i][l] === 1) {
                                console.log(`${i + 1} -> ${l + 1} -> ${k + 1} -> ${j + 1}`);
                            }
                        }
                    }
                }
            }
        }
    }
    console.log("\n");
}


ctx.clearRect(0, 0, canvas.width, canvas.height);
renderEdges(directedGraphMatrix, nodeCoords);
renderNodes(nodeCoords);

const consoleElement = document.getElementById('console');
consoleElement.innerHTML += 'Directed graph information:<br>';
logGraphInfo(directedGraphMatrix);
