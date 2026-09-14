import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, zoneId, productId } = body;

        // ត្រួតពិនិត្យទិន្នន័យដែលអតិថិជនបានបញ្ចូល
        if (!userId || !zoneId || !productId) {
            return NextResponse.json(
                { success: false, message: 'សូមបញ្ចូលទិន្នន័យឱ្យបានគ្រប់គ្រាន់!' },
                { status: 400 }
            );
        }

        // ព័ត៌មានសម្ងាត់ (ទាញយកពី Environment Variables របស់ Vercel ផ្ទាល់ ដើម្បីសុវត្ថិភាព)
        const apiKey = process.env.PROVIDER_API_KEY || 'YOUR_API_KEY_FROM_PROVIDER';
        const apiEndpoint = process.env.PROVIDER_API_ENDPOINT || 'https://api.provider-example.com/v1/topup';

        // ផ្ើសំណើទៅកាន់ Server របស់ក្រុមហ៊ុនផ្គត់ផ្គង់ពេជ្រ (API Provider)
        const apiResponse = await axios.post(apiEndpoint, {
            user_id: userId,
            zone_id: zoneId,
            product_code: productId,
            key: apiKey
        });

        // ពិនិត្យមើលលទ្ធផលពី Provider
        if (apiResponse.data.status === 'success') {
            return NextResponse.json({ 
                success: true, 
                message: 'បញ្ចូលពេជ្រជូនអតិថិជនបានដោយជោគជ័យ!',
                data: apiResponse.data 
            });
        } else {
            return NextResponse.json(
                { 
                    success: false, 
                    message: 'ការបញ្ចូលពេជ្របរាជ័យពីប្រព័ន្ធ Provider',
                    error: apiResponse.data 
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Topup API Error:', error);
        return NextResponse.json(
            { success: false, message: 'មានបញ្ហាក្នុងប្រព័ន្ធ Server ខាងក្នុង!' },
            { status: 500 }
        );
    }
}
