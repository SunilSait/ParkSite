"""
QR Code service — generates QR codes for booking confirmations.
Uses the Python qrcode library.
"""

import io
import base64
import qrcode


def generate_booking_qr(booking_data):
    """
    Generate a QR code containing booking details.

    Args:
        booking_data: dict with booking information

    Returns:
        Base64-encoded PNG image string (data URI ready).
    """
    # Build the QR code content string
    qr_content = (
        f"=== PARKING BOOKING ===\n"
        f"Reference: {booking_data.get('booking_reference', 'N/A')}\n"
        f"Name: {booking_data.get('user_name', 'N/A')}\n"
        f"Location: {booking_data.get('location_name', 'N/A')}\n"
        f"Slot: {booking_data.get('slot_number', 'N/A')}\n"
        f"Date: {booking_data.get('booking_date', 'N/A')}\n"
        f"Time: {booking_data.get('start_time', 'N/A')} - {booking_data.get('end_time', 'N/A')}\n"
        f"Amount: ₹{booking_data.get('total_amount', '0')}\n"
        f"Status: {booking_data.get('status', 'N/A')}\n"
        f"========================"
    )

    # Generate QR code image
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_content)
    qr.make(fit=True)

    img = qr.make_image(fill_color='black', back_color='white')

    # Convert to base64 string
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.read()).decode('utf-8')

    return f'data:image/png;base64,{img_base64}'
