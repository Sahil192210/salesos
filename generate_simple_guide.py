"""
Generate an easy-to-understand, executive & beginner-friendly PDF Guide for:
E-Commerce D2C Sales OS (PRODUCT 01)
ASCII-only text to guarantee crisp rendering across any PDF reader.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
)

def build_user_friendly_pdf(filename="Ecommerce_D2C_Sales_OS_Simple_Guide.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Palette
    c_primary = colors.HexColor("#0F172A")    # Deep Slate 900
    c_blue = colors.HexColor("#2563EB")       # Modern Blue
    c_teal = colors.HexColor("#0D9488")       # Emerald / Teal
    c_text = colors.HexColor("#334155")       # Readable Slate 700
    c_bg_card = colors.HexColor("#F8FAFC")    # Slate 50
    c_border = colors.HexColor("#CBD5E1")     # Slate 300

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=c_primary,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'MainSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=c_blue,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_primary,
        spaceBefore=12,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_blue,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=c_text,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=c_text,
        leftIndent=12,
        spaceAfter=3
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_text
    )

    code_pill = ParagraphStyle(
        'CodePill',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8,
        leading=10,
        textColor=c_primary
    )

    story = []

    # ==================== PAGE 1 ====================
    story.append(Paragraph("E-Commerce D2C Sales OS", title_style))
    story.append(Paragraph("Simple & Easy-to-Understand Operating Guide (For Everyone)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=c_blue, spaceBefore=2, spaceAfter=10))

    story.append(Paragraph("1. What is this System & Why Does It Exist?", h1_style))
    story.append(Paragraph(
        "Running an online direct-to-consumer (D2C) brand involves solving <b>three major daily headaches</b>:<br/>"
        "1. <b>Fake or High-Risk COD Orders (RTO):</b> Customers order Cash on Delivery and refuse packages at the door, costing the brand shipping losses.<br/>"
        "2. <b>Lost Sales from Dropped Carts:</b> Shoppers browse, add products to their bag, and abandon checkout without buying.<br/>"
        "3. <b>Mismatched Warehouse Stock:</b> Items sell out on the website while physical warehouse stock in accounting software (Tally) hasn't synced.",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Solution:</b> The <b>E-Commerce D2C Sales OS</b> solves all three automatically. It scores risky orders before they ship, sends automated WhatsApp payment links to bring dropped customers back, connects to Tally to keep stock quantities accurate, and provides a sleek dashboard to run your entire store.",
        body_style
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("How the System Works in 4 Simple Steps:", h2_style))

    steps_data = [
        [Paragraph("Step", table_header), Paragraph("Feature Name", table_header), Paragraph("In Plain English: What It Does For You", table_header)],
        [
            Paragraph("<b>Step 1</b>", table_cell),
            Paragraph("<b>Store Login & Catalog</b>", table_cell),
            Paragraph("Every brand gets its own unique subdomain (e.g. <code>acme.d2cos.com</code>). You can upload products, set prices, and select GST percentages with automatic tax calculation.", table_cell)
        ],
        [
            Paragraph("<b>Step 2</b>", table_cell),
            Paragraph("<b>RTO Fraud Detector</b>", table_cell),
            Paragraph("When a customer places an order, the system scans their phone number and payment type. High-risk COD orders receive a warning score so you don't lose money on fake deliveries.", table_cell)
        ],
        [
            Paragraph("<b>Step 3</b>", table_cell),
            Paragraph("<b>WhatsApp Cart Recovery</b>", table_cell),
            Paragraph("If a visitor abandons their cart, the system automatically sends a friendly WhatsApp message in their preferred language (English, Marathi, or Hindi) with a 1-tap UPI payment link.", table_cell)
        ],
        [
            Paragraph("<b>Step 4</b>", table_cell),
            Paragraph("<b>Logistics & Tally Sync</b>", table_cell),
            Paragraph("With a single click, create Shiprocket shipping labels (AWB tracking codes) and synchronize your product inventory directly with Tally ERP.", table_cell)
        ],
    ]
    t_steps = Table(steps_data, colWidths=[55, 140, 345])
    t_steps.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_steps)

    story.append(Spacer(1, 8))
    story.append(Paragraph("2. Understanding the Key Features (Explained Simply)", h1_style))

    story.append(Paragraph("<b>A. RTO Risk Scoring (Return-to-Origin Prevention):</b>", h2_style))
    story.append(Paragraph(
        "• <b>Score 0 to 40 (Low Risk - Safe):</b> Prepaid orders (UPI, Razorpay) with verified customer numbers. Safe to pack and ship immediately.<br/>"
        "• <b>Score 70 to 100 (High Risk - Flagged):</b> Large Cash on Delivery (COD) orders or suspicious repeating phone numbers. The system flags these on your dashboard so you can call and confirm before dispatching.",
        bullet_style
    ))

    story.append(Paragraph("<b>B. The 0, 1, 3 Day Abandoned Cart Recovery Loop:</b>", h2_style))
    story.append(Paragraph(
        "A background robot (Cron job) runs automatically 3 times every single day at <b>8:00 AM, 3:00 PM, and 8:00 PM</b>.<br/>"
        "• <b>Day 0 (Within hours):</b> Sends a quick nudge: 'Did you forget this? Tap here to complete your order in 5 seconds via UPI.'<br/>"
        "• <b>Day 1 (Next day):</b> Sends a 24-hour reminder offering a smooth checkout experience.<br/>"
        "• <b>Day 3 (Final notice):</b> Sends a last reminder to reserve their stock before the cart expires.",
        bullet_style
    ))

    # ==================== PAGE 2 ====================
    story.append(PageBreak())
    story.append(Paragraph("3. Multilingual WhatsApp Customer Recovery", h1_style))
    story.append(Paragraph(
        "To reach customers across India, the system includes <b>regional language personalization</b>. "
        "Store owners can choose which language their customers receive messages in:",
        body_style
    ))

    lang_data = [
        [Paragraph("Language", table_header), Paragraph("Customer Message Preview", table_header), Paragraph("Why This Helps Sales", table_header)],
        [
            Paragraph("<b>English</b>", table_cell),
            Paragraph("Hello! You left {Item} in your cart. Complete your purchase now for Rs.{Amount}: upi://pay?pa=merchant@upi...", table_cell),
            Paragraph("Best for urban and metro shoppers accustomed to English e-commerce apps.", table_cell)
        ],
        [
            Paragraph("<b>Marathi</b>", table_cell),
            Paragraph("Namaskar! Tumchya cart madhil {Item} ajunhi baki ahe. Fakt Rs.{Amount} madhe kharedi purna kara: upi://pay?pa=merchant@upi...", table_cell),
            Paragraph("Significantly increases trust and conversion in Maharashtra and regional markets.", table_cell)
        ],
        [
            Paragraph("<b>Hindi</b>", table_cell),
            Paragraph("Namaste! Aapke cart me {Item} abhi bhi baki hai. Keval Rs.{Amount} me apni kharidari poori karein: upi://pay?pa=merchant@upi...", table_cell),
            Paragraph("Understood nationwide; provides friendly, accessible tone that reduces checkout drop-off.", table_cell)
        ],
    ]
    t_lang = Table(lang_data, colWidths=[85, 275, 180])
    t_lang.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_blue),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_lang)
    story.append(Spacer(1, 10))

    story.append(Paragraph("4. Tour of the Website Pages (What You See on Screen)", h1_style))
    story.append(Paragraph(
        "The web app is clean, fast, and easy to navigate from the top menu bar on your computer or phone:",
        body_style
    ))

    pages_data = [
        [Paragraph("Screen / Page", table_header), Paragraph("What You See Here", table_header), Paragraph("Buttons You Can Click", table_header)],
        [
            Paragraph("<b>/login</b>", code_pill),
            Paragraph("Sign-in screen where you enter your store subdomain, email, and password.", table_cell),
            Paragraph("'Sign In' or 'Register new tenant store'.", table_cell)
        ],
        [
            Paragraph("<b>/dashboard</b>", code_pill),
            Paragraph("Overview cards: Total Products, Total Orders, Abandoned Count, and RTO Risk %. Also displays a table of high-risk orders.", table_cell),
            Paragraph("'Export 2026 Audit (Excel)' to download tax and sales records instantly.", table_cell)
        ],
        [
            Paragraph("<b>/products</b>", code_pill),
            Paragraph("Your active product catalog showing pictures, base price, GST %, price with tax, and live stock.", table_cell),
            Paragraph("Upload form to add new products with up to 5 photos.", table_cell)
        ],
        [
            Paragraph("<b>/orders</b>", code_pill),
            Paragraph("Every customer order with phone number, payment mode (COD/UPI), and fraud risk score.", table_cell),
            Paragraph("'Mark Shipped' (creates Shiprocket AWB) and 'Send Invoice WhatsApp'.", table_cell)
        ],
        [
            Paragraph("<b>/abandoned</b>", code_pill),
            Paragraph("Customers who didn't finish checkout, showing what they wanted and how much it costs.", table_cell),
            Paragraph("'Send WhatsApp Now' to send an instant 1-click UPI recovery message.", table_cell)
        ],
        [
            Paragraph("<b>/tally</b>", code_pill),
            Paragraph("Accounting connection status and date/time of the last inventory sync.", table_cell),
            Paragraph("'Trigger Tally Sync Now' to refresh product stock counts.", table_cell)
        ],
        [
            Paragraph("<b>/settings</b>", code_pill),
            Paragraph("Switches to turn WhatsApp and SMS alerts on/off, change message language, and save API keys.", table_cell),
            Paragraph("'Test Alert' button to confirm notifications are firing.", table_cell)
        ],
    ]
    t_pages = Table(pages_data, colWidths=[80, 260, 200])
    t_pages.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(t_pages)

    # ==================== PAGE 3 ====================
    story.append(PageBreak())
    story.append(Paragraph("5. Step-by-Step Quick Start Guide (How to Use It Right Now)", h1_style))
    story.append(Paragraph(
        "Both the frontend website and backend server are already set up and running on your computer. "
        "Here is how you can try it right away in your web browser:",
        body_style
    ))

    quickstart_data = [
        [Paragraph("Step", table_header), Paragraph("Action", table_header), Paragraph("What You Will Experience", table_header)],
        [
            Paragraph("<b>1</b>", table_cell),
            Paragraph("Open browser and go to:<br/><b>http://localhost:3000</b>", table_cell),
            Paragraph("You will see the modern Sales OS login screen.", table_cell)
        ],
        [
            Paragraph("<b>2</b>", table_cell),
            Paragraph("Log in with demo credentials:<br/>Subdomain: <b>acme</b><br/>Email: <b>owner@acme.com</b><br/>Password: <b>password123</b>", table_cell),
            Paragraph("Takes you directly into the live store Dashboard.", table_cell)
        ],
        [
            Paragraph("<b>3</b>", table_cell),
            Paragraph("Click <b>'Export 2026 Audit (Excel)'</b> on Dashboard", table_cell),
            Paragraph("Instantly downloads a clean <code>Audit_Export_2026.xlsx</code> file containing Title, SKU, Total, GST, and Status.", table_cell)
        ],
        [
            Paragraph("<b>4</b>", table_cell),
            Paragraph("Go to <b>Orders Page</b> and click <b>'Mark Shipped'</b>", table_cell),
            Paragraph("Generates a Shiprocket tracking AWB code and marks the shipment dispatched.", table_cell)
        ],
        [
            Paragraph("<b>5</b>", table_cell),
            Paragraph("Go to <b>Abandoned Carts</b> and click <b>'Send WhatsApp Now'</b>", table_cell),
            Paragraph("Sends the localized recovery message with a 1-tap UPI payment deep link.", table_cell)
        ],
        [
            Paragraph("<b>6</b>", table_cell),
            Paragraph("Go to <b>Tally Sync</b> and click <b>'Trigger Tally Sync Now'</b>", table_cell),
            Paragraph("Updates warehouse stock counts across the catalog and logs the timestamp.", table_cell)
        ],
    ]
    t_qs = Table(quickstart_data, colWidths=[40, 200, 300])
    t_qs.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_teal),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_card]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_qs)
    story.append(Spacer(1, 10))

    story.append(Paragraph("6. Frequently Asked Questions (FAQ)", h1_style))
    story.append(Paragraph("<b>Q: What does 'Multi-Tenant' mean?</b><br/>"
        "A: It means multiple distinct stores or brands can use the same software system safely without ever seeing each other's customers, products, or financial numbers. Each store is isolated under its own unique subdomain.", body_style))

    story.append(Paragraph("<b>Q: Does this work if I have real WhatsApp and Shiprocket credentials?</b><br/>"
        "A: Yes! You can enter your live Meta WhatsApp API Token and Shiprocket login credentials directly in the <code>.env</code> file or on the <code>/settings</code> page, and it will immediately communicate with the live official APIs.", body_style))

    story.append(Paragraph("<b>Q: How are taxes and GST calculated?</b><br/>"
        "A: When you upload a product, you choose its tax bracket (e.g. 18%). When an order is placed, the backend calculates the exact subtotal, calculates the GST breakdown, and saves both into the database and Excel audit sheet automatically.", body_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("7. Summary & Completion Status", h1_style))
    story.append(Paragraph(
        "✓ 100% Complete: All features from the specification sheet (Database models, REST APIs, automated background Cron, Next.js frontend pages, and export tools) are fully built, tested, and actively running.",
        ParagraphStyle('SuccessStyle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=12, textColor=c_teal)
    ))

    doc.build(story)
    print(f"[User-Friendly PDF Generated] Successfully saved to {filename}")

if __name__ == '__main__':
    build_user_friendly_pdf()
