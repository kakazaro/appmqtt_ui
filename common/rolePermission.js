import utility from '../common/utility';

const US = utility.USER_ROLES.US.id;
const AD = utility.USER_ROLES.AD.id;
const SA = utility.USER_ROLES.SA.id;

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
    };
}

export default RolePermission;