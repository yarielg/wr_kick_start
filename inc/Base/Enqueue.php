<?php

/*
*
* @package Yariko
*
*/

namespace Kgm\Inc\Base;

class Enqueue{

    public function register(){


        add_action( 'wp_enqueue_scripts',  array($this,'kgm_enqueue_frontend'));
        add_action( 'wp_head',  array($this, 'kmg_enqueue_map_scripts'));

    }

    /**
     * Adding the map scripts (A condition is required in case the map is not needed)
     */
    function kmg_enqueue_map_scripts(){
        ?>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBMwYpxeHMJ249d2oWOfcFwyxe5kcAAcB0&callback=window.Kgm.MapHandler.initMap&v=weekly&libraries=places" async defer></script>
        <?php
    }

    /**
     * Enqueueing the main scripts with all the javascript logic that this plugin offer
     */
    function kgm_enqueue_frontend(){
        wp_enqueue_style('main-css', KGM_PLUGIN_URL . '/assets/css/main.css');

        wp_enqueue_script('main-js', KGM_PLUGIN_URL  . '/assets/js/main.js' ,array('jquery'),'1.0', false);
        wp_localize_script( 'main-js', 'parameters', ['ajax_url'=> admin_url('admin-ajax.php'), 'plugin_url' => KGM_PLUGIN_URL]);
        wp_enqueue_script('checkout-js', KGM_PLUGIN_URL  . '/assets/js/checkout.js' ,array('jquery','main-js'),'1.0', true);
    }

}