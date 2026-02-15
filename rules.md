# 🐆 Leopard Architectural Rules (hebrew-learn-app)

This document serves as the **Source of Truth** for all coding practices in this project. All new features and refactors must strictly adhere to these patterns.

---

## 🏗️ 1. Directory Structure & Layers

We follow a strict **Atomic Design** philosophy combined with a **Domain-Driven** logic layer.

### **Components (`components/`)**
-   **Atoms**: Pure UI primitives (e.g., `Text`, `Button`). **Rule**: No business logic, no hooks (except basic UI hooks like animations). Must be generic.
-   **Molecules**: Simple groups of atoms (e.g., `OptionItem`). **Rule**: Can handle UI-only state (e.g., isPressed), but no service/API calls.
-   **Organisms**: Complex business entities (e.g., `QuestionCard`). **Rule**: Can handle form state, but should receive data/callbacks via props.
-   **Templates**: Layout orchestrators (e.g., `WelcomeTemplate`). **Rule**: Defines the structure of the page. Receives data from the "Page" and passes it to Organisms.
-   **Skeletons**: Loading UI for organisms.

### **Pages (`app/`)**
-   Routes in the `app/` directory should be **thin**.
-   **Rule**: Pages should only:
    1. Resolve route params.
    2. Call the required business logic hooks.
    3. Pass data to a **Template**.
-   **NEVER** write raw UI or complex logic inside `app/[route].tsx`.

---

## 🧠 2. Logic & State Management

### **Custom Hooks (`hooks/`)**
-   All business logic belongs in **Custom Hooks**, organized by domain (e.g., `hooks/Auth`, `hooks/Exercises`).
-   **Rule**: Components should not know *how* data is fetched, only *what* data is available.

### **API Layer (`utils/api/`)**
-   **Rule**: API calls are strictly abstracted into Service classes (e.g., `AuthApi.ts`).
-   Use the `HttpClient.ts` for consistency + interceptors.
-   **NO** raw `axios` or `fetch` calls inside hooks or components.

---

## 📦 3. Barrel Exports & Imports

### **Strict Barrel Enforcement**
-   Every folder in `components/`, `hooks/`, and `types/` must have an `index.ts` file.
-   **Rule**: Always import from the folder root, not the file.
    -   ✅ `import { Text } from '@/atoms';`
    -   ❌ `import { Text } from '@/atoms/Text';`

### **Path Aliases**
-   Use `@/` aliases defined in `tsconfig.json` for all internal imports.

---

## 🎨 4. Styling & Theme

-   **Design System**: Use the semantic `theme` system.
-   **Rule**: **ZERO hardcoded hex codes** in components.
-   Use `designSystem.ts` (or `@rn-vui/themed` constants) for colors, spacing, and typography.

---

## 🏷️ 5. TypeScript & Data

-   **Strict Mode**: Enabled. Avoid `any` at all costs.
-   **Domain Types**: Define domain models in `types/`.
-   **API Types**: Separate DTOs (Data Transfer Objects) from UI models if they differ.
-   **Enums/Constants**: Use `utils/constants/` (e.g., `AppRoutes.ts`) for all magic strings.

---

## ✅ 6. Checklist Before Committing
1.  Is the code in the correct Atomic layer?
2.  Is logic separated into a custom hook?
3.  Are all imports via barrel files?
4.  Are there any hardcoded hex colors? (Remove them).
5.  Does `yarn tsc` pass?

---

**Remember**: If a pattern doesn't exist in the **Leopard Reference**, do not invent a new one. Follow the existing isolation and abstraction rules.
