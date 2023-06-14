<?php

/*
*
* @package yariko
*
*/

namespace Bgad\Inc\Base;

class Deactivate{

    public static function deactivate(){
        flush_rewrite_rules();
    }
}
