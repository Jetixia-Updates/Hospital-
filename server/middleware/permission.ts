import { RequestHandler } from "express";
import { hasPermission } from "../../shared/permissions";
import { AppError } from "./error";

// Middleware to check if user has specific permission
export const checkPermission = (
  module: string,
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export'
): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user) {
      throw new AppError(401, "Unauthorized - No user found");
    }

    if (!hasPermission(user.role, module, action)) {
      throw new AppError(
        403,
        `Forbidden - User does not have permission to ${action} ${module}`
      );
    }

    next();
  };
};

// Middleware to check multiple permissions (user needs at least one)
export const checkAnyPermission = (
  permissions: Array<{ module: string; action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' }>
): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user) {
      throw new AppError(401, "Unauthorized - No user found");
    }

    const hasAnyPermission = permissions.some(({ module, action }) =>
      hasPermission(user.role, module, action)
    );

    if (!hasAnyPermission) {
      throw new AppError(
        403,
        "Forbidden - User does not have required permissions"
      );
    }

    next();
  };
};

// Middleware to check if user can access their own data or has permission
export const checkOwnDataOrPermission = (
  module: string,
  action: 'read' | 'update' | 'delete'
): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;
    const resourceId = req.params.id;

    if (!user) {
      throw new AppError(401, "Unauthorized - No user found");
    }

    // User can access their own data
    if (user.id === resourceId) {
      return next();
    }

    // Or user has permission to access others' data
    if (hasPermission(user.role, module, action)) {
      return next();
    }

    throw new AppError(
      403,
      "Forbidden - You can only access your own data or need appropriate permissions"
    );
  };
};
