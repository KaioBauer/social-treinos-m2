
# 🏋️ TraInApp – Rede Social Fitness Minimalista

Aplicativo mobile estilo Instagram, voltado para treinos e vida fitness.

---

## 👨‍💻 Desenvolvedores
- **Yran Mauro**
- **Kaio Guilherme Bauer**

---

## 🔧 Pré-requisitos

- Node.js
- Expo CLI
- Conta no Firebase com Firestore e Authentication habilitados

---

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/seu-usuario/trainapp.git
cd trainapp
````

---

## 🔌 Backend (Servidor de Upload)

1. Acesse a pasta do servidor:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor local:

```bash
node server.js
```

> O servidor será iniciado em: `http://localhost:3000`

---

## 📱 App Mobile (Expo)

1. Acesse a raiz do projeto (caso esteja na pasta backend):

```bash
cd ..
```

2. Crie o arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
EXPO_PUBLIC_API_IP=http://SEU-IP-LOCAL:3000/upload
```

> Substitua `SEU-IP-LOCAL` pelo IP local da sua máquina (ex: `192.168.0.105`).
> No Android, use o comando: `adb reverse tcp:3000 tcp:3000`

3. Instale as dependências do app:

```bash
npm install
```

4. Inicie o Expo:

```bash
npm run start
```

---

## 📚 Funcionalidades

* Cadastro e login com Firebase Authentication
* Feed com postagens ordenadas por data
* Upload de imagens com localização e descrição
* Curtidas com contador
* Visualização de perfis públicos e pessoais
* Edição de perfil (foto, nome, telefone)
* Remoção de posts próprios
* Navegação estilo Instagram (bottom tab + stack)

---

## 🛠️ Tecnologias

* React Native + Expo
* Firebase Auth & Firestore
* Node.js + Express + Multer (para upload de imagens)
* Expo Location e ImagePicker

---

## 💡 Observações

* O app utiliza um servidor local para upload de imagens, portanto o IP deve estar correto no `.env`.
* Imagens são salvas em `backend/uploads/`.
* Use um emulador Android ou o app **Expo Go** para testar no celular.

---


