"""
Generate a pristine, professional multi-page PDF documentation for:
E-Commerce D2C Sales OS (PRODUCT 01)
Clean layout, no broken fonts, perfectly aligned tables.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)

def build_pdf(filename="Ecommerce_D2C_Sales_OS_Documentation.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    primary_color = colors.HexColor("#0F172A")    # Slate 900
    accent_color = colors.HexColor("#2563EB")     # Blue 600
    accent_teal = colors.HexColor("#0D9488")      # Teal 600
    dark_gray = colors.HexColor("#334155")        # Slate 700
    light_bg = colors.HexColor("#F8FAFC")         # Slate 50
    border_color = colors.HexColor("#CBD5E1")     # Slate 300

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=primary_color,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=accent_color,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=accent_color,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=dark_gray,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=dark_gray,
        leftIndent=12,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1E293B")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        textColor=dark_gray
    )

    story = []

    # ==================== PAGE 1 ====================
    story.append(Paragraph("E-Commerce D2C Sales OS", title_style))
    story.append(Paragraph("PRODUCT 01 - System Architecture & Technical Build Documentation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=accent_color, spaceBefore=2, spaceAfter=8))

    story.append(Paragraph("1. Executive Overview & System Architecture", h1_style))
    story.append(Paragraph(
        "The <b>E-Commerce D2C Sales OS</b> is a production-grade multi-tenant operating system designed for direct-to-consumer "
        "enterprises. It couples an automated fraud/RTO risk engine, multilingual WhatsApp recovery workflows (English, Marathi, Hindi), "
        "real-time Tally ERP inventory synchronization, Razorpay signature verification, and Shiprocket automated fulfillment.",
        body_style
    ))

    tech_data = [
        [Paragraph("Tier", table_header_style), Paragraph("Stack / Tools", table_header_style), Paragraph("Functionality & Production Responsibilities", table_header_style)],
        [Paragraph("<b>Frontend</b>", table_cell_style), Paragraph("Next.js 15, Tailwind CSS, Lucide Icons, Axios", table_cell_style), Paragraph("Multi-tenant subdomain routing, operational dashboards, order and catalog tables", table_cell_style)],
        [Paragraph("<b>Backend</b>", table_cell_style), Paragraph("Node.js, Express, Mongoose, Multer, ExcelJS", table_cell_style), Paragraph("REST API microservices, multi-image upload processing, Year 2026 Audit Excel exports", table_cell_style)],
        [Paragraph("<b>Security</b>", table_cell_style), Paragraph("JWT, Bcrypt.js, HMAC-SHA256", table_cell_style), Paragraph("Stateless session authentication, password hashing, Razorpay payment verification", table_cell_style)],
        [Paragraph("<b>Automation</b>", table_cell_style), Paragraph("Node-cron, Meta WhatsApp Cloud API, Fast2SMS", table_cell_style), Paragraph("Cron schedule (0 8,15,20 * * *) executing [0, 1, 3] days recovery matrix", table_cell_style)],
        [Paragraph("<b>Integrations</b>", table_cell_style), Paragraph("Tally Connector, Shiprocket Logistics, Razorpay", table_cell_style), Paragraph("Real-time ERP stock updates, automated AWB generation, digital payment reconciliation", table_cell_style)],
    ]
    t_tech = Table(tech_data, colWidths=[80, 190, 270])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 8))

    story.append(Paragraph("2. Mongoose Schemas & Data Model Specifications", h1_style))
    model_data = [
        [Paragraph("Model", table_header_style), Paragraph("Attributes & Field Types", table_header_style), Paragraph("Constraints & Relationships", table_header_style)],
        [
            Paragraph("<b>Company</b>", table_cell_style),
            Paragraph("<code>_id, name, subdomain, ownerEmail, passwordHash, createdAt</code>", code_style),
            Paragraph("<code>subdomain</code> unique lowercase key; isolates all tenant data.", table_cell_style)
        ],
        [
            Paragraph("<b>Product</b>", table_cell_style),
            Paragraph("<code>_id, companyId, title, sku, price, gstPercent, stock, images, tallyItemId, status</code>", code_style),
            Paragraph("<code>sku</code> unique key; <code>companyId</code> ref Company; <code>images</code> up to 5 URLs.", table_cell_style)
        ],
        [
            Paragraph("<b>Order</b>", table_cell_style),
            Paragraph("<code>_id, companyId, customerName, phone, items: [{productId, qty, price}], total, gstTotal, paymentMode, paymentStatus, rtoScore, shiprocketAwb, status, createdAt</code>", code_style),
            Paragraph("paymentMode: COD/UPI/Razorpay; status: valid/packed/shipped/delivered/rto; rtoScore: 0-100.", table_cell_style)
        ],
        [
            Paragraph("<b>AbandonedCart</b>", table_cell_style),
            Paragraph("<code>companyId, phone, productId, cartValue, reminderDays, recovered, createdAt</code>", code_style),
            Paragraph("reminderDays: default [0, 1, 3]; tracks recovery status and cron execution.", table_cell_style)
        ],
        [
            Paragraph("<b>TallySync</b>", table_cell_style),
            Paragraph("<code>companyId, lastSyncAt, itemsSynced, status</code>", code_style),
            Paragraph("Stores ERP synchronization timestamps and updated stock records.", table_cell_style)
        ],
    ]
    t_models = Table(model_data, colWidths=[90, 270, 180])
    t_models.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_models)

    # ==================== PAGE 2 ====================
    story.append(PageBreak())
    story.append(Paragraph("3. Backend REST API Endpoints Specification", h1_style))

    api_data = [
        [Paragraph("Method & Route", table_header_style), Paragraph("Payload / Query Params", table_header_style), Paragraph("Logic & Execution Result", table_header_style)],
        [
            Paragraph("<code>POST /api/auth/register</code>", code_style),
            Paragraph("name, subdomain, ownerEmail, password", table_cell_style),
            Paragraph("Bcrypt hashes password, creates tenant Company, issues signed JWT token.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/auth/login</code>", code_style),
            Paragraph("subdomain, email, password", table_cell_style),
            Paragraph("Validates tenant credentials, verifies hash, returns JWT and companyId.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/products/create</code>", code_style),
            Paragraph("Bearer Auth, FormData (images max 5, title, sku, price, gstPercent, stock)", table_cell_style),
            Paragraph("Multer uploads to /uploads/, stores URLs in DB, computes tax profile.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/products/list</code>", code_style),
            Paragraph("?companyId=&status=", table_cell_style),
            Paragraph("Returns tenant catalog sorted by createdAt descending.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/orders/create</code>", code_style),
            Paragraph("companyId, customerName, phone, items, paymentMode", table_cell_style),
            Paragraph("Computes item subtotal + GST, executes RTO scoring algorithm, creates Order.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/orders/list</code>", code_style),
            Paragraph("?companyId=&status=", table_cell_style),
            Paragraph("Returns orders with populated product references (e.g. status=rto).", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/orders/stats</code>", code_style),
            Paragraph("?companyId=", table_cell_style),
            Paragraph("Returns total orders, rtoCount, deliveredCount, packedCount, shippedCount.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/orders/abandoned/check</code>", code_style),
            Paragraph("companyId, phone, productId, cartValue", table_cell_style),
            Paragraph("Logs pending customer cart with reminder schedule [0, 1, 3] days.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/orders/shiprocket/ship</code>", code_style),
            Paragraph("orderId", table_cell_style),
            Paragraph("Generates Shiprocket AWB track code, updates order status to 'shipped'.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/payment/verify</code>", code_style),
            Paragraph("razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId", table_cell_style),
            Paragraph("HMAC SHA256 signature verification; updates order paymentStatus to 'paid'.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/tally/sync</code>", code_style),
            Paragraph("companyId, tallyData [{sku, stock, price}]", table_cell_style),
            Paragraph("Syncs product inventory stock in bulk, records TallySync log entry.", table_cell_style)
        ],
        [
            Paragraph("<code>POST /api/whatsapp/abandoned</code>", code_style),
            Paragraph("abandonedCartId, language (English/Marathi/Hindi)", table_cell_style),
            Paragraph("Dispatches Meta WhatsApp Cloud API message with direct UPI payment link.", table_cell_style)
        ],
        [
            Paragraph("<code>GET /api/audit/export</code>", code_style),
            Paragraph("?companyId=&year=2026", table_cell_style),
            Paragraph("Streams native Excel (.xlsx) file with Title, SKU, Total, GST, Status.", table_cell_style)
        ],
    ]
    t_api = Table(api_data, colWidths=[140, 160, 240])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 10))

    story.append(Paragraph("4. Automated Cron Recovery & Multilingual Engine", h1_style))
    story.append(Paragraph(
        "<b>Cron Schedule:</b> <code>0 8,15,20 * * *</code> (Runs daily at 08:00 AM, 03:00 PM, and 08:00 PM).<br/>"
        "Calculates elapsed days: <code>diffDays = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000))</code>.<br/>"
        "Triggers WhatsApp + Fast2SMS notifications when <code>reminderDays.includes(diffDays)</code>:",
        body_style
    ))
    story.append(Paragraph("• <b>Day 0:</b> Immediate high-priority cart recovery message with direct UPI link.", bullet_style))
    story.append(Paragraph("• <b>Day 1:</b> 24-hour reminder offering quick checkout before item is released.", bullet_style))
    story.append(Paragraph("• <b>Day 3:</b> Final 72-hour scarcity notice before cart cancellation.", bullet_style))

    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Multilingual Messaging (English / Marathi / Hindi Translation Profiles):</b>", h2_style))
    
    msg_data = [
        [Paragraph("Language", table_header_style), Paragraph("Recovery Nudge Format & UPI Deep Link Structure", table_header_style)],
        [
            Paragraph("<b>English</b>", table_cell_style),
            Paragraph("Hello! You left {Item} in your cart. Complete purchase for Rs.{Amount}: upi://pay?pa=merchant@upi&pn=Store&am={Amount}&cu=INR&tn=CompleteCart", table_cell_style)
        ],
        [
            Paragraph("<b>Marathi</b>", table_cell_style),
            Paragraph("Namaskar! Tumchya cart madhil {Item} ajunhi baki ahe. Fakt Rs.{Amount} madhe kharedi purna kara: upi://pay?pa=merchant@upi...", table_cell_style)
        ],
        [
            Paragraph("<b>Hindi</b>", table_cell_style),
            Paragraph("Namaste! Aapke cart me {Item} abhi bhi baki hai. Keval Rs.{Amount} me apni kharidari poori karein: upi://pay?pa=merchant@upi...", table_cell_style)
        ],
    ]
    t_msg = Table(msg_data, colWidths=[90, 450])
    t_msg.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_msg)

    # ==================== PAGE 3 ====================
    story.append(PageBreak())
    story.append(Paragraph("5. Frontend Next.js Architecture & Views", h1_style))
    story.append(Paragraph(
        "The frontend is organized under the Next.js App Router with responsive Tailwind CSS components, "
        "real-time data fetching through a unified <code>lib/api.js</code> client, and persistent token/tenant caching.",
        body_style
    ))

    fe_data = [
        [Paragraph("Route / Page", table_header_style), Paragraph("UI Components & Interactive Features", table_header_style)],
        [
            Paragraph("<code>/login</code>", code_style),
            Paragraph("Subdomain, email, and password authentication. Direct link to register tenant, automatic JWT cookie/localStorage sync.", table_cell_style)
        ],
        [
            Paragraph("<code>/dashboard</code>", code_style),
            Paragraph("Summary metric cards: Total Products, Total Orders, Abandoned Count, RTO Risk Percentage. Filtered table of high-risk RTO orders with action items.", table_cell_style)
        ],
        [
            Paragraph("<code>/products</code>", code_style),
            Paragraph("Product creation form (Title, SKU, Price, GST %, Stock, Multi-file upload) with immediate live gallery and active catalog table.", table_cell_style)
        ],
        [
            Paragraph("<code>/orders</code>", code_style),
            Paragraph("Full orders management table (Phone, Total, Payment Mode, Status, RTO Score). 1-click 'Mark Shipped' via Shiprocket and 'Send Invoice WhatsApp' buttons.", table_cell_style)
        ],
        [
            Paragraph("<code>/abandoned</code>", code_style),
            Paragraph("Live AbandonedCart monitor table with recovery status pill and immediate 'Send WhatsApp Now' recovery dispatch trigger.", table_cell_style)
        ],
        [
            Paragraph("<code>/tally</code>", code_style),
            Paragraph("ERP sync status, live item count sync trigger, and historical Tally audit log viewer.", table_cell_style)
        ],
        [
            Paragraph("<code>/settings</code>", code_style),
            Paragraph("Notification toggles (WhatsApp, SMS, UPI AutoPay), language selector (English/Marathi/Hindi), Razorpay/Shiprocket credential inputs, and 'Test Alert' trigger.", table_cell_style)
        ],
    ]
    t_fe = Table(fe_data, colWidths=[100, 440])
    t_fe.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_fe)
    story.append(Spacer(1, 10))

    story.append(Paragraph("6. Run & Done Verification Checklist", h1_style))
    checklist_items = [
        ("Company register/login with subdomain works", "Verified via /api/auth/register and /api/auth/login"),
        ("Product upload with GST calculated works", "Verified with Multer multi-file upload and automated 18%/12% tax calc"),
        ("Product list filtered by companyId works", "Verified via /api/products/list?companyId={id}"),
        ("Dashboard cards correct", "Total Products, Total Orders, Abandoned Count, RTO % computed from DB"),
        ("Order create with RTO score works", "Heuristic fraud engine scores COD and customer parameters (0-100)"),
        ("Abandoned cron sends WhatsApp image + UPI at 0,1,3 days", "Configured in cron.js running at 0 8,15,20 * * * with UPI deep links"),
        ("Tally sync updates stock", "POST /api/tally/sync successfully updates catalog stock numbers and logs event"),
        ("Razorpay verify updates paid", "HMAC-SHA256 signature verification updates order status to 'paid'"),
        ("Excel export downloads", "GET /api/audit/export?year=2026 delivers styled .xlsx with Title, SKU, Total, GST, Status"),
        ("WhatsApp Marathi/Hindi toggle works", "Multilingual localized translations generated and delivered dynamically")
    ]

    check_data = [[Paragraph("Requirement Checklist Item", table_header_style), Paragraph("Implementation Verification Status", table_header_style)]]
    for req, status in checklist_items:
        check_data.append([
            Paragraph(f"✓ <b>{req}</b>", table_cell_style),
            Paragraph(status, table_cell_style)
        ])

    t_check = Table(check_data, colWidths=[240, 300])
    t_check.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), accent_teal),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, light_bg]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_check)

    doc.build(story)
    print(f"[PDF Generated] Successfully saved to {filename}")

if __name__ == '__main__':
    build_pdf()
