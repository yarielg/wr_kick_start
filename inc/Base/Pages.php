<?php

/*
*
* @package Yariko
*
*/

namespace Wrkswp\Inc\Base;

class Pages{

    public function register(){

        add_action('admin_menu', function(){
            add_menu_page('Page Title', 'Menu Title', 'manage_options', 'wrkswp-slug-menu', array($this,'admin_index') , WRKSWP_PLUGIN_URL. 'assets/img/icon.png',110);
        });

        add_action('admin_menu',function(){
            $page_product =  add_submenu_page( 'wrkswp-parent-slug-menu', __('Page Title','wr_kick_start'), __('Menu Title','wr_text_domain'),'manage_options', 'wrkswp-slug-menu', array($this,'admin_index'));
            add_action( 'load-' . $page_product, function(){
                add_action( 'admin_enqueue_scripts',function (){
                    //Add css and js only for the current page
                });
            });
        });

    }

    //Assigning the template to page
    function admin_index(){
        require_once WRKSWP_PLUGIN_PATH . 'templates/dashboard.php';
    }

}
?>