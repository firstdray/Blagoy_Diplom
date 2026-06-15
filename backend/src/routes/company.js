const router = require("express").Router();
const company = require('../service/company');
const adminMiddleware = require("../middleware/checkAdminRights");

router.get('/company', async (req, res) => {
    try {
        const companyInfo = await company.GetInfoCompany();
        res.status(200).json({
            success: true,
            data: companyInfo,
        });
    } catch (error) {
        console.log('Get info company error: ', error);
        res.status(500).json({error: 'INTERNAL_SERVER_ERROR'});
    }
})

router.post('/company', async (req, res) => {
    try {
        adminMiddleware.checkAdminRights(req);
        console.log(req.body)

        const newCompany = await company.AddedCompany(req.body)

        res.status(201).json({
            success: true,
            data: newCompany,
        })
    } catch (error) {
        console.log('Added company error: ', error);

        if (error.message === 'invalid data') {
            return res.status(400).json({error: 'INVALID_DATA', message: error.message});
        }

        res.status(500).json({error: 'INTERNAL_SERVER_ERROR'});
    }
})

router.put('/company/:id', async (req, res) => {
    try {
        adminMiddleware.checkAdminRights(req);

        const updateData = {
            id: req.params.id,
            ...req.body
        };

        if (isNaN(updateData.id) || updateData.id <= 0) {
            return res.status(400).json({
                error: 'INVALID_ID',
                message: 'ID must be a positive number'
            });
        }

        const updatedCompany = await company.UpdateCompany(updateData);

        res.status(200).json({
            success: true,
            data: updatedCompany,
        });
    } catch (error) {
        console.log('Update company error: ', error);

        if (error.message === 'invalid data') {
            return res.status(400).json({error: 'INVALID_DATA', message: error.message});
        }

        if (error.message.includes('not found')) {
            return res.status(404).json({error: 'COMPANY_NOT_FOUND', message: error.message});
        }

        res.status(500).json({error: 'INTERNAL_SERVER_ERROR'});
    }
});

router.delete('/company/:id', async (req, res) => {
    try {
        adminMiddleware.checkAdminRights(req);

        const companyId = parseInt(req.params.id, 10);

        if (isNaN(companyId) || companyId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_ID',
                message: 'ID must be a positive number'
            });
        }

        const deleted = await company.DeleteCompany(companyId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'COMPANY_NOT_FOUND',
                message: `Company with id ${companyId} not found`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Company deleted successfully',
            deletedId: companyId
        });

    } catch (error) {
        console.error('Delete company error:', error);

        if (error.message === 'invalid data') {
            return res.status(400).json({
                success: false,
                error: 'INVALID_DATA',
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to delete company'
        });
    }
});

module.exports = router;