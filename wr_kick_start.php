<?php
/*
*
* @package yariko


Plugin Name:  Plugin Name
Plugin URI:   https://www.webreadynow.com/plugin-page
Description:  Description Here
Version:      1.0.1
Author:       Web Ready Now
Author URI:   https://webreadynow.com/
Tested up to: 5.3.2
Text Domain:  wr_kick_start
Domain Path:  /languages
*/

defined('ABSPATH') or die('You do not have access, sally human!!!');

define ( 'WRKSWP_PLUGIN_VERSION', '1.0.0');

/* Generate Autoload
 * 1- Composer init
 * 2- Add PSR4 to composer.json and change WRKS for your plugin's name abbreviation.
 * 3- Composer Update
 * 4- Replace
 *          WRKSWP by PLUGIN_ABBREVIATION
*           Wrkswp by Plugin_abbreviation
*           wr_kick_start by plugin_text_domain
*/
if( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php') ){
    require_once  dirname( __FILE__ ) . '/vendor/autoload.php';
}
//Change WRPL for plugin's initials
define('WRKSWP_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
define('WRKSWP_PLUGIN_URL' , plugin_dir_url(  __FILE__  ) );
define('WRKSWP_ADMIN_URL' , get_admin_url() );
define('WRKSWP_PLUGIN_DIR_BASENAME' , dirname(plugin_basename(__FILE__)) );

//include the helpers
include 'inc/util/helpers.php';

if( class_exists( 'Wrkswp\\Inc\\Init' ) ){
    register_activation_hook( __FILE__ , array('Wrkswp\\Inc\\Base\\Activate','activate') );
    Wrkswp\Inc\Init::register_services();
}



