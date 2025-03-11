<?php
header('Content-Type: application/json');

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json);

// Validate input
if (!$data || !isset($data->amount) || !isset($data->phone)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input']);
    exit();
}

// M-Pesa API credentials - Sandbox Environment
$consumer_key = 'GvzjNnYgNJtwgwfLBkZh65VPwfuKvs0V';  // Sandbox test credentials
$consumer_secret = 'oXQQzyGD4tFI9yxc';  // Sandbox test credentials
$business_shortcode = '174379';  // Sandbox test shortcode
$passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';  // Sandbox test passkey
$callback_url = isset($data->callbackUrl) ? $data->callbackUrl : 'https://yourdomain.com/api/mpesa-callback.php';

// For testing, let's log the incoming data
error_log('M-Pesa API Request Data: ' . print_r($data, true));

// Generate access token
$credentials = base64_encode($consumer_key . ':' . $consumer_secret);
$url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array('Authorization: Basic '.$credentials));
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

$result = curl_exec($curl);

// Log the token generation response
error_log('Token Generation Response: ' . $result);

if (curl_errno($curl)) {
    error_log('Curl error: ' . curl_error($curl));
    http_response_code(500);
    echo json_encode(['error' => 'Failed to generate access token']);
    exit();
}

$result = json_decode($result);
if (!isset($result->access_token)) {
    error_log('Invalid token response: ' . print_r($result, true));
    http_response_code(500);
    echo json_encode(['error' => 'Invalid token response']);
    exit();
}

$access_token = $result->access_token;

// Generate password
$timestamp = date('YmdHis');
$password = base64_encode($business_shortcode . $passkey . $timestamp);

// Initialize STK Push
$url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Authorization: Bearer '.$access_token
));

// Format phone number
$phone = $data->phone;
if (strlen($phone) == 9) {
    $phone = '254' . $phone;
} elseif (strlen($phone) == 10 && substr($phone, 0, 1) == '0') {
    $phone = '254' . substr($phone, 1);
} elseif (strlen($phone) == 12 && substr($phone, 0, 3) == '254') {
    // Phone number is already in the correct format
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid phone number format']);
    exit();
}

$curl_post_data = array(
    'BusinessShortCode' => $business_shortcode,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerPayBillOnline',
    'Amount' => (int)$data->amount,
    'PartyA' => $phone,
    'PartyB' => $business_shortcode,
    'PhoneNumber' => $phone,
    'CallBackURL' => $callback_url,
    'AccountReference' => 'KCA CU Fundraiser',
    'TransactionDesc' => 'Donation to KCA CU'
);

$data_string = json_encode($curl_post_data);

// Log the STK push request
error_log('STK Push Request: ' . $data_string);

curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($curl, CURLOPT_HEADER, false);

$response = curl_exec($curl);

// Log the STK push response
error_log('STK Push Response: ' . $response);

if (curl_errno($curl)) {
    error_log('Curl error in STK push: ' . curl_error($curl));
    http_response_code(500);
    echo json_encode(['error' => 'Failed to initiate payment']);
    exit();
}

curl_close($curl);

// Ensure we're returning valid JSON
$response_data = json_decode($response);
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log('Invalid JSON response: ' . $response);
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from M-Pesa']);
    exit();
}

echo $response; 