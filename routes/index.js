var express = require('express');

var router = express.Router();

var ctrlLocker = require('../controllers/lockers.controller');
var ctrlOrder = require('../controllers/orders.controller');

//  Locker APIs
router.get('/lockers', ctrlLocker.lockerGetAll);
router.get('/lockers/:id', ctrlLocker.lockerGetOne);
router.post('/lockers', ctrlLocker.lockerPOST);
router.put('/lockers/:id', ctrlLocker.lockerPUT);
router.delete('/lockers/:id', ctrlLocker.lockerDEL);

//  Order APIs
router.get('/orders', ctrlOrder.orderGetAll);
router.get('/orders/:id', ctrlOrder.orderGetOne);
router.post('/orders', ctrlOrder.orderPOST);
router.put('/orders/:id', ctrlOrder.orderPUT);
router.delete('/orders/:id', ctrlOrder.orderDEL);

module.exports = router;
