<?php

/*
*
* @package Yariko
*
*/

namespace Kgm\Inc\Base;

class Ajax{

    public function register(){

        /**
         * Ajax actions
         */
        add_action( 'wp_ajax_get_ffl', array($this,'getFflLocators'));
        add_action( 'wp_ajax_nopriv_get_ffl', array($this,'getFflLocators'));

    }

    /**
     * Get the ffl dealers
     */
    function getFflLocators(){

        $args = array(
            'post_type' => 'wpsl_stores',
            'post_status'    => 'publish',
            'meta_key'			=> 'certified_kgm_dealer',
            'orderby'			=> 'meta_value',
            'order'				=> 'DESC'
        );

        $locators = get_posts( $args );
        $ffl_locators = array();
        foreach ($locators as $locator){
            array_push($ffl_locators, array(
                    'city' => get_post_meta($locator->ID,'wpsl_city', true),
                    'address' => get_post_meta($locator->ID,'wpsl_address', true),
                    'country' => get_post_meta($locator->ID,'wpsl_country', true),
                    'state' => get_post_meta($locator->ID,'wpsl_state', true),
                    'zip' => get_post_meta($locator->ID,'wpsl_zip', true),
                    'lat' => get_post_meta($locator->ID,'wpsl_lat', true),
                    'lon' => get_post_meta($locator->ID,'wpsl_lng', true),
                    'phone' => get_post_meta($locator->ID,'wpsl_phone', true),
                    'name' => $locator->post_title,
                    'certified' => get_field('certified_kgm_dealer', $locator->ID),
                )
            );
        }

        echo json_encode(array('success' => true,'locators' => $ffl_locators));
        wp_die();
    }

}