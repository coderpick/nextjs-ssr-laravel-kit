/**
 * This file contains reusable helpers for authorization logic. just like laravel spatie roles and permissions package.
 */

export function hasRole(user, roleName) {
    return user?.roles?.some(role => role.name === roleName) ?? false;
}


export function hasPermission(user, permissionName) {
    const hasDirectPermission = user?.permissions?.some(permission => permission.name === permissionName) ?? false;
    const hasPermissionThroughRole = user?.roles?.some(role =>
        role.permissions?.some(permission => permission.name === permissionName)
    ) ?? false;

    return hasDirectPermission || hasPermissionThroughRole;
}


export function can(user, permissionName) {
    return hasPermission(user, permissionName);
}


export function cannot(user, permissionName) {
    return !hasPermission(user, permissionName);
}


export function hasAnyRole(user, roleNames) {
    return roleNames.some(roleName => hasRole(user, roleName));
}


export function hasAllRoles(user, roleNames) {
    return roleNames.every(roleName => hasRole(user, roleName));
}


export function hasAnyPermission(user, permissionNames) {
    return permissionNames.some(permissionName => hasPermission(user, permissionName));
}


export function hasAllPermissions(user, permissionNames) {
    return permissionNames.every(permissionName => hasPermission(user, permissionName));
}
