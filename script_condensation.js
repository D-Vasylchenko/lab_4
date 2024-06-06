const n1 = 3;
const n2 = 3;
const n3 = 0;
const n4 = 7;
const totalMatrixSize = 10 + n3;
const scale1 = 1 - n3 * 0.01 - n4 * 0.01 - 0.3;
const scale2 = 1 - n3 * 0.005 - n4 * 0.005 - 0.27;
const circleRadius = 150;
const canvasCenterX = 400;
const canvasCenterY = 300;
const stepAngle = (2 * Math.PI) / (totalMatrixSize - 1);

function CustomRandomGenerator(seedValue) {
    this.seedValue = seedValue;
    const modulusValue = Math.pow(2, 31);

    this.generate = function () {
        this.seedValue = (705205 * this.seedValue + 220) % modulusValue;
        return (this.seedValue / modulusValue) * 2;
    };
}

function calculateNodeCoordinates(centerX, centerY) {
    const coordinates = [];
    for (let i = 0; i < totalMatrixSize - 1; i++) {
        const x = centerX - circleRadius * Math.cos(i * stepAngle);
        const y = centerY - circleRadius * Math.sin(i * stepAngle);
        coordinates.push({ x, y });
    }
    coordinates.push({ x: centerX, y: centerY });
    return coordinates;
}

function multiplyMatrices(matrixA, matrixB) {
    const size = matrixA.length;
    const resultMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                resultMatrix[i][j] += matrixA[i][k] * matrixB[k][j];
            }
        }
    }
    return resultMatrix;
}

function calculateReachability(matrix) {
    const size = matrix.length;
    const reachabilityMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    let powerMatrix = [...matrix];

    for (let i = 0; i < size; i++) {
        powerMatrix = multiplyMatrices(powerMatrix, matrix);
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                reachabilityMatrix[j][k] = reachabilityMatrix[j][k] || powerMatrix[j][k];
            }
        }
    }
    return reachabilityMatrix.map(row => row.map(cell => (cell !== 0 ? 1 : 0)));
}

function findStrongComponents(matrix) {
    const size = matrix.length;
    const reachabilityMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    const transposedMatrix = Array.from({ length: size }, () => Array(size).fill(0));
    const strongComponentsMatrix = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                reachabilityMatrix[i][j] += matrix[i][k] * matrix[k][j];
            }
            transposedMatrix[i][j] = matrix[j][i];
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            strongComponentsMatrix[i][j] = matrix[i][j] * transposedMatrix[i][j];
        }
    }
    return strongComponentsMatrix;
}

function buildCondensedGraph(sccMatrix) {
    const size = sccMatrix.length;
    const condensedGraph = Array.from({ length: size }, () => []);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (sccMatrix[i][j] === 1) {
                for (let k = 0; k < size; k++) {
                    if (k !== j && sccMatrix[j][k] === 1) {
                        const component = findVertexComponent(sccMatrix, k);
                        if (!condensedGraph[i].includes(component)) {
                            condensedGraph[i].push(component);
                        }
                    }
                }
            }
        }
    }
    return condensedGraph
        .map(nodes => (nodes.length === 0 ? [0] : nodes))
        .filter((node, index, self) => index === self.findIndex(n => JSON.stringify(n) === JSON.stringify(node)));
}

function findVertexComponent(sccMatrix, vertex) {
    for (let i = 0; i < sccMatrix.length; i++) {
        if (sccMatrix[i][vertex] === 1) {
            return i;
        }
    }
    return -1;
}

function drawNodes(ctx, coords) {
    for (let i = 0; i < totalMatrixSize; i++) {
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

function drawEdges(ctx, matrix, positions) {
    for (let i = 0; i < totalMatrixSize; i++) {
        for (let j = 0; j < totalMatrixSize; j++) {
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
                    drawArrow(ctx, positions[j].x - offsetX, positions[j].y - offsetY, angle);
                } else {
                    const angle = positions[i].x < ctx.canvas.width / 4 ? Math.PI / 6 : (Math.PI * 7) / 8;
                    drawLoop(ctx, i, angle, positions[i].x, positions[i].y);
                }
            }
        }
    }
}

function drawLoop(ctx, nodeIndex, angle, x, y) {
    let offsetX = (x >= ctx.canvas.width / 4 && x <= ctx.canvas.width / 2) || x >= (3 * ctx.canvas.width) / 4 ? 20 : -20;
    x += offsetX;
    ctx.strokeStyle = 'green'; 
    ctx.beginPath();
    ctx.arc(x, y - 7.5, 10, Math.PI / 1.3, (Math.PI * 6.5) / 2);
    ctx.stroke();
    ctx.closePath();
    if (angle !== 0) {
        drawArrow(ctx, x, y + 3, angle);
    }
}

function drawArrow(ctx, x, y, angle) {
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

function logGraphDetails(degrees) {
    const consoleElement = document.getElementById('console');
    consoleElement.innerHTML += 'Hanging and isolated vertices:<br>';
    for (let i = 0; i < totalMatrixSize; i++) {
        if (degrees[i] === 0) {
            consoleElement.innerHTML += `Vertex ${i + 1} is isolated<br>`;
        }
        if (degrees[i] === 1) {
            consoleElement.innerHTML += `Vertex ${i + 1} is hanging<br>`;
        }
    }

    let isRegular = true;
    for (let i = 1; i < totalMatrixSize; i++) {
        if (degrees[i] !== degrees[i - 1]) {
            consoleElement.innerHTML += 'Graph is irregular<br>';
            isRegular = false;
            break;
        }
    }
    if (isRegular) {
        consoleElement.innerHTML += `Graph is regular. Degree: ${degrees[0]}<br>`;
    }
}
function findMatrixSquare(matrix) {
    const result = Array.from({ length: size }, () => Array(size).fill(0));
    const size = matrix.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                result[i][j] += matrix[i][k] * matrix[k][j];
            }
        }
    }

    return result;
}

function findTwoStepPaths(matrix, size) {
    const twoStepMatrix = multiplyMatrices(matrix, matrix);
    const consoleElement = document.getElementById('console');
    consoleElement.innerHTML += 'Paths of length 2:<br>';
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (twoStepMatrix[i][j] > 0) {
                for (let k = 0; k < size; k++) {
                    if (matrix[k][j] === 1 && matrix[i][k] === 1) {
                        consoleElement.innerHTML += `${i + 1} -> ${k + 1} -> ${j + 1}<br>`;
                    }
                }
            }
        }
    }
}

const randomGen = new CustomRandomGenerator(3307);
let directedMatrix = [];
let undirectedMatrix = [];

for (let i = 0; i < totalMatrixSize; i++) {
    directedMatrix[i] = [];
    undirectedMatrix[i] = [];
    for (let j = 0; j < totalMatrixSize; j++) {
        let randomValue = randomGen.generate();
        undirectedMatrix[i][j] = Math.floor(randomValue * scale2);
        directedMatrix[i][j] = Math.floor(randomValue * scale1);
    }
}

let undirectedMatrixCopy = [];
for (let i = 0; i < directedMatrix.length; i++) {
    undirectedMatrixCopy[i] = [];
    for (let j = 0; j < directedMatrix[i].length; j++) {
        undirectedMatrixCopy[i][j] = directedMatrix[i][j];
    }
}

for (let i = 0; i < undirectedMatrixCopy.length; i++) {
    for (let j = i; j < undirectedMatrixCopy[i].length; j++) {
        if (undirectedMatrixCopy[i][j] !== undirectedMatrixCopy[j][i]) {
            undirectedMatrixCopy[i][j] = undirectedMatrixCopy[j][i] = Math.max(
                undirectedMatrixCopy[i][j],
                undirectedMatrixCopy[j][i]
            );
        }
    }
}

const nodeCoordinates = calculateNodeCoordinates(canvasCenterX, canvasCenterY);

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

drawEdges(ctx, undirectedMatrix, nodeCoordinates);
drawNodes(ctx, nodeCoordinates);

const reachabilityMatrix = calculateReachability(undirectedMatrix);

const strongComponentsMatrix = findStrongComponents(reachabilityMatrix);
const consoleElement = document.getElementById('console');
consoleElement.innerHTML += 'Strongly connected components matrix:<br>';
consoleElement.innerHTML += JSON.stringify(strongComponentsMatrix) + '<br>';

const condensedGraph = buildCondensedGraph(strongComponentsMatrix);

let twoWay = findMatrixSquare(matrix3);
wayTwoLength(matrix3, twoWay, n)
console.log(twoWay);

let threeWay = findCubedMatrix(twoWay, matrix3);
wayThreeLength(matrix3, twoWay, threeWay, n);
console.log(threeWay);

const condensedCoords = [];
for (let i = 0; i < condensedGraph.length; i++) {
    const angle = i * stepAngle + 11;
    const x = canvasCenterX + 230 + circleRadius * Math.cos(angle);
    const y = canvasCenterY + 250 + circleRadius * Math.sin(angle);
    condensedCoords.push({ x, y });
}

for (let i = 0; i < condensedGraph.length; i++) {
    const neighbors = condensedGraph[i];
    const source = condensedCoords[i];
    for (const neighbor of neighbors) {
        const target = condensedCoords[neighbor];
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
    }
}

for (let i = 0; i < condensedCoords.length; i++) {
    const { x, y } = condensedCoords[i];
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5733'; 
    ctx.fill();
    ctx.strokeStyle = '#E5E7E9'; 
    ctx.stroke();
    ctx.fillStyle = '#E5E7E9';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`C${i}`, x, y);
}
