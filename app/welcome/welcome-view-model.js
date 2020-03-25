const Observable = require("tns-core-modules/data/observable").Observable;
const Frame = require("tns-core-modules/ui/frame");
const getViewById = require("tns-core-modules/ui/core/view").getViewById;
const TNSPlayer = require("nativescript-audio").TNSPlayer;
function createViewModel() {

    const viewModel = new Observable();
    viewModel.tutorial=(args)=>{
       
        Frame.topmost().navigate({
            moduleName:'main/main-page',
            context:{isTutorial:true}
            }
            )
    }
    viewModel.startGame=(args)=>{        
        Frame.topmost().navigate({
            moduleName:'main/main-page',
            context:{isTutorial:false}
            }
            )
    }
    viewModel.viewScores=(args)=>{
        
        Frame.topmost().navigate({
            moduleName:'score/score-page',
            context:{isTutorial:false}

            }
            )
    }
    
    return viewModel;
}

exports.createViewModel = createViewModel;
