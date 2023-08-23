const { check, validationResult } = require('express-validator');

const create = [
  check('title').isLength({ min: 1 }).withMessage('Title tidak boleh kosong'),
  check('headline').isLength({ min: 1 }).withMessage('Headline tidak boleh kosong'),
  check('wildcard').isLength({ min: 1 }).withMessage('Wildcard tidak boleh kosong')
                  .custom(async value => {
                    const dashboard = await model.dashboard.findOne({where: {wildcard: value}});
                    if (dashboard) {
                      throw new Error('tidak boleh sama');
                    }
                  }),
  check('logo').optional().isLength({ min: 1 }).withMessage('Logo tidak boleh kosong'),
  check('emblem').optional().isLength({ min: 1 }).withMessage('Emblem tidak boleh kosong'),
  check('tema').optional().isLength({ min: 1 }).withMessage('Tema tidak boleh kosong'),
  check('provinces').isLength({ min: 1 }).withMessage('Province tidak boleh kosong'),
  check('cities').optional().isLength({ min: 1 }).withMessage('Cities tidak boleh kosong'),
  check('districts').optional().isLength({ min: 1 }).withMessage('District tidak boleh kosong'),
  check('subdistricts').optional().isLength({ min: 1 }).withMessage('Subdistrict tidak boleh kosong'),
  check('mastermenu_id').isNumeric().withMessage('Master menu harus numeric').isLength({ min: 1 }).withMessage('Master menu tidak boleh kosong'),
  check('status').isLength({ min: 1 }).withMessage('Status harus dipilih')
                .isIn(['active','inactive'])
                .withMessage("Tidak sesuai pilihan, harap masukan : Active atau Inactive")
];

const update = [
  check('title').isLength({ min: 1 }).withMessage('Title tidak boleh kosong'),
  check('headline').isLength({ min: 1 }).withMessage('Headline tidak boleh kosong'),
  check('wildcard').isLength({ min: 1 }).withMessage('Wildcard tidak boleh kosong')
                  .custom(async value => {
                    const dashboard = await model.dashboard.findOne({where: {wildcard: value}});
                    if (dashboard) {
                      throw new Error('tidak boleh sama');
                    }
                  }),
  check('logo').optional().isLength({ min: 1 }).withMessage('Logo tidak boleh kosong'),
  check('emblem').optional().isLength({ min: 1 }).withMessage('Emblem tidak boleh kosong'),
  check('tema').optional().isLength({ min: 1 }).withMessage('Tema tidak boleh kosong'),
  check('provinces').isLength({ min: 1 }).withMessage('Province tidak boleh kosong'),
  check('cities').optional().isLength({ min: 1 }).withMessage('Cities tidak boleh kosong'),
  check('districts').optional().isLength({ min: 1 }).withMessage('District tidak boleh kosong'),
  check('subdistricts').optional().isLength({ min: 1 }).withMessage('Subdistrict tidak boleh kosong'),
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