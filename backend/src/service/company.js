const pgDb = require("../db/pg");
const validCompany = require("../validators/company.validators");

async function AddedCompany(data) {
    if (!validCompany.isValidCompanyDTO(data)) {
        console.error("invalid data");
        throw new Error('invalid data')
    }

    try {
        const query = `INSERT INTO companies (
            company_name,
            company_site,
            company_description,
            director,
            type_coop,
            specialization,
            path_logo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, company_name, company_site, company_description, director, type_coop, specialization, path_logo
        `;

        return await pgDb.query(query, [
            data.company_name,
            data.company_site,
            data.company_description,
            data.director,
            data.type_coop,
            data.specialization,
            data.path_logo
        ]);
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

async function GetInfoCompany() {
    try {
        const query = "SELECT * FROM companies";
        const result = await pgDb.query(query);

        if (!result) {
            throw new Error("Db failed");
        }
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function UpdateCompany(data) {
    if (!validCompany.isValidUpdateCompanyDTO(data)) {
        console.error("invalid data");
        throw new Error('invalid data')
    }

    const allowedFields = ['company_name', 'company_site', 'company_description', 'director', 'type_coop', 'specialization', 'path_logo'];

    const updateFields = Object.keys(data)
        .filter(key => allowedFields.includes(key) && data[key] !== undefined)
        .reduce((obj, key) => {
            obj[key] = data[key];
            return obj;
        }, {});

    const updateFieldsArray = Object.keys(updateFields);

    if (updateFieldsArray.length === 0) {
        console.error("no valid fields to update");
        throw new Error("no valid fields to update");
    }

    const setClause = updateFieldsArray.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const query = `UPDATE companies SET ${setClause} WHERE id = $${updateFieldsArray.length + 1} RETURNING *;`;
    const values = [...updateFieldsArray.map(field => updateFields[field]), data.id];

    try {
        const result = await pgDb.query(query, values);

        if (result.length === 0) {
            throw new Error(`Company with id ${data.id} not found`);
        }

        return result[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function DeleteCompany(id) {
    const companyId = typeof id === "string" ? parseInt(id, 10) : id;

    if (isNaN(companyId) || companyId <= 0) {
        console.error("invalid data: id must be positive number");
        throw new Error('invalid data');
    }

    try {
        const result = await pgDb.query('DELETE FROM companies WHERE id = $1 RETURNING id;', [companyId]);

        return result.length > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {AddedCompany, GetInfoCompany, UpdateCompany, DeleteCompany};