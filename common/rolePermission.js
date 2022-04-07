import utility from '../common/utility';

const US = utility.USER_ROLES.US.id; // Người dùng thường
const AD = utility.USER_ROLES.AD.id; // Admin
const SA = utility.USER_ROLES.SA.id; // System Admin

function RolePermission(role) {
    return {
        mainInfoScreen: role === AD || role === US,
        showUserType: role === AD || role === SA,

        addSite: role === SA,
        accessSiteSetting: role === AD || role === SA,
        removeSite: role === SA,

        addDevice: role === AD || role === SA,
        removeDevice: role === SA,

        mainUserManageScreen: role === SA,
        needSettingSiteAccess: role === AD || role === US,

        canSeePrice: role === SA || role === AD || role === US,
        canSeeDiscount: role === SA || role === AD,
        canSeeVAT: role === SA || role === AD,
    };
}

export default RolePermission;