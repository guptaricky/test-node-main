const express = require('express')
const router = express.Router();
const fileOperationController = require('../Controllers/fileOperation.controller');

// router.get('/fetch-and-convert', fileOperationController.convertJsonToExcel_old);

router.post('/sendJson', fileOperationController.sendJson);
router.get('/flatingBOM', fileOperationController.flatingBOM);
router.get('/convertJsonToExcel', fileOperationController.convertJsonToExcel);
router.get('/sendDataToSFTP', fileOperationController.sendDataToSFTP);
// router.get('/sendSFTPRes', fileOperationController.sendSFTPRes);

module.exports = router;