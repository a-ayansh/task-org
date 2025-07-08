import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (req, res) => {
    const response = new ApiResponse(200, { status: "OK" }, "Server is healthy");
    res.status(200).json(response);
});

export {
    healthcheck
};
