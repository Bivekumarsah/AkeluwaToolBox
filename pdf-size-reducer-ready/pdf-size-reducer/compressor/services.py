"""Compatibility service using the upgraded compression engine.

Web requests use pdf_reducer.views, which runs this work in an isolated process.
"""
from dataclasses import dataclass
from pathlib import Path
from pdf_reducer.compression import compress_pdf, PdfError

PdfCompressionError = PdfError

@dataclass
class CompressionResult:
    output_path: Path
    original_size: int
    final_size: int
    requested_reduction: float
    actual_reduction: float
    engine: str
    visual_compression: bool


def compress_to_target(input_path, work_directory, reduction_percentage):
    try:
        target = int(reduction_percentage)
        if float(reduction_percentage) != target:
            raise ValueError
    except (ValueError, TypeError, OverflowError) as exc:
        raise PdfCompressionError("Use a whole-number reduction from 5 to 90 percent.") from exc
    result = compress_pdf(Path(input_path).read_bytes(), target, "preserve")
    output = Path(work_directory) / "compressed.pdf"
    output.write_bytes(result.data)
    return CompressionResult(output, result.original_size, len(result.data), target,
                             result.reduction, "pymupdf", result.flattened)
