<?php 
  require('config.php');

  // $con = mysql_connect("localhost", $db_username, $db_password);
  //   if (!$con)
  //   {
  //     die('Could not connect: ' . mysql_error());
  //   }
  //   mysql_select_db($db_name, $con);
  
  $who = $_GET['who'];  
  // $who = mysql_real_escape_string( $who );  
  $how_much = $_GET['how_much'];  
  // $how_much = mysql_real_escape_string( $how_much );

  if( !$who || !how_much || !is_numeric($how_much) ) {
    die('unsupported who and how_much values');
  }

  // $running_total = 0;
  // $last_update = "SELECT * FROM $db_tablename ORDER BY id DESC LIMIT 1";
  // $result = mysql_query($last_update);
  // if($result) {
  //   $row = mysql_fetch_array($result);
  //   $running_total = $row['running_total'];
  // }
  $running_total = 1000;

  $running_total = $running_total + $how_much;
  // 
  // $insert_query = "INSERT INTO $db_tablename (who, how_much, running_total) ";
  // $insert_query .= sprintf( "VALUES(‘%s’, %f, %f)", $who, $how_much, $running_total );
  // 
  // $insert_result = mysql_query($insert_query);
  // if(!$insert_result) {
  //   die('insert query failed' . mysql_error());
  // }
  // 
  // mysql_close($con);
  
  require('Pusher.php');
  $pusher = new Pusher($pusher_key, $pusher_secret, $pusher_app_id);
  $channel_name = 'donations-channel';

  $values = array('who' => $who, 'howMuch' => $how_much, 'newTotal' => $running_total);
  $pusher->trigger($channel_name, 'new_donation', $values);
?>