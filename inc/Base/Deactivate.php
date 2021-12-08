<?php

/*
*
* @package yariko
*
*/

namespace Kgm\Inc\Base;

class Deactivate{

    public static function deactivate(){
        flush_rewrite_rules();
    }
}
