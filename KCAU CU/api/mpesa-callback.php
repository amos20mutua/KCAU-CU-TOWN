<?php
header("Content-Type: application/json");

// Get the callback data
$callbackData = file_get_contents('php://input');
$data = json_decode($callbackData);

// Validate the callback data
if (!$data || !isset($data->Body->stkCallback)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid callback data']);
    exit();
}

$result = $data->Body->stkCallback;

// Initialize Supabase PHP client
require_once __DIR__ . '/../vendor/autoload.php';
use Supabase\Client;

$supabase = new Client(
    'https://qmmwikoyptgkheztrwjn.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbXdpa295cHRna2hlenRyd2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzODAyMTgsImV4cCI6MjA1Njk1NjIxOH0.-InUlGihCe9Z-pTSFdPr98UX6lTVIuQ2mVMrLDb9lY4'
);

// Update the contribution status based on the callback result
try {
    if ($result->ResultCode == 0) {
        // Payment successful
        $supabase->from('contributions')
            ->update([
                'status' => 'completed',
                'mpesa_receipt' => $result->CallbackMetadata->Item[1]->Value // MpesaReceiptNumber
            ])
            ->eq('transaction_id', $result->CheckoutRequestID)
            ->execute();
    } else {
        // Payment failed
        $supabase->from('contributions')
            ->update([
                'status' => 'failed',
                'failure_reason' => $result->ResultDesc
            ])
            ->eq('transaction_id', $result->CheckoutRequestID)
            ->execute();
    }

    // Return success response
    http_response_code(200);
    echo json_encode(['status' => 'success']);
} catch (Exception $e) {
    // Log the error and return error response
    error_log('M-Pesa callback error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}