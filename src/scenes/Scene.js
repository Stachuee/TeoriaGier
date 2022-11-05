import Phaser from 'phaser'

export default class Scene extends Phaser.Scene
{
	constructor()
	{
		super('Game')
	}

	preload()
    {
        this.load.image('bg', 'images/bg.png')
        this.load.image('empty', 'images/Frame_1.png')

        this.load.image('playerOne', 'images/Frame_2.png')
        this.load.image('playerTwo', 'images/Frame_3.png')
        
        this.load.image('first', 'images/Grocup_3.png')
        this.load.image('second', 'images/Group_3.png')
        this.load.image('third', 'images/Grouph_3.png')

        this.load.image('firstWin', 'images/one.png')
        this.load.image('secondWin', 'images/two.png')
    }



    create()
    {
        this.CreateGame();
    }


    mapX = 9;
    mapY = 9;
    map;


    aiCount = "none"; // one, two, none

    playerOne = true;
    firstWin;

    CreateGame()
    {

        this.add.image(this.scale.baseSize.width/2 - 25, this.scale.baseSize.height/2, 'bg')

        var buttonOne = this.add.image(this.scale.baseSize.width/2 - 200, 35, 'first').setScale(0.5).setInteractive({ useHandCursor: true })

        buttonOne.on('pointerdown', () => {
           this.aiCount = 'none';
           this.firstWin.setAlpha(0);
           this.secondWin.setAlpha(0);
           this.ResetMap();
        })

        var buttonTwo = this.add.image(this.scale.baseSize.width/2, 35, 'second').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonTwo.on('pointerdown', () => {
            this.aiCount = 'one';
            this.firstWin.setAlpha(0);
            this.secondWin.setAlpha(0);
            this.ResetMap();
         })
        var buttonThree = this.add.image(this.scale.baseSize.width/2 + 200, 35, 'third').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonThree.on('pointerdown', () => {
            this.aiCount = 'two';
            this.firstWin.setAlpha(0);
            this.secondWin.setAlpha(0);
            this.ResetMap();
            this.AiMove();
         }) 

        this.map = Array.from(Array(this.mapX), () => new Array(this.mapY));

        for(let i = 0; i < this.mapY; i++)
        {
            for(let j = 0; j < this.mapX; j++)
            {
                var sprite = this.add.image(50 * j + this.scale.baseSize.width/2 - this.mapX/2 * 50 + 25, 50 * i + 125, 'empty')

                sprite.setScale(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    if((this.aiCount === "one" && this.playerOne || this.aiCount === "none") && this.CheckIfCanPlace(this.playerOne, this.map, j, i)) 
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
            //console.log((this.playerOne ? "Player One" : "Player Two") + " lost");
            //console.log(this.moveCount + " " + this.choicesCout + " " + this.gamesCount);
            if(this.playerOne) this.secondWin.setAlpha(1);
            else this.firstWin.setAlpha(1);
            
            return;
            //this.ResetMap();
        }
        if(this.aiCount === "one" && !this.playerOne) this.move = setTimeout(() => this.AiMove("minMax"), 1);
        else if(this.aiCount === "two")
        {
            if(this.playerOne)  this.move = setTimeout(() => this.AiMove("minMax"), 1);
            else  this.move = setTimeout(() => this.AiMove(), 1);
        }
    }

    minMaxDepth = 2;

    AiMove(algorithm = "random")
    { 
        let x;
        let y;
        switch(algorithm)
        {
            case "minMax":
                let copy = this.CopyBoard(this.map);
                let move = this.CheckBoard(copy, this.playerOne, this.minMaxDepth)
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

    CheckBoard(board, vertical, depthRemain, sign = true) // sign - true = +, sign - false = -
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
                    if(depthRemain > 0) 
                    {
                        let result = this.CheckBoard(board, !vertical, depthRemain - 1, !sign)
                        
                        if((sign && result.minMaxValue > minMaxValue) || (!sign && result.minMaxValue < minMaxValue))
                        {
                            nexIndex = 0
                            minMaxValue = result.minMaxValue
                            moves = []
                            moves[nexIndex] = {x, y}
                            nexIndex++
                        }
                        else if(result.minMaxValue === minMaxValue)
                        {
                            moves[nexIndex] = {x, y}
                            nexIndex++
                        }
                    }
                    else
                    {
                        let score = this.EvalGameState(board, vertical)
                        
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
                    }
                    
                    this.UnMarkSpot(board, vertical, x, y)
                }
            }   
        }
        return {cordinates: moves[Math.floor(Math.random()*moves.length)], minMaxValue}
    }

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


    EvalGameState(board, vertical)
    {
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
                if(!map[j][i].isFilled && this.CheckIfCanPlace(vertical, map, j, i)) numberOfAvalibleMoves++;
            }
        }
        return numberOfAvalibleMoves;
    }


    CheckIfCanPlace(vertical, map, x, y)
    {
        if(vertical)
        {
            if(map[x][y].isFilled === false && y < this.mapY - 1 && map[x][y + 1].isFilled === false) return true;
            return false;
        }
        else
        {
            if(map[x][y].isFilled === false && x < this.mapX - 1 && map[x + 1][y].isFilled === false) return true;
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
                this.map[x][y + 1].isFilled= true
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
