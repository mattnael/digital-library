// Membuat PDF satu halaman yang valid (xref dihitung, bukan template mati)
// untuk konten contoh hasil seed. Latex dilarang oleh aturan tugas, jadi
// berkasnya dirakit manual sesuai struktur PDF 1.4.
export function buildSamplePdf(title, lines) {
  const escapeText = (value) =>
    value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

  const contentOps = [
    `BT /F1 20 Tf 56 780 Td (${escapeText(title)}) Tj ET`,
    ...lines.map((line, index) => `BT /F1 11 Tf 56 ${740 - index * 20} Td (${escapeText(line)}) Tj ET`),
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${contentOps.length} >>\nstream\n${contentOps}\nendstream`,
  ];

  let body = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((objectBody, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${objectBody}\nendobj\n`;
  });

  const xrefOffset = body.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  return Buffer.from(
    body +
      xref +
      `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
    'latin1',
  );
}
