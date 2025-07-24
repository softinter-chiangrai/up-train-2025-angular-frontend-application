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
- `--style=css`: ใช้ CSS เป็น style format (จะเปลี่ยนเป็น Tailwind ภายหลัง)
- `--skip-git`: ไม่สร้าง git repository (เนื่องจากเราใช้ template repository แล้ว)

### 2. ติดตั้ง Tailwind CSS

```bash
# ติดตั้ง Tailwind CSS และ dependencies
npm install -D tailwindcss@3 postcss autoprefixer

# สร้างไฟล์ config
npx tailwindcss init -p
```

### 3. ตั้งค่า Tailwind Configuration

แก้ไขไฟล์ `tailwind.config.js`:

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

### 4. เพิ่ม Tailwind directives

แก้ไขไฟล์ `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles สำหรับ Todo App */
body {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
}
```

### 5. ทดสอบ Tailwind CSS

แก้ไขไฟล์ `src/app/app.component.html`:

```html
<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-4 text-center">
      🎯 Todo App Workshop
    </h1>
    <p class="text-gray-600 text-center">
      Angular 18 + Tailwind CSS
    </p>
    
    <!-- ทดสอบ Tailwind Classes -->
    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <p class="text-blue-800 text-sm">
        ✅ Tailwind CSS ทำงานได้แล้ว!
      </p>
    </div>
  </div>
</div>
```

### 6. รันและทดสอบ Project

```bash
# รัน development server
ng serve

# หรือ
npm start
```

เปิด browser ไปที่ `http://localhost:4200` จะเห็นหน้าตาแบบนี้:

![Project Setup Result](../assets/step-0-result.png)

## 📁 Project Structure หลังจาก Setup

```
up-train-2025-angular-frontend-application/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.config.ts
│   ├── assets/
│   ├── styles.css
│   └── main.ts
├── tailwind.config.js
├── angular.json
├── package.json
└── tsconfig.json
```

## 🎨 Tailwind CSS เบื้องต้น

### Colors ที่สามารถใช้ใน Todo App

```css
/* Primary Colors */
bg-blue-500    /* ปุ่ม primary */
bg-green-500   /* สถานะ completed */
bg-red-500     /* ปุ่ม delete */
bg-yellow-500  /* ปุ่ม edit */

/* Background Colors */
bg-gray-50     /* background หลัก */
bg-white       /* card background */
bg-gray-100    /* input background */

/* Text Colors */
text-gray-800  /* text หลัก */
text-gray-600  /* text รอง */
text-green-600 /* completed text */
```

### Layout Classes ที่จะใช้บ่อย

```css
/* Container & Layout */
max-w-md mx-auto  /* centered container */
min-h-screen      /* full height */
p-4, p-6          /* padding */
m-2, m-4          /* margin */

/* Flexbox */
flex items-center justify-between
flex-col          /* vertical flex */

/* Border & Shadow */
rounded-lg        /* rounded corners */
shadow-md         /* drop shadow */
border border-gray-200
```

## ✅ Checklist

เมื่อทำเสร็จแล้ว คุณควรจะมี:

- [ ] Angular project ที่รันได้
- [ ] Tailwind CSS ที่ทำงานได้
- [ ] หน้าเว็บที่แสดงข้อความทดสอบ
- [ ] ไม่มี error ใน console
- [ ] Project structure ที่ถูกต้อง

## 🚨 Common Issues & Solutions

### Issue 1: Tailwind styles ไม่ทำงาน
**Solution**: ตรวจสอบว่า:
- ไฟล์ `tailwind.config.js` มี content path ที่ถูกต้อง
- เพิ่ม `@tailwind` directives ใน `styles.css` แล้ว
- รัน `ng serve` ใหม่

### Issue 2: Angular CLI ไม่พบ
**Solution**: ติดตั้ง Angular CLI globally
```bash
npm install -g @angular/cli@18
```

### Issue 3: Node.js version ไม่รองรับ
**Solution**: ใช้ Node.js version 18+ 
```bash
node --version  # ควรได้ v22.x.x หรือสูงกว่า
```

### Issue 4: ไม่พบ node_modules
**Solution**: รันคำสั่ง `npm install` ใน project directory เพื่อดาวน์โหลด dependencies
```bash
npm install
```

## 🎓 สิ่งที่เรียนรู้ใน Step นี้

1. **การสร้าง Angular project** พร้อม options ต่าง ๆ
2. **การติดตั้งและตั้งค่า Tailwind CSS** ใน Angular
3. **Tailwind configuration** และ content paths
4. **CSS utilities classes** เบื้องต้น
5. **Project structure** ของ Angular

## 🔄 Next Step

[👉 ไปต่อที่ Step 1: Basic Component Structure](./step-1-components.md)

---

💡 **เคล็ดลับ**: ใช้ [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension ใน VS Code เพื่อได้ autocomplete และ preview ของ classes!