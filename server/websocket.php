<?php  

// Usage: $master=new WebSocket("localhost",12345);

include ('handshake.php');

class WebSocket {
	var $master;
	var $sockets = array ();
	var $users   = array ();
	var $debug   = false;
	var $lastDate;
	var $usernameList = array ();

	function __construct ($address, $port) {
		error_reporting (E_ALL);
		set_time_limit (0);
		ob_implicit_flush ();

		$this->master = socket_create (AF_INET, SOCK_STREAM, SOL_TCP) or die ('socket_create() failed');
		socket_set_option ($this->master, SOL_SOCKET, SO_REUSEADDR, 1) or die ('socket_option() failed');
		socket_bind ($this->master, $address, $port) or die ('socket_bind() failed');
		socket_listen ($this->master, 20) or die ('socket_listen() failed');
		$this->sockets[] = $this->master;
		$this->say ('Server Started : ' . date ('Y-m-d H:i:s'));
		$this->say ('Listening on   : ' . $address . ' port ' . $port);
		$this->say ('Master socket  : ' . $this->master . "\n");
		$this->lastDate = date('l j F Y');

		while (true) {
			$changed = $this->sockets;
			socket_select ($changed, $write=NULL, $except=NULL, NULL);
			foreach ($changed as $socket) {
				if ($socket == $this->master) {
					$client = socket_accept ($this->master);
					if ($client < 0) {
						$this->log ('socket_accept() failed');
						continue;
					}
					else {
						$this->connect ($client);
					}
				}
				else {
					$bytes = @socket_recv ($socket, $buffer, 2048, 0);
					
					# On error or on close, close the socket
					if (($bytes == 0) || ($bytes == 2)) {
						$this->disconnect ($socket);
					}
					else {
						$user = $this->getuserbysocket ($socket);
						if (!$user->handshake) {
							$this->dohandshake ($user, $buffer);
						}
						else {
							$checkMsg = explode (',' , $this->unwrap ($buffer));
							switch ($checkMsg[0]) {
								# Handle login
								case 'login':
									$this->loginHandler ($user, $checkMsg[1]);
									break;
								# Broadcast the message
								case 'global':
									# Get the entire message, included ','
									$this->sendGlobal (substr ($this->unwrap ($buffer), strlen ($checkMsg[0]) + 1), $user);
									break;
								# Send message back to the sender and to the receiver
								case 'private':
									# Sender, receiver, message
									$this->sendPrivate ($user, $checkMsg[1], substr ($this->unwrap ($buffer), strlen ($checkMsg[0]) + strlen ($checkMsg[1]) + 2));
									break;
							}
						}
					}
				}
			}
		}
	}
	
	# Broadcast the message
	function sendGlobal ($msg, $sender) {
		$msg = '<b>' . $sender->name . ':</b> ' . $msg;
		$this->process ($msg);
	}
	
	# Find user by his name
	function findUserByName ($name) {
		$found = null;
		foreach ($this->users as $user) {
			if (strtolower ($user->name) == strtolower ($name)) {
				$found = $user;
				break;
			}
		}
		
		return $found;
	}
	
	# Send message both to the sender and to the receiver
	function sendPrivate ($sender, $receiver, $msg) {
		# Get user object of the receiver
		$receiver = $this->findUserByName ($receiver);
		
		# Add username to the message
		$msg = '<b>' . $sender->name . ':</b> ' . $msg;
		
		# Set date
		$msg = '<i>' . date('H:i:s') . '</i>' . ' - ' . $msg;
		if ($this->lastDate != date ('l j F Y')) {
			$this->lastDate = date ('l j F Y');
			$msg = '<br /><span style="color:blue"><b>*** ' . $this->lastDate . ' ***' . '</b></span><br /><br />' . $msg;
		}
		
		# Sender -> private:room_receiver:msg
		$this->send ($sender->socket, 'private:' . $receiver->name . ':' . $msg);
		# Sender -> private:room_sender:msg
		$this->send ($receiver->socket, 'private:' . $sender->name . ':' . $msg);
	}
	
	function loginHandler ($userToLogin, $username) {
		# If there is an already logged user with $username, disconnect this
		if ($this->findUserByName ($username) == null) {
			# Save name of the user just logged in
			$userToLogin->name = $username;
			array_push ($this->usernameList , $username);
			# Send the date to him
			$this->send ($userToLogin->socket, 'global:<span style="color:blue"><b>*** ' . $this->lastDate . ' ***' . '</b></span><br />');
			# Send the updated userlist
			$msgUserList = 'userlist:' . implode (':' , $this->usernameList);
			$this->sendUserList ($msgUserList);
			# Notify every users
			$this->process ('<span style="color:green"><b>' . $username . '</b> is just arrived!</span>');
		}
		else {
			$this->disconnect ($userToLogin->socket);
		}
	}

	function sendUserList ($userlist) {
		$userlist = 'global:' . $userlist;
		foreach ($this->sockets as $socket) {
			$user = $this->getuserbysocket($socket);
			if ($user != null) {
				$this->send($user->socket,$userlist);
			}
		}
	}

	function process ($msg) {
		$msg = '<i>' . date('H:i:s') . '</i>' . ' - ' . $msg;
		if ($this->lastDate != date ('l j F Y')) {
			$this->lastDate = date ('l j F Y');
			$msg = '<br /><span style="color:blue"><b>*** ' . $this->lastDate . ' ***' . '</b></span><br /><br />' . $msg;
		}
		
		$msg = 'global:' . $msg;
		
		foreach ($this->sockets as $socket) {
			$user = $this->getuserbysocket ($socket);
			if ($user != null) {
				$this->send ($user->socket, $msg);
			}
		}
	}

	function send ($client, $msg) { 
		$this->say ('> ' . $msg);
		$msg = $this->wrap ($msg);
		socket_write ($client, $msg, strlen ($msg));
	}

	function connect ($socket) {
		$user = new User ();
		$user->id = uniqid ();
		$user->socket = $socket;
		array_push ($this->users, $user);
		array_push ($this->sockets, $socket);
		$this->log($socket . ' CONNECTED!');
	}

	function disconnect ($socket) {
		$found = null;
		$n = count ($this->users);
		for ($i = 0; $i < $n; $i++) {
			if ($this->users[$i]->socket == $socket) {
				$found=$i;
				break;
			}
		}
		if (!is_null ($found)) {
			# Disconnect an existing user
			$disconnectedUser = $this->users[$found]->name;
			array_splice ($this->users, $found, 1);
			if (!is_null ($disconnectedUser)) {
				array_splice ($this->usernameList, $found, 1);
				# Send the updated userlist
				$msgUserList = 'userlist:' . implode (':' , $this->usernameList);
				# Notify every users except the disconnected one
				$this->process ('<span style="color:red"><b>' . $disconnectedUser . '</b> has left!</span>');
				$this->say ($msgUserList);
				$this->sendUserList ($msgUserList);
			}
			else {
				# Disconnect an non-existing user
				$this->send ($this->users[$found]->socket, 'global:<span style="color:red"><b>Your username is already used! Try to login with another one.</b></span>');
			}
		}
		$index = array_search ($socket, $this->sockets);
		socket_close ($socket);
		$this->log ($socket . ' DISCONNECTED!');
		if ($index >= 0) {
			array_splice ($this->sockets, $index, 1);
		}
	}

	function dohandshake ($user, $buffer) {
		$this->say ("\nRequesting handshake...");
		$this->say ($buffer);
		list ($resource, $host, $origin) = $this->getheaders ($buffer);
		$this->say ('Handshaking...');
		$hs = (string) new WebSocketHandshake ($buffer);
		socket_write ($user->socket, $hs, strlen ($hs));
		$user->handshake = true;
		$this->say ('Done handshaking...');
		return true;
	}

	function getheaders ($req) {
		$r = $h = $o = null;
		if (preg_match ('/GET (.*) HTTP/', $req, $match)) {
			$r = $match[1];
		}
		if (preg_match ("/Host: (.*)\r\n/", $req, $match)) {
			$h = $match[1];
		}
		if (preg_match ("/Origin: (.*)\r\n/", $req, $match)) {
			$o = $match[1];
		}
	
		return array ($r, $h, $o);
	}

	function getuserbysocket ($socket) {
		$found = null;
		foreach ($this->users as $user) {
			if ($user->socket == $socket) {
				$found = $user;
				break;
			}
		}
		
		return $found;
	}

	function say ($msg = '') {
		echo $msg . "\n";
	}
	
	function log ($msg = '') {
		if ($this->debug) {
			echo $msg . "\n";
		}
	}
	
	function wrap ($msg = '') {
		return chr(0) . $msg . chr(255);
	}
	
	function unwrap ($msg = '') {
		return substr ($msg, 1, strlen ($msg) - 2);
	}
}

class User {
	var $id;
	var $socket;
	var $handshake;
	var $name;
}

?>
