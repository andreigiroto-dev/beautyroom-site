/**
 * Vercel Serverless Function: /api/process_payment.js
 * Processamento Seguro de Pagamento via API Mercado Pago (Checkout Transparente)
 *
 * Suporta:
 *  - Cartão de Crédito (tokenizado via MercadoPago.js v2 no frontend)
 *  - PIX via API oficial do Mercado Pago (com QR Code dinâmico e webhook)
 */

export default async function handler(req, res) {
  // Configuração de CORS seguro
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  // Token secreto do Mercado Pago: obtido das variáveis de ambiente da Vercel ou fallback local de desenvolvimento
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'TEST-527658138527103-111314-5ca06e724dba68306ba929c288a30ab5-181078928';

  if (!MP_ACCESS_TOKEN) {
    return res.status(500).json({
      error: 'Configuração ausente: MP_ACCESS_TOKEN não está definido nas variáveis de ambiente da Vercel.'
    });
  }

  try {
    const {
      paymentMethod, // 'card' ou 'pix'
      transactionAmount,
      description,
      token, // token do cartão gerado com segurança pelo MercadoPago.js
      installments,
      paymentMethodId, // 'visa', 'master', 'elo', etc.
      issuerId,
      payer
    } = req.body;

    if (!transactionAmount || transactionAmount <= 0) {
      return res.status(400).json({ error: 'Valor da transação inválido.' });
    }

    if (!payer || !payer.email) {
      return res.status(400).json({ error: 'Dados do pagador (email) são obrigatórios.' });
    }

    // Montagem do payload de pagamento conforme a documentação do Mercado Pago
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
      if (!token) {
        return res.status(400).json({ error: 'Token do cartão ausente.' });
      }
      paymentPayload.token = token;
      paymentPayload.installments = Number(installments) || 1;
      paymentPayload.payment_method_id = paymentMethodId;
      if (issuerId) {
        paymentPayload.issuer_id = issuerId;
      }
    } else if (paymentMethod === 'pix') {
      paymentPayload.payment_method_id = 'pix';
    } else {
      return res.status(400).json({ error: 'Método de pagamento inválido.' });
    }

    // Chamada à API oficial do Mercado Pago V1 Payments
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
      console.error('Erro na resposta do Mercado Pago:', paymentData);
      return res.status(mpResponse.status).json({
        error: paymentData.message || 'Erro ao processar pagamento no Mercado Pago',
        details: paymentData.cause || []
      });
    }

    // Retorno amigável e seguro para o front-end
    return res.status(200).json({
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      payment_method_id: paymentData.payment_method_id,
      payment_type_id: paymentData.payment_type_id,
      transaction_amount: paymentData.transaction_amount,
      qr_code: paymentData.point_of_interaction?.transaction_data?.qr_code || null,
      qr_code_base64: paymentData.point_of_interaction?.transaction_data?.qr_code_base64 || null,
      ticket_url: paymentData.point_of_interaction?.transaction_data?.ticket_url || null
    });

  } catch (err) {
    console.error('Exceção ao processar pagamento:', err);
    return res.status(500).json({ error: 'Erro interno no servidor ao processar pagamento.' });
  }
}

