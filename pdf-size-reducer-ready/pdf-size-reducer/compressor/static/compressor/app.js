const form = document.querySelector("#compress-form");
const dropZone = document.querySelector("#drop-zone");
const fileInput = document.querySelector("#pdf-file");
const fileSummary = document.querySelector("#file-summary");
const fileName = document.querySelector("#file-name");
const fileSize = document.querySelector("#file-size");
const removeFileButton = document.querySelector("#remove-file");
const rangeInput = document.querySelector("#percentage");
const numberInput = document.querySelector("#percentage-number");
const estimate = document.querySelector("#estimate");
const originalSize = document.querySelector("#original-size");
const targetSize = document.querySelector("#target-size");
const compressButton = document.querySelector("#compress-button");
const buttonLabel = document.querySelector(".button-label");
const statusBox = document.querySelector("#status");

const MAX_FILE_SIZE = 60 * 1024 * 1024;
let selectedFile = null;

function formatBytes(bytes) {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const unit = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1,
    );

    return `${(bytes / 1024 ** unit).toFixed(unit === 0 ? 0 : 2)} ${units[unit]}`;
}

function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = `status ${type}`;
    statusBox.hidden = false;
}

function clearStatus() {
    statusBox.hidden = true;
    statusBox.textContent = "";
    statusBox.className = "status";
}

function updateEstimate() {
    if (!selectedFile) return;

    const percentage = Number(rangeInput.value);
    const estimatedBytes = selectedFile.size * (1 - percentage / 100);

    originalSize.textContent = formatBytes(selectedFile.size);
    targetSize.textContent = formatBytes(estimatedBytes);
}

function selectFile(file) {
    clearStatus();

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
        showStatus("Please choose a PDF file.", "error");
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        showStatus("The maximum supported file size is 60 MB.", "error");
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatBytes(file.size);
    dropZone.hidden = true;
    fileSummary.hidden = false;
    estimate.hidden = false;
    compressButton.disabled = false;
    updateEstimate();
}

function removeFile() {
    selectedFile = null;
    fileInput.value = "";
    dropZone.hidden = false;
    fileSummary.hidden = true;
    estimate.hidden = true;
    compressButton.disabled = true;
    clearStatus();
}

function setPercentage(value) {
    const safeValue = Math.min(90, Math.max(5, Number(value) || 5));
    rangeInput.value = safeValue;
    numberInput.value = safeValue;
    updateEstimate();
}

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
    }
});

fileInput.addEventListener("change", () => {
    selectFile(fileInput.files[0]);
});

for (const eventName of ["dragenter", "dragover"]) {
    dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add("is-dragging");
    });
}

for (const eventName of ["dragleave", "drop"]) {
    dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove("is-dragging");
    });
}

dropZone.addEventListener("drop", (event) => {
    selectFile(event.dataTransfer.files[0]);
});

removeFileButton.addEventListener("click", removeFile);
rangeInput.addEventListener("input", () => setPercentage(rangeInput.value));
numberInput.addEventListener("change", () => setPercentage(numberInput.value));

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedFile) {
        showStatus("Please select a PDF file.", "error");
        return;
    }

    clearStatus();
    compressButton.disabled = true;
    compressButton.classList.add("is-loading");
    buttonLabel.textContent = "Compressing PDF...";

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("percentage", rangeInput.value);

    const csrfToken = form.querySelector("[name=csrfmiddlewaretoken]").value;

    try {
        const response = await fetch("/api/compress/", {
            method: "POST",
            headers: {
                "X-CSRFToken": csrfToken,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Compression failed.");
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        const cleanName = selectedFile.name.replace(/\.pdf$/i, "");

        downloadLink.href = downloadUrl;
        downloadLink.download = `${cleanName}-compressed.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        URL.revokeObjectURL(downloadUrl);

        const actualReduction = response.headers.get("X-Actual-Reduction");
        const finalBytes = Number(response.headers.get("X-Final-Size"));
        const visualMode = response.headers.get("X-Visual-Compression") === "true";

        let message = `Finished: ${actualReduction}% smaller`;
        if (finalBytes) message += ` (${formatBytes(finalBytes)}).`;
        if (visualMode) {
            message += " Strong visual compression was used, so selectable text or links may be flattened.";
        }

        showStatus(message, "success");
    } catch (error) {
        showStatus(error.message, "error");
    } finally {
        compressButton.disabled = false;
        compressButton.classList.remove("is-loading");
        buttonLabel.textContent = "Compress and download";
    }
});
