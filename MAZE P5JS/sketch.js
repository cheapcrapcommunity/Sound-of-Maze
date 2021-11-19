
var cols, rows;
var w = 10;
var grid = [];
var current;
var stack = [];
//check if the sketch is loaded
function detectMax() {
  try {
    window.max.outlet('Hello Max!');

    return true;
  }
  catch(e) {
    console.log('Max, where are you?');
      
  }
  return false;
}
//instance mode
var s = function(p){
    
    var maxIsDetected = detectMax();
    
    p.setup = function(){
        
        p.createCanvas(400, 400);

        window.max.bindInlet('set_frameRate', function (speed) {
            frameRate_speed = speed;
            p.frameRate(frameRate_speed);
        });

        cols = p.floor(p.width/w);
        rows = p.floor(p.height/w);
        
        for(var j = 0; j < rows; j++){
            for(var i = 0; i < cols; i++){
                var cell = new p.Cell(i, j);
                grid.push(cell);
            }
    }
    
        current = grid[0];
        
    }
    if(maxIsDetected){

        //document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        window.max.bindInlet('parse_dict', function (_dict_name) {
        window.max.getDict(_dict_name, function(_dict) {
        window.max.outlet('parse_dict', 'start parsing...');
        for(var _key in _dict) {
            if (_dict.hasOwnProperty(_key)) {
                window.max.outlet('parse_dict', _key + ' ' + _dict[_key]);
            }
        }
        window.max.outlet('parse_dict', '... parsing finished');
        });
      });
    }
    p.draw = function(){
        
        p.background(53);
        
        for(var i = 0; i < grid.length; i++){
            
            grid[i].show();
            
        }
        
        current.visited = true;
        current.highlight();
        
        var next = current.checkNeighbors();
        if (next){
            
            next.visited = true;

            stack.push(current);

            p.removeWalls(current, next);

            current = next;
        }else if (stack.length > 0){
            //if stuck, go to the stack and get the last one
            current = stack.pop();

        }
        
        if(maxIsDetected) {
            window.max.outlet('status', p.frameCount, current.i, current.j);
            
            var dict_obj = {

                frame_count: p.frameCount,
                current_x: current.i,
                current_y: current.j
                
          };
          
          window.max.setDict('status_dict', dict_obj);
          window.max.outlet('status_dict_updated');
            
            
        }
    }
    
    p.index = function(i, j){
        
        if(i < 0 || j < 0 || i > cols -1 || j > rows - 1){
        
            return -1;
        
        }
    
        return i + j * cols;
        
    }
   
    p.Cell = function(i, j){
        
        this.i = i;
        this.j = j;
        this.walls = [true, true, true, true];
        this.visited = false;
        
        this.checkNeighbors = function (){
            
            var neighbors = [];
        
            var top    = grid[p.index(i    , j - 1)];
            var right  = grid[p.index(i + 1, j    )];
            var bottom = grid[p.index(i    , j + 1)];
            var left   = grid[p.index(i - 1, j    )];
            
            if(top && !top.visited){
                neighbors.push(top);
            }
            if(right && !right.visited){
                neighbors.push(right);
            }
            if(bottom && !bottom.visited){
                neighbors.push(bottom);
            }
            if(left && !left.visited){
                neighbors.push(left);
            }
            if(neighbors.length > 0){
                var r = p.floor(p.random(0, neighbors.length));
                return neighbors[r];       
            }else{      
                return undefined;        
            }
        
        }
        
        this.highlight = function (){
            var x = this.i*w;
            var y = this.j*w;
            p.noStroke();
            p.fill(0, 0, 255, 100);
            p.rect(x, y, w, w);
        }
        
        this.show = function(){
            
            var x = this.i*w;
            var y = this.j*w;
            p.stroke(255);

            //p.noStroke();
            //p.noFill();
            //p.rect(x, y, w, w); 
            
            if (this.walls[0]){
            
            p.line(x    , y    , x + w, y    );
            
            }
            if (this.walls[1]){

                p.line(x + w, y    , x + w, y + w);

            }
            if (this.walls[2]){

                p.line(x + w, y + w, x    , y + w);

            }
            if (this.walls[3]){

                p.line(x    , y + w, x    , y    );

            }
            if(this.visited){
                p.noStroke();
                p.fill(255,54,38);
                p.rect(x, y, w, w); 
            }

        }
        
    }
    
    p.removeWalls = function(a, b){
            
        var x = a.i - b.i;
        if(x == 1){
            a.walls[3] = false;
            b.walls[1] = false;
        }else if (x == -1){
            a.walls[1] = false;
            b.walls[3] = false;
        }

        var y = a.j - b.j;
        if(y == 1){
            a.walls[0] = false;
            b.walls[2] = false;
        }else if (y == -1){
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
                             
}
//run the sketch
var myp5 = new p5(s);