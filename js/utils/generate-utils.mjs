const pageEl = document.querySelector('.page-a');
const paperContentEl = document.querySelector('.page-a .paper-content');
const overlayEl = document.querySelector('.overlay');

let paperContentPadding;

function isFontErrory() {
  // Some fonts have padding top errors, this function tells you if the current font has that
  const currentHandwritingFont = document.body.style.getPropertyValue(
    '--handwriting-font'
  );
  return (
    currentHandwritingFont === '' ||
    currentHandwritingFont.includes('Homemade Apple')
  );
}

function applyPaperStyles() {
  pageEl.style.border = 'none';
  pageEl.style.overflowY = 'hidden';

  // Adding class shadows even if effect is scanner
  if (document.querySelector('#page-effects').value === 'scanner') {
    overlayEl.classList.add('shadows');
  } else {
    overlayEl.classList.add(document.querySelector('#page-effects').value);
  }

  if (document.querySelector('#page-effects').value === 'scanner') {
    // For scanner, we need shadow between 50deg to 120deg only
    // Since If the lit part happens to be on margins, the margins get invisible
    overlayEl.style.background = `linear-gradient(${
      Math.floor(Math.random() * (120 - 50 + 1)) + 50
    }deg, #0008, #0000)`;
  } else if (document.querySelector('#page-effects').value === 'shadows') {
    overlayEl.style.background = `linear-gradient(${
      Math.random() * 360
    }deg, #0008, #0000)`;
  }

  if (isFontErrory() && document.querySelector('#font-file').files.length < 1) {
    paperContentPadding =
      paperContentEl.style.paddingTop.replace(/px/g, '') || 5;
    const newPadding = Number(paperContentPadding) - 5;
    paperContentEl.style.paddingTop = `${newPadding}px`;
  }
}

function removePaperStyles() {
  pageEl.style.overflowY = 'auto';
  pageEl.style.border = '1px solid var(--border-secondary)';

  if (document.querySelector('#page-effects').value === 'scanner') {
    overlayEl.classList.remove('shadows');
  } else {
    overlayEl.classList.remove(document.querySelector('#page-effects').value);
  }

  if (isFontErrory()) {
    paperContentEl.style.paddingTop = `${paperContentPadding}px`;
  }
}

function renderOutput(outputImages) {
  const outputContainer = document.querySelector('#output');
  const outputHeader = document.querySelector('#output-header');
  const downloadPdfBtn = document.querySelector('#download-as-pdf-button');
  const deleteAllBtn = document.querySelector('#delete-all-button');

  if (outputImages.length <= 0) {
    outputContainer.innerHTML = `
      <div class="output-placeholder">
        <div class="placeholder-icon">✨</div>
        <h4>Ready to Generate</h4>
        <p>Click "Generate Handwriting" to create your first handwritten image</p>
      </div>
    `;
    downloadPdfBtn.classList.remove('show');
    deleteAllBtn.classList.remove('show');
    outputHeader.textContent = '📸 Generated Images';
    return;
  }

  downloadPdfBtn.classList.add('show');
  deleteAllBtn.classList.add('show');
  outputHeader.textContent = `📸 Generated Images (${outputImages.length})`;
  
  outputContainer.innerHTML = outputImages
    .map(
      (outputImageCanvas, index) => /* html */ `
    <div 
      class="output-image-container fade-in" 
      style="position: relative; display: inline-block;"
    >
      <button 
        data-index="${index}" 
        class="close-button close-${index}"
        aria-label="Remove image ${index + 1}">
          &times;
      </button>
      <img 
        alt="Generated handwriting image ${index + 1}" 
        src="${outputImageCanvas.toDataURL('image/jpeg')}"
        loading="lazy"
      />
      <div style="text-align: center; margin-top: var(--spacing-md);">
        <a 
          class="download-image-button" 
          download="handwriting-${index + 1}.jpg"
          href="${outputImageCanvas.toDataURL('image/jpeg')}"
        >
          💾 Download Image
        </a>
        <div style="margin-top: var(--spacing-sm);">
          <button 
            class="move-left"
            data-index="${index}" 
            ${index === 0 ? 'disabled' : ''}
            aria-label="Move image ${index + 1} left"
          >
            ← Move Left
          </button>
          <button 
            class="move-right"
            data-index="${index}" 
            ${index === outputImages.length - 1 ? 'disabled' : ''}
            aria-label="Move image ${index + 1} right"
          >
            Move Right →
          </button>
        </div>
      </div>
    </div>
    `
    )
    .join('');
}

export { removePaperStyles, applyPaperStyles, renderOutput };