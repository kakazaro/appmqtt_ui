$(function () {

    'use strict';

    // Form

    var contactForm = function () {

        if ($('#contactForm').length > 0) {
            $('#contactForm').validate({
                rules: {
                    name: 'required',
                    email: {
                        required: true,
                        email: true
                    },
                    message: {
                        required: true,
                        minlength: 5
                    }
                },
                messages: {
                    name: 'Vui lòng nhập tên của bạn',
                    email: 'Vui lòng nhập email hợp lệ',
                    message: 'Vui lòng nhập lời nhắn'
                },
                /* submit via ajax */
                submitHandler: function (form) {
                    var $submit = $('.submitting'),
                        waitText = 'Đang gửi...';

                    $.ajax({
                        type: 'POST',
                        url: 'php/send-email.php',
                        data: $(form).serialize(),

                        beforeSend: function () {
                            $submit.css('display', 'block').text(waitText);
                        },
                        success: function (msg) {
                            $('#form-message-warning').hide();
                            setTimeout(function () {
                                $('#contactForm').fadeOut();
                            }, 1000);
                            setTimeout(function () {
                                $('#form-message-success').fadeIn();
                            }, 1400);

                        },
                        error: function () {
                            $('#form-message-warning').hide();
                            setTimeout(function () {
                                $('#contactForm').fadeOut();
                            }, 1000);
                            setTimeout(function () {
                                $('#form-message-success').fadeIn();
                            }, 1400);

                        }
                    });
                }

            });
        }
    };
    contactForm();

});