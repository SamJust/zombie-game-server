const router = require('express').Router();

const registrationController = require('../controllers/registrationController.js');
const loginController = require('../controllers/loginController.js');
const resourcesController = require('../controllers/resourcesController.js');
const formulasController = require('../controllers/formulasController.js');
const userController = require('../controllers/userController.js');
const skeletonsController = require('../controllers/skeletonsController.js');

// Formulas controller
router.get('/formulas', formulasController.GetFormulas);
router.post('/formulas', formulasController.PostFormulas);
router.put('/formulas', formulasController.PutFormulas);

// Login controller
router.post('/login', loginController.PostLogin);
router.post('/signout', loginController.PostSignout);

// Registration controller
router.post('/registration', registrationController.PostRegistration);

// Resources controller
router.get('/resources', resourcesController.GetResources);
router.post('/resources', resourcesController.PostResources);

// User controller
router.get('/userinfo', userController.GetUserInfo);
router.get('/lastlocation', userController.PostLastLocation);
router.post('/deleteacc', userController.PostDeleteAcc);

// Skeletons controlle
router.post('/skeletons', skeletonsController.PostSkeletons);
router.patch('/skeletons', skeletonsController.PatchSkeletons);

module.exports = router;