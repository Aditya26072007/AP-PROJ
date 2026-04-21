<?php
$servername = "localhost";
$username = "root";   
$password = "";       
$dbname = "login_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email'];
$pass = $_POST['password'];

$sql = "INSERT INTO Users (email, password) VALUES ('$email', '$pass')";

if ($conn->query($sql) === TRUE) {
  header("Location: /AP-PROJ/FrontPage/index.html");
  exit();
} else {
  echo "Error: " . $conn->error;
}

$conn->close();
?>