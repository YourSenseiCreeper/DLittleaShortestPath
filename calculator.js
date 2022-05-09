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
var calculationMatrix = null;

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
    calculationMatrix = new CalculationMatrix(data);
    generateInputTable();
}

function generateInputTable() {
    let innerHtml = generateHeader() + generateBody(data, true);
    document.getElementById('inp-matrix').innerHTML = innerHtml;
    calculationMatrix = new CalculationMatrix(data);
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

function generateNewTable(generateIds, bottomRow = null, lastCol = null) {
    let printMatrix = calculationMatrix.preparePrintMatrix();
    let cols = printMatrix[0].length;
    let rows = printMatrix.length;

    let tableHtml = "<thead><th></th>";
    for (let i = 0; i < cols; i++) {
        tableHtml += `<th>${printMatrix[0][i]}</th>`;
    }
    tableHtml += "</thead>";

    tableHtml += "<tbody>";
    for (let i = 1; i < rows; i++) {
        tableHtml += `<tr><td><b>${printMatrix[i][0]}</b></td>`;
        for (let j = 1; j < cols; j++) { // skip first collumn
            let idsText = generateIds ? `id="i-${i}${j}"` : '';
            if (i == j || printMatrix[i][j] == infinity) {
                tableHtml += `<td><input type="text" value="M" ${idsText} disabled></td>`;
            } else {
                tableHtml += `<td><input type="text" value="${printMatrix[i][j]}" ${idsText}"></td>`;
            }     
        }
        if (!!lastCol) {
            tableHtml += `<td><input type="text" class="extra-cell" value="${lastCol[i]}" disabled></td>`; 
        }
        tableHtml += "</tr>";
    }
    if (!!bottomRow) {
        tableHtml += `<tr><td></td>`
        for (let i = 0; i < size; i++) {
            tableHtml += `<td><input type="text" class="extra-cell" value="${bottomRow[i]}" disabled></td>`;    
        }
        tableHtml += "</tr>";
    }
    tableHtml += "</tbody>";
    return tableHtml;
}


// todo
function remapDataToOutput() {
    let test = calculationMatrix.preparePrintMatrix();
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
    // let mappedData = remapDataToOutput();
    let innerHtml = '<table>' + generateNewTable(false, bottomRow, lastCol) + '</table>';
    let element = document.getElementById(elementId);
    element.innerHTML = innerHtml;
}

function checkZerosInRowsAndCols() {
    let [colSubtractions, rowSubtractions] = calculationMatrix.findZerosOrRecalculate();

    // // check zeros in rows
    // let subtractedInRows = [];
    // let subtractedInCols = [];

    // data = remapInputToData();
    // for (let i = 0; i < size; i++) {
    //     let minInRow = infinity;
    //     for (let j = 0; j < size; j++) {
    //         if (minInRow > data[i][j]) {
    //             minInRow = data[i][j]; 
    //         }
    //     }

    //     // nie nieskończoność i większe od 0 - odejmowanie od pozostałych
    //     if (minInRow < infinity && minInRow > 0) {
    //         lb += minInRow;
    //         subtractedInRows.push(minInRow);
    //         for (let j = 0; j < size; j++) {
    //             if (data[i][j] !== infinity) data[i][j] -= minInRow; 
    //         }
    //     } else {
    //         subtractedInRows.push(0);
    //     }
    // }

    // // check zeros in cols
    // for (let i = 0; i < size; i++) {
    //     let minInCol = infinity;
    //     for (let j = 0; j < size; j++) {
    //         if (minInCol > data[j][i]) {
    //             minInCol = data[j][i];
    //         }
    //     }

    //     // nie nieskończoność i większe od 0 - odejmowanie od pozostałych
    //     if (minInCol < infinity && minInCol > 0) {
    //         lb += minInCol;
    //         subtractedInCols.push(minInCol);        
    //         for (let j = 0; j < size; j++) {
    //             if (data[j][i] !== infinity) data[j][i] -= minInCol; 
    //         }
    //     } else {
    //         subtractedInCols.push(0);
    //     }
    // }
    generateTable('response', colSubtractions, rowSubtractions);
    // gdzieś dalej trzeba zrobić wykreślanie
    // steps.push(_clone(data));
}

function findSecondMinsInRowsAndCols() {
    let [colSecondMins, rowSecondMins] = calculationMatrix.findSecondMins();
    // // check zeros in rows
    // let secondMinsInRows = [];
    // let secondMinsInCols = [];

    // // data = remapInputToData(); // remapping is no longer needed
    // for (let i = 0; i < size; i++) {
    //     let minInRow = infinity;
    //     let secondMinInRow = infinity;
    //     for (let j = 0; j < size; j++) {
    //         if (minInRow >= data[i][j]) {
    //             if (minInRow < infinity) {
    //                 secondMinInRow = minInRow;
    //             }
    //             minInRow = data[i][j];
    //         }
    //     }

    //     secondMinsInRows.push(secondMinInRow);
    // }

    // // check zeros in cols
    // for (let i = 0; i < size; i++) {
    //     let minInCol = infinity;
    //     let secondMinInCol = infinity;
    //     for (let j = 0; j < size; j++) {
    //         if (minInCol >= data[j][i]) {
    //             if (minInCol < infinity) {
    //                 secondMinInCol = minInCol;
    //             }
    //             minInCol = data[j][i];
    //         }
    //     }

    //     secondMinsInCols.push(secondMinInCol);
    // }
    generateTable('response', colSecondMins, rowSecondMins);
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
            let newRow = new LineEntry(i, 0, size, i, i+1);
            this._rows.push(newRow);
        }
        // colls
        for (let i = 0; i < size; i++) {
            let newCol = new LineEntry(i, i, i+1, 0, size);
            this._cols.push(newCol);      
        }

        this._matrix = matrix;
    }

    findSecondMins() {
        let rowSecondMins = [];
        let colSecondMins = [];

        for (const row of this._rows) {
            rowSecondMins.push(row.findSecondMin(this._matrix));
        }

        for (const col of this._cols) {
            colSecondMins.push(col.findSecondMin(this._matrix));
        }
        return [colSecondMins, rowSubtractions];
    }

    findZerosOrRecalculate() {
        let rowSubtractions = [];
        let colSubtractions = [];
        for (const row of this._rows) {
            rowSubtractions.push(row.findZerosOrSubtract(this._matrix));
        }

        for (const col of this._cols) {
            colSubtractions.push(col.findZerosOrSubtract(this._matrix));
        }
        return [colSubtractions, rowSubtractions];
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

    preparePrintMatrix() {
        let printMatrix = [];
        // do-while
        let hasNextElement = true;
        let rowIndex = 0;
        let colIndex = 0;
        let newMatrixRow = [];

        // header row
        // blank cell in left corner
        newMatrixRow.push('');
        for (let i = 0; i < size; i++) {
            if (!this._cols._crossedOut) {
                newMatrixRow.push(i);
            }
        }
        printMatrix.push(newMatrixRow);
        newMatrixRow = [];

        do {
            let row = this._rows[rowIndex];
            if (row._crossedOut) {
                printMatrix.push(newMatrixRow); // risky, to będzie powodować problemy
                newMatrixRow = [];
                rowIndex++;
                if (rowIndex > this._rows.length - 1) {
                    hasNextElement = false;
                    break;
                }
                continue;
            }
            let col = this._cols[colIndex];
            if (col._crossedOut) {
                colIndex++;
                if (colIndex > this._cols.length-1) {
                    colIndex = 0;
                }
                continue;
            }

            if (colIndex == 0) {
                newMatrixRow.push(colIndex); // row header
            }

            let cellValue = this._matrix[rowIndex][colIndex] == infinity ? 'M' : String(this._matrix[rowIndex][colIndex]);
            newMatrixRow.push(cellValue);
            colIndex++;
            if (colIndex > this._cols.length - 1) {
                colIndex = 0;
                printMatrix.push(newMatrixRow);
                newMatrixRow = [];

                rowIndex++;
                if (rowIndex > this._rows.length - 1) {
                    hasNextElement = false;
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

    findZerosOrSubtract(matrix) {
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