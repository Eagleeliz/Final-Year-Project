// test-sms.ts (create in your project root)
import smsService from '../sms/sms.service';

async function testSmsService() {
  console.log('🚀 Testing SMS Service...\n');
  
  try {
    // IMPORTANT: You MUST use a verified phone number
    // Go to Twilio Console → Verified Caller IDs → Add your number
    const TEST_PHONE = '+254705135534'; // ← REPLACE WITH YOUR VERIFIED NUMBER
    
    // Test 1: Send a regular SMS
    console.log('📱 Test 1: Sending regular SMS...');
    const result1 = await smsService.sendSms({
      to: TEST_PHONE,
      body: 'Hello from Maternal Health App! This is a test message.'
    });
    console.log(`✅ SMS sent! Message ID: ${result1.sid}\n`);
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Send emergency alert
    console.log('🚨 Test 2: Sending emergency alert...');
    const result2 = await smsService.sendEmergencyAlert(
      TEST_PHONE,
      123,                // User ID
      'severe_pain',      // Alert type
      'high',             // Severity (medium, high, or critical)
      'Patient reports severe abdominal pain for 2 hours' // Description
    );
    console.log(`✅ Emergency alert sent! Message ID: ${result2.sid}\n`);
    
    // Test 3: Check message status
    console.log('📊 Test 3: Checking message status...');
    const status = await smsService.getMessageStatus(result2.sid);
    console.log(`✅ Message status: ${status}\n`);
    
    console.log('🎉 All tests completed successfully!');
    console.log('📱 Check your phone for the messages.');
    
  } catch (error: any) {
    console.error('\n❌ TEST FAILED:', error.message);
    
    // Helpful error messages
    if (error.message.includes('Trial account')) {
      console.log('\n💡 SOLUTION:');
      console.log('1. Go to: https://console.twilio.com');
      console.log('2. Click "Phone Numbers" → "Verified Caller IDs"');
      console.log('3. Add and verify your phone number');
      console.log('4. Update TEST_PHONE in test-sms.ts with your verified number');
    }
    
    if (error.message.includes('Invalid phone number')) {
      console.log('\n💡 Make sure phone number has:');
      console.log('   - + at the beginning');
      console.log('   - Country code (e.g., +1 for US)');
      console.log('   - No spaces or dashes');
      console.log('   Example: +1234567890');
    }
  }
}

// Run the test
testSmsService();