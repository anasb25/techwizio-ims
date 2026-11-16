function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Print via a blank iframe so the browser footer URL is not localhost. */
export function printInvoiceElement(
  elementId: string,
  documentTitle: string,
): void {
  const source = document.getElementById(elementId);
  if (!source) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.setAttribute(
    'style',
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden',
  );
  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!win || !doc) {
    document.body.removeChild(iframe);
    window.print();
    return;
  }

  const clone = source.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src?.startsWith('/')) {
      img.src = `${window.location.origin}${src}`;
    }
  });

  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(documentTitle)}</title>
</head>
<body></body>
</html>`);
  doc.close();

  document
    .querySelectorAll('link[rel="stylesheet"], style')
    .forEach((node) => {
      doc.head.appendChild(node.cloneNode(true));
    });

  doc.body.appendChild(clone);

  const finish = () => {
    win.focus();
    win.print();
    window.setTimeout(() => {
      iframe.remove();
    }, 1000);
  };

  const sheets = doc.querySelectorAll('link[rel="stylesheet"]');
  if (sheets.length === 0) {
    window.setTimeout(finish, 250);
    return;
  }

  let ready = 0;
  const onSheet = () => {
    ready += 1;
    if (ready >= sheets.length) {
      finish();
    }
  };

  sheets.forEach((link) => {
    link.addEventListener('load', onSheet);
    link.addEventListener('error', onSheet);
  });

  window.setTimeout(finish, 2500);
}
