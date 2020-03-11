const Observable = require("tns-core-modules/data/observable").Observable;
const Frame = require("tns-core-modules/ui/frame");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const appSettings = require("tns-core-modules/application-settings");
const Label = require("tns-core-modules/ui/label").Label;
var trials=1;
var curr_pos = 1;
var colors_all=["#FF0000","#FFFF00","#008000","#0000FF","#FFFFFF","#FFA500"]
var colors_code=[]


function createViewModel(page) {

    const viewModel = new Observable();
    //const page=Frame.topmost().currentPage
    console.log('page',page)
    var score_num= appSettings.getNumber('score_num', 0)
    console.log("score_num", score_num)
    const stack = getViewById(page, "scores")
    //console.log('stack',stack)
    for(var i =1; i<=score_num;i++){
        score=appSettings.getNumber("score"+i,0)
        let lbl = new Label();
        lbl.text=i+". no of guesses:"+score;
        //console.log('stack',stack)
        stack.addChild(lbl)
        //console.log('score'+i,score)

    }
    viewModel.onHomeTap = () => {
        Frame.topmost().navigate({
            moduleName:"main-page",
            transition: {
                name: "slide",
                duration: 380,
                curve: "easeIn"
            },
           
        });
    }
   
    return viewModel;
}

exports.createViewModel = createViewModel;
