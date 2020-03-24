const Observable = require("tns-core-modules/data/observable").Observable;
const Frame = require("tns-core-modules/ui/frame");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const appSettings = require("tns-core-modules/application-settings");
const ToolTip = require("nativescript-tooltip").ToolTip;
var isTutorial = false;
var trials = 1;
var playedRight= false;
var curr_pos = 1;
var colors_all = [
    "#FF0000",
    "#FFFF00",
    "#008000",
    "#0000FF",
    "#FFFFFF",
    "#FFA500"
];
var colors_code = [];
var cheated = false;
const dialogs = require("tns-core-modules/ui/dialogs");
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function reset_lbl(page) {
    //const page = Frame.topmost().currentPage

    for (let i = 1; i <= 12; i++) {
        for (let j = 1; j <= 4; j++) {
            var lbl = getViewById(page, i + "" + j);
            console.log(lbl);
            lbl.backgroundColor = "gray";
        }
    }
}
function find_col(cols, col) {
    for (let i = 0; i < cols.length; i++) {
        if (cols[i] == col + "") {
            return true;
        }
        return false;
    }
}
function get_feedback(page) {
    var feedback = "";
    var corr_in_pos = 0;
    var corr_nin_pos = 0;
    var wrong_col = 0;
    var seen_col = [];
    if( getViewById(page, trials + "" + 1).backgroundColor==colors_code[0] && getViewById(page, trials + "" + 2).backgroundColor==colors_code[1]&&getViewById(page, trials + "" + 3).backgroundColor==colors_code[2]&&getViewById(page, trials + "" + 4).backgroundColor==colors_code[3]){
        //"corr col in corr Pos:" +corr_in_pos + " corr col not in corr pos:" + corr_nin_pos +" wrong color:" + wrong_col
       
        if(!cheated)//CHANGE THIS                                                                                                                                                                                                                                                                                                                                                                                                                                                               ! ! 
          addScoreToScoreBoard()
        ask_for_user_choice(page,"You won! Choose Action.")
        
    }
    for (let i = 1; i <= 4; i++) {
        const lbl = getViewById(page, trials + "" + i);
        if (lbl.backgroundColor == colors_code[i - 1]) {
            //color in corect position
            corr_in_pos++;
        } else if (colors_code.includes(String(lbl.backgroundColor))) {
            //correct color in wrong position
            // if(!seen_col.includes(lbl.backgroundColor))
            corr_nin_pos++;

        } else if(!colors_code.includes(String(lbl.backgroundColor))&&!seen_col.includes(String(lbl.backgroundColor))) {
            //wrong color
            // if(!seen_col.includes(lbl.backgroundColor))
            wrong_col++;
        }
        seen_col.push(lbl.backgroundColor);
    }
    return (
        "corr col in corr Pos:" +
        corr_in_pos +
        " corr col not in corr pos:" +
        corr_nin_pos +
        " wrong color:" +
        wrong_col
    );
}

function restart(page) {
    colors_code=[]
    for (let i = 1; i <= 4; i++) {
        var id = "c" + i;

        let color_index = getRandomInt(6);
        let color = colors_all[color_index];
        colors_code.push(color);
        const lbl = getViewById(page, "c" + i);
        lbl.backgroundColor = color;
    }
    reset_lbl(page);
    const grid = getViewById(page, "game");
    grid.visibility = "visible";
    //console.log('trials',trials)
    let i = trials;

    while (i > 0) {
        console.log("i", i);
        lbl = getViewById(page, "feed" + i);
        lbl.text = "";
        i--;
    }
    trials = 1;
    curr_pos = 1;
}

function addScoreToScoreBoard() {
    //appSettings.clear();
    let num = appSettings.getNumber("score_num", 0);
    console.log("num", num);
    let curr_num = num + 1;
    console.log("Curr_num", curr_num);
    appSettings.setNumber("score_num", curr_num);

    appSettings.setNumber("score" + curr_num, trials);

    console.log("score" + curr_num, appSettings.getNumber("score" + curr_num));
    scores = [];
    // Put all the scores in an array
    for (var i = 1; i <= curr_num; i++) {
        let s = appSettings.getNumber("score" + i);
        console.log("score" + i, s);
        s=parseInt(s)
        scores.push(s);
    }
    //sort the array
    scores.sort((a, b) => a - b);
    //save the scores 5 top smallest to highest
    console.log("scores", scores);
    let j = 1;
    //Stores the highest 5 scores
    for (var i = 1; i <=curr_num && j <= 5; i++) {
        appSettings.setNumber("score" + j, scores[i-1]);
        j++;
    }
    if (curr_num > 5) {
        appSettings.setNumber("score_num", 5);
    }
}

function ask_for_user_choice(page, message="Game Over. Choose action.") {
    dialogs
        .confirm({
            title: "MasterMind Game",
            message: message,
            okButtonText: "Start new game",
            cancelButtonText: "View Scores",
            neutralButtonText: "Quit Game"
        })
        .then(function(result) {
            // result argument is boolean

            console.log("Dialog result: " + result);
            if (result) {
                restart(page);
            } else if (result == undefined) {
                Frame.topmost().navigate({
                    moduleName: "main-page",
                    transition: {
                        name: "slide",
                        duration: 380,
                        curve: "easeIn"
                    }
                });
            } else {
                Frame.topmost().navigate({
                    moduleName: "score/score-page",
                    transition: {
                        name: "slide",
                        duration: 380,
                        curve: "easeIn"
                    }
                });
            }
        });
}
function createViewModel(page) {
    const viewModel = new Observable();
    console.log("page", page);
    viewModel.onStart=(args)=>{
        const page = args.object.page
     const context = page.navigationContext;
     isTutorial = context.isTutorial
     console.log("context", isTutorial);
     if (isTutorial){
            const newGameButton = page.getViewById("startGame");            
                const tip1 = new ToolTip(newGameButton,{text:"Now, tap this button to start", backgroundColor:"pink",textColor:"black", position: "bottom"});
                tip1.show(); 

           
            
     }
    }
    
    viewModel.restart = args => {
        const page = args.object.page;
        restart(page);
        if (isTutorial){
            const sw = getViewById(page, "sw1")
            const tip = new ToolTip(sw,{text:"enable cheat mode", backgroundColor:"pink",textColor:"black", position: "top"});
            tip.show(); 
            setTimeout(()=>{ 
                tip.hide();
                const colGrid = getViewById(page, "colGrid")
                const tip1 = new ToolTip(colGrid,{text:"Guess color", backgroundColor:"pink",textColor:"black", position: "bottom"});
                tip1.show(); 
                setTimeout(()=>{
                     tip1.hide();

                     const feedLabl = getViewById(page, "feed1")
                     const tip2 = new ToolTip(feedLabl,{text:"feedback shows here..", backgroundColor:"pink",textColor:"black", position: "top"});
                     tip2.show(); 
                     setTimeout(()=>{
                         tip2.hide();
                         const tip3 = new ToolTip(colGrid,{text:"Now, practice. Tap blue button!", backgroundColor:"pink",textColor:"black", position: "top"});
                         tip3.show(); 

                     },3000)
                }, 3000);
            }, 3000);
           
     }
    };

    viewModel.onColorTap = args => {
        const btn = args.object;
        console.log("color", btn.backgroundColor);
        const page = Frame.topmost().currentPage;
        if(isTutorial && !playedRight){
            const feedLabl = getViewById(page, "feed1")
            if(btn.backgroundColor !="#0000FF"){                
                // const tip = new ToolTip(feedLabl,{text:"Wrong color! Tap blue", backgroundColor:"pink",textColor:"black", position: "left"});
                // tip.show();
                return
                
            }
            else{
            const tip3 = new ToolTip(feedLabl,{text:"Well done! Continue.", backgroundColor:"pink",textColor:"black", position: "left"});
            tip3.show();
            playedRight=true;
            }
           
        }
        const lbl = getViewById(page, trials + "" + curr_pos);
        lbl.backgroundColor = btn.backgroundColor;
        curr_pos++;
        
        if (curr_pos > 4) {
            var feedback = get_feedback(page);
            //viewModel.set("result",feedback)
            const lbl1 = getViewById(page, "feed" + trials);
            lbl1.text = feedback;
            trials++;
            curr_pos = 1;
        }
        if (trials > 12) {
            trials = 12;
            if (!cheated ) {
                addScoreToScoreBoard();
            }
            ask_for_user_choice(page);
        }
    };
    viewModel.switchLoaded = (args) => {
        let sw = args.object;
        
        sw.on("checkedChange", args2 => {
            //console.log( sw.bindingContext.id );
            const page = Frame.topmost().currentPage;
            const grid = getViewById(page, "code");
            if (sw.checked) {
                //check if switch is checked
                console.log("checked", sw.checked);

                grid.visibility = "visible";
                cheated = true;
            } else {
                grid.visibility = "collapsed";
            }
        });
    };
    viewModel.onHelpButtonTap=()=>{
        dialogs.confirm({
            title: "Game Score App",
            message: "Developed by Baise Mahoro.\n in fulfillment of requirements for Assignment 9 of CMSC 4233 (or 5233) in the Spring 2020 course  ",
            okButtonText: "OK",

        })
        .then(function(result) {
           
            
        });
    }
    return viewModel;
}

exports.createViewModel = createViewModel;
