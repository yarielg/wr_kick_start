<?php if($flag_require_dealer){
    ?>
    <ol class="progtrckr" data-progtrckr-steps="4">
        <li class="">SHIPPING</li>
        <li class="">FFL LOCATOR</li>
        <li class="">NFA AGREEMENTS</li>
        <li class="">PAYMENT</li>
    </ol>
    <?php
}else{
    ?>
    <ol class="progtrckr" data-progtrckr-steps="2">
        <li class="">SHIPPING</li>
        <li class="">PAYMENT</li>
    </ol>
    <?php
}