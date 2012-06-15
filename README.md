# HTML5 Hacks Thermometer

*Based on the [A realtime charity thermometer for GiveCamp UK tutorial](http://blog.pusher.com/2011/10/20/a-realtime-charity-thermometer-for-givecamp-uk).*

This repo contains the full working solution of the HTML5 Hacks Thermometer.

## Getting started

1. [Sign up for Pusher](http://pusher.com/sign_up)
2. Get your application credentials from the Pusher dashboard
3. Rename `config.example.php` to `config.php` (`mv config.example.php config.php`)
4. Add the credentials from 2. to `config.php`
5. If you would like the database functionality you can use the following to create the database:

       CREATE TABLE IF NOT EXISTS `donations` (
         `id` int(11) NOT NULL auto_increment,
         `who` varchar(200) NOT NULL,
         `how_much` decimal(10,2) NOT NULL,
         `when` timestamp NOT NULL default CURRENT_TIMESTAMP,
         `running_total` decimal(10,2) NOT NULL,
         PRIMARY KEY  (`id`)
       )
6. Update the application key defined inline within `widget.js` to match the `pusher_key` defined in `config.php`.