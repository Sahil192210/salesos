"""
Generate the Definitive Exhaustive Feature Reference Manual:
E-Commerce D2C Sales OS (PRODUCT 01)
Explaining EACH AND EVERY FEATURE from both Frontend and Backend with granular details.
Using standard ASCII for dialect names to guarantee crisp cross-platform rendering.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)

def build_definitive_feature_manual(filename="Ecommerce_D2C_Sales_OS_Full_Feature_Reference.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=32,
        leftMargin=32,
        topMargin=32,
        bottomMargin=32
    )

    styles = getSampleStyleSheet()
    
    c_primary = colors.HexColor("#0F172A")    # Slate 900
    c_blue = colors.HexColor("#2563EB")       # Blue 600
    c_teal = colors.HexColor("#0D9488")       # Teal 600
    c_rose = colors.HexColor("#E11D48")       # Rose 600
    c_text = colors.HexColor("#334155")       # Slate 700
    c_bg_light = colors.HexColor("#F8FAFC")   # Slate 50
    c_border = colors.HexColor("#CBD5E1")     # Slate 300

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=c_blue,
        spaceAfter=8
    )

    part_style = ParagraphStyle(
        'PartHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.white,
        spaceBefore=0,
        spaceAfter=0
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=c_primary,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=c_text,
        spaceAfter=3.5
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9.5,
        textColor=c_primary
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9.5,
        textColor=c_text
    )

    def banner(text, color):
        t = Table([[Paragraph(f"<b>{text}</b>", part_style)]], colWidths=[548])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), color),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    story = []

    # ==================== PAGE 1: TITLE & BACKEND CORE FEATURES ====================
    story.append(Paragraph("E-Commerce D2C Sales OS", title_style))
    story.append(Paragraph("Exhaustive Feature-by-Feature Reference: Frontend Views & Backend Architecture", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceBefore=2, spaceAfter=8))

    story.append(banner("PART 1: BACKEND FEATURES & INTERNAL ENGINES", c_primary))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Feature B-01: Multi-Tenant Subdomain Authentication & Security (routes/auth.js)", h1_style))
    story.append(Paragraph(
        "• <b>Tenant Company Registration (POST /api/auth/register):</b> Accepts <code>name</code>, <code>subdomain</code>, <code>ownerEmail</code>, and <code>password</code>. The system sanitizes the subdomain into lowercase alphanumeric characters, verifies no collisions exist in MongoDB, generates a cryptographic salt (10 rounds via bcryptjs), and hashes the password. Once saved, it signs an asynchronous JWT token containing <code>{ companyId, subdomain, email }</code> with a 7-day expiry.<br/>"
        "• <b>Subdomain-Isolated Login (POST /api/auth/login):</b> Validates tenant credentials by scoping queries to both <code>subdomain</code> and <code>email</code>. Verifies bcrypt hashes and returns the signed JWT token. This ensures total zero-trust tenant isolation across stores.",
        body_style
    ))

    story.append(Paragraph("Feature B-02: Product Catalog & Tax Computation Engine (routes/products.js)", h1_style))
    story.append(Paragraph(
        "• <b>Multi-File Multer Upload (POST /api/products/create):</b> Enforces <code>authMiddleware</code> (extracts and verifies Bearer token). Configured with disk storage writing to <code>/uploads/</code> with unique timestamp hashing. Accepts up to 5 image uploads simultaneously.<br/>"
        "• <b>Automated GST Profile Mapping:</b> Stores base price, stock count, and GST bracket (0%, 5%, 12%, 18%, 28%). Computes dynamic retail value: <code>retailPrice = price * (1 + gstPercent / 100)</code>.<br/>"
        "• <b>Tenant Catalog Query (GET /api/products/list):</b> Accepts query filters <code>companyId</code> and <code>status</code>. Returns products sorted by <code>createdAt: -1</code> (newest arrivals first).",
        body_style
    ))

    story.append(Paragraph("Feature B-03: Algorithmic Order Management & RTO Risk Engine (routes/orders.js)", h1_style))
    story.append(Paragraph(
        "• <b>Automated Tax & Subtotal Breakdown:</b> When an order is placed via <code>POST /api/orders/create</code>, the backend iterates over line items, retrieves each product's base price and GST percentage, computes total tax and gross payable, and writes normalized sub-records.<br/>"
        "• <b>Heuristic Fraud Evaluation Algorithm (calculateRtoScore):</b> Evaluates fraud probability on a 0-100 scale:<br/>"
        "&nbsp;&nbsp;1. <i>Baseline Confidence (+15):</i> Initial score assigned to all transactions.<br/>"
        "&nbsp;&nbsp;2. <i>Payment Mode Weighting:</i> COD (+45) due to high refusal rates in Indian e-commerce vs UPI/Razorpay (+2 to +5).<br/>"
        "&nbsp;&nbsp;3. <i>High-Value COD Threshold:</i> If payment is COD and cart value exceeds Rs. 2,000, adds +25 points.<br/>"
        "&nbsp;&nbsp;4. <i>Repetitive Digit Pattern:</i> Regular expression test <code>/^(\\d)\\1{9}$/</code> checks for fake numbers (e.g. 9111111111), adding +30 points.<br/>"
        "&nbsp;&nbsp;5. <i>Automated Status Quarantining:</i> Orders with RTO score > 75 are automatically assigned <code>status = 'rto'</code> for merchant review.<br/>"
        "• <b>Analytics & Stats Engine (GET /api/orders/stats):</b> Aggregates counts for total orders, RTO flagged orders, delivered shipments, and active fulfillments.",
        body_style
    ))

    story.append(Paragraph("Feature B-04: Automated Shiprocket Logistics Dispatch (routes/orders.js)", h1_style))
    story.append(Paragraph(
        "• <b>Shipment Manifesting (POST /api/orders/shiprocket/ship):</b> Accepts <code>orderId</code>. Integrates with Shiprocket Logistics services to generate a unique Air Waybill (AWB) tracking number (e.g. <code>SR839201948</code>) and transitions order status from <code>valid</code> to <code>shipped</code>.",
        body_style
    ))

    # ==================== PAGE 2: BACKEND CONT. & FRONTEND CORE ====================
    story.append(PageBreak())

    story.append(Paragraph("Feature B-05: Abandoned Cart Recovery & Cron Daemon (cron.js & routes/orders.js)", h1_style))
    story.append(Paragraph(
        "• <b>Cart Drop-off Logger (POST /api/orders/abandoned/check):</b> Records uncompleted checkout sessions with customer phone, target product reference, and cart value with recovery schedule <code>reminderDays: [0, 1, 3]</code>.<br/>"
        "• <b>Daily Background Cron Daemon (node-cron):</b> Scheduled at <code>0 8,15,20 * * *</code> (daily at 8:00 AM, 3:00 PM, and 8:00 PM).<br/>"
        "&nbsp;&nbsp;1. Fetches all unrecovered carts where <code>recovered === false</code>.<br/>"
        "&nbsp;&nbsp;2. Calculates elapsed time in days: <code>diffDays = Math.floor((now - createdAt) / (24 * 60 * 60 * 1000))</code>.<br/>"
        "&nbsp;&nbsp;3. If <code>reminderDays.includes(diffDays)</code>, automatically triggers recovery dispatches across WhatsApp and Fast2SMS.",
        body_style
    ))

    story.append(Paragraph("Feature B-06: Multilingual WhatsApp & UPI Deep Linking Engine (routes/whatsapp.js)", h1_style))
    story.append(Paragraph(
        "• <b>Meta WhatsApp Cloud API Integration (POST /api/whatsapp/abandoned):</b> Dispatches WhatsApp messages to customers with instant 1-tap UPI payment deep links (<code>upi://pay?pa=merchant@upi&pn=D2CStore&am={amount}&cu=INR&tn=CompleteCart_{id}</code>).<br/>"
        "• <b>Dynamic Localization Engine:</b> Interpolates product title and payable amount into three dialect profiles: English, Marathi (Regional), and Hindi (National).<br/>"
        "• <b>Automated WhatsApp Invoice Generator (POST /api/whatsapp/invoice):</b> Sends order confirmation receipts and tracking summaries to customer phones.",
        body_style
    ))

    story.append(Paragraph("Feature B-07: Tally ERP Bi-Directional Inventory Synchronization (routes/tally.js)", h1_style))
    story.append(Paragraph(
        "• <b>Bulk Stock Synchronizer (POST /api/tally/sync):</b> Accepts inventory data arrays mapping SKUs or <code>tallyItemId</code> to live warehouse stock numbers and prices. Atomically updates the Product catalog.<br/>"
        "• <b>Audit Trail Logger (GET /api/tally/logs):</b> Records each synchronization event in the <code>TallySync</code> collection with timestamps, item counts, and status.",
        body_style
    ))

    story.append(Paragraph("Feature B-08: Razorpay HMAC-SHA256 Payment Verification (routes/payment.js)", h1_style))
    story.append(Paragraph(
        "• <b>Cryptographic Payment Reconciliation (POST /api/payment/verify):</b> Computes HMAC-SHA256 signature over <code>razorpay_order_id + '|' + razorpay_payment_id</code> using <code>RAZORPAY_SECRET</code>. Verifies signature authenticity and updates order status to <code>paid</code>.",
        body_style
    ))

    story.append(Paragraph("Feature B-09: Financial Audit & Year 2026 Excel Export Generator (routes/audit.js)", h1_style))
    story.append(Paragraph(
        "• <b>Native Excel Streaming (GET /api/audit/export?year=2026):</b> Uses <code>exceljs</code> to construct and stream a styled <code>.xlsx</code> workbook with custom headers and borders, detailing <code>Title</code>, <code>SKU</code>, <code>Total</code>, <code>GST</code>, and <code>Status</code> for compliance and tax filings.",
        body_style
    ))

    story.append(Spacer(1, 6))
    story.append(banner("PART 2: FRONTEND NEXT.JS VIEWS & USER EXPERIENCE", c_teal))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Feature F-01: Multi-Tenant Login & Brand Onboarding (/login)", h1_style))
    story.append(Paragraph(
        "• <b>Interactive Mode Toggle:</b> Switch between 'Sign In' and 'Register New Tenant Store' with real-time field transitions.<br/>"
        "• <b>Subdomain Validator:</b> Automatically formats brand subdomains into valid domain handles with live <code>.d2cos.com</code> suffix indicator.<br/>"
        "• <b>Session Hydration:</b> Saves JWT token, companyId, and brand name into browser storage and seamlessly redirects to the Dashboard.",
        body_style
    ))

    story.append(Paragraph("Feature F-02: Analytics Dashboard & RTO Fraud Control Screen (/dashboard)", h1_style))
    story.append(Paragraph(
        "• <b>Live Metric Cards:</b> Displays Total Products in catalog, Total Orders with delivered breakdown, Abandoned Carts in recovery, and RTO Risk Percentage.<br/>"
        "• <b>RTO High-Risk Quarantine Table:</b> Directly queries <code>/orders/list?status=rto</code> to display suspicious orders with color-coded risk bars (0-100) and customer contact numbers.<br/>"
        "• <b>One-Click 2026 Audit Export Button:</b> Direct trigger that invokes the backend Excel generator and downloads <code>Audit_Export_2026.xlsx</code>.",
        body_style
    ))

    # ==================== PAGE 3: FRONTEND CONT. & MASTER TABLE ====================
    story.append(PageBreak())

    story.append(Paragraph("Feature F-03: Catalog & Multi-Image Product Management (/products)", h1_style))
    story.append(Paragraph(
        "• <b>Product Upload Form:</b> Form inputs for Title, unique SKU, Base Price (Rs.), GST selection dropdown (0%, 5%, 12%, 18%, 28%), and Stock Quantity.<br/>"
        "• <b>Multer Multi-Image Uploader:</b> Supports selecting up to 5 image files simultaneously with preview counts.<br/>"
        "• <b>Live Catalog Gallery Table:</b> Displays active products with square image thumbnails, SKU tags, base price, tax rate, computed retail price with GST, and low-stock indicators.",
        body_style
    ))

    story.append(Paragraph("Feature F-04: Order Operations & Shiprocket Fulfillment View (/orders)", h1_style))
    story.append(Paragraph(
        "• <b>Comprehensive Order Table:</b> Displays Order ID, creation date, customer name, phone number, line items, total with GST breakdown, and payment mode.<br/>"
        "• <b>One-Click 'Mark Shipped' Action:</b> Directly triggers Shiprocket AWB generation and displays the live tracking number on screen.<br/>"
        "• <b>One-Click 'Send Invoice WhatsApp' Action:</b> Dispatches instant order receipts to customer WhatsApp numbers.<br/>"
        "• <b>Interactive Order Simulator Modal:</b> Allows operators to test orders with custom names, phones, products, and payment modes (COD vs UPI) to verify RTO scoring in real time.",
        body_style
    ))

    story.append(Paragraph("Feature F-05: Abandoned Cart Recovery Control Center (/abandoned)", h1_style))
    story.append(Paragraph(
        "• <b>Dropped Cart Monitor:</b> Shows customers who abandoned checkout, the items they left behind, and the total cart value.<br/>"
        "• <b>Language Selector Bar:</b> Allows store operators to preview and dispatch recovery messages in English, Marathi, or Hindi.<br/>"
        "• <b>Instant 'Send WhatsApp Now' Trigger:</b> Manually fires the WhatsApp recovery API with live message previews and 1-tap UPI deep links.<br/>"
        "• <b>Cart Drop-off Simulator:</b> Lets operators simulate cart abandonments with custom phone numbers and amounts.",
        body_style
    ))

    story.append(Paragraph("Feature F-06: Tally ERP Warehouse Synchronization Screen (/tally)", h1_style))
    story.append(Paragraph(
        "• <b>ERP Connector Status Card:</b> Displays real-time connection health, last sync timestamp, and total items updated.<br/>"
        "• <b>'Trigger Tally Sync Now' Button:</b> Initiates an immediate ledger synchronization with physical warehouse stock.<br/>"
        "• <b>Historical Audit Log Table:</b> Displays past sync records with sync ID, timestamp, updated item count, and success status.",
        body_style
    ))

    story.append(Paragraph("Feature F-07: Global System & Integration Settings (/settings)", h1_style))
    story.append(Paragraph(
        "• <b>Automated Gateway Toggles:</b> Interactive switches to enable/disable WhatsApp Recovery, SMS Notifications (Fast2SMS), and UPI AutoPay Mandates.<br/>"
        "• <b>Store Language Preference Selector:</b> Select default store language between English, Marathi, and Hindi.<br/>"
        "• <b>Gateway Credentials Form:</b> Manage Razorpay Key ID, Shiprocket Email, and Shiprocket Password.<br/>"
        "• <b>'Test Alert' Simulator:</b> Triggers a simulated notification cycle across active channels.",
        body_style
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("Feature B-10 & F-08: Complete Cross-Reference Feature Matrix", h1_style))

    matrix_data = [
        [Paragraph("Feature Component", table_header), Paragraph("Layer", table_header), Paragraph("Endpoint / Path", table_header), Paragraph("Key Capability", table_header)],
        [Paragraph("Tenant Authentication", table_cell), Paragraph("Backend", table_cell), Paragraph("<code>POST /api/auth/register, /login</code>", code_style), Paragraph("Bcrypt hash, subdomain isolation, signed JWT tokens", table_cell)],
        [Paragraph("Product Tax Management", table_cell), Paragraph("Full-Stack", table_cell), Paragraph("<code>/products & /api/products/create</code>", code_style), Paragraph("Multer 5-file upload, 0-28% GST calc, catalog gallery", table_cell)],
        [Paragraph("RTO Fraud Scoring", table_cell), Paragraph("Backend", table_cell), Paragraph("<code>POST /api/orders/create</code>", code_style), Paragraph("Algorithmic COD, cart value, and phone pattern scoring", table_cell)],
        [Paragraph("Logistics Fulfillment", table_cell), Paragraph("Full-Stack", table_cell), Paragraph("<code>/orders & /api/orders/shiprocket/ship</code>", code_style), Paragraph("Shiprocket AWB tracking generation & status updates", table_cell)],
        [Paragraph("Abandoned Recovery", table_cell), Paragraph("Full-Stack", table_cell), Paragraph("<code>/abandoned & /api/whatsapp/abandoned</code>", code_style), Paragraph("0,1,3 day cron, 1-tap UPI deep links, WhatsApp Cloud API", table_cell)],
        [Paragraph("Multilingual Messages", table_cell), Paragraph("Full-Stack", table_cell), Paragraph("<code>/settings & routes/whatsapp.js</code>", code_style), Paragraph("English, Marathi, and Hindi translation templates", table_cell)],
        [Paragraph("Tally ERP Stock Sync", table_cell), Paragraph("Full-Stack", table_cell), Paragraph("<code>/tally & /api/tally/sync</code>", code_style), Paragraph("Bi-directional stock ledger sync and TallySync audit log", table_cell)],
        [Paragraph("Year 2026 Audit Export", table_cell), Paragraph("Full-Stack", table_cell), Paragraph("<code>/dashboard & /api/audit/export</code>", code_style), Paragraph("Native ExcelJS .xlsx export with Title, SKU, Total, GST", table_cell)],
        [Paragraph("Payment Reconciliation", table_cell), Paragraph("Backend", table_cell), Paragraph("<code>POST /api/payment/verify</code>", code_style), Paragraph("Razorpay HMAC-SHA256 signature verification to paid", table_cell)],
    ]
    t_mat = Table(matrix_data, colWidths=[105, 55, 175, 213])
    t_mat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_mat)

    doc.build(story)
    print(f"[Definitive Feature Reference Manual Generated] Successfully saved to {filename}")

if __name__ == '__main__':
    build_definitive_feature_manual()
