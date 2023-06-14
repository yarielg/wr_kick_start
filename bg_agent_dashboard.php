<?php
/*
*
* @package yariko


Plugin Name:  Beghelli Agent Dashboard
Plugin URI:   https://thomasgbennett.com/
Description:  A dashboard agent integrated with MAS500
Version:      1.0.0
Author:       Web Ready Now (Yariel Gordillo)
Author URI:   https://webreadynow.com/
Tested up to: 5.3.2
Text Domain:  bg_agent_dashboard
Domain Path:  /languages
*/

defined('ABSPATH') or die('You do not have access, sally human!!!');

define ( 'BGAD_PLUGIN_VERSION', '1.0.0');

if( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php') ){
    require_once  dirname( __FILE__ ) . '/vendor/autoload.php';
}
//Change WRPL for plugin's initials
define('BGAD_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define('BGAD_PLUGIN_URL' , plugin_dir_url(  __FILE__  ) );
define('BGAD_ADMIN_URL' , get_admin_url() );
define('BGAD_PLUGIN_DIR_BASENAME' , dirname(plugin_basename(__FILE__)) );

//include the helpers
include 'inc/util/helpers.php';
if( class_exists( 'Bgad\\Inc\\Init' ) ){
    register_activation_hook( __FILE__ , array('Bgad\\Inc\\Base\\Activate','activate') );
    Kgm\Inc\Init::register_services();
}



