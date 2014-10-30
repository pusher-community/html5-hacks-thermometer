<?php 
  require 'vendor/autoload.php';
  require('config.php');

  $con = mysqli_connect($db_host, $db_username, $db_password, $db_name) or die("Error " . mysqli_error($con));
  
  $who = $_GET['who'];  
  $who = mysqli_real_escape_string( $con, $who );  
  $how_much = $_GET['how_much'];  
  $how_much = mysqli_real_escape_string( $con, $how_much );

  if( !$who || !how_much || !is_numeric($how_much) ) {
    die('unsupported who and how_much values');
  }

  $running_total = 0;
  $last_update = "SELECT * FROM $db_tablename ORDER BY id DESC LIMIT 1" or die("Error in the consult.." . mysqli_error($con));
  $result = $con->query($last_update);
  if($result) {
    $row = mysqli_fetch_array($result);
    $running_total = $row['running_total'];
  }

  $running_total = $running_total + $how_much;
  
  $insert_query = "INSERT INTO $db_tablename (who, how_much, running_total) ";
  $insert_query .= sprintf( "VALUES('%s', %f, %f)", $who, $how_much, $running_total ) or die("Error in the consult.." . mysqli_error($con));
  
  $insert_result = $con->query($insert_query);
  if(!$insert_result) {
    die('insert query failed' . mysql_error());
  }
  
  $pusher = new Pusher($pusher_key, $pusher_secret, $pusher_app_id);
  $channel_name = 'donations-channel';

  $values = array('who' => $who, 'howMuch' => $how_much, 'newTotal' => $running_total);
  $pusher->trigger($channel_name, 'new_donation', $values);
?>