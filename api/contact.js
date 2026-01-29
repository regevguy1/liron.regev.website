/**
 * Vercel Serverless Function - Contact Form Handler
 * Sends form submissions to Monday.com with tracking data
 */

// Monday.com Board Configuration
const BOARD_ID = '18397900958';
const COLUMN_IDS = {
    phone: 'phone_mm02wsp0',
    email: 'email_mm02pr2q',
    message: 'long_text_mm021vmw',
    ipAddress: 'text_mm02jeyj',
    location: 'text_mm02xq6k',
    userAgent: 'text_mm029ehw',
    referrer: 'text_mm02t2x3',
    utmSource: 'text_mm02byrq',
    utmMedium: 'text_mm02k300',
    utmCampaign: 'text_mm02drw6',
    pageUrl: 'text_mm0251d',
    submittedAt: 'date_mm02jwgy'
};

/**
 * Get location from IP address using ip-api.com (free, no API key needed)
 */
async function getLocationFromIP(ip) {
    try {
        // Skip for localhost/private IPs
        if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return 'Local/Private IP';
        }
        
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=city,country,regionName`);
        if (!response.ok) return 'Unknown';
        
        const data = await response.json();
        if (data.status === 'fail') return 'Unknown';
        
        return `${data.city || ''}, ${data.regionName || ''}, ${data.country || ''}`.replace(/^, |, $/g, '').replace(/, ,/g, ',');
    } catch (error) {
        console.error('IP lookup error:', error);
        return 'Unknown';
    }
}

/**
 * Create item in Monday.com board
 */
async function createMondayItem(itemName, columnValues) {
    const apiToken = process.env.MONDAY_API_TOKEN;
    
    if (!apiToken) {
        throw new Error('MONDAY_API_TOKEN environment variable not set');
    }
    
    const query = `
        mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
            create_item (
                board_id: $boardId,
                item_name: $itemName,
                column_values: $columnValues
            ) {
                id
            }
        }
    `;
    
    const variables = {
        boardId: BOARD_ID,
        itemName: itemName,
        columnValues: JSON.stringify(columnValues)
    };
    
    const response = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': apiToken,
            'API-Version': '2024-01'
        },
        body: JSON.stringify({ query, variables })
    });
    
    const result = await response.json();
    
    if (result.errors) {
        console.error('Monday.com API errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'Monday.com API error');
    }
    
    return result.data?.create_item?.id;
}

/**
 * Main handler
 */
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const {
            name,
            phone,
            email,
            message,
            userAgent,
            referrer,
            utmSource,
            utmMedium,
            utmCampaign,
            utmTerm,
            utmContent,
            pageUrl
        } = req.body;
        
        // Validate required fields
        if (!name || !phone) {
            return res.status(400).json({ error: 'Name and phone are required' });
        }
        
        // Get IP address from headers (Vercel provides this)
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'Unknown';
        
        // Get location from IP
        const location = await getLocationFromIP(ip);
        
        // Format date for Monday.com (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];
        
        // Build column values for Monday.com
        // Only include columns that have values to avoid Monday.com validation errors
        const columnValues = {
            [COLUMN_IDS.phone]: phone,
            [COLUMN_IDS.ipAddress]: ip || '',
            [COLUMN_IDS.location]: location || '',
            [COLUMN_IDS.userAgent]: (userAgent || '').substring(0, 500),
            [COLUMN_IDS.referrer]: referrer || '',
            [COLUMN_IDS.utmSource]: utmSource || '',
            [COLUMN_IDS.utmMedium]: utmMedium || '',
            [COLUMN_IDS.utmCampaign]: [utmCampaign, utmTerm, utmContent].filter(Boolean).join(' | ') || '',
            [COLUMN_IDS.pageUrl]: pageUrl || '',
            [COLUMN_IDS.submittedAt]: { date: today }
        };
        
        // Only add email if provided (empty email objects cause errors)
        if (email) {
            columnValues[COLUMN_IDS.email] = { email: email, text: email };
        }
        
        // Only add message if provided
        if (message) {
            columnValues[COLUMN_IDS.message] = { text: message };
        }
        
        // Create item in Monday.com
        const itemId = await createMondayItem(name, columnValues);
        
        console.log(`Lead created successfully: ${itemId}`);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Lead submitted successfully',
            itemId 
        });
        
    } catch (error) {
        console.error('Error processing form:', error);
        return res.status(500).json({ 
            error: 'Failed to submit form',
            details: error.message 
        });
    }
}
