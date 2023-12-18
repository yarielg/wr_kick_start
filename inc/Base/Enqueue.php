<?php

/*
*
* @package Yariko
*
*/

namespace Bgad\Inc\Base;

class Enqueue{

    public function register(){

        add_action( 'wp_enqueue_scripts',  array($this,'kgm_enqueue_frontend'));
    
    }

    /**
     * Enqueueing the main scripts with all the javascript logic that this plugin offer
     */
    function kgm_enqueue_frontend(){
        wp_enqueue_style('main-css', KGM_PLUGIN_URL . '/assets/css/main.css');
        wp_enqueue_script('main-js', KGM_PLUGIN_URL  . '/assets/js/main.js' ,array('jquery'),'1.0', false);
     
        wp_localize_script( 'main-js', 'parameters', ['ajax_url'=> admin_url('admin-ajax.php'), 'plugin_url' => KGM_PLUGIN_URL]);
 
    }

}
