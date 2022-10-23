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

    CreateGame()
    {

        var buttonOne = this.add.image(this.scale.baseSize.width/2 - 200, 35, 'first').setScale(0.5).setInteractive({ useHandCursor: true })

        buttonOne.on('pointerdown', () => {
           this.aiCount = 'none';
           this.ResetMap();
        })

        var buttonTwo = this.add.image(this.scale.baseSize.width/2, 35, 'second').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonTwo.on('pointerdown', () => {
            this.aiCount = 'one';
            this.ResetMap();
         })
        var buttonThree = this.add.image(this.scale.baseSize.width/2 + 200, 35, 'third').setScale(0.5).setInteractive({ useHandCursor: true })
        buttonThree.on('pointerdown', () => {
            this.aiCount = 'two';
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
                    if((this.aiCount === "one" && this.playerOne || this.aiCount === "none") && this.CheckIfCanPlace(this.playerOne, j, i)) 
                    {
                        this.PlaceBlock(this.playerOne, j, i);
                        this.map[j][i].tint = 0xFFFFFF;
                        this.PlayerSwap();
                    }
                })
                .on('pointerover', () => {
                    if(this.CheckIfCanPlace(this.playerOne, j, i)) this.map[j][i].tint = 0x696969
                })
                .on('pointerout', () => {
                    this.map[j][i].tint = 0xFFFFFF
                })
                sprite["isFilled"] = false;
                this.map[j][i] = sprite;
            }
        }
    }


    ResetMap()
    {
        this.gamesCount++;
        clearTimeout(this.move);
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
        let choises = this.CheckHowManyMovesPossible(this.playerOne)
        this.choicesCout += choises
        if(choises == 0) {
            console.log((this.playerOne ? "Player One" : "Player Two") + " lost");
            console.log(this.moveCount + " " + this.choicesCout + " " + this.gamesCount);
            this.ResetMap();
        }
        if(this.aiCount === "one" && !this.playerOne) this.move = setTimeout(() => this.AiMove(), 100);
        else if(this.aiCount === "two") this.move = setTimeout(() => this.AiMove(), 100);
    }

    AiMove()
    { 
        let x;
        let y;
        do {
            x = Phaser.Math.Between(0, this.mapX - 1);
            y = Phaser.Math.Between(0, this.mapY - 1); 
        
        } while(!this.CheckIfCanPlace(this.playerOne, x, y))
        this.PlaceBlock(this.playerOne, x, y);
        this.PlayerSwap();
    }

    CheckHowManyMovesPossible(vertical)
    {
        let numberOfAvalibleMoves = 0;
        for(let i = 0; i < this.mapY; i++)
        {
            for(let j = 0; j < this.mapX; j++)
            {
                if(!this.map[j][i].isFilled && this.CheckIfCanPlace(vertical, j, i)) numberOfAvalibleMoves++;
            }
        }
        return numberOfAvalibleMoves;
    }


    CheckIfCanPlace(vertical, x, y)
    {
        if(vertical)
        {
            if(this.map[x][y].isFilled === false && y < this.mapY - 1 && this.map[x][y + 1].isFilled === false) return true;
            return false;
        }
        else
        {
            if(this.map[x][y].isFilled === false && x < this.mapX - 1 && this.map[x + 1][y].isFilled === false) return true;
            return false;
        }
    }

    PlaceBlock(vertical, x, y)
    {
        if(this.CheckIfCanPlace(vertical, x, y))
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
