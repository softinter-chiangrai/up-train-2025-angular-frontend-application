# 🛠️ Troubleshooting Guide

คู่มือแก้ไขปัญหาที่พบบ่อยใน Angular Todo App Workshop

## 🚨 ปัญหาที่พบบ่อย

### 1. การติดตั้งและตั้งค่า

#### ❌ `ng: command not found`

**สาเหตุ**: Angular CLI ไม่ได้ติดตั้งหรือไม่อยู่ใน PATH

**วิธีแก้**:
```bash
# ติดตั้ง Angular CLI แบบ global
npm install -g @angular/cli@18

# ตรวจสอบการติดตั้ง
ng version
```

#### ❌ `npm ERR! peer dep missing`

**สาเหตุ**: Dependencies ไม่ตรงกัน

**วิธีแก้**:
```bash
# ลบ node_modules และ package-lock.json
rm -rf node_modules package-lock.json

# ติดตั้งใหม่
npm install

# หรือใช้ --force flag
npm install --force
```

#### ❌ Tailwind CSS ไม่ทำงาน

**สาเหตุ**: Configuration ไม่ถูกต้อง

**วิธีแก้**:
1. ตรวจสอบ `tailwind.config.js`:
```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"], // ✅ ต้องมี
  // ...
}
```

2. ตรวจสอบ `src/styles.css`:
```css
@tailwind base;    /* ✅ ต้องมี */
@tailwind components;
@tailwind utilities;
```

3. Restart development server:
```bash
ng serve
```

### 2. TypeScript Errors

#### ❌ `Property 'id' does not exist on type 'Todo'`

**สาเหตุ**: Interface definition ไม่ครบ

**วิธีแก้**:
```typescript
// ✅ ถูกต้อง
export interface Todo {
  id?: number;  // Optional property
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

#### ❌ `Type 'string' is not assignable to type 'Date'`

**สาเหตุ**: API ส่งข้อมูลเป็น string แต่ interface ต้องการ Date

**วิธีแก้**:
```typescript
// ใน service
getTodos(): Observable<Todo[]> {
  return this.http.get<Todo[]>(`${this.apiUrl}/todos`).pipe(
    map(todos => todos.map(todo => ({
      ...todo,
      createdAt: new Date(todo.createdAt) // ✅ แปลง string เป็น Date
    })))
  );
}
```

### 3. Signals และ Components

#### ❌ `Cannot read properties of undefined (reading 'asReadonly')`

**สาเหตุ**: Signal ไม่ได้ initialize

**วิธีแก้**:
```typescript
// ❌ ผิด
private _todos = signal<Todo[]>();

// ✅ ถูกต้อง
private _todos = signal<Todo[]>([]);
```

#### ❌ `ExpressionChangedAfterItHasBeenCheckedError`

**สาเหตุ**: State เปลี่ยนแปลงระหว่าง change detection cycle

**วิธีแก้**:
```typescript
// ใช้ setTimeout หรือ scheduleTask
setTimeout(() => {
  this._isLoading.set(false);
}, 0);

// หรือใช้ effect
effect(() => {
  // Handle side effects here
});
```

### 4. HTTP และ API

#### ❌ `CORS policy: No 'Access-Control-Allow-Origin' header`

**สาเหตุ**: CORS configuration

**วิธีแก้**:
1. **ใช้ Angular CLI Proxy** (แนะนำสำหรับ development):

สร้าง `proxy.conf.json`:
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": true,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

เพิ่มใน `angular.json`:
```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

2. **JSON Server CORS**:
```javascript
// ใน server.js
const cors = require('cors');
server.use(cors());
```

#### ❌ `HttpClient provider not found`

**สาเหตุ**: HttpClient ไม่ได้ provide

**วิธีแก้**:
```typescript
// ใน app.config.ts
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(), // ✅ เพิ่มบรรทัดนี้
  ]
};
```

### 5. JSON Server

#### ❌ `Error: Cannot find module 'json-server'`

**วิธีแก้**:
```bash
# ติดตั้งแบบ global
npm install -g json-server

# หรือแบบ local
npm install --save-dev json-server
```

#### ❌ `EADDRINUSE: address already in use :::3000`

**วิธีแก้**:
```bash
# หา process ที่ใช้ port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# หรือใช้ port อื่น
json-server --watch db.json --port 3001
```

### 6. Styling และ Layout

#### ❌ Dark mode ไม่เปลี่ยน

**วิธีแก้**:
1. ตรวจสอบ Tailwind config:
```javascript
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'], // ✅ ต้องมี
  // ...
}
```

2. ตรวจสอบ class application:
```typescript
// ใน theme.service.ts
private applyTheme(theme: 'light' | 'dark'): void {
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    html.classList.add('dark');
  } else {
    html.setAttribute('data-theme', 'light');
    html.classList.remove('dark');
  }
}
```

#### ❌ Responsive design ไม่ทำงาน

**วิธีแก้**:
```html
<!-- ตรวจสอบ viewport meta tag ใน index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- ใช้ responsive classes ที่ถูกต้อง -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  <!-- content -->
</div>
```

## 🔍 การ Debug

### 1. ใช้ Browser DevTools

```typescript
// เพิ่ม console.log สำหรับ debug
ngOnInit(): void {
  console.log('Component initialized');
  this.loadTodos();
}

// ใช้ debugger
onTodoAdded(title: string): void {
  debugger; // Browser จะ pause ที่นี่
  this.addTodo(title);
}
```

### 2. Angular DevTools

ติดตั้ง Angular DevTools extension:
- [Chrome](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/angular-devtools/)

### 3. Network Tab

ตรวจสอบ HTTP requests:
1. เปิด F12 → Network tab
2. ดู request/response
3. ตรวจสอบ status codes
4. ดู request headers

## 📝 Code Quality

### 1. TypeScript Strict Mode

```json
// ใน tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. ESLint Configuration

```bash
ng add @angular-eslint/schematics
```

### 3. Best Practices

```typescript
// ✅ ใช้ readonly signals
private _todos = signal<Todo[]>([]);
todos = this._todos.asReadonly();

// ✅ Type guards
private isTodo(obj: any): obj is Todo {
  return obj && typeof obj.title === 'string';
}

// ✅ Error handling
catchError(error => {
  console.error('Error:', error);
  return throwError(() => new Error('Something went wrong'));
})
```

## 🧪 Testing Issues

### ❌ `NullInjectorError: No provider for HttpClient`

**วิธีแก้**:
```typescript
// ใน spec file
import { HttpClientTestingModule } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule], // ✅ เพิ่มบรรทัดนี้
    // ...
  });
});
```

### ❌ `Can't resolve all parameters for...`

**วิธีแก้**:
```typescript
// ใช้ inject() แทน constructor injection ใน standalone components
export class MyComponent {
  private service = inject(MyService); // ✅ ใช้แทน

  // แทน constructor injection
  // constructor(private service: MyService) {}
}
```

## 🚀 Performance Issues

### 1. Slow Change Detection

```typescript
// ✅ ใช้ OnPush strategy
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})

// ✅ ใช้ trackBy functions
trackByTodoId(index: number, todo: Todo): number {
  return todo.id || index;
}
```

### 2. Memory Leaks

```typescript
// ✅ Unsubscribe ใน ngOnDestroy
export class MyComponent implements OnDestroy {
  private subscriptions = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
```

## 📞 ขอความช่วยเหลือ

### 1. Official Resources
- [Angular Documentation](https://angular.io/docs)
- [Angular CLI Reference](https://angular.io/cli)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### 2. Community
- [Angular Discord](https://discord.gg/angular)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/angular)
- [Angular Reddit](https://www.reddit.com/r/Angular2/)

### 3. GitHub Issues
หากพบปัญหาใน workshop นี้:
1. ตรวจสอบ [Issues](https://github.com/YOUR_REPO/issues) ที่มีอยู่
2. สร้าง issue ใหม่พร้อมรายละเอียด:
   - Operating System
   - Node.js version
   - Angular CLI version
   - Error message (ถ้ามี)
   - Steps to reproduce

---

<div align="center">
  <a href="../WORKSHOP-README.md">🏠 กลับหน้าหลัก</a>
</div>
