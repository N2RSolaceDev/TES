// test.js - Test API Key using Native Fetch (No node-fetch needed)
// Works on Node.js 18+ / 20+

// === 🔧 CONFIGURE THESE VALUES ===
const API_BASE_URL = 'https://unfiltereduk.co.uk'; // 🔥 Change to your URL
const API_KEY = 'ukapi_ce8a277043b7364a1e02c7552bb9eb15897690cb82c45ede962298009d8a9598'; // ✅ Your key
const TO_EMAIL = 'solace@unfiltereduk.co.uk';
const SUBJECT = 'API Test - Native Fetch';
const BODY = `
Hello Solace,

This confirms the API system is fully operational.

— unfiltereduk Automation
`.trim();

// === 🚀 Send Test Email ===
async function sendTestEmail() {
  console.log('📧 Testing API with native fetch...\n');

  // Validate config
  if (!API_BASE_URL || !API_BASE_URL.startsWith('http')) {
    console.error('❌ ERROR: Invalid API_BASE_URL. Example: https://your-app.onrender.com');
    return;
  }

  if (!API_KEY || !API_KEY.startsWith('ukapi_')) {
    console.error('❌ ERROR: Invalid API_KEY format.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/automated-send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: API_KEY,
        to: TO_EMAIL,
        subject: SUBJECT,
        body: BODY
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS: Email sent via native fetch!');
      console.log('📬 From: %s', data.from || 'unknown');
      console.log('📨 To: %s', TO_EMAIL);
      console.log('📌 Subject: %s', SUBJECT);
      console.log('🔗 Response:', data);
      console.log('\n💡 Check inbox: solace@unfiltereduk.co.uk');
    } else {
      console.error('❌ FAILED:', data.error || 'No error message');
      console.error('> Status:', response.status);
    }
  } catch (error) {
    console.error('🚨 NETWORK ERROR:', error.message);
    console.log('');
    console.log('🔧 Possible causes:');
    console.log('   • Server offline: Visit %s', API_BASE_URL);
    console.log('   • Wrong URL (check spelling)');
    console.log('   • API key revoked or invalid');
    console.log('   • Network firewall or timeout');
  }
}

// Run the test
sendTestEmail();
