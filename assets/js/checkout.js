(function(window, $) {
    "use strict";

    function CheckoutHandler(){
        var self = this;
        window.step = 1;
        self.init();
    }

    CheckoutHandler.prototype = {
        init: function () {
            var self = this;

            self.displaySteps();
            self.changeDirection();
        },
        displaySteps(){
            $('.step').attr("style", "display: none !important");
            $('.step-' + window.step).attr("style", "display: block !important");
            if(window.step === 4){
                $('.step-4').attr("style", "display: inline !important");
            }

            var go_back_btn  = $('.go_back').filter('.footer');
            var continue_btn = $('.continue').filter('.footer');
            go_back_btn.css('display', 'none');
            continue_btn.css('display', 'none');
            switch (window.step) {
                case 1:
                    continue_btn.css('display', 'inline-block');
                    break
                case 2:
                    go_back_btn.css('display', 'inline-block');
                    break
                case 3:
                    continue_btn.css('display', 'inline-block');
                    go_back_btn.css('display', 'inline-block');
                    break
                case 4:
                    go_back_btn.css('display', 'inline-block');
                    break
            }

            //Scroll  to top
           // $(window).scrollTop(0);
           // window.scrollTo({ top: 0, behavior: 'smooth' });
            $("html, body").animate({ scrollTop: 0 }, "slow");

        },
        checkErrorsShippingFields(){
            return $('#billing_first_name').val().length === 0 ||
                $('#billing_last_name').val().length === 0 ||
                // $('#select2-billing_country-container').val().length === 0 ||
                $('#billing_address_1').val().length === 0 ||
                $('#billing_city').val().length === 0 ||
                // $('#select2-billing_state-container').val().length === 0 ||
                $('#billing_postcode').val().length === 0 ||
                $('#billing_phone').val().length === 0 ||
                $('#billing_email').val().length === 0;

        },
        changeStep(direction){
            var self = this;
            // If all the mandatory Check are not checked, then wi cant go to the next step
            if(window.step === 3 && $('input.mandatory_check').not(':checked').length > 0 && direction === 1){
                alert('You must check all the fields');
                return;
            }

            if(window.step === 1 && self.checkErrorsShippingFields()){
                alert('You have some empty/wrong fields');
                return;
            }

            if(direction === -1 && window.step !==1){
                window.step--;
                $('button.go_back').css('display', 'inline-block');
            }
            if(direction === 1 && window.step !== 4){
                window.step++;
            }
        },
        changeDirection(){
            var self = this;
            $('body').on('click', '.btn-step, radio-dealer' ,function(e){

                if($(this).hasClass('radio-dealer')){
                    var dealer = $(this).data('dealer');
                    dealer = JSON.parse(window.atob(dealer));
                    $('#dealer_info_selected').empty();
                    $('#dealer_info_selected').append('<h4><strong>SELECTED FFL</strong></h4>\n' +
                        '    <p><strong>'+dealer.name+'</strong></p>\n' +
                        '    <p><strong>'+dealer.address+'</strong></p>\n' +
                        '    <p><strong>'+ dealer.city + ', ' + dealer.state + ' ' + dealer.zip + '</strong></p>\n' +
                        '    <p><strong><a href="tel:'+dealer.phone+'">'+dealer.phone+'</a></strong></p>');
                }

                if($(this).hasClass('go_back')){
                    self.changeStep(-1)
                }else{
                    self.changeStep(1)

                }
                self.displaySteps();
                self.stepBarUpdate();
            })

        },
        stepBarUpdate(){
            var current = 1;
            var done_class = 'progtrckr-done';
            $('ol.progtrckr li').each(function(step){
                if(current < window.step){
                    $(this).addClass(done_class);
                    $(this).css('text-decoration', 'line-through');
                }else{
                    $(this).removeClass(done_class);
                    $(this).css('text-decoration', 'none');
                }
                current++;
            });
        }
    }

    $(document).ready(function() {
        window.Kgm = window.Kgm || {};
        window.Kgm.CheckoutHandler = new CheckoutHandler();
    });
})(window, window.jQuery);
