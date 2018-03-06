d3.matrixGrid = function(matrix) {
  
  var rows = matrix.length,
  cols = matrix[0].length,
  margin = margin || {top:10,left:10,bottom:10,right:10},
  width = width || 960 - margin.left - margin.right,
  height = height || 500 - margin.top - margin.bottom,
  resize = false,
  inCanvas = false,
  zoomable = false,
  data = [],
  cells = {};
  
  function resetGrid() {
    data = [];
    
    matrix.forEach(function(row,i){
      row.forEach(function(cell,j) {
        var check = data.filter(function(d) { return d.id == cell});
        if(check.length == 0) {
          data.push({id:cell, row:i+1, col:j+1, height:1, width:1});
        } else {
          data.forEach(function(d){
            if(d.id == cell) {
              if(d.width + d.col - 1 < j+1) {
                d.width++;
              }
              if(d.height + d.row - 1 < i+1) { 
                d.height++;
              }
            }
          })
        }
      })
    });
    
    
    data.forEach(function(d) {
      d.width = width/cols*d.width;
      d.height = height/rows*d.height;
      d.translate = [((d.col - 1)*width/cols),((d.row-1)*height/rows)];
    });
    
    
  }
  
  
  
  
  
  var matrixGrid = function(context) {
    var svg;
    
    context.selectAll("*").remove();
    
    if(inCanvas) {
      
      var canvas = context.append("canvas")
      .attr("width", width/height*100)
      .attr("height", 100)
      .style("visibility","hidden")
      .style("display","block")
      .style("height","100%")
      .style("width", "100%")
    }
    
    if(resize) {
      svg = context.append("svg")
      .attr("viewBox","0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("preserveAspectRatio","xMinYMin slice")
      .style("-webkit-user-select","none")
      .style("cursor","default")
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top +")");
    } else {
      svg = context.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("-webkit-user-select","none")
      .style("cursor","default")
      .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top +")");
    }
    
    if(inCanvas) {
      d3.select(svg.node().parentNode)
      .style("position","absolute")
      .style("top",0)
      .style("left",0)
    }
    
    var allCells = svg.selectAll(".cell")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d) {return 'translate('+ d.translate[0] + "," + d.translate[1] + ")"})
    .each(function(d) { cells["cell" + d.id] = d3.select(this)});
    
    if(zoomable) {
      allCells.on("dblclick", zoom);
    }
    
    return matrixGrid;
    
    var zoomed = false;
    
    function zoom(d) {
      if(zoomed) {
        
        if(inCanvas) {
          
          canvas.transition()
          .duration(1000)
          .attr("width", width/height*100)
          .attr("height", 100)
        }
        
        d3.select(this.parentNode.parentNode)
        .transition()
        .duration(1000)
        .attr("viewBox","0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        
        allCells.transition()
        .duration(1000)
        .style("opacity",1)
        
      } else { 
        
        var bb = this.getBBox()
        var vb = [0,0,0,0];
        
        vb[0] =  d.translate[0] - 10;
        vb[1] =  d.translate[1] - 10;
        vb[2] = d.width + 30;
        vb[3] = d.height + 30;
        
        d3.select(this.parentNode.parentNode)
        .transition()
        .duration(1000)
        .attr("viewBox", vb[0] + " " + vb[1] + " " + vb[2] + " " + vb[3])
        
        allCells.transition()
        .duration(1000)
        .style("opacity",function(e) { return e.id == d.id ? 1 : .1;})
        
        if(inCanvas) {
          
          canvas.transition()
          .duration(1000)
          .attr("width", (vb[2])/(vb[3])*100) 
          .attr("height", 100)
        }
        
      }
      
      zoomed = !zoomed;
      
    }
    
  }
  
  matrixGrid.info = function(cell) {
    return data.filter(function(d) { return d.id == cell;})[0];
  }
  
  matrixGrid.getCell = function(id) {
    return cells["cell" + id];
  }
  
  matrixGrid.width = function(_width) {
    width = _width;
    resetGrid();
    return matrixGrid;
  }
  
  matrixGrid.height = function(_height) {
    height = _height;
    resetGrid();
    return matrixGrid;
  }
  
  matrixGrid.margin = function(_margin) {
    margin = _margin;
    resetGrid();
    return matrixGrid;
  }
  
  matrixGrid.resize = function() {
    resize = true;
    return matrixGrid;
  }
  
  matrixGrid.inCanvas = function() {
    inCanvas = true;
    return matrixGrid;
  }
  
  matrixGrid.zoomable = function() {
    zoomable = true;
    return matrixGrid;
  }
  
  resetGrid();
  return matrixGrid;
}