const { Scenes } = require('telegraf');
const { organizationCommands } = require('../commands');

const changeOrganizationScene = new Scenes.WizardScene(
  'CHANGE_ORGANIZATION_SCENE_ID',
  ...organizationCommands.changeOrganization,
);
const changeServiceScene = new Scenes.WizardScene(
  'CHANGE_SERVICE_SCENE_ID',
  ...organizationCommands.changeService,
);
const infoServiceScene = new Scenes.WizardScene(
  'INFO_SERVICE_SCENE_ID',
  ...organizationCommands.servicesInfo,
);
const deleteServiceScene = new Scenes.WizardScene(
  'DELETE_SERVICE_SCENE_ID',
  ...organizationCommands.deleteService,
);
const creationServiceScene = new Scenes.WizardScene(
  'CREATION_SERVICE_SCENE_ID',
  ...organizationCommands.createService,
);

module.exports = [
  infoServiceScene,
  changeServiceScene,
  changeOrganizationScene,
  creationServiceScene,
  deleteServiceScene,
];
