(() => {
  const encoder = new TextEncoder();
  const crcTable = Array.from({length: 256}, (_, n) => {
    let crc = n; for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0); return crc >>> 0;
  });
  function crc32(bytes) {let crc = 0xffffffff; for (const b of bytes) crc = (crc >>> 8) ^ crcTable[(crc ^ b) & 255]; return (crc ^ 0xffffffff) >>> 0;}
  function validateFiles(files) {
    if (files.length > 3) return 'Please choose no more than 3 reference files.';
    if (files.some(file => !/\.(jpe?g|png|pdf)$/i.test(file.name))) return 'Please choose JPG, PNG or PDF reference files.';
    if (files.some(file => file.size > 10 * 1024 * 1024)) return 'Each reference file must be 10 MB or smaller.';
    return '';
  }
  function makeZip(entries) {
    const local = [], central = []; let offset = 0;
    entries.forEach(({name, bytes}) => {
      const filename = encoder.encode(name), crc = crc32(bytes);
      const header = new Uint8Array(30 + filename.length), view = new DataView(header.buffer);
      view.setUint32(0, 0x04034b50, true); view.setUint16(4, 20, true); view.setUint16(6, 0x800, true);
      view.setUint16(12, 33, true); view.setUint32(14, crc, true); view.setUint32(18, bytes.length, true); view.setUint32(22, bytes.length, true); view.setUint16(26, filename.length, true); header.set(filename, 30);
      const directory = new Uint8Array(46 + filename.length), dv = new DataView(directory.buffer);
      dv.setUint32(0, 0x02014b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 20, true); dv.setUint16(8, 0x800, true); dv.setUint16(14, 33, true);
      dv.setUint32(16, crc, true); dv.setUint32(20, bytes.length, true); dv.setUint32(24, bytes.length, true); dv.setUint16(28, filename.length, true); dv.setUint32(42, offset, true); directory.set(filename, 46);
      local.push(header, bytes); central.push(directory); offset += header.length + bytes.length;
    });
    const size = central.reduce((sum, bytes) => sum + bytes.length, 0);
    const end = new Uint8Array(22), view = new DataView(end.buffer);
    view.setUint32(0, 0x06054b50, true); view.setUint16(8, entries.length, true); view.setUint16(10, entries.length, true); view.setUint32(12, size, true); view.setUint32(16, offset, true);
    return new Blob([...local, ...central, end], {type: 'application/zip'});
  }
  const escape = text => String(text).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  function fold(line) {
    let rows = [], row = '', length = 0;
    for (const character of line) {const size = encoder.encode(character).length; if (length + size > 73) {rows.push(row); row = ' '; length = 1;} row += character; length += size;}
    rows.push(row); return rows.join('\r\n');
  }
  const stamp = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  function calendar({name, email, date, time, message}) {
    const start = new Date(date + 'T' + time + ':00+05:30');
    if (!Number.isFinite(start.getTime()) || start <= new Date()) throw new Error('Please choose a future consultation time.');
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const uid = globalThis.crypto?.randomUUID?.() || Date.now() + '-' + Math.random().toString(16).slice(2);
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Tyohaar//Consultation Requests//EN', 'METHOD:PUBLISH', 'BEGIN:VEVENT', 'UID:' + uid + '@tyohaar', 'DTSTAMP:' + stamp(new Date()), 'DTSTART:' + stamp(start), 'DTEND:' + stamp(end), 'STATUS:TENTATIVE', 'SUMMARY:Consultation request — Tyohaar', 'DESCRIPTION:' + escape('Unconfirmed consultation request. Share with the maker to agree availability.\nName: ' + name + '\nEmail: ' + email + '\n' + message), 'END:VEVENT', 'END:VCALENDAR'].map(fold).join('\r\n') + '\r\n';
  }
  function download(blob, name) {const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);}
  window.tyohaarRequests = {makeZip, validateFiles, calendar, download, encode: text => encoder.encode(text)};
})();
