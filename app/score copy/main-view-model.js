const Observable = require("tns-core-modules/data/observable").Observable;
const Frame = require("tns-core-modules/ui/frame");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
var trials=1;
var curr_pos = 1;
var colors_all=["#FF0000","#FFFF00","#008000","#0000FF","#FFFFFF","#FFA500"]
var colors_code=[]
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function reset_lbl(page){
    //const page = Frame.topmost().currentPage
    
    for(let i=1; i<=12; i++){
        for(let j=1; j<=4;j++){
            var lbl = getViewById(page,i+""+j) 
            console.log(lbl)
            lbl.backgroundColor="gray"
        }
    }
}
function find_col(cols, col){
    for(let i =0; i<cols.length; i++){
        if(cols[i]==col+""){
            return true;

        }
        return false
    }
}
function get_feedback(page){
    var feedback=""
    var corr_in_pos =0
    var corr_nin_pos =0
    var wrong_col=0
    var seen_col=[]
    for(let i=1; i<=4; i++){
        const lbl = getViewById(page,trials+""+i);
        if(lbl.backgroundColor==colors_code[i-1]){
            //color in corect position
                corr_in_pos++;
        }
        else if(find_col(colors_code, lbl.backgroundColor)){
            //correct color in wrong position
            // if(!seen_col.includes(lbl.backgroundColor))
                corr_nin_pos++;

        }
        else{
            //wrong color
            // if(!seen_col.includes(lbl.backgroundColor))
                wrong_col++;

        }
        seen_col.push(lbl.backgroundColor)

    }
    return "corr col in corr Pos:"+corr_in_pos+" corr col not in corr pos:"+corr_nin_pos+" wrong color:"+wrong_col;
}
function createViewModel() {

    const viewModel = new Observable();
    viewModel.onStart=(args)=>{
        const page = args.object.page
        for(let i =1; i<=4; i++){
            var id="c"+i
            
            
            let color_index =getRandomInt(6)
            let color = colors_all[color_index]
            colors_code.push(color)
            const lbl = getViewById(page,"c"+i)
            lbl.backgroundColor = color
        }
        reset_lbl(page);
        const grid = getViewById(page, "game")
        grid.visibility="visible"
        trials=1;
        curr_pos=1
    }
    viewModel.restart=(args)=>{
        const page = args.object.page
        for(let i =1; i<=4; i++){
            var id="c"+i
            
            
            let color_index =getRandomInt(6)
            let color = colors_all[color_index]
            colors_code.push(color)
            const lbl = getViewById(page,"c"+i)
            lbl.backgroundColor = color
        }
        reset_lbl(page);
        const grid = getViewById(page, "game")
        grid.visibility="visible";
        let i=trials;
        while(i>0){
            lbl =  getViewById(page, "feed"+i)
            lbl.text = ""
            i--;
        }
        trials=1;
        curr_pos=1;

    }
   
    viewModel.onColorTap=(args)=>{
        const btn = args.object
        console.log("color", btn.backgroundColor)
        const page = Frame.topmost().currentPage
        const lbl = getViewById(page, trials+""+curr_pos)
        lbl.backgroundColor=btn.backgroundColor;
        curr_pos++;
        if(curr_pos>4){
            var feedback = get_feedback(page)
            //viewModel.set("result",feedback)
            const lbl1 = getViewById(page, "feed"+trials)
            lbl1.text = feedback
            trials++;
            curr_pos=1
        }
        if(trials>12){
            
        }
        

    }
    viewModel.switchLoaded=(args)=>{
        let sw = args.object;
    
        
    sw.on("checkedChange", args2 => {
        //console.log( sw.bindingContext.id );
        const page = Frame.topmost().currentPage
        const grid = getViewById(page, "code")
        if (sw.checked) {//check if switch is checked
            console.log("checked", sw.checked)
           
            grid.visibility="visible"
        }
        else{
            grid.visibility="collapsed"
        }
    });
    }
    return viewModel;
}

exports.createViewModel = createViewModel;
