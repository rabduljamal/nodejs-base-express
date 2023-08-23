const { check, validationResult } = require('express-validator');

const create = [
    check('dashboard_id').isNumeric().withMessage('Dashboard harus numeric').isLength({ min: 1 }).withMessage('Dashboard boleh kosong'),
    check('title').isLength({ min: 1 }).withMessage('Tidak boleh kosong'),
    check('sort').optional().isNumeric().withMessage('Urutan harus numeric'),
    check('url').optional().isLength({ min: 1 }).withMessage('Tidak boleh kosong'),
    check('image').optional().isLength({ min: 1 }).withMessage('Tidak boleh kosong'),
    check('status').isLength({ min: 1 }).withMessage('Status harus dipilih')
                .isIn(['active','inactive'])
                .withMessage("Tidak sesuai pilihan, harap masukan : Active atau Inactive")
    
];

const update = [
  check('title').isLength({ min: 1 }).withMessage('Tidak boleh kosong'),
  check('sort').optional().isNumeric().withMessage('Urutan harus numeric'),
  check('url').optional().isLength({ min: 1 }).withMessage('Tidak boleh kosong'),
  check('image').optional().isLength({ min: 1 }).withMessage('Tidak boleh kosong'),
  check('status').isLength({ min: 1 }).withMessage('Status harus dipilih')
              .isIn(['active','inactive'])
              .withMessage("Tidak sesuai pilihan, harap masukan : Active atau Inactive")
  
];

const status = [
  check('status').isLength({ min: 1 }).withMessage('Status harus dipilih')
              .isIn(['active','inactive'])
              .withMessage("Tidak sesuai pilihan, harap masukan : Active atau Inactive")
  
];

module.exports = {
  create,
  update,
  status
}