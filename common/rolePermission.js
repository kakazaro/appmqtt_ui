import utility from '../common/utility';

const US = utility.USER_ROLES.US.id; // Người dùng thường
const AD = utility.USER_ROLES.AD.id; // Admin
const SA = utility.USER_ROLES.SA.id; // System Admin
const MA = utility.USER_ROLES.MA.id; // Manager
const EN = utility.USER_ROLES.EN.id; // Engineer

function RolePermission(role) {
    return {
        mainInfoScreen: role === AD || role === US || role === EN || role === MA,
        showUserType: role === AD || role === SA,

        addSite: role === SA,
        accessSiteSetting: role === AD || role === SA || role === US || role === MA,
        removeSite: role === SA,

        addDevice: role === AD || role === SA,
        removeDevice: role === SA,

        mainUserManageScreen: role === SA,
        needSettingSiteAccess: role === AD || role === US || role === MA || role === EN,

        canEditName: role === SA || role === AD,
        canEditPrice: role === SA || role === AD || role === US,
        canSeePercent: role === SA || role === AD || role === MA,
        canEditPercent: role === SA || role === AD,
    };
}

export default RolePermission;