/**
 * Vercel Serverless Function: /api/process_payment.js
 * Cópia de compatibilidade caso o Vercel Root Directory aponte para beautyroom_site_v2
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido.' });

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'TEST-527658138527103-111314-5ca06e724dba68306ba929c288a30ab5-181078928';

  try {
    const { paymentMethod, transactionAmount, description, token, installments, paymentMethodId, issuerId, payer } = req.body;

    let paymentPayload = {
      transaction_amount: Number(parseFloat(transactionAmount).toFixed(2)),
      description: description || 'Beauty Room - Sinal de Agendamento',
      payer: {
        email: payer.email,
        first_name: payer.firstName || 'Cliente',
        last_name: payer.lastName || 'Beauty Room',
        identification: payer.identification || undefined
      }
    };

    if (paymentMethod === 'card') {
      paymentPayload.token = token;
      paymentPayload.installments = Number(installments) || 1;
      paymentPayload.payment_method_id = paymentMethodId;
      if (issuerId) paymentPayload.issuer_id = issuerId;
    } else if (paymentMethod === 'pix') {
      paymentPayload.payment_method_id = 'pix';
    }

    const mpResponse = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      },
      body: JSON.stringify(paymentPayload)
    });

    const paymentData = await mpResponse.json();
    if (!mpResponse.ok) {
      return res.status(mpResponse.status).json({
        error: paymentData.message || 'Erro no Mercado Pago',
        details: paymentData.cause || []
      });
    }

    return res.status(200).json({
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      payment_method_id: paymentData.payment_method_id,
      transaction_amount: paymentData.transaction_amount,
      qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code || null,
      qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64 || null
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno ao processar pagamento.' });
  }
}

