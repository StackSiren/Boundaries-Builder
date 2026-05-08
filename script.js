// Affirmations list
const affirmations = [
  "You are worthy of healthy boundaries.",
  "Saying 'no' is an act of self-love.",
  "Your needs are important.",
  "Boundaries build strong relationships.",
  "It's okay to protect your time and energy.",
  "You teach others how to treat you by what you allow."
];

function showAffirmation() {
  const idx = Math.floor(Math.random() * affirmations.length);
  document.getElementById('affirmation').textContent = affirmations[idx];
}

document.addEventListener('DOMContentLoaded', () => {
  showAffirmation();

  // Drag & Drop logic
  const blocks = document.querySelectorAll('.block');
  const dropZone = document.getElementById('drop-zone');

  let draggedBlock = null;

  blocks.forEach(block => {
    block.addEventListener('dragstart', (e) => {
      draggedBlock = block.cloneNode(true);
      draggedBlock.classList.add('dragging');
      e.dataTransfer.effectAllowed = "move";
    });
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = '#e8e6f3';
  });

  dropZone.addEventListener('dragleave', (e) => {
    dropZone.style.background = '#f3effa';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = '#f3effa';

    if (draggedBlock) {
      draggedBlock.classList.remove('dragging');
      draggedBlock.setAttribute('draggable', 'true');
      // Allow editing the block text
      draggedBlock.contentEditable = "true";
      // Add remove button
      const removeBtn = document.createElement('button');
      removeBtn.textContent = "🗑";
      removeBtn.style.marginLeft = "1em";
      removeBtn.style.background = "#f8d7da";
      removeBtn.style.color = "#a94442";
      removeBtn.onclick = () => draggedBlock.remove();
      draggedBlock.appendChild(removeBtn);

      dropZone.appendChild(draggedBlock);
      draggedBlock = null;
    }
  });

  // Export as PDF
  document.getElementById('export-pdf').addEventListener('click', () => {
    html2canvas(document.getElementById('drop-zone')).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF();
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 10, 10, width - 20, 0);
      pdf.save('my-boundaries.pdf');
    });
  });

  // Export as Image
  document.getElementById('export-image').addEventListener('click', () => {
    html2canvas(document.getElementById('drop-zone')).then(canvas => {
      const link = document.createElement('a');
      link.download = 'my-boundaries.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // Save to localStorage
  document.getElementById('save-local').addEventListener('click', () => {
    localStorage.setItem('boundaries', dropZone.innerHTML);
    alert('Boundaries saved!');
  });

  // Load from localStorage
  document.getElementById('load-local').addEventListener('click', () => {
    const data = localStorage.getItem('boundaries');
    if (data) {
      dropZone.innerHTML = data;
      // Reattach remove button event listeners
      Array.from(dropZone.querySelectorAll('button')).forEach(btn => {
        btn.onclick = () => btn.parentElement.remove();
      });
    }
  });
});

// Add html2canvas and jsPDF via CDN
const cdnScripts = [
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

cdnScripts.forEach(src => {
  const s = document.createElement('script');
  s.src = src;
  document.head.appendChild(s);
});