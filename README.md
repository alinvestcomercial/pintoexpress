# PintoExpress

Plataforma digital de venda e reserva de pintos e insumos avícolas em Moçambique.

## Visão
Website e WhatsApp são duas portas de entrada para o mesmo backend. O cliente não precisa de conta ou password; a identificação operacional usa telefone e referências seguras de encomenda/fatura/pagamento. A equipa interna usa um backoffice privado.

## MVP
- Catálogo de pintos e insumos
- Lotes de pintos e stock
- Carrinho e encomendas
- Reservas
- M-Pesa como único meio de pagamento online
- Pagamentos parciais/prestações
- Faturação eletrónica preparada para integração fiscal
- WhatsApp como canal de atendimento e operação
- Backoffice para vendas, operações, finanças e entregas
- Auditoria das operações críticas

## Princípios
- Backend como fonte de verdade
- Confirmação de pagamento apenas por confirmação oficial do M-Pesa
- Processamento idempotente de callbacks
- UUIDs internos; referências humanas para atendimento
- Sem passwords para clientes
- Alterações críticas exigem confirmação segura

## Estado
Fase inicial de implementação da fundação técnica e do modelo de domínio.