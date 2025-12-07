"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

export default function PrintQuotationPage() {
    const searchParams = useSearchParams()
    const [quotation, setQuotation] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    const id = searchParams.get('id')

    React.useEffect(() => {
        if (!id) return
        fetch(`/api/sales/quotations/${id}`)
            .then(res => res.json())
            .then(data => {
                setQuotation(data.data)
                setLoading(false)
                // Auto print after load
                setTimeout(() => window.print(), 500)
            })
            .catch(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        )
    }

    if (!quotation) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                Quotation not found
            </div>
        )
    }

    // Parse line items
    let lineItems: any[] = []
    try {
        lineItems = JSON.parse(quotation.lineItems || '[]')
    } catch { lineItems = [] }

    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    })

    const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0)

    return (
        <>
            <style>{`
                @media print {
                    @page { 
                        size: A4 portrait; 
                        margin: 15mm; 
                    }
                    * { 
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                    }
                    nav, header, aside, [data-sidebar], .sidebar, 
                    [role="navigation"], .no-print, button, footer { 
                        display: none !important; 
                        visibility: hidden !important;
                    }
                    .print-container {
                        width: 100% !important;
                        max-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                    }
                }
                @media screen {
                    .print-container {
                        max-width: 210mm;
                        margin: 20px auto;
                        box-shadow: 0 4px 24px rgba(0,0,0,0.1);
                    }
                    body { background: #f5f5f5; }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="print-container" style={{
                backgroundColor: '#fff',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                color: '#1a1a1a'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: '#fff',
                    padding: '32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>AUTOFLOW</h1>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#94a3b8' }}>Premium Automotive Solutions</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Quotation</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }}>{quotation.number}</div>
                    </div>
                </div>

                {/* Info Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div style={{ padding: '16px', borderRight: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Date</div>
                        <div style={{ fontWeight: '500' }}>{today}</div>
                    </div>
                    <div style={{ padding: '16px', borderRight: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Valid Until</div>
                        <div style={{ fontWeight: '500' }}>{quotation.validUntil || '7 Days'}</div>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Status</div>
                        <div style={{ fontWeight: '600', color: '#059669' }}>{quotation.status}</div>
                    </div>
                </div>

                {/* Customer & Vehicle */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '32px',
                    padding: '32px',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Bill To</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{quotation.customer}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Valued Customer</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Vehicle</div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{quotation.vehicle}</div>
                        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>New Vehicle</div>
                    </div>
                </div>

                {/* Line Items */}
                <div style={{ padding: '32px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '16px' }}>
                        Price Breakdown
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #1f2937' }}>
                                <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280' }}>Description</th>
                                <th style={{ padding: '12px 0', textAlign: 'right', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#6b7280' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItems.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '14px 0', fontSize: '14px' }}>{item.description}</td>
                                    <td style={{
                                        padding: '14px 0',
                                        textAlign: 'right',
                                        fontFamily: 'monospace',
                                        fontSize: '14px',
                                        color: item.amount < 0 ? '#dc2626' : '#1a1a1a'
                                    }}>
                                        {item.amount < 0 ? '- ' : ''}₹{Math.abs(item.amount).toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Total */}
                    <div style={{
                        marginTop: '24px',
                        padding: '20px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>On-Road Price</span>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                            ₹{total.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* Terms */}
                <div style={{ padding: '0 32px 32px' }}>
                    <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        padding: '20px'
                    }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', marginBottom: '12px' }}>
                            Terms & Conditions
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
                            <li>This quotation is valid for 7 days from the date of issue.</li>
                            <li>Prices are subject to change without prior notice.</li>
                            <li>Actual colors may vary from display.</li>
                            <li>Vehicle delivery subject to availability.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    background: '#1e293b',
                    color: '#fff',
                    padding: '20px 32px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '13px'
                }}>
                    <div>
                        <div style={{ fontWeight: '600' }}>AutoFlow Premium Motors</div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>123 Auto Street, Business Bay, Mumbai 400001</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>Helpline</div>
                        <div style={{ fontWeight: '500' }}>+91 98765 43210</div>
                    </div>
                </div>

                {/* Signature Area */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '64px',
                    padding: '48px 32px 32px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <div>
                        <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '8px', marginTop: '60px' }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>Customer Signature</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '8px', marginTop: '60px' }}>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>Authorized Signature</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Button - Hidden on Print */}
            <div className="no-print" style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px'
            }}>
                <button
                    onClick={() => window.print()}
                    style={{
                        padding: '12px 32px',
                        backgroundColor: '#1e293b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    🖨️ Print Quotation
                </button>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        padding: '12px 32px',
                        backgroundColor: '#fff',
                        color: '#1e293b',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    ← Go Back
                </button>
            </div>
        </>
    )
}
