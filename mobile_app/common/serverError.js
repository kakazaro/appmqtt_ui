export default {
    getError: (err) => {
        let code = err?.response?.data?.code;
        if (code) {
            const key = Object.keys(errors).find(k => (errors[k].code + '') === (code + ''));
            if (key) {
                return errors[key].error;
            }
        }

        let message = err?.response?.data?.message || err?.response?.data?.error;
        if (message) {
            return message;
        }

        return 'Đã có lỗi xảy ra, vui lòng thử lại';
    }
};

const errors = {
    E40001: { code: 40001, message: 'System code. Please contact with your admin', error: 'Đã có lỗi không xác định xảy ra' },
    E40002: { code: 40002, message: 'Role is incorrect systax. Please use [SA, AD, US]', error: 'Quyền người dùng không hợp lệ' },
    E40010: { code: 40010, message: 'Basetime or type is incorrect', error: 'Lỗi giá trị đầu vào chưa đúng' },
    E40011: { code: 40011, message: 'Username or passwork is incorrect', error: 'Tài khoản hoặc mật khẩu không chính xác' },
    E40012: { code: 40012, message: 'There is no data in device data', error: 'Không có dữ liệu' },
    E40013: { code: 40013, message: 'Device id is incorrect', error: 'ID của thiết bị không chính xác' },
    E40014: { code: 40014, message: 'Can not find user. Maybe user id is incorrect', error: 'ID của người dùng không chính xác' },
    E40015: { code: 40015, message: 'Param \'access\' is incorrect. Please use in [true or false]', error: 'Lỗi giá trị đầu vào chưa đúng' },

    E40016: { code: 40016, message: 'There are no sites assigned for your user. Please contact with your admin', error: 'Bạn không có trạm điện nào được cấp quyền' },
    E40017: { code: 40017, message: 'Email is duplicated. Please change other email', error: 'Email bị trùng, vui lòng dùng 1 email khác' },
    E40018: { code: 40018, message: 'Password is must at list 3 characters', error: 'Mật khẩu phải ít nhất 3 chữ cái' },
    E40019: { code: 40019, message: 'Not authorized to access this resource. Please login again', error: 'Bạn không có quyền truy cập dữ liệu, thử đăng xuất và đăng nhập lại' },

    E40020: { code: 40020, message: 'Email is incorrect', error: 'Email đăng nhập không đúng' },
    E40021: { code: 40021, message: 'Password is incorrect', error: 'Sai mật khẩu, vui lòng thử lại' },
};