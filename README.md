# IMA Digitais Soluções — Portal da Empresa

Website público + painel privado em Firebase.

## Recursos
- Site público com portfólio e animações
- Galeria de trabalhos
- Google Maps/navegação
- Formulário de contacto armazenado no Firestore
- Painel privado com login Firebase
- Mensagens
- Funcionários: contratar e inativar mantendo histórico
- Clientes
- Projetos

## IMPORTANTE — primeiro administrador
As regras usam `admins/{uid}` para autorizar o dono/administrador.
Depois de criar o utilizador administrador no Firebase Authentication, copie o UID desse usuário em **Firestore > dados > admins** criando um documento com ID exatamente igual ao UID.
Não crie uma regra que permita qualquer usuário autenticado administrar a empresa.

## Publicação
Envie os arquivos para o GitHub Pages. O site público fica em `index.html` e o painel em `admin.html`.
