<?php
$url=parse_url(getenv("CLEARDB_DATABASE_URL"));

$db_host = $url["host"];
$db_username = $url["user"];
$db_name = substr($url["path"],1);
$db_password = $url["pass"];
$db_tablename = 'donations';

$pusher_app_id = getenv('94729');
$pusher_key = getenv('8d7867b9c36e71e38fd1');
$pusher_secret = getenv('45193d4dbbef4793f449');
?>