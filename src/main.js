import Phaser from 'phaser'

import Scene from './scenes/Scene'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	backgroundColor: '#ffffff',
	physics: {
		default: 'arcade',
	},
	scene: [Scene]
}

export default new Phaser.Game(config)
