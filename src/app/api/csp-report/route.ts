import { NextRequest, NextResponse } from 'next/server';

/**
 * Endpoint for CSP violation reports
 * This route handler receives Content Security Policy violation reports
 * and logs them for monitoring and analysis
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract CSP violation report from request body
    const report = await req.json();
    
    // Log the CSP violation (in production, you'd want to send this to a monitoring service)
    console.warn('CSP Violation:', {
      blockedURI: report['csp-report']?.['blocked-uri'],
      violatedDirective: report['csp-report']?.['violated-directive'],
      documentURI: report['csp-report']?.['document-uri'],
      referrer: report['csp-report']?.referrer,
      originalPolicy: report['csp-report']?.['original-policy'],
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return NextResponse.json({ error: 'Failed to process CSP report' }, { status: 400 });
  }
}
