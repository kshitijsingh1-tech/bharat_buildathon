"""
Sarthi AI Pipeline - Smart Document Intelligence & Expiry Processor
Handles document OCR metadata extraction, validity checks, and renewal warnings.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta

class DocumentProcessor:
    def __init__(self):
        self.doc_rules = {
            "income-certificate": {"validity_days": 365, "issuer": "Revenue Department"},
            "residence-certificate": {"validity_days": 1095, "issuer": "Revenue Department"},
            "aadhaar": {"validity_days": 9999, "issuer": "UIDAI"},
            "land-record": {"validity_days": 180, "issuer": "State Revenue Portal"},
            "bank-passbook": {"validity_days": 9999, "issuer": "Bank Branch"}
        }

    def analyze_document(self, doc_type: str, file_name: str, issue_date_str: str = None) -> Dict[str, Any]:
        """
        Simulates AI OCR scanning of an uploaded document, extracts metadata, and checks validity status.
        """
        rule = self.doc_rules.get(doc_type.lower(), {"validity_days": 365, "issuer": "Government Authority"})

        today = datetime.now()
        if issue_date_str:
            try:
                issue_date = datetime.strptime(issue_date_str, "%Y-%m-%d")
            except ValueError:
                issue_date = today - timedelta(days=300)
        else:
            issue_date = today - timedelta(days=320)

        expiry_date = issue_date + timedelta(days=rule["validity_days"])
        days_until_expiry = (expiry_date - today).days

        if days_until_expiry < 0:
            status = "missing"
            detail = "Document expired"
        elif days_until_expiry <= 30:
            status = "expiring"
            detail = f"Expires in {days_until_expiry} days — {expiry_date.strftime('%d %b %Y')}"
        else:
            status = "valid"
            detail = f"Valid until {expiry_date.strftime('%d %b %Y')}"

        return {
            "docId": doc_type,
            "fileName": file_name,
            "status": status,
            "detail": detail,
            "issuedBy": rule["issuer"],
            "daysUntilExpiry": max(0, days_until_expiry),
            "ocrConfidence": 0.96,
            "extractedAttributes": {
                "documentType": doc_type,
                "verifiedDate": today.strftime("%Y-%m-%d"),
                "authenticityCheck": "Passed"
            }
        }
