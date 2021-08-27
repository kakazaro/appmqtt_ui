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

        return 'Đã có lỗi xảy ra, vui lòng thử lại\nHoặc kiểm tra kết nối mạng';
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
    E40019: { code: 40019, message: 'Not authorized to access this resource. Please login again', error: 'Bạn không có quyền truy cập dữ liệu\nThử đăng xuất và đăng nhập lại' },

    E40020: { code: 40020, message: 'Email is incorrect', error: 'Email đăng nhập không đúng' },
    E40021: { code: 40021, message: 'Password is incorrect', error: 'Sai mật khẩu, vui lòng thử lại' },
    E40022: { code: 40022, message: 'Unauthorized', error: 'Lỗi định danh' },

    E40100: { code: 40100, message: 'The site name is exist in database', error: 'Tên trạm đã tồn tại' },
    E40101: { code: 40101, message: 'The site name is required', error: 'Tên trạm không hợp lệ' },
    E40102: { code: 40102, message: 'The price is required', error: 'Giá tiền không hợp lệ' },
    E40103: { code: 40103, message: 'The currency is required', error: 'Loại tiền tệ không hợp lệ' },
    E40104: { code: 40104, message: 'The status is incorrect', error: 'Trạng thái không hợp lệ' },

    E40200: { code: 40200, message: 'The iot name is exist in database', error: 'Tên IOT đã tồn tại' },
    E40201: { code: 40201, message: 'The iot name is required', error: 'Tên IOT không hợp lệ' },
    E40202: { code: 40202, message: 'The iot code is required', error: 'Mã IOT không hợp lệ' },
    E40203: { code: 40203, message: 'The site_id is required', error: 'Mã trạm không hợp lệ' },
    E40204: { code: 40204, message: 'IOT Code is incorrect', error: 'Mã IOT không chính xác' },

    //Device
    E40300: { code: 40300, message: 'The device name is exist in database', error: 'Tên thiết bị đã tồn tại' },
    E40301: { code: 40301, message: 'Device type is required', error: 'Loại thiết bị không hợp lệ' },

    E40305: { code: 40305, message: 'Basetime is incorrect. [month or year]', error: 'Lỗi đầu vào "Basetime"' },

    E40400: { code: 40400, message: 'Can not find user', error: 'Người dùng không tồn tại' },

    E40500: { code: 40500, message: 'Can not find device', error: 'Thiết bị không tồn tại' },

    E40600: { code: 40600, message: 'Can not find site', error: 'Trạm không tồn tại' },

    E40700: { code: 40700, message: 'Status event is incorrect', error: 'Trạng thái không chính xác' },
    E40701: { code: 40701, message: 'Event type is incorrect', error: 'Loại sự kiện không chính xác' },

    // add
    E40800: { code: 40800, message: 'Device is not active or dont have data', error: 'Thiệt bị không hoặc động hoặc không có dữ liệu' },

    //Report
    E41000: { code: 41000, message: 'The distance between start date and end date is too far. Select data in 2 months range', error: 'Khoảng thời gian báo cáo quá lớn, vui lòng nhập không quá 2 tháng' },
    E41001: { code: 41001, message: 'Too many requests from this IP, please try again after 10s', error: 'Yêu cầu quá tải, vui lòng thử lại sau 10 giây nữa' },
};

export { errors };