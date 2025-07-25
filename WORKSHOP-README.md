# 🚀 Angular 18 Todo App Workshop

> **Interactive Workshop สำหรับเรียนรู้ Angular 18 + Tailwind CSS + Services**

## 🎯 เป้าหมายของ Workshop

สร้าง Todo Application ด้วย Angular 18 โดยเรียนรู้:

- ✅ **Angular 18 Features**: Standalone Components, Signals, New Control Flow
- ✅ **Tailwind CSS**: Utility-first CSS Framework
- ✅ **TypeScript**: Strong typing และ interfaces
- ✅ **Services & HTTP**: การเชื่อมต่อ API
- ✅ **Forms**: Reactive Forms และ Validation
- ✅ **State Management**: การจัดการ state ด้วย Signals

## 📚 สารบัญ Workshop

| Step | หัวข้อ | เวลาโดยประมาณ | สิ่งที่จะได้เรียนรู้ |
|------|--------|---------------|-------------------|
| [Step 0](./docs/step-0-setup.md) | Project Setup | 15 นาที | สร้างโปรเจค + ติดตั้ง Tailwind |
| [Step 1](./docs/step-1-models.md) | Models & Interfaces | 10 นาที | TypeScript interfaces |
| [Step 2](./docs/step-2-services.md) | Todo Service | 20 นาที | HTTP Client, Observable |
| [Step 3](./docs/step-3-components.md) | Components | 25 นาที | Standalone Components, Signals |
| [Step 4](./docs/step-4-forms.md) | Forms | 20 นาที | Reactive Forms, Validation |
| [Step 5](./docs/step-5-styling.md) | Styling | 15 นาที | Tailwind CSS Classes |
| [Step 6](./docs/step-6-integration.md) | API Integration | 20 นาที | เชื่อมต่อ Backend API |
| [Step 7](./docs/step-7-enhancement.md) | Enhancements | 15 นาที | Features เพิ่มเติม |

**⏱️ รวมเวลา: ประมาณ 2.5 ชั่วโมง**

## 🛠️ เตรียมเครื่องมือ

### Required Tools
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) หรือ [yarn](https://yarnpkg.com/)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli@18`)
- Code Editor ([VS Code](https://code.visualstudio.com/) แนะนำ)

### Recommended VS Code Extensions
- Angular Language Service
- Angular Snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag

### ตรวจสอบ Version
```bash
node --version    # ควรเป็น v22+
npm --version     # ควรเป็น v10+
ng version        # ควรเป็น Angular CLI v18+
```

## 🏃‍♂️ Quick Start

### Option 1: ใช้ Template Repository (แนะนำ)
```bash
# 1. คลิก "Use this template" บน GitHub
# 2. Clone repository ของคุณ
git clone https://github.com/softinter-chiangrai/up-train-2025-angular-frontend-application.git
cd YOUR_REPO_NAME

# 3. ติดตั้ง dependencies
npm install

# 4. เริ่มต้น development server
npm start
```

### Option 2: สร้างจากศูนย์
```bash
# เริ่มจาก Step 0
# ดู docs/step-0-setup.md สำหรับรายละเอียด
```

## 📖 วิธีใช้ Workshop

1. **เริ่มจาก Step 0** และทำตามลำดับ
2. **แต่ละ Step จะมี**:
   - 🎯 เป้าหมายที่ชัดเจน
   - 📝 คำแนะนำทีละขั้นตอน
   - 💻 Code examples
   - ✅ Checklist สำหรับตรวจสอบ
   - 🔗 Link ไปยัง Step ถัดไป

3. **หากติดปัญหา**:
   - ดูใน `examples/` folder สำหรับ reference code
   - ตรวจสอบ `troubleshooting.md`
   - เปิด Issue บน GitHub

## 🌟 Features ที่จะสร้าง

- ➕ เพิ่ม Todo ใหม่
- ✏️ แก้ไข Todo
- ✅ ทำเครื่องหมายสำเร็จ
- 🗑️ ลบ Todo
- 📊 แสดงสถิติ (Total, Completed, Pending)
- 🔄 Refresh ข้อมูล
- 💾 บันทึกข้อมูลผ่าน API
- 📱 Responsive Design

## 🎨 Preview

<details>
<summary>📱 หน้าตาแอปที่จะได้</summary>

```
┌─────────────────────────┐
│     📝 Todo App         │
│ Angular 18 + Components │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Add new todo...     │ │
│ │              [Add]  │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Total: 5 │ ✅: 2 │ ⏳: 3 │
├─────────────────────────┤
│ ☐ Learn Angular        │
│ ☑ Setup Tailwind  [🗑] │
│ ☐ Build Todo App   [🗑] │
│ ☐ Deploy to GitHub [🗑] │
└─────────────────────────┘
```

</details>

## 📁 โครงสร้างโปรเจค

```
src/
├── app/
│   ├── components/
│   │   ├── todo-app/           # Main component
│   │   └── todo-form/          # Form component
│   ├── models/
│   │   └── todo.model.ts       # TypeScript interfaces
│   ├── services/
│   │   └── todo.service.ts     # HTTP service
│   └── app.component.ts        # Root component
├── styles.css                  # Global Tailwind styles
└── index.html
```

## 🤝 Contributing

หากต้องการช่วยปรับปรุง Workshop:

1. Fork repository
2. สร้าง feature branch (`git checkout -b feature/amazing-improvement`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add amazing improvement'`)
4. Push ไปยัง branch (`git push origin feature/amazing-improvement`)
5. เปิด Pull Request

## 📞 ติดต่อ

- 🐛 **พบ Bug**: เปิด [Issue](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)
- 💡 **ข้อเสนอแนะ**: เปิด [Discussion](https://github.com/YOUR_USERNAME/YOUR_REPO/discussions)
- 📧 **อื่นๆ**: your-email@example.com

## 📄 License

MIT License - ดูใน [LICENSE](LICENSE) file

---

<div align="center">

**🚀 พร้อมแล้วหรือยัง? เริ่มต้นที่ [Step 0: Project Setup](./docs/step-0-setup.md)**

Made with ❤️ for Angular learners

</div>
