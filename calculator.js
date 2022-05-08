var infinity = Number.MAX_SAFE_INTEGER;
var data = [
    [infinity, infinity, 12, 5],
    [infinity, infinity, infinity, 3],
    [12, infinity, infinity, 1],
    [5, 3, 1, infinity],
]; // matrix
var steps = []; // here we have all matricies through all steps
var lb = 0;
var size = 4;
var path = []; // array of tuples (a,b) creating the path

function basicFillMatrix() {
    data = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            if (i == j)
                row.push(infinity);
            else
                row.push(0);
        }
        data.push(row);
    };
    console.log(data);
}

function resizeMatrix() {
    size = document.getElementById('inp-size').value;
    basicFillMatrix();
    generateInputTable();
}

function remapDataToInput() {
    let outputMatix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            if (data[i][j] == infinity)
                row.push('M');
            else
                row.push(data[i][j]);
        }
        outputMatix.push(row);
    };
    return outputMatix;
}

function generateInputTable() {
    let innerHtml = generateHeader() + generateBody(data, true);
    document.getElementById('inp-matrix').innerHTML = innerHtml;
}

function generateHeader() {
    let rowHtml = "<thead><th></th>";
    for (let i = 0; i < size; i++) {
        rowHtml += `<th>${i}</th>`;
    }
    rowHtml += "</thead>";
    return rowHtml;
}

function generateBody(inputData, generateIds, bottomRow = null, lastCol = null) {
    let rowHtml = "<tbody>";
    for (let i = 0; i < size; i++) {
        rowHtml += `<tr><td><b>${i}</b></td>`;
        for (let j = 0; j < size; j++) {
            let idsText = generateIds ? `id="i-${i}${j}"` : '';
            if (i == j || inputData[i][j] == infinity) {
                rowHtml += `<td><input type="text" value="M" ${idsText} disabled></td>`;
            } else {
                rowHtml += `<td><input type="text" value="${inputData[i][j]}" ${idsText}"></td>`;
            }     
        }
        if (!!lastCol) {
            rowHtml += `<td><input type="text" class="extra-cell" value="${lastCol[i]}" disabled></td>`; 
        }
        rowHtml += "</tr>";
    }
    if (!!bottomRow) {
        rowHtml += `<tr><td></td>`
        for (let i = 0; i < size; i++) {
            rowHtml += `<td><input type="text" class="extra-cell" value="${bottomRow[i]}" disabled></td>`;    
        }
        rowHtml += "</tr>";
    }
    rowHtml += "</tbody>";
    return rowHtml;
}


// todo
function remapDataToOutput() {
    let outputMatix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            if (data[i][j] == infinity)
                row.push('M');
            else
                row.push(data[i][j]);
        }
        outputMatix.push(row);
    };
    return outputMatix;
}

function remapInputToData() {
    let matrixFromInput = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            let inputValue = document.getElementById(`i-${i}${j}`).value;
            if (inputValue == 'M')
                row.push(infinity);
            else
                row.push(Number(inputValue));
        }
        matrixFromInput.push(row);
    };
    return matrixFromInput;
}

function generateTable(elementId, bottomRow = null, lastCol = null) {
    let mappedData = remapDataToOutput();
    let innerHtml = '<table>' + generateHeader() + generateBody(mappedData, false, bottomRow, lastCol) + '</table>';
    let element = document.getElementById(elementId);
    element.innerHTML = innerHtml;
}

function _clone(object) {
    let cloned = JSON.parse(JSON.stringify(object));
    return object;
}

function checkZerosInRowsAndCols() {
    // check zeros in rows
    let subtractedInRows = [];
    let subtractedInCols = [];

    data = remapInputToData();
    for (let i = 0; i < size; i++) {
        let minInRow = infinity;
        for (let j = 0; j < size; j++) {
            if (minInRow > data[i][j]) {
                minInRow = data[i][j]; 
            }
        }

        // nie nieskończoność i większe od 0 - odejmowanie od pozostałych
        if (minInRow < infinity && minInRow > 0) {
            lb += minInRow;
            subtractedInRows.push(minInRow);
            for (let j = 0; j < size; j++) {
                if (data[i][j] !== infinity) data[i][j] -= minInRow; 
            }
        } else {
            subtractedInRows.push(0);
        }
    }

    // check zeros in cols
    for (let i = 0; i < size; i++) {
        let minInCol = infinity;
        for (let j = 0; j < size; j++) {
            if (minInCol > data[j][i]) {
                minInCol = data[j][i];
            }
        }

        // nie nieskończoność i większe od 0 - odejmowanie od pozostałych
        if (minInCol < infinity && minInCol > 0) {
            lb += minInCol;
            subtractedInCols.push(minInCol);        
            for (let j = 0; j < size; j++) {
                if (data[j][i] !== infinity) data[j][i] -= minInCol; 
            }
        } else {
            subtractedInCols.push(0);
        }
    }
    generateTable('response', subtractedInCols, subtractedInRows);
    steps.push(_clone(data));
}

function findSecondMinsInRowsAndCols() {
    // check zeros in rows
    let secondMinsInRows = [];
    let secondMinsInCols = [];

    // data = remapInputToData(); // remapping is no longer needed
    for (let i = 0; i < size; i++) {
        let minInRow = infinity;
        let secondMinInRow = infinity;
        for (let j = 0; j < size; j++) {
            if (minInRow >= data[i][j]) {
                if (minInRow < infinity) {
                    secondMinInRow = minInRow;
                }
                minInRow = data[i][j];
            }
        }

        secondMinsInRows.push(secondMinInRow);
    }

    // check zeros in cols
    for (let i = 0; i < size; i++) {
        let minInCol = infinity;
        let secondMinInCol = infinity;
        for (let j = 0; j < size; j++) {
            if (minInCol >= data[j][i]) {
                if (minInCol < infinity) {
                    secondMinInCol = minInCol;
                }
                minInCol = data[j][i];
            }
        }

        secondMinsInCols.push(secondMinInCol);
    }
    generateTable('response', secondMinsInCols, secondMinsInRows);
}

function crossOutRowAndCol(rowNumber, colNumber) {
    let newMatrix = [];
    for (let i = 0; i < size; i++) {
        for (let i = 0; i < size; i++) {
            
        }
    }

    size--; // downsize the matrix
}

// musimy działać na abstrakcji macierzy, a nie samej macierzy
// przy wykreślaniu wierszy i kolumn podejście z klasyczną macierzą
// zagubi się w nazywaniu wierszy i kolumn kiedy coś z niej usuniemy
class CalculationMatrix {
    
    _rows = [];
    _cols = [];
    _matrix = [];

    constructor(matrix) {
        this._matrix = matrix;
        // rows
        for (let i = 0; i < size; i++) {
            let newRow = LineEntry(i, 0, size, i, i);
            this._rows.push(newRow);
        }
        // colls
        for (let i = 0; i < size; i++) {
            let newCol = LineEntry(i, i, i, 0, size);
            this._cols.push(newCol);      
        }

        this._matrix = matrix;
    }

    findSecondMins() {
        for (const row of this._rows) {
            row.findSecondMin(this._matrix);
        }

        for (const col of this._cols) {
            col.findSecondMin(this._matrix);
        }
    }

    findZerosOrRecalculate() {
        for (const row of this._rows) {
            row.findZeros(this._matrix);
        }

        for (const col of this._cols) {
            col.findZeros(this._matrix);
        }
    }

    crossOutRow(rowLabel) {
        let rowIndex = this.rows.find(r => r._label == rowLabel);
        // powinniśmy raczej dodać mu wszystkie skipped entries, tak żeby nie można było po nim przeiterować
        // this.rows.splice(rowIndex, 1); // remove element

        rows[rowIndex].setIsCrossedOut(true);
        // aktualizacja kolumn
        for (let i = 0; i < cols.length; i++) {
            cols[i].addToSkipped(rowIndex);
        }

        // return rowIndex
    }

    crossOutCol(colIndex) {

    }

    preparePrintMatrix(matrix) {
        let printMatrix = [];
        // do-while
        let hasNextElement = true;
        let rowIndex = 0;
        let colIndex = 0;
        let newMatrixRow = [];
        do {
            let row = this.rows[rowIndex];
            if (row._crossedOut) {
                printMatrix.push(newMatrixRow);
                newMatrixRow = [];
                rowIndex++;
                if (rowIndex > this.rows.length - 1) {
                    hasNextElement = false;
                    break;
                }
                continue;
            }
            let col = this.cols[colIndex];
            if (col._crossedOut) {
                colIndex++;
                if (colIndex > this.cols.length-1) {
                    colIndex = 0;
                }
                continue;
            }

            newMatrixRow.push(matrix[rowIndex][colIndex]); // tu powinna być zamiana infinity na M 
            colIndex++;
            if (colIndex > this.cols.length - 1) {
                colIndex = 0;
                printMatrix.push(newMatrixRow);
                newMatrixRow = [];

                rowIndex++;
                if (rowIndex > this.rows.length - 1) {
                    break; // doszliśmy do końca macierzy
                }
            }
        } while(hasNextElement);
        return printMatrix;
    }
}

class LineEntry {

    _label = '1';
    _xIndexStart = 0;
    _xIndexEnd = 0;
    _yIndexStart = 0;
    _yIndexEnd = 0;
    _skippedEntries = []; // indeksy komórek z usuniętych wierszy / kolumn (przydatne przy findSecondMin oraz findZeros)
    _crossedOut = false;
    constructor(label, xIndexStart, xIndexEnd, yIndexStart, yIndexEnd) {
        this._label = label;
        this._xIndexStart = xIndexStart;
        this._xIndexEnd = xIndexEnd;
        this._yIndexStart = yIndexStart;
        this._yIndexEnd = yIndexEnd;
    }

    findSecondMin(matrix) {
        let min = infinity;
        let secondMin = infinity;
        for (let i = this._yIndexStart; i < this._yIndexEnd; i++) {
            for (let j = this._xIndexStart; j < this._xIndexEnd; j++) {
                if (min > matrix[i][j]) {
                    if (min < infinity) {
                        secondMin = min;
                    }
                    min = matrix[i][j];
                }
            }       
        }
        return secondMin;
    }

    findZeros(matrix) {
        let min = infinity;
        for (let i = this._yIndexStart; i < this._yIndexEnd; i++) {
            for (let j = this._xIndexStart; j < this._xIndexEnd; j++) {
                if (min > matrix[i][j]) min = matrix[i][j];
            }       
        }

        if (min > 0 && min !== infinity) {
            for (let i = this._yIndexStart; i < this._yIndexEnd; i++) {
                for (let j = this._xIndexStart; j < this._xIndexEnd; j++) {
                    if (matrix[i][j] !== infinity) matrix[i][j] -= min;
                }       
            }
        }
        return min;
    }

    addToSkipped(indexValue) {
        // można dodać sprawdzanie czy element się znajduje w tablicy, ale nie trzeba
        this._skippedEntries.push(indexValue);
    }

    setIsCrossedOut() {
        this._crossedOut = true;
    }
}



function calculate() {

}