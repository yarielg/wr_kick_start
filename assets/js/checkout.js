jQuery(function($) {



    $(document).ready(function() {
        window.step = 1;


        $('.next').click(function(){
            $('#payment').removeAttr('style')
        })

        displaySteps();

        function displaySteps(){
            $('.step').attr("style", "display: none !important");
            $('.step-' + window.step).attr("style", "display: block !important");
            if(window.step == 4){
                $('.step-4').attr("style", "display: inline !important");
                $('.wrong-payment').attr("style", "display: none !important");
            }

        }

        $('.btn-step').on('click', function(){
            if($(this).hasClass('go_back')){
                changeStep(-1)
            }else{
                changeStep(1)

            }
            displaySteps();
        })

        //direction -1 is back, 1 is continue
        function changeStep(direction){
            if(direction === -1 && window.step !==1){
                window.step--;
            }
            if(direction === 1 && window.step !== 4){
                window.step++;
            }
        }
    });
});