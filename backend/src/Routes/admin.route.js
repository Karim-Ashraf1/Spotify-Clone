const {Router} = require('express');
const {getAdmin} = require('../controllers/admin.controller');

const router = Router();

router.get('/', getAdmin);

export default router;