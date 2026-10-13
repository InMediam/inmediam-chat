---
'@inmediam/chat': patch
---

Ajustes de layout na tela de chamados:

- O menu de ações do chamado só mostra o separador abaixo de "Detalhes do
  chamado" quando há uma ação de finalizar ou reabrir logo abaixo.
- A lista de chamados não desenha mais uma linha abaixo do último item nem
  abaixo do estado vazio.
- No mobile a lista passa a ocupar a altura da tela e rolar por dentro: antes,
  com mais chamados do que cabiam na tela, o fim da lista era cortado e a
  paginação infinita não carregava a página seguinte.
- O skeleton do endereço no cabeçalho do chamado acompanha a largura
  disponível e não passa mais por cima do badge de status no mobile.
