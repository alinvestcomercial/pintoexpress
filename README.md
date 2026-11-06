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


## Estado da experiência comercial (frontend)
- Balcão digital com pesquisa e filtros por categoria
- Catálogo demonstrativo de pintos e insumos
- Carrinho local para preparar pedidos de cotação
- Formulário de contacto com dados de cliente, localização e preferência de recepção
- Encaminhamento para WhatsApp quando `NEXT_PUBLIC_WHATSAPP_NUMBER` estiver configurado; sem essa variável, copia o texto do pedido
- Layout responsivo com cards e superfícies arredondadas

## Limitações actuais
- Os produtos e imagens do catálogo são conteúdo inicial demonstrativo; preços e stock não são publicados nem confirmados.
- O carrinho e os pedidos ainda não são persistidos numa base de dados nem criam encomendas oficiais.
- Não há integração de pagamentos M-Pesa, facturação, logística ou WhatsApp Business API nesta fase.
- A confirmação comercial continua a ser feita pela equipa. Nunca considerar o envio do formulário como encomenda confirmada ou pagamento efectuado.

## Configuração de contacto
Definir `NEXT_PUBLIC_WHATSAPP_NUMBER` com o número oficial em formato internacional, apenas dígitos (por exemplo, `2588XXXXXXXX`). Esta variável é pública e não deve conter tokens ou segredos.


## Organização das páginas comerciais
- `/` — homepage de descoberta e encaminhamento para o balcão
- `/catalogo` — catálogo pesquisável e filtrável
- `/produto/[slug]` — informação de cada produto
- `/solucoes` — orientação por objectivo e dimensão da criação
- `/como-comprar` — etapas e condições do processo de consulta
- `/pedido` — lista de produtos e formulário de consulta
- `/sobre` — apresentação institucional
- `/contactos` — formulário e canais de atendimento

O pedido é mantido localmente no navegador para permitir navegação entre catálogo, detalhes e formulário. Ainda não é uma encomenda persistida no servidor. O envio por WhatsApp depende da configuração de NEXT_PUBLIC_WHATSAPP_NUMBER; sem ela, o formulário informa a limitação e não confirma a recepção do pedido.
