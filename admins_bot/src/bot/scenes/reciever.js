const { Scenes } = require('telegraf');
const { recieverCommands } = require('../commands');

const createTrashTypeScene = new Scenes.WizardScene(
  'CREATE_TRASHTYPE_SCENE_ID',
  ...recieverCommands.createTrashType,
);

const infoTrashTypeScene = new Scenes.WizardScene(
  'INFO_TRASHTYPE_SCENE_ID',
  ...recieverCommands.trashTypesInfo,
);

const changeTrashTypeScene = new Scenes.WizardScene(
  'CHANGE_TRASHTYPE_SCENE_ID',
  ...recieverCommands.changeTrashType,
);

const deleteTrashTypeScene = new Scenes.WizardScene(
  'DELETE_TRASHTYPE_SCENE_ID',
  ...recieverCommands.deleteTrashType,
);

const calculateTrash = new Scenes.WizardScene(
  'CALCULATE_TRASH_SCENE_ID',
  ...recieverCommands.calculatePoints,
);

module.exports = [
  createTrashTypeScene,
  infoTrashTypeScene,
  changeTrashTypeScene,
  deleteTrashTypeScene,
  calculateTrash,
];
