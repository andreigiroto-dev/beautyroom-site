import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const MP_ACCESS_TOKEN =
    process.env.MP_ACCESS_TOKEN ||
    'TEST-527658138527103-111314-5ca06e724dba68306ba929c288a30ab5-181078928';

  try {
    const body = await request.json();
    const {
      paymentMethod,
      transactionAmount,
      description,
      token,
      installments,
      paymentMethodId,
      issuerId,
      payer
    } = body;

    let paymentPayload: any = {
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

    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      },
      body: JSON.stringify(paymentPayload)
    });

    const paymentData = await mpRes.json();

    if (!mpRes.ok) {
      const detailMsg =
        paymentData.cause && paymentData.cause.length > 0
          ? paymentData.cause.map((c: any) => c.description || c.code).join(', ')
          : paymentData.message || 'Erro ao processar pagamento';

      return json({ error: detailMsg, details: paymentData.cause || [] }, { status: mpRes.status });
    }

    return json({
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      payment_method_id: paymentData.payment_method_id,
      transaction_amount: paymentData.transaction_amount
    });
  } catch (err: any) {
    return json({ error: 'Erro interno ao processar pagamento.' }, { status: 500 });
  }
};
