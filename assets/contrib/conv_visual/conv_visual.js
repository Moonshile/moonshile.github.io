TensorViewSize = 30;
TensorOpSize = 50;
TensorFontSize = 20;
ViewBufferSize = 20;

function convVisualPad(input, size) {
    var res = [];
    var n = Math.sqrt(input.length);
    for(var i = 0; i < n + size*2; ++i) {
        for(var j = 0; j < n + size*2; ++j) {
            if((i - size >= 0 && i - size < n) && (j - size >= 0 && j - size < n)) {
                res.push(input[n*(i - size) + j - size]);
            } else {
                res.push(0);
            }
        }
    }
    return res;
}

function convVisualConv2d(input, filter, stride, dilation) {
    var res = [];
    var inds = [];
    var m = Math.sqrt(input.length);
    var n = Math.sqrt(filter.length);
    var nn = (n - 1)*dilation + 1;
    for(var i = 0; i + nn - 1 < m; i += stride) {
        for(var j = 0; j + nn - 1 < m; j += stride) {
            cur_value = 0;
            cur_inds = [];
            for(var x = 0; x < n; ++x) {
                for(var y = 0; y < n; ++y) {
                    if(x*dilation >= m || y*dilation >= m) {
                        continue;
                    }
                    cur_value += input[(x*dilation + i)*m + y*dilation + j] * filter[x*n + y];
                    cur_inds.push([x*dilation + i, y*dilation + j]);
                }
            }
            res.push(cur_value);
            inds.push(cur_inds);
        }
    }
    return [res, inds];
}

function convVisualCreateTensorView(tensor, tensorName) {
    var table = document.createElement('table');
    table.className = tensorName;

    var cells = [];
    var m = Math.sqrt(tensor.length);
    for(var i = 0; i < m; ++i) {
        tr = document.createElement('tr');
        for(var j = 0; j < m; ++j) {
            td = document.createElement('td');
            td.innerText = tensor[i*m + j];
            cells.push(td);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return [table, cells];
}

function convVisualRender(container, input, filter, output, reverse) {
    var c = document.createElement('div');
    c.style.margin = '0 auto';
    c.style.position = 'relative';

    var [inputView, inputCells] = convVisualCreateTensorView(input, 'input-view');
    var [filterView, filterCells] = convVisualCreateTensorView(filter, 'filter-view');
    var [outputView, outputCells] = convVisualCreateTensorView(output, 'output-view');
    var inputViewSize = Math.sqrt(input.length)*(TensorViewSize + 2) + 2;
    var filterViewSize = Math.sqrt(filter.length)*(TensorViewSize + 2) + 2;
    var outputViewSize = Math.sqrt(output.length)*(TensorViewSize + 2) + 2;

    var totalWidth = inputViewSize + filterViewSize + outputViewSize + TensorOpSize*2 + ViewBufferSize;
    var totalHeight = Math.max(inputViewSize, filterViewSize, outputViewSize);

    inputView.style.marginTop = ((totalHeight - inputViewSize)/2) + 'px';
    filterView.style.marginTop = ((totalHeight - filterViewSize)/2) + 'px';
    outputView.style.marginTop = ((totalHeight - outputViewSize)/2) + 'px';
    c.style.width = totalWidth + 'px';
    c.style.height = totalHeight + 'px';

    var opConv = document.createElement('span');
    opConv.innerHTML = '*';
    opConv.style.width = TensorOpSize + 'px';
    opConv.style.height = TensorOpSize + 'px';
    opConv.style.marginTop = ((totalHeight - TensorFontSize)/2) + 'px';

    var opEq = document.createElement('span');
    opEq.innerHTML = reverse ? '&#x2190;' : '&#x2192;';
    opEq.style.width = TensorOpSize + 'px';
    opEq.style.height = TensorOpSize + 'px';
    opEq.style.marginTop = ((totalHeight - TensorFontSize)/2) + 'px';

    container.style.height = (totalHeight + ViewBufferSize*2) + 'px';

    if(reverse){
        c.appendChild(outputView);
        c.appendChild(opEq);
        c.appendChild(filterView);
        c.appendChild(opConv);
        c.appendChild(inputView);
        container.appendChild(c);
    } else {
        c.appendChild(inputView);
        c.appendChild(opConv);
        c.appendChild(filterView);
        c.appendChild(opEq);
        c.appendChild(outputView);
        container.appendChild(c);
    }
    return [inputCells, filterCells, outputCells];
}

function convVisualRun(container, input, filter, stride, dilation, reverse, interval) {
    var [output, inds] = convVisualConv2d(input, filter, stride, dilation);
    var [inputCells, filterCells, outputCells] = convVisualRender(container, input, filter, output, reverse);
    var step = 0;
    return setInterval(function(){
        var n = Math.sqrt(output.length);
        var inputSize = Math.sqrt(inputCells.length);
        var i = Math.floor(step/n);
        var j = step % n;

        if(step > 0) {
            var prevInds = inds[step - 1];
            for(var i = 0; i < prevInds.length; ++i){
                var [x, y] = prevInds[i];
                inputCells[x*inputSize + y].style.backgroundColor = 'transparent';
            }
        }

        if(step == output.length) {
            for(var i = 0; i < outputCells.length; ++i) {
                outputCells[i].style.color = 'transparent';
                outputCells[i].style.backgroundColor = 'transparent';
            }
        } else {
            var curInds = inds[step];
            for(var i = 0; i < curInds.length; ++i){
                var [x, y] = curInds[i];
                inputCells[x*inputSize + y].style.backgroundColor = 'rgb(244,177,131)';
            }

            outputCells[step].style.color = 'black';
            outputCells[step].style.backgroundColor = 'rgb(244,177,131)';
        }
        
        step += 1;
        if(step > output.length) {
            step = 0;
        }
    }, interval, 0);
}

