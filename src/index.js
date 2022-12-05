import { apply } from 'file-loader';
import Phaser from 'phaser';
//import logoImg from './assets/logo.png';

class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload()
    {
        this.load.image('bg', './public/images/bg1.png')
        this.load.image('empty', './public/images/Frame_1.png')

        this.load.image('playerOne', './public/images/Frame_2.png')
        this.load.image('playerTwo', './public/images/Frame_3.png')
        
        this.load.image('first', './public/images/Grocup_3.png')
        this.load.image('second', './public/images/Group_3.png')
        this.load.image('third', './public/images/Grouph_3.png')

        this.load.image('minmax', './public/images/MinMax.png')
        this.load.image('negamax', './public/images/NegaMax.png')
        this.load.image('alfabeta', './public/images/AlfaBeta.png')
        this.load.image('random', './public/images/Random.png')
        
        this.load.image('gl0', './public/images/Gl0.png')
        this.load.image('gl1', './public/images/Gl1.png')
        this.load.image('gl2', './public/images/Gl2.png')

        this.load.image('start', './public/images/Start.png')
        this.load.image('reset', './public/images/Reset.png')

        this.load.image('firstWin', './public/images/one.png')
        this.load.image('secondWin', './public/images/two.png')
    }

    create()
    {
        this.SetBg();
        this.SetUI();
        this.CreateGame();
    }


    mapX = 9;
    mapY = 9;
    map;


    aiCount = "none"; // one, two, none

    playerOne = true;
    firstWin;

    SetBg()
    {
        this.add.image(this.scale.baseSize.width/2 - 25, this.scale.baseSize.height/2, 'bg')
    }

    chosenAlgorithm = [0, 0]
    chosenDepths = [0, 0]
    algorithms = ["minmax", "negamax", "alfabeta", "random"]
    depths = ["gl0", "gl1", "gl2"]
    gameStarted = false
    
    SetUI()
    {

        let buttonAlgorithmOne = this.add.image(this.scale.baseSize.width/2- 200, 75, 'minmax').setScale(0.5).setInteractive({ useHandCursor: true }).setVisible(false)       
        buttonAlgorithmOne.on('pointerdown', () => {
            if(this.gameStarted) return
            if(this.chosenAlgorithm[0] < this.algorithms.length - 1) this.chosenAlgorithm[0]++
            else this.chosenAlgorithm[0] = 0
            buttonAlgorithmOne.setTexture(this.algorithms[this.chosenAlgorithm[0]])
        })
        let buttonDepthOne = this.add.image(this.scale.baseSize.width/2- 200, 105, 'gl0').setScale(0.5).setInteractive({ useHandCursor: true }).setVisible(false)
        buttonDepthOne.on('pointerdown', () => {
            if(this.gameStarted) return
            if(this.chosenDepths[0] < this.depths.length - 1) this.chosenDepths[0]++
            else this.chosenDepths[0] = 0
            buttonDepthOne.setTexture(this.depths[this.chosenDepths[0]])
        })


        let buttonAlgorithmTwo = this.add.image(this.scale.baseSize.width/2 + 200, 75, 'minmax').setScale(0.5).setInteractive({ useHandCursor: true }).setVisible(false)
        buttonAlgorithmTwo.on('pointerdown', () => {
            if(this.gameStarted) return
            if(this.chosenAlgorithm[1] < this.algorithms.length - 1) this.chosenAlgorithm[1]++
            else this.chosenAlgorithm[1] = 0
            buttonAlgorithmTwo.setTexture(this.algorithms[this.chosenAlgorithm[1]])
        })
        
        let buttonDepthTwo = this.add.image(this.scale.baseSize.width/2 + 200, 105, 'gl0').setScale(0.5).setInteractive({ useHandCursor: true }).setVisible(false)

        buttonDepthTwo.on('pointerdown', () => {
            if(this.gameStarted) return
            if(this.chosenDepths[1] < this.depths.length - 1) this.chosenDepths[1]++
            else this.chosenDepths[1] = 0
            buttonDepthTwo.setTexture(this.depths[this.chosenDepths[1]])
        })


        let buttonStart = this.add.image(this.scale.baseSize.width/2, 105, 'start').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonStart.on('pointerdown', () => {
            this.firstWin.setAlpha(0);
            this.secondWin.setAlpha(0);
            this.ResetMap();
            this.gameStarted = true;
            buttonReset.setVisible(true)
            buttonStart.setVisible(false)
            if(this.aiCount === "two") this.AiMove();
         })

         let buttonReset = this.add.image(this.scale.baseSize.width/2, 105, 'reset').setScale(0.5).setInteractive({ useHandCursor: true }).setVisible(false)
         buttonReset.on('pointerdown', () => {
            this.firstWin.setAlpha(0);
            this.secondWin.setAlpha(0);
            this.ResetMap();
            this.gameStarted = false;
            buttonStart.setVisible(true)
            buttonReset.setVisible(false)
          })



        let buttonOne = this.add.image(this.scale.baseSize.width/2 - 200, 35, 'first').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonOne.on('pointerdown', () => {
           this.aiCount = 'none';
           buttonAlgorithmOne.setVisible(false)
           buttonDepthOne.setVisible(false)
           buttonAlgorithmTwo.setVisible(false)
           buttonDepthTwo.setVisible(false)
           buttonStart.setVisible(true)
           buttonReset.setVisible(false)
           buttonStart.setTexture("start");
           this.firstWin.setAlpha(0);
           this.secondWin.setAlpha(0);
           this.ResetMap();
           this.gameStarted = false
        })

        let buttonTwo = this.add.image(this.scale.baseSize.width/2, 35, 'second').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonTwo.on('pointerdown', () => {
            this.aiCount = 'one';
            buttonAlgorithmOne.setVisible(false)
            buttonDepthOne.setVisible(false)
            buttonAlgorithmTwo.setVisible(true)
            buttonDepthTwo.setVisible(true)
            buttonStart.setVisible(true)
            buttonReset.setVisible(false)
            buttonStart.setTexture("start");
            this.firstWin.setAlpha(0);
            this.secondWin.setAlpha(0);
            this.ResetMap();
            this.gameStarted = false
         })
        let buttonThree = this.add.image(this.scale.baseSize.width/2 + 200, 35, 'third').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonThree.on('pointerdown', () => {
            this.aiCount = 'two';
            buttonAlgorithmOne.setVisible(true)
            buttonDepthOne.setVisible(true)
            buttonAlgorithmTwo.setVisible(true)
            buttonDepthTwo.setVisible(true)
            buttonStart.setVisible(true)
            buttonReset.setVisible(false)
            buttonStart.setTexture("start");
            this.firstWin.setAlpha(0);
            this.secondWin.setAlpha(0);
            this.ResetMap();
            this.gameStarted = false
         }) 
    }

    CreateGame()
    {

        this.map = Array.from(Array(this.mapX), () => new Array(this.mapY));

        for(let i = 0; i < this.mapY; i++)
        {
            for(let j = 0; j < this.mapX; j++)
            {
                var sprite = this.add.image(50 * j + this.scale.baseSize.width/2 - this.mapX/2 * 50 + 25, 50 * i + 150, 'empty')

                sprite.setScale(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    if((this.gameStarted && (this.aiCount === "one" && this.playerOne || this.aiCount === "none")) && this.CheckIfCanPlace(this.playerOne, this.map, j, i)) 
                    {
                        this.PlaceBlock(this.playerOne, j, i);
                        this.map[j][i].tint = 0xFFFFFF;
                        this.PlayerSwap();
                    }
                })
                .on('pointerover', () => {
                    if(this.CheckIfCanPlace(this.playerOne, this.map, j, i)) this.map[j][i].tint = 0x696969
                })
                .on('pointerout', () => {
                    this.map[j][i].tint = 0xFFFFFF
                })
                sprite["isFilled"] = false;
                this.map[j][i] = sprite;
            }
        }

        this.firstWin = this.add.image(this.scale.baseSize.width/2, this.scale.baseSize.height/2, 'firstWin');
        this.firstWin.setAlpha(0);
        this.secondWin = this.add.image(this.scale.baseSize.width/2, this.scale.baseSize.height/2, 'secondWin');
        this.secondWin.setAlpha(0);

    }


    ResetMap()
    {
        this.firstWin.setAlpha(0);
        this.secondWin.setAlpha(0);
        this.gamesCount++;
        clearTimeout(this.move);
        this.playerOne = true;
        for(let i = 0; i < this.mapY; i++)
        {
            for(let j = 0; j < this.mapX; j++)
            {
                this.map[j][i].isFilled = false;
                this.map[j][i].setTexture('empty');
            }
        }
    }


    move;

    moveCount = 0;
    choicesCout = 0;
    gamesCount = 1;

    PlayerSwap()
    {
        this.playerOne = !this.playerOne; // change player
        this.moveCount++;
        let choises = this.CheckHowManyMovesPossible(this.playerOne, this.map)
        this.choicesCout += choises
        if(choises == 0) {
            if(this.playerOne) this.secondWin.setAlpha(1);
            else this.firstWin.setAlpha(1);
            this.gameStarted = false
            return;
        }
        if(this.aiCount === "one" && !this.playerOne) this.move = setTimeout(() => this.AiMove(this.algorithms[this.chosenAlgorithm[1]], this.chosenDepths[1]), 1);
        else if(this.aiCount === "two")
        {
            if(this.playerOne)  this.move = setTimeout(() => this.AiMove(this.algorithms[this.chosenAlgorithm[0]], this.chosenDepths[0]), 1);
            else  this.move = setTimeout(() => this.AiMove(this.algorithms[this.chosenAlgorithm[1]], this.chosenDepths[1]), 1);
        }
    }

    minMaxDepth = 2;

    AiMove(algorithm = "random", depth = 0)
    { 
        let x;
        let y;
        let copy;
        let move;
        switch(algorithm)
        {
            case "minmax":
                copy = this.CopyBoard(this.map);
                move = this.MinMax(copy, this.playerOne, depth)
                x = move.cordinates.x
                y = move.cordinates.y
                break;
            case "negamax":
                copy = this.CopyBoard(this.map);
                move = this.NegaMax(copy, this.playerOne, depth)
                x = move.cordinates.x
                y = move.cordinates.y       
            break;
            case "alfabeta":
                copy = this.CopyBoard(this.map);
                move = this.AlfaBetaStart(copy, this.playerOne, depth + 1)
                console.log(move)
                x = move.cordinates.x
                y = move.cordinates.y       
            break;
            case "random":
                do {
                    x = Phaser.Math.Between(0, this.mapX - 1);
                    y = Phaser.Math.Between(0, this.mapY - 1); 
                } while(!this.CheckIfCanPlace(this.playerOne, this.map, x, y))
                break;
        }
        console.log(algorithm + ": " + this.evalCount)
        this.evalCount = 0 
        this.PlaceBlock(this.playerOne, x, y);
        this.PlayerSwap();
    }   

    CopyBoard(board)
    {
        let mapCopy = Array.from(Array(this.mapX), () => new Array(this.mapY));
        for(let x = 0; x < this.mapX; x++)
        {
            for(let y = 0; y < this.mapY; y++)
            {
                mapCopy[x][y] = [];
                mapCopy[x][y]["isFilled"] = board[x][y].isFilled;
            }   
        }
        return mapCopy;
    }

    MinMax(board, vertical, depthRemain, sign = true) // sign - true = +, sign - false = -
    {
        let moves = []
        let minMaxValue = sign ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
        let nexIndex = 0
        

        for(let x = 0; x < this.mapX; x++)
        {
            for(let y = 0; y < this.mapY; y++)
            {
                if(this.CheckIfCanPlace(vertical, board, x, y))
                {
                    this.MarkSpot(board, vertical, x, y)
                    let score
                    if(depthRemain > 0)
                    {
                        score = this.MinMax(board, !vertical, depthRemain - 1, !sign).minMaxValue
                    }
                    else
                    {
                        score = this.EvalGameState(board, vertical) * (sign ? 1 : -1 )
                    }

                    if((sign && score > minMaxValue) || (!sign && score < minMaxValue))
                    {
                        nexIndex = 0
                        minMaxValue = score
                        moves = []
                        moves[nexIndex] = {x, y}
                        nexIndex++
                    }
                    else if(score === minMaxValue)
                    {
                        moves[nexIndex] = {x, y}
                        nexIndex++
                    }
                    
                    this.UnMarkSpot(board, vertical, x, y)
                }
            }   
        }
        return {cordinates: moves[Math.floor(Math.random()*moves.length)], minMaxValue}
    }


    NegaMax(board, vertical, depthRemain, sign = true) // sign - true = +, sign - false = -
    {
        let moves = []
        let maxValue = Number.MIN_SAFE_INTEGER
        let nexIndex = 0
        
        for(let x = 0; x < this.mapX; x++)
        {
            for(let y = 0; y < this.mapY; y++)
            {
                if(this.CheckIfCanPlace(vertical, board, x, y))
                {
                    this.MarkSpot(board, vertical, x, y)
                    let score
                    if(depthRemain > 0)
                    {
                        score = this.NegaMax(board, !vertical, depthRemain - 1, !sign).maxValue
                    }
                    else
                    {
                        score = this.EvalGameState(board, vertical) 
                    }

                    if(score > maxValue)
                    {
                        nexIndex = 0
                        maxValue = score
                        moves = []
                        moves[nexIndex] = {x, y}
                        nexIndex++
                    }
                    else if(score === maxValue)
                    {
                        moves[nexIndex] = {x, y}
                        nexIndex++
                    }
                    
                    this.UnMarkSpot(board, vertical, x, y)
                }
            }   
        }
        return {cordinates: moves[Math.floor(Math.random()*moves.length)], maxValue : -maxValue}
    }

    AlfaBetaStart(board, vertical, depthRemain, sign = true, alpha = Number.MIN_SAFE_INTEGER, beta = Number.MAX_SAFE_INTEGER)
    {
        let list = []
        for(let x = 0; x < this.mapX; x++)
        {
            for(let y = 0; y < this.mapY; y++)
            {
                if(this.CheckIfCanPlace(vertical, board, x, y))
                {
                    this.MarkSpot(board, vertical, x, y)
                    let value = this.AlfaBeta(board, !vertical, depthRemain - 1, !sign, alpha, beta)
                    this.UnMarkSpot(board, vertical, x, y)
                    alpha = alpha > value ? alpha : value
                    list.push({value, cordinates: {x,y}})
                }
            }
        }
        list.sort((a,b) => b.value - a.value)
        return list[0]; 
    }

    AlfaBeta(board, vertical, depthRemain, sign = true, alpha, beta) // sign - true = +, sign - false = -
    {
        if(depthRemain > 0) {
            if(sign)
            {
                for(let x = 0; x < this.mapX; x++)
                {
                    for(let y = 0; y < this.mapY; y++)
                    {
                        if(this.CheckIfCanPlace(vertical, board, x, y))
                        {
                            this.MarkSpot(board, vertical, x, y)
                            let value = this.AlfaBeta(board, !vertical, depthRemain - 1, !sign, alpha, beta)
                            this.UnMarkSpot(board, vertical, x, y)
                            alpha = alpha > value ? alpha : value
                            if (alpha >= beta) return beta
                        }
                    }   
                }
                return alpha
            }
            else 
            {
                for(let x = 0; x < this.mapX; x++)
                {
                    for(let y = 0; y < this.mapY; y++)
                    {
                        if(this.CheckIfCanPlace(vertical, board, x, y))
                        {
                            this.MarkSpot(board, vertical, x, y)
                            let value = this.AlfaBeta(board, !vertical, depthRemain - 1, !sign, alpha, beta)
                            this.UnMarkSpot(board, vertical, x, y)
                            beta = beta < value ? beta : value
                            if (alpha >= beta) return alpha
                        }
                    }   
                }
                return beta
            }
        } 
        else {
            return this.EvalGameState(board, vertical) * (sign ? 1 : -1 )
        }
    }

/*
    AlfaBeta(board, vertical, depthRemain, sign = true, alpha = {value : Number.MIN_SAFE_INTEGER, cordinates :{x:0,y:0}}, beta = {value :Number.MAX_SAFE_INTEGER, cordinates :{x:0,y:0}}) // sign - true = +, sign - false = -
    {
        if(depthRemain > 0) {
            if(sign)
            {
                for(let x = 0; x < this.mapX; x++)
                {
                    for(let y = 0; y < this.mapY; y++)
                    {
                        if(this.CheckIfCanPlace(vertical, board, x, y))
                        {
                            this.MarkSpot(board, vertical, x, y)
                            let value = this.AlfaBeta(board, !vertical, depthRemain - 1, !sign, alpha, beta)
                            this.UnMarkSpot(board, vertical, x, y)
                            alpha = alpha.value > value.value ? alpha : {value : value.value, cordinates :{x,y}}
                            if (alpha.value >= beta.value) return beta
                        }
                    }   
                }
            }
            else 
            {   
                for(let x = 0; x < this.mapX; x++)
                {
                    for(let y = 0; y < this.mapY; y++)
                    {
                        if(this.CheckIfCanPlace(vertical, board, x, y))
                        {
                            this.MarkSpot(board, vertical, x, y)
                            let value = this.AlfaBeta(board, !vertical, depthRemain - 1, !sign, alpha, beta)
                            this.UnMarkSpot(board, vertical, x, y)
                            beta = beta.value < value.value ? beta : {value : value.value, cordinates :{x,y}}
                            if (alpha.value >= beta.value) return alpha
                        }
                    }   
                }
                return beta
            }
        } 
        else {
            return {value : this.EvalGameState(board, vertical) * (sign ? 1 : -1 ), cordinates :{x:0,y:0}}
            //return this.EvalGameState(board, vertical) * (sign ? 1 : -1 )
        }
    }*/

    MarkSpot(board, vertical, x, y)
    {
        board[x][y].isFilled = true
        if(vertical)
        {
            board[x][y + 1].isFilled= true
        }
        else
        {
            board[x + 1][y].isFilled = true
        }
    }

    UnMarkSpot(board, vertical, x, y)
    {
        board[x][y].isFilled = false
        if(vertical)
        {
            board[x][y + 1].isFilled= false
        }
        else
        {
            board[x + 1][y].isFilled = false
        }
    }

    evalCount = 0;
    EvalGameState(board, vertical)
    {
        this.evalCount++;
        
        let oponentMoves = this.CheckHowManyMovesPossible(!vertical, board)
        if(oponentMoves === 0) return Number.MAX_SAFE_INTEGER
        else return this.CheckHowManyMovesPossible(vertical, board) - oponentMoves;
    }

    CheckHowManyMovesPossible(vertical, map)
    {
        let numberOfAvalibleMoves = 0;
        for(let i = 0; i < this.mapY; i++)
        {
            for(let j = 0; j < this.mapX; j++)
            {
                if(this.CheckIfCanPlace(vertical, map, j, i)) numberOfAvalibleMoves++;
            }
        }
        return numberOfAvalibleMoves;
    }


    CheckIfCanPlace(vertical, map, x, y)
    {
        if(vertical)
        {
            if(!map[x][y].isFilled&& y < this.mapY - 1 && !map[x][y + 1].isFilled) return true;
            return false;
        }
        else
        {
            if(!map[x][y].isFilled&& x < this.mapX - 1 && !map[x + 1][y].isFilled) return true;
            return false;
        }
    }

    PlaceBlock(vertical, x, y)
    {
        if(this.CheckIfCanPlace(vertical, this.map, x, y))
        {
            this.map[x][y].isFilled = true
            this.map[x][y].setTexture(vertical ? 'playerOne' : 'playerTwo')
            if(vertical)
            {
                this.map[x][y + 1].isFilled = true
                this.map[x][y + 1].setTexture(vertical ? 'playerOne' : 'playerTwo')
            }
            else
            {
                this.map[x + 1][y].isFilled = true
                this.map[x + 1][y].setTexture(vertical ? 'playerOne' : 'playerTwo')
            }
        }
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: MyGame
};

const game = new Phaser.Game(config);
