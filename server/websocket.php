<?php  

// Usage: $master=new WebSocket("localhost",12345);

include ("handshake.php");

class WebSocket{
  var $master;
  var $sockets = array();
  var $users   = array();
  var $debug   = false;
  var $lastDate;
  var $usernameList = array ();
  
  function __construct($address,$port){
    error_reporting(E_ALL);
    set_time_limit(0);
    ob_implicit_flush();

    $this->master=socket_create(AF_INET, SOCK_STREAM, SOL_TCP)     or die("socket_create() failed");
    socket_set_option($this->master, SOL_SOCKET, SO_REUSEADDR, 1)  or die("socket_option() failed");
    socket_bind($this->master, $address, $port)                    or die("socket_bind() failed");
    socket_listen($this->master,20)                                or die("socket_listen() failed");
    $this->sockets[] = $this->master;
    $this->say("Server Started : ".date('Y-m-d H:i:s'));
    $this->say("Listening on   : ".$address." port ".$port);
    $this->say("Master socket  : ".$this->master."\n");
    
    $this->lastDate = date('l j F Y');

    while(true){
      $changed = $this->sockets;
      socket_select($changed,$write=NULL,$except=NULL,NULL);
      foreach($changed as $socket){
        if($socket==$this->master){
          $client=socket_accept($this->master);
          if($client<0){ $this->log("socket_accept() failed"); continue; }
          else{ $this->connect($client); }
        }
        else{
          $bytes = @socket_recv($socket,$buffer,2048,0);
          if($bytes==0){ $this->disconnect($socket); }
          else{
            $user = $this->getuserbysocket($socket);
            if(!$user->handshake){ $this->dohandshake($user,$buffer); }
            else{ 
            	$checkLogin = explode (" " , $this->unwrap($buffer));
            	# Handle login
							if ($checkLogin[0] == 'login') {
								# Save name of the user just logged in
								$user->name = $checkLogin[1];
								array_push ($this->usernameList , $checkLogin[1]);
								# Send the date to him
								$this->send ($user->socket, '<span style="color:blue"><b>*** ' . $this->lastDate . ' ***' . '</b></span><br />');
								# Send the updated userlist
								$msgUserList = 'userlist ' . implode (' ' , $this->usernameList);
								$this->sendUserList ($msgUserList);
								# Notify every users
								$this->process($this->sockets, '<span style="color:green"><b>' . $checkLogin[1] . '</b> is just arrived!</span>');
							}
							# And logout too
							else if ($checkLogin[0] == 'logout') {
								# Notify every users
								$this->process($this->sockets, '<span style="color:red"><b>' . $user->name . '</b> is left!</span>');
								# Disconnect him
								$this->disconnect ($user->socket);
							}
							# Otherwise, broadcast the message
							else
	            	$this->process($this->sockets,$this->unwrap($buffer));
            }
          }
        }
      }
    }
  }
  
  function sendUserList ($userlist) {
  	foreach ($this->sockets as $socket) {
      $user = $this->getuserbysocket($socket);
      if ($user != null)
	      $this->send($user->socket,$userlist);
    }
  }

  function process($socketList,$msg){
    /* Extend and modify this method to suit your needs */
    /* Basic usage is to echo incoming messages back to client */
    /* Send the message to each user connected */
    $msg = '<i>' . date('H:i:s') . '</i>' . ' - ' . $msg;
    if ($this->lastDate != date('l j F Y')) {
    	$this->lastDate = date('l j F Y');
    	$msg = '<br /><span style="color:blue"><b>*** ' . $this->lastDate . ' ***' . '</b></span><br /><br />' . $msg;
    }
    foreach ($socketList as $socket) {
      $user = $this->getuserbysocket($socket);
      if ($user != null)
	      $this->send($user->socket,$msg);
    }
  }

  function send($client,$msg){ 
    $this->say("> ".$msg);
    $msg = $this->wrap($msg);
  	socket_write($client,$msg,strlen($msg));
  } 

  function connect($socket){
    $user = new User();
    $user->id = uniqid();
    $user->socket = $socket;
    array_push($this->users,$user);
    array_push($this->sockets,$socket);
    $this->log($socket." CONNECTED!");
  }

  function disconnect($socket){
    $found=null;
    $n=count($this->users);
    for($i=0;$i<$n;$i++){
      if($this->users[$i]->socket==$socket){ $found=$i; break; }
    }
    if(!is_null($found)){ 
    	array_splice($this->users,$found,1); 
    	array_splice ($this->usernameList,$found,1);
    	# Send the updated userlist
			$msgUserList = 'userlist ' . implode (' ' , $this->usernameList);
			$this->say ($msgUserList);
			$this->sendUserList ($msgUserList);
    }
    $index=array_search($socket,$this->sockets);
    socket_close($socket);
    $this->log($socket." DISCONNECTED!");
    if($index>=0){ array_splice($this->sockets,$index,1); }
  }

  function dohandshake($user,$buffer){
    $this->say("\nRequesting handshake...");
    $this->say($buffer);
    list($resource,$host,$origin) = $this->getheaders($buffer);
    $this->say("Handshaking...");
    $hs = (string)new WebSocketHandshake($buffer);
    socket_write($user->socket,$hs,strlen($hs));
    $user->handshake=true;
    $this->say("Done handshaking...");
    return true;
  }

  function getheaders($req){
    $r=$h=$o=null;
    if(preg_match("/GET (.*) HTTP/"   ,$req,$match)){ $r=$match[1]; }
    if(preg_match("/Host: (.*)\r\n/"  ,$req,$match)){ $h=$match[1]; }
    if(preg_match("/Origin: (.*)\r\n/",$req,$match)){ $o=$match[1]; }
    return array($r,$h,$o);
  }

  function getuserbysocket($socket){
    $found=null;
    foreach($this->users as $user){
      if($user->socket==$socket){ $found=$user; break; }
    }
    return $found;
  }

  function     say($msg=""){ echo $msg."\n"; }
  function     log($msg=""){ if($this->debug){ echo $msg."\n"; } }
  function    wrap($msg=""){ return chr(0).$msg.chr(255); }
  function  unwrap($msg=""){ return substr($msg,1,strlen($msg)-2); }

}

class User{
  var $id;
  var $socket;
  var $handshake;
  var $name;
}

?>
