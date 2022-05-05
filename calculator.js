var infinity = Number.MAX_SAFE_INTEGER;
var data = [
    [infinity, infinity, 12, 5],
    [infinity, infinity, infinity, 3],
    [12, infinity, infinity, 1],
    [5, 3, 1, infinity],
]; // matrix
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



function calculate() {

}