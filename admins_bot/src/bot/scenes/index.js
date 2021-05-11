const { Scenes } = require('telegraf');
const { mainCommands } = require('../commands');
const orgScenes = require('./organization');
const recScenes = require('./reciever');

const creationScene = new Scenes.WizardScene('CREATION_SCENE_ID', ...mainCommands);

module.exports = { orgScenes, recScenes, creationScene };
