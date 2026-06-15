function isValidCompanyDTO(data) {
    return (
        data &&
        typeof data.company_name === "string" && data.company_name.trim() !== "" &&
        typeof data.company_site === "string" && data.company_site.trim() !== "" &&
        typeof data.company_description === "string" &&
        typeof data.director === "string" && data.director.trim() !== "" &&
        typeof data.type_coop === "string" &&
        typeof data.specialization === "string" &&
        typeof data.path_logo === "string"
    );
}

function isValidUpdateCompanyDTO(data) {
    if (!data || typeof data.id !== "string") {
        return false;
    }

    return (
        (data.company_name !== undefined && typeof data.company_name === "string") ||
        (data.company_site !== undefined && typeof data.company_site === "string") ||
        (data.company_description !== undefined && typeof data.company_description === "string") ||
        (data.director !== undefined && typeof data.director === "string") ||
        (data.type_coop !== undefined && typeof data.type_coop === "string") ||
        (data.specialization !== undefined && typeof data.specialization === "string") ||
        (data.path_logo !== undefined && typeof data.path_logo === "string")
    );
}

module.exports = {
    isValidCompanyDTO,
    isValidUpdateCompanyDTO
};