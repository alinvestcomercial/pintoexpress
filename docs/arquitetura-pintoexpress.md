# Arquitectura PintoExpress

## Estado

A aplicação está ligada ao projecto Supabase `pintoexpress` e usa PostgreSQL como núcleo transaccional.

## Domínios

- **Catálogo:** products, packages, package_items, inventory_lots.
- **Clientes:** customers.
- **Vendas:** orders, order_items, order_events.
- **Pagamentos:** payments, payment_proofs e regras em business_settings.
- **Reservas:** reservations.
- **Logística:** fulfillments.

## Fluxo comercial

1. Cliente escolhe produto ou pacote standard.
2. O pedido recebe uma referência única.
3. O sistema calcula/recebe o valor final e escolhe o fluxo de pagamento conforme a configuração comercial.
4. M-Pesa será usado quando estiver habilitado e o valor estiver dentro do limite configurado.
5. Acima do limite, o pedido segue para transferência bancária.
6. O comprovativo fica associado ao mesmo pedido e à sua referência.
7. Eventos registam a evolução do pedido até entrega/levantamento.

## Segurança

As tabelas públicas têm RLS. O catálogo permite leitura apenas de registos activos. Dados de encomendas, pagamentos, reservas, logística e inventário não são expostos anonimamente.

## Dados ainda não configurados

Não foram inventados preços, limite de M-Pesa, dados bancários, stock ou credenciais de pagamento. Esses valores ficam configuráveis no backoffice quando forem fornecidos.

## Próxima camada

A próxima implementação deve adicionar o checkout transaccional server-side, integração M-Pesa real, upload de comprovativos via Storage, backoffice e consultas públicas de encomendas por referência + telefone sem expor tabelas internas diretamente.
