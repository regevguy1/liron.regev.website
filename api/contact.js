/**
 * Vercel Serverless Function - Contact Form Handler
 * Sends form submissions to Monday.com with tracking data
 * Sends email notifications via Resend
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
 * Send email notification via Resend
 * @param {Object} leadData - The lead information
 */
async function sendEmailNotification(leadData) {
    const apiKey = process.env.RESEND_API_KEY;
    const recipients = process.env.EMAIL_RECIPIENTS; // Comma-separated emails
    
    if (!apiKey || !recipients) {
        console.log('Email notifications not configured - skipping');
        return;
    }
    
    const recipientList = recipients.split(',').map(e => e.trim()).filter(Boolean);
    
    if (recipientList.length === 0) {
        console.log('No email recipients configured - skipping');
        return;
    }
    
    // Format current time in Israel timezone
    const now = new Date().toLocaleString('he-IL', { 
        timeZone: 'Asia/Jerusalem',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Build HTML email content
    const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="he">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .field { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-right: 4px solid #667eea; }
            .field-label { font-size: 12px; color: #666; margin-bottom: 5px; font-weight: bold; }
            .field-value { font-size: 16px; color: #333; }
            .cta { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; }
            .phone-link { color: #667eea; text-decoration: none; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 ליד חדש התקבל!</h1>
                <p>מישהו מעוניין בשירותים שלך</p>
            </div>
            <div class="content">
                <div class="field">
                    <div class="field-label">👤 שם</div>
                    <div class="field-value">${leadData.name}</div>
                </div>
                <div class="field">
                    <div class="field-label">📱 טלפון</div>
                    <div class="field-value">
                        <a href="tel:${leadData.phone}" class="phone-link">${leadData.phone}</a>
                    </div>
                </div>
                ${leadData.email ? `
                <div class="field">
                    <div class="field-label">📧 אימייל</div>
                    <div class="field-value">${leadData.email}</div>
                </div>
                ` : ''}
                ${leadData.message ? `
                <div class="field">
                    <div class="field-label">💬 הודעה</div>
                    <div class="field-value">${leadData.message}</div>
                </div>
                ` : ''}
                <div class="field">
                    <div class="field-label">📍 מיקום</div>
                    <div class="field-value">${leadData.location || 'לא זמין'}</div>
                </div>
                <div class="field">
                    <div class="field-label">🕐 זמן קבלה</div>
                    <div class="field-value">${now}</div>
                </div>
                ${leadData.pageUrl ? `
                <div class="field">
                    <div class="field-label">🔗 דף מקור</div>
                    <div class="field-value">${leadData.pageUrl}</div>
                </div>
                ` : ''}
                <center>
                    <a href="tel:${leadData.phone}" class="cta">📞 התקשר עכשיו</a>
                </center>
            </div>
            <div class="footer">
                ⚡ פעולה נדרשת: יש ליצור קשר בהקדם האפשרי!
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'לידים חדשים <leads@lironregev.com>',
                to: recipientList,
                subject: `🎉 ליד חדש: ${leadData.name} - ${leadData.phone}`,
                html: htmlContent
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Email send failed:', error);
            return { success: false, error };
        }

        const result = await response.json();
        console.log('Email sent successfully:', result.id);
        return { success: true, id: result.id };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
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
        
        // Sanitize phone number - remove all non-digit characters (hyphens, spaces, etc.)
        const sanitizedPhone = phone.replace(/\D/g, '');
        
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
            [COLUMN_IDS.phone]: sanitizedPhone,
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
        
        // Send email notification (don't block response, don't fail if email fails)
        sendEmailNotification({
            name,
            phone: sanitizedPhone,
            email,
            message,
            location,
            pageUrl
        }).catch(err => console.error('Email notification error:', err));
        
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
