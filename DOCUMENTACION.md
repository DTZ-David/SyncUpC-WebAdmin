# 📱 SyncUpC - Plataforma Web de Administración

## 📋 Descripción General

SyncUpC es una plataforma web administrativa para la gestión de eventos universitarios en la Universidad Popular del Cesar. Permite al personal administrativo crear, gestionar y monitorear eventos académicos, así como controlar la asistencia y visualizar métricas.

---

## 🎯 Características Principales

### 🔐 Autenticación y Seguridad
- **Login seguro** con validación de dominio institucional `@unicesar.edu.co`
- **Registro de staff** con proceso multi-paso (3 pasos)
- **Control de roles**: Solo permite acceso a personal administrativo (no estudiantes)
- **Validaciones robustas**: Contraseñas seguras (8+ caracteres, mayúsculas, minúsculas, números)

### 📅 Gestión de Eventos
- **Crear y editar eventos** con formulario multi-paso (4 pasos)
- **Información completa**: título, objetivo, fechas, ubicación, audiencia
- **Eventos virtuales y presenciales** con soporte para URLs de reunión
- **Gestión de campus y espacios** conectada al backend
- **Categorías y tipos de eventos** personalizables
- **Galería de imágenes** para cada evento

### 👥 Gestión de Asistentes
- **Lista de asistentes** por evento
- **Control de asistencia** en tiempo real
- **Filtrado y búsqueda** de participantes

### 📊 Dashboard y Métricas
- **Panel principal** con estadísticas en tiempo real
- **Eventos recientes** con acceso rápido
- **Métricas detalladas**: asistencias, tasas de participación, tendencias
- **Visualización de datos** clara y concisa

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── Auth/              # Autenticación (Login, Registro)
│   ├── Dashboard/         # Panel principal
│   ├── Events/           # Gestión de eventos
│   │   ├── ui/           # Componentes principales (EventList, EventForm, EventDetails)
│   │   ├── Sections/     # Secciones del formulario
│   │   ├── hooks/        # Lógica de negocio
│   │   └── Types/        # Tipos TypeScript
│   ├── Attendees/        # Gestión de asistentes
│   ├── Metrics/          # Métricas y reportes
│   ├── Layout/           # Header, Sidebar
│   ├── EventImages/      # Galería de imágenes
│   └── shared/           # Componentes reutilizables (Modales)
├── services/
│   ├── api/              # Servicios API (authService, eventService, etc.)
│   ├── config/           # Configuración (apiConfig, supabaseService)
│   └── types/            # Tipos del backend
├── context/              # Context API (AuthContext)
└── App.tsx               # Componente principal
```

---

## 🔧 Tecnologías Utilizadas

- **React 18** + **TypeScript** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos y diseño
- **Lucide React** - Iconos
- **Supabase** - Backend y almacenamiento de imágenes
- **API REST** - Comunicación con backend .NET

---

## 📝 Flujos Principales

### 1️⃣ Flujo de Autenticación

```
Login → Validación @unicesar.edu.co → Verificación de rol → Dashboard
```

**Validaciones:**
- Email con formato válido
- Email termina en `@unicesar.edu.co`
- Contraseña mínimo 8 caracteres
- Solo roles: `staff`, `admin`, `staffmember`

### 2️⃣ Flujo de Creación de Evento

```
Paso 1: Información Básica
  ↓ (Título 5-200 caracteres, Objetivo 10-1000 caracteres)
Paso 2: Fecha y Ubicación
  ↓ (Fecha/hora, campus/espacio o URL virtual)
Paso 3: Audiencia y Configuración
  ↓ (Profesores, estudiantes, administrativos, capacidad)
Paso 4: Detalles Finales
  ↓ (Categorías, tipos, imágenes opcionales)
Enviar → Backend → Confirmación
```

### 3️⃣ Flujo de Gestión de Asistencia

```
EventList → Ver Asistentes → AttendeeList → Control de asistencia
```

---

## 🎨 Componentes Principales

### App.tsx
Componente raíz que maneja:
- Estado de autenticación
- Navegación entre tabs
- Modales globales (AlertModal, ConfirmModal)
- Renderizado condicional según autenticación

### EventForm
Formulario multi-paso para crear/editar eventos:
- **BasicInfoStep**: Título y objetivo
- **DateTimeLocationStep**: Fechas, horarios, ubicación
- **AudienceConfigStep**: Audiencia objetivo, configuraciones
- **FinalDetailsStep**: Categorías, tipos, imágenes

### EventList
Lista de eventos con:
- Búsqueda y filtros
- Tarjetas de eventos con información resumida
- Acciones: Ver, Editar, Eliminar, Ver Asistentes

### Dashboard
Panel principal con:
- 4 tarjetas de estadísticas
- Lista de eventos recientes
- Navegación rápida a detalles

---

## 🔐 Validaciones Implementadas

### Autenticación
- ✅ Email institucional `@unicesar.edu.co` (Login y Registro)
- ✅ Contraseña segura: 8+ caracteres, 1 mayúscula, 1 minúscula, 1 número
- ✅ Validación de rol del servidor
- ✅ Nombres/apellidos mínimo 2 caracteres
- ✅ Teléfono 10 dígitos (opcional)

### Eventos
- ✅ Título: 5-200 caracteres
- ✅ Objetivo: 10-1000 caracteres
- ✅ Fechas: No anteriores a hoy
- ✅ Fecha fin > Fecha inicio
- ✅ Registro finaliza antes del evento
- ✅ Ubicación: Campus + espacio (presencial) o URL válida (virtual)
- ✅ Capacidad: 1-10,000 personas
- ✅ Al menos una audiencia objetivo

---

## 🌐 Servicios API

### authService
```typescript
login(credentials) // Login con validación de rol
logout() // Cierre de sesión
getCurrentUser() // Usuario actual
isAuthenticated() // Verificar sesión
```

### eventService
```typescript
getAllEvents() // Obtener todos los eventos
getEventById(id) // Obtener evento específico
createEvent(data) // Crear nuevo evento
updateEvent(id, data) // Actualizar evento
deleteEvent(id) // Eliminar evento
```

### eventMetadataService
```typescript
getCampuses() // Obtener sedes
getSpacesByCampusId(id) // Obtener espacios por sede
getEventCategories() // Obtener categorías
getEventTypes() // Obtener tipos de evento
```

### apiClient
Cliente HTTP centralizado:
- Headers automáticos
- Gestión de tokens
- Manejo de errores
- Timeout configurado (30s)

---

## 🎨 Sistema de Modales

### AlertModal
Para mensajes informativos:
```typescript
// Tipos: info, success, warning, error
setAlertModal({
  isOpen: true,
  title: "Título",
  message: "Mensaje",
  type: "success"
});
```

### ConfirmModal
Para confirmaciones:
```typescript
setConfirmModal({
  isOpen: true,
  title: "Confirmar",
  message: "¿Seguro?",
  type: "warning",
  onConfirm: () => { /* acción */ }
});
```

---

## 📱 Diseño Responsive

- **Desktop**: Sidebar fija + contenido principal
- **Tablet**: Sidebar colapsable
- **Mobile**: Menú hamburguesa + navegación adaptada

---

## 🚀 Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

---

## 📌 Variables de Entorno

```env
VITE_API_BASE_URL=https://api.syncupc.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🔄 Estados Globales

### App Level
- `isAuthenticated`: Estado de autenticación
- `currentUser`: Usuario actual
- `activeTab`: Tab activa en navegación
- `alertModal`: Estado del modal de alerta
- `confirmModal`: Estado del modal de confirmación

### EventForm
- `formData`: Datos del formulario
- `currentStep`: Paso actual (0-3)
- `errors`: Errores de validación
- `isSubmitting`: Estado de envío

---

## 🎯 Mejores Prácticas Implementadas

✅ TypeScript estricto para type safety
✅ Componentes reutilizables y modulares
✅ Custom hooks para lógica de negocio
✅ Validaciones client-side robustas
✅ Manejo centralizado de errores
✅ Modales profesionales (no `alert()`/`confirm()`)
✅ Loading states en todas las operaciones
✅ Responsive design con Tailwind
✅ Código documentado y organizado

---

## 📞 Soporte

Para preguntas o soporte técnico sobre la plataforma, contactar al equipo de desarrollo de SyncUpC.

---

**Versión**: 1.0.0
**Última actualización**: Octubre 2025
