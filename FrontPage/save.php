<?php
header("Content-Type: application/json");   

$conn = new mysqli("localhost", "root", "", "portfolio_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB failed"]));
}


$data = json_decode(file_get_contents("php://input"), true); 


if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}


$id = $data["id"] ?? null;
$type = $data["type"] ?? "";
$name = $data["name"] ?? "";
$amount = $data["amount"] ?? 0;
$date = $data["date"] ?? null;
$units = $data["units"] ?? 0;


if (!$id || !$type || !$name || !$amount || !$date) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit();
}

$sql = "INSERT INTO investments (id, type, name, amount, date, units)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issdss", $id, $type, $name, $amount, $date, $units);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$conn->close();
?>