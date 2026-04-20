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

if (strpos($email, '@') === false) {
    echo "Error: Email must contain @ symbol!";
    exit();
}

if (strlen($pass) < 8) {
    echo "Error: Password must be at least 8 characters!";
    exit();
}

$sql = "INSERT INTO Users (email, password) VALUES ('$email', '$pass')";

if ($conn->query($sql) === TRUE) {
  echo "Registration successful!";
  header("Location: ../FrontPage/index.html");
  exit();
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
