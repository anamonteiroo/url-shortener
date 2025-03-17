# Encurtador de URLs com NestJS

Este projeto é um serviço de encurtamento de URLs construído com NestJS. Ele permite que os usuários encurtem URLs longas, gerenciem suas URLs encurtadas e realizem operações como atualização e exclusão.

## Funcionalidades

- **Encurtar URLs**: Transforma URLs longas em URLs curtas e já permitindo o seu acesso direto.
- **Listar URLs do usuário**: Retorna todas as URLs encurtadas por um usuário específico com a atualização do número de cliques.
- **Atualizar URLs**: Permite a atualização da URL original associada a uma URL encurtada.
- **Excluir URLs**: Realiza a exclusão lógica (soft delete) de uma URL encurtada.

## Tecnologias Utilizadas

- **NestJS**: Framework para construção de aplicações server-side em Node.js.
- **TypeORM**: ORM para interação com o banco de dados.
- **Jest**: Framework de testes para garantir a qualidade do código.
- **SQLite/PostgreSQL**: Banco de dados para armazenar as URLs e informações dos usuários.

## Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Banco de dados (SQLite, PostgreSQL, etc.)

## Como Configurar

### 1. Clone o repositório

```bash
git clone https://github.com/anamonteiroo/url-shortener.git
cd encurtador-url
```

### 2. Instale as dependências

```bash
cd backend
npm install
# ou
yarn install
```

### 3. Configure o banco de dados

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=mysecretkey
```

### 4. Execute as migrações

```bash
npx prisma migrate dev
# ou
yarn prisma migrate dev
```

### 5. Inicie o servidor

```bash
npm run start
# ou
yarn start
```

O servidor estará rodando em `http://localhost:3000`.

## Como Usar

### Registrar Usuário

**Endpoint:** `POST /auth/register`

**Body:**

```json
{
  "email": "teste@teste.com.br",
  "password": "123456"
}
```

**Response**

```json
{
    "message": "User registered successfully",
    "user": {
        "id": "a5011206-7b0f-4b68-b7eb-7ed7c6766e78",
        "email": "teste@teste.com.br",
        "createdAt": "2025-03-17T22:44:32.141Z"
    }
}
```

### Logar Usuário

**Endpoint:** `POST /auth/login`

**Body:**

```json
{
  "email": "teste@teste.com.br",
  "password": "123456"
}
```

**Response**

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1MDExMjA2LTdiMGYtNGI2OC1iN2ViLTdlZDdjNjc2NmU3OCIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tLmJyIiwiaWF0IjoxNzQyMjUxNTYwLCJleHAiOjE3NDIyNTUxNjB9.k42znT1bVXZObCt04qXoQHlwnNRKKnHn5JbINLepins"
}
```

### Encurtar uma URL (pode estar ou não autenticado. Somente quando autenticado é possível fazer a listagem, atualização e deleção)

**Endpoint:** `POST /url/shorten`

**Body:**

```json
{
  "original": "http://www.google.com.br"
}
```

**Response:**

```json
{
  "message": "URL shortened successfully",
  "shortUrl": "http://localhost:3000/a91141"
}
```

### Listar URLs do Usuário (deve estar autenticado)

**Endpoint:** `GET /url/my-urls`

**Response:**

```json
[
    {
        "id": "ea8d502c-662a-4415-9ce5-5ec79f203756",
        "original": "http://www.google.com.br",
        "short": "ff81c5",
        "clicks": 0,
        "createdAt": "2025-03-17T22:47:34.105Z"
    }
]
```

### Atualizar uma URL

**Endpoint:** `PATCH /url/update/:id`

**Body:**

```json
{
  "original": "http://www.youtube.com.br"
}
```

**Response:**

```json
{
    "id": "ea8d502c-662a-4415-9ce5-5ec79f203756",
    "original": "http://www.youtube.com.br"
}
```

### Excluir uma URL

**Endpoint:** `DELETE /url/delete/:id`

**Response:**

```json
{
    "id": "ea8d502c-662a-4415-9ce5-5ec79f203756",
    "deletedAt": "2025-03-17T22:52:05.823Z"
}
```

## Acessar URL Encurtada
Ao acessar a URL encurtada, ex: http://localhost:3000/:shortUrl, é possível acessar o endereço original. Cada acesso à essa URL é contabilizada no banco de dados e pode ser vista na lista de URLs do usuário.

## Postman

O arquivo do **Postman** está disponível na raiz do projeto para auxiliar nos testes da API.

## Executando os Testes

Para executar os testes, use o seguinte comando:

```bash
npm run test
# ou
yarn test
```

Os testes incluem:

- Testes unitários para o controlador e serviço.


## Escalabilidade do projeto

1. Uso de Banco de Dados Escalável
- **PostgreSQL**: Usar o PostgreSQL para recursos como replicação e particionamento de dados.
- **Sharding**: Dividir os dados entre múltiplos bancos para escalar horizontalmente.

2. Balanceamento de Carga
- **Balanceador de Carga**: Usar **Nginx** ou **HAProxy** para distribuir as requisições entre várias instâncias.
- **Docker e Kubernetes**: Utilizar containers com Docker e orquestre com Kubernetes para escalar automaticamente.

3. Monitoramento e Logging Centralizado
- **Logs**: Usar ferramentas como **Winston** ou **Pino** para logs estruturados e centralize-os com **Elasticsearch** ou **Grafana Loki**.
- **Monitoramento**: Utilizar **Prometheus** e **Grafana** para monitorar a performance e saúde do sistema.

4. Testes e CI/CD
- **CI/CD**: Configurar pipelines para testes automáticos e deploy usando **GitLab CI**, **Jenkins** ou **GitHub Actions**.
- **Testes de Carga**: Usar ferramentas como **Artillery** ou **JMeter** para simular tráfego e verificar a performance.

5. Arquitetura de Microserviços
- **Microserviços**: Separar funcionalidades em microserviços independentes (ex: encurtamento de URL, gerenciamento de usuários).
- **API Gateway**: Usar um API Gateway para orquestrar e balancear requisições entre microserviços.

#### Desenvolvido por Ana Monteiro.
