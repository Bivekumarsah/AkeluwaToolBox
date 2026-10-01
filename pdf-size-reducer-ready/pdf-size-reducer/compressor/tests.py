import pymupdf
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, SimpleTestCase


class PdfCompressorTests(SimpleTestCase):
    def create_pdf(self):
        with pymupdf.open() as document:
            page = document.new_page()
            page.insert_text((72, 72), "PDF Size Reducer test document")
            return document.tobytes()

    def test_home_page_loads(self):
        response = Client().get("/reducer/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "PDF size reducer")

    def test_pdf_can_be_uploaded_and_downloaded(self):
        uploaded = SimpleUploadedFile(
            "sample.pdf",
            self.create_pdf(),
            content_type="application/pdf",
        )

        response = Client().post(
            "/api/compress/",
            {"pdf": uploaded, "percentage": "25"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")
        self.assertTrue(response.content.startswith(b"%PDF-"))

        with pymupdf.open(stream=response.content, filetype="pdf") as document:
            self.assertEqual(document.page_count, 1)

    def test_non_pdf_is_rejected(self):
        uploaded = SimpleUploadedFile(
            "notes.txt",
            b"This is not a PDF.",
            content_type="text/plain",
        )

        response = Client().post(
            "/api/compress/",
            {"pdf": uploaded, "percentage": "50"},
        )

        self.assertEqual(response.status_code, 400)
