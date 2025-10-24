# PMH DomDom Web - Next.js Project

> Web frontend cho hệ thống DOMDOM, sử dụng Next.js 13+, App Router, Ant Design, Zustand, Firebase Auth, đa ngôn ngữ và tích hợp API.

---

## 🚀 Công nghệ sử dụng

- [Next.js 13+](https://nextjs.org/docs) (App Router)
- [React 18](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Firebase Auth](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/v5)
- Hỗ trợ đa ngôn ngữ với `next-intl`

---

## 🧪 Yêu cầu hệ thống

- Node.js >= 22.x (bắt buột)
- Yarn 1.22.22 (Bắt buột)
- Docker & Docker Compose

## 🗂️ Cấu trúc thư mục chính

```
src/
├── app/                      # Next.js App Router
├── _components/              # Các component dùng chung
├── apiServices/              # Logic gọi API tập trung
├── contexts/                 # React context
├── hooks/                    # Custom hooks
├── stores/                   # Zustand state
├── models/                   # Kiểu dữ liệu / interface
├── styles/                   # Style tùy chỉnh
├── shared/                   # Các thành phần chia sẻ
├── utils/                    # Các hàm tiện ích
```

---

## ⚙️ Cài đặt & chạy dự án

### 1. Clone repo

```bash
git clone https://github.com/url../pmh-domdom-web.git
cd pmh-domdom-web
```

### 2. Cài dependencies

```bash
   yarn install --frozen-lockfile
```

## Environment Variables

| Key                                      | Description                               |
| ---------------------------------------- | ----------------------------------------- |
| NEXT_PUBLIC_BACKEND_API_URL              | API Server URL (should have trailing `/`) |
| NEXTAUTH_SECRET                          | Secret for Next Auth                      |
| NEXT_PUBLIC_GOOGLE_MAPS_KEY              | Google Maps API key                       |
| NEXT_PUBLIC_URL                          | Product URL                               |
| NEXT_PUBLIC_FACEBOOK_PIXEL_ID            | Facebook Pixel ID                         |
| NEXT_PUBLIC_URL_SOCKET                   | Socket URL                                |
| NEXT_PUBLIC_FIREBASE_API_KEY             | Firebase configuration keys               |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN         | Firebase configuration keys               |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID          | Firebase configuration keys               |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET      | Firebase configuration keys               |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Firebase configuration keys               |
| NEXT_PUBLIC_FIREBASE_APP_ID              | Firebase configuration keys               |
| NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID      | Firebase configuration keys               |
| NEXT_PUBLIC_GOOGLE_ANALYTIC              | Google Analytics key                      |

### 3. Tạo file `.env`

Sao chép file `.env.example` thành `.env` và cập nhật các biến môi trường cần thiết.

### 4. Chạy development

```bash
yarn dev
```

Trang sẽ chạy tại `http://localhost:3000`

---

## Running the Application

### Development Mode

Run the app in development mode with hot reloading:

## 🐳 Chạy với Docker

Build và chạy container:

```bash
docker build -t pmh-domdom-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_API_URL="https://api.domdom.com.vn/" \
  -e NEXTAUTH_SECRET="your_nextauth_secret" \
  -e NEXT_PUBLIC_GOOGLE_MAPS_KEY="your_google_maps_key" \
  # ... add other variables as needed ...
  pmh-domdom-web
```

---

## 🧪 Scripts

- `yarn dev`: Khởi chạy server dev
- `yarn build`: Build production
- `yarn start`: Chạy production build (mặc định port 80)
- `yarn lint`: Kiểm tra ESLint

---

## 🔐 Xác thực

Dự án sử dụng `next-auth` kết hợp với `Firebase` để xác thực người dùng.

---

## 🌐 Đa ngôn ngữ

Cấu trúc i18n được quản lý trong thư mục `src/app/[locale]` với hỗ trợ nhiều ngôn ngữ thông qua `next-intl`.

---

## 📁 CI/CD

Có cấu hình trong thư mục `cicd/` và file `cloudbuild.yaml` để deploy lên môi trường production .

---

## 📦 Production

Chạy production:

```bash
docker build -t pmh-domdom-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_API_URL="https://api.domdom.com.vn/" \
  -e NEXTAUTH_SECRET="your_nextauth_secret" \
  -e NEXT_PUBLIC_GOOGLE_MAPS_KEY="your_google_maps_key" \
  # ... add other variables as needed ...
  pmh-domdom-web
```

---

END