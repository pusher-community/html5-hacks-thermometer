<?php
$url=parse_url(getenv("CLEARDB_DATABASE_URL"));

$db_host = $url["host"];
$db_username = $url["user"];
$db_name = substr($url["path"],1);
$db_password = $url["pass"];
$db_tablename = 'donations';

$pusher_app_id = getenv('PUSHER_APP_ID');
$pusher_key = getenv('PUSHER_APP_KEY');
$pusher_secret = getenv('PUSHER_APP_SECRET');
?>