export default {
    getError: (err) => {
        let code = err?.response?.data?.code;
        if (code) {
            const key = Object.keys(errors).find(e => (e.code + '') === (code + ''));
            if (key) {
                return errors[key].error;
            }
        }

        return 'Đã có lỗi xảy ra, vui lòng thử lại';
    }
};

const errors = {
    E40001: { code: 40001, message: 'System code', error: 'Đã có lỗi không xác định xảy ra' },
    E40010: { code: 40010, message: 'Basetime or type is incorrect', error: 'Lỗi giá trị đầu vào chưa đúng' },
    E40011: { code: 40011, message: 'Username or passwork is incorrect', error: 'Tài khoản hoặc mật khẩu không chính xác' },
    E40012: { code: 40012, message: 'There is no data in device data', error: 'Không có dữ liệu' },
    E40013: { code: 40013, message: 'Device id is incorrect', error: 'ID của thiết bị không chính xác' },
};