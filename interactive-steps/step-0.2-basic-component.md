# Step 0.2: สร้าง Basic Component

## 🎯 เป้าหมายของ Step นี้
เรียนรู้การสร้าง **Angular Standalone Component** พื้นฐาน

---

## 📚 สิ่งที่จะได้เรียนรู้
- Angular Standalone Components
- Component Generator
- Component Structure
- Basic Template

---

## 📋 Prerequisites
- ✅ Step 0.1 เสร็จแล้ว (Todo Model Interface)

---

## 📝 Task: สร้าง TodoApp Component

### 1. Generate Component ด้วย Angular CLI

```bash
# สร้าง component โดยใช้ Angular CLI
ng generate component components/todo-app --standalone --skip-tests

# หรือ short form
ng g c components/todo-app --standalone --skip-tests
```

### 2. เข้าใจโครงสร้างไฟล์ที่สร้างขึ้น

```
src/app/components/todo-app/
├── todo-app.component.ts     # Component Class
├── todo-app.component.html   # Template
└── todo-app.component.css    # Styles
```

### 3. แก้ไข Component Class

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.ts`:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-app',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-app.component.html',
  styleUrls: ['./todo-app.component.css']
})
export class TodoAppComponent {
  // TODO: เพิ่ม property title
  title = '';

  // TODO: เพิ่ม method sayHello ที่ return string
  sayHello(): string {
    // เขียนโค้ดตรงนี้
    return '';
  }
}
```

### 4. แก้ไข Template

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.html`:

```html
<!-- TODO: สร้าง template ที่แสดง -->
<!-- - ข้อความ "Hello from TodoApp Component!" -->
<!-- - แสดงค่าจาก property title -->
<!-- - แสดงผลจาก method sayHello() -->

<div class="container">
  <!-- เขียน HTML ตรงนี้ -->
</div>
```

### 5. เพิ่ม Basic Styles

แก้ไขไฟล์ `src/app/components/todo-app/todo-app.component.css`:

```css
/* TODO: เพิ่ม CSS สำหรับ .container */
.container {
  /* เขียน CSS ตรงนี้ */
}
```

---

## 🔍 Self-Check: ตรวจสอบด้วยตัวเอง

### Test 1: Component Structure

ตรวจสอบว่ามีไฟล์ครบ:
- ✅ `todo-app.component.ts`
- ✅ `todo-app.component.html`
- ✅ `todo-app.component.css`

### Test 2: Import Component

แก้ไข `src/app/app.component.ts` เพื่อทดสอบ:

```typescript
import { Component } from '@angular/core';
import { TodoAppComponent } from './components/todo-app/todo-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoAppComponent], // เพิ่ม import
  template: `
    <h1>Welcome to Angular!</h1>
    <app-todo-app></app-todo-app>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-app';
}
```

### Test 3: Run Application

```bash
# รัน development server
npm start

# เปิด browser ไปที่
http://localhost:4200
```

---

## ✅ Checkpoint: ผลลัพธ์ที่ควรได้

### 1. Component Files Created
```
src/app/components/todo-app/
├── todo-app.component.ts     ✅
├── todo-app.component.html   ✅
└── todo-app.component.css    ✅
```

### 2. Working Component Class
```typescript
export class TodoAppComponent {
  title = 'My Todo App';

  sayHello(): string {
    return 'Hello from TodoApp Component!';
  }
}
```

### 3. Working Template
```html
<div class="container">
  <h2>Hello from TodoApp Component!</h2>
  <p>Title: {{ title }}</p>
  <p>Message: {{ sayHello() }}</p>
</div>
```

### 4. Basic Styles
```css
.container {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 20px;
}
```

### 5. Browser Output
หน้าเว็บแสดง:
- "Hello from TodoApp Component!"
- Title และ Message ที่กำหนด

---

## 🎓 สิ่งที่เรียนรู้ในขั้นนี้

### ✅ Angular Standalone Components
- ไม่ต้องใช้ NgModule
- Import dependencies โดยตรง
- Self-contained components

### ✅ Component Architecture
- Component Class
- Template (HTML)
- Styles (CSS)
- Selector

### ✅ Angular CLI
- การใช้ `ng generate component`
- Command line options
- File structure generation

### ✅ Template Syntax
- Interpolation `{{ }}`
- Property binding
- Method calling

---

## 🔧 Troubleshooting

### ❌ Error: "ng command not found"
**Solution**: ติดตั้ง Angular CLI
```bash
npm install -g @angular/cli
```

### ❌ Error: "Cannot find module"
**Solution**: ตรวจสอบ import path ใน app.component.ts

### ❌ Component ไม่แสดงในหน้าเว็บ
**Solution**: 
1. ตรวจสอบ import ใน app.component.ts
2. ตรวจสอบ selector name
3. ตรวจสอบ template syntax

### ❌ CSS ไม่มีผล
**Solution**: ตรวจสอบ class name ใน HTML และ CSS

---

## 🚀 พร้อมไป Step ถัดไป?

เมื่อผ่าน Checkpoint แล้ว:
👉 [Step 0.3: Component State ด้วย Signals](./step-0.3-component-state.md)

---

## 💡 เคล็ดลับ

1. **Standalone Components**: เทรนด์ใหม่ของ Angular 18+
2. **Angular CLI**: ช่วยสร้าง boilerplate code
3. **File Organization**: จัดกลุ่มไฟล์ในโฟลเดอร์เดียวกัน
4. **Hot Reload**: เปลี่ยนโค้ดแล้วหน้าเว็บ refresh อัตโนมัติ

---

**🎯 Goal Achieved**: สร้าง Angular Component พื้นฐานได้แล้ว!
