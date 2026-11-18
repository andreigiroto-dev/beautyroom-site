// Algoritmo oficial EMV e CRC16 para geração de PIX BACEN
function formatEMV(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

export function calculateCRC16(payload: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload(params: {
  key: string;
  name: string;
  city: string;
  amount: number;
  txid?: string;
}): string {
  const { key, name, city, amount, txid = 'SINAL' } = params;

  let payload = formatEMV('00', '01');
  payload += formatEMV('01', '12');

  const gui = formatEMV('00', 'br.gov.bcb.pix');
  const chave = formatEMV('01', key);
  payload += formatEMV('26', gui + chave);

  payload += formatEMV('52', '0000');
  payload += formatEMV('53', '986');
  payload += formatEMV('54', amount.toFixed(2));
  payload += formatEMV('58', 'BR');

  const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().substring(0, 25);
  const cleanCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().substring(0, 15);
  payload += formatEMV('59', cleanName);
  payload += formatEMV('60', cleanCity);

  const tx = formatEMV('05', txid.substring(0, 25));
  payload += formatEMV('62', tx);

  payload += '6304';
  const crc = calculateCRC16(payload);

  return payload + crc;
}
