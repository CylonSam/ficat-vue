# FICAT - SISTEMA DE GERAÇÃO AUTOMATICA DE FICHAS CATALOGRÁFICAS

> FICAT versão Nuxt.js (Vue <3).

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/en/)
- [Vue.js 2](https://v2.vuejs.org/)
- [Nuxt.js 2](https://nuxtjs.org/)
- [Buefy](https://buefy.org/)
- [MySQL 8](https://dev.mysql.com/doc/)
- [Knex.js](http://knexjs.org/)

## Requisitos

- Instalar Node

    **Versão: 10**

    Nota: Use o nvm!

- Instalar MySQL

    **Versão: 8**

## Configurações

### Sobre banco de dados

- Criar database com o nome da sua preferência

- Criar um usuario com permissões para alterar a database que você criou

- Colocar as credenciais de database e usuário no arquivo de variáveis de ambiente
  
### Sobre rodar o projeto

``` bash
# instala as dependencias do projeto
$ npm install

# roda o projeto em http://localhost:3000
$ npm run dev

# Cria build para produção e roda servidor
$ npm run build
$ npm run start

# Gera projeto estatico (para nginx / apache2 etc)
$ npm run generate
```

