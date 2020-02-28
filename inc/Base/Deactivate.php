<?php

/*
*
* @package yariko
*
*/

namespace Wrkswp\Inc\Base;

class Deactivate{

    public static function deactivate(){
        flush_rewrite_rules();
    }
}
