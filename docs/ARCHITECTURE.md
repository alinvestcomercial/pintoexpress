# Arquitetura PintoExpress

## Canais
1. Website público
2. WhatsApp Business Platform/API
3. Backoffice privado

Os três canais usam as mesmas regras de negócio e persistência.

## Domínio principal
Customer -> Order -> OrderItem -> Product/ProductLot
Order -> Invoice
Invoice -> PaymentPlan -> Installment
Invoice -> Payment
Order -> Delivery
Customer -> SupportRequest
Customer/Order -> WhatsAppConversation/Message
Todas as mutações críticas -> AuditLog

## Segurança
Telefone, código da encomenda e número da fatura são referências; não são autenticação suficiente para alterações sensíveis. Operações críticas usam token/OTP/link seguro e expiração.

## Pagamentos
M-Pesa é o único método online no MVP. O browser nunca marca pagamento como confirmado. O backend recebe confirmação oficial, verifica idempotência e só então atualiza saldo/estado e dispara a emissão da fatura conforme a integração fiscal.

## WhatsApp
Mensagens iniciadas pela empresa fora da janela de atendimento usam templates aprovados quando exigidos pela Meta. Opt-in/opt-out deve ser armazenado. WhatsApp é canal, não fonte de verdade.
