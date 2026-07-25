import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRolesEnum } from "../utils/constants.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
if (req.user.role !== UserRolesEnum.ADMIN) {
    throw new ApiError(403, "Access denied");
}

    next();
});