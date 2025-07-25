# Step 0: Project Setup

🎯 **เป้าหมาย**: สร้าง Angular project พื้นฐานและติดตั้ง Tailwind CSS

## 📋 สิ่งที่จะทำใน Step นี้

- [ ] สร้าง Angular project ใหม่
- [ ] ติดตั้งและตั้งค่า Tailwind CSS
- [ ] ทดสอบการทำงานของ project
- [ ] ตั้งค่า project structure พื้นฐาน

## 🚀 Getting Started

### 1. สร้าง Angular Project

```bash
# สร้าง Angular project ใหม่
ng new up-train-2025-angular-frontend-application --routing --style=css --skip-git

# เข้าไปใน project directory
cd up-train-2025-angular-frontend-application
```

**คำอธิบาย Options:**
- `--routing`: เพิ่ม Angular Router
- `--style=css`: ใช้ CSS เป็น style format
- `--skip-git`: ไม่สร้าง git repository (ถ้าใช้ template repository)

### 2. ติดตั้ง Tailwind CSS

```bash
# ติดตั้ง Tailwind CSS และ dependencies
npm install -D tailwindcss@3 postcss autoprefixer

# สร้างไฟล์ config
npx tailwindcss init -p
```

### 3. ตั้งค่า Tailwind CSS

**แก้ไขไฟล์ `tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**แก้ไขไฟล์ `src/styles.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### 4. ทดสอบ Tailwind CSS

**แก้ไขไฟล์ `src/app/app.component.html`:**

```html
<div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white p-8 rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">
      🚀 Angular + Tailwind CSS
    </h1>
    <p class="text-gray-600">
      Project setup สำเร็จแล้ว! พร้อมสำหรับ Step ถัดไป
    </p>
  </div>
</div>
```

### 5. รันโปรเจค

```bash
# เริ่ม development server
ng serve

# หรือใช้
npm start
```

เปิดเบราว์เซอร์ที่ `http://localhost:4200` คุณควรเห็นหน้าจอสีฟ้าสวยๆ

## ✅ ตรวจสอบผลลัพธ์

- [ ] โปรเจค Angular 18 ทำงานได้
- [ ] Tailwind CSS ทำงานได้ (เห็นสีและ styling)
- [ ] ไม่มี error ใน console
- [ ] หน้าจอแสดงข้อความ "Angular + Tailwind CSS"

## 🐛 Troubleshooting

### ปัญหาที่อาจพบ

**1. ng command not found**
```bash
npm install -g @angular/cli@18
```

**2. Tailwind CSS ไม่ทำงาน**
- ตรวจสอบ `content` path ใน `tailwind.config.js`
- ตรวจสอบ `@tailwind` directives ใน `styles.css`
- Restart development server

**3. Port 4200 ถูกใช้แล้ว**
```bash
ng serve --port 4201
```

## 📚 เรียนรู้เพิ่มเติม

- [Angular CLI](https://angular.io/cli)
- [Tailwind CSS Installation](https://tailwindcss.com/docs/installation)
- [Angular Project Structure](https://angular.io/guide/file-structure)

## 🔗 ขั้นตอนถัดไป

✅ **สำเร็จแล้ว?** ไปต่อที่ [Step 1: Models & Interfaces](./step-1-models.md)

---

<div align="center">
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a> | 
  <a href="./step-1-models.md">➡️ Step 1: Models</a>
</div>
