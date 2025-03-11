<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Daraja API credentials
$consumerKey = "YOUR_CONSUMER_KEY";
$consumerSecret = "YOUR_CONSUMER_SECRET";
$businessShortCode = "YOUR_SHORTCODE"; // Paybill or Till number
$passkey = "YOUR_PASSKEY";

// Generate access token
function getAccessToken($consumerKey, $consumerSecret) {
    $url = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
    
    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, ['Authorization: Basic ' . base64_encode($consumerKey . ':' . $consumerSecret)]);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($curl);
    $result = json_decode($response);
    
    return $result->access_token;
}

// Initialize STK Push
function initiateStkPush($accessToken, $businessShortCode, $passkey, $amount, $phone, $callbackUrl) {
    $timestamp = date('YmdHis');
    $password = base64_encode($businessShortCode . $passkey . $timestamp);
    
    $url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json'
        ),
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode([
            'BusinessShortCode' => $businessShortCode,
            'Password' => $password,
            'Timestamp' => $timestamp,
            'TransactionType' => 'CustomerPayBillOnline',
            'Amount' => $amount,
            'PartyA' => $phone,
            'PartyB' => $businessShortCode,
            'PhoneNumber' => $phone,
            'CallBackURL' => $callbackUrl,
            'AccountReference' => 'KCA CU Contribution',
            'TransactionDesc' => 'Contribution'
        ])
    ));
    
    $response = curl_exec($curl);
    curl_close($curl);
    
    return $response;
}

// Handle incoming request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $amount = $data['amount'];
    $phone = $data['phone'];
    $callbackUrl = $data['callbackUrl'];
    
    $accessToken = getAccessToken($consumerKey, $consumerSecret);
    $stkResponse = initiateStkPush(
        $accessToken, 
        $businessShortCode, 
        $passkey, 
        $amount, 
        $phone, 
        $callbackUrl
    );
    
    echo $stkResponse;
}
?>
