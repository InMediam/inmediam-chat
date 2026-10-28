---
'@inmediam/chat': minor
---

Novo campo opcional `destinatariosExternos` no `ChatAdapter`, para
destinatários atendidos fora do chat (por exemplo, por WhatsApp).

Com um desses destinatários escolhido no formulário de abrir chamado:

- o campo de anexos dá lugar ao `notice` configurado, já que os anexos não
  seguem para o outro canal;
- o botão de envio passa a mostrar o `submitLabel`;
- o envio não cria o chamado: chama `onSubmit` com um `ChamadoDraft`
  (`categoria`, `assunto`, `locacaoId` e `descricao`) e fecha o formulário.

Os demais destinatários seguem criando o chamado como antes. Quem não informa o
campo não precisa mudar nada. Os tipos `ChamadoDraft` e `DestinatarioExterno`
passam a ser exportados.
