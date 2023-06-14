<?php

/*
*
* @package Yariko
*
*/

namespace Bgad\Inc\Base;

class Settings{

    public function register(){

        /**
         * Override woocommerce template from plugin
         */

        add_filter( 'woocommerce_locate_template', array($this, 'locate_template'), 10, 3 );

    }

    function locate_template( $template, $template_name, $template_path ) {
        $basename = basename( $template );

        switch ($basename){
            case 'review-order.php':
                $template = KGM_PLUGIN_PATH . 'templates/review-order.php';
                break;
            case 'payment.php':
                $template = KGM_PLUGIN_PATH . 'templates/payment.php';
                break;
            case 'form-checkout.php':
                $template = KGM_PLUGIN_PATH . 'templates/form-checkout.php';
                break;
        }

        return $template;
    }

}