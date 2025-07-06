# Musicfy - Plataforma Musical 🎵  

Musicfy es una plataforma musical que conecta artistas con sus fans, permitiendo la creación, distribución y descubrimiento de música de manera intuitiva.  

## 🔐 Tipos de Usuarios  

### 🎤 Artistas (Singer)  
- Crean y gestionan su perfil artístico  
- Suben canciones y álbumes  
- Se asocian a géneros musicales  
- Administran su catálogo musical  

### 🎧 Usuarios Regulares  
- Descubren nuevos artistas y géneros  
- Reproducen música directamente en la plataforma  
- Exploran contenido musical organizado  

## 🛠️ Tecnologías Principales  

- **Frontend**: React + TypeScript  
- **Backend**: Firebase  
  - **Authentication**: Email/contraseña  
  - **Firestore**: Base de datos NoSQL  
  - **Storage**: Cloudinary (para imágenes y audios)  
  - **Analytics**: Seguimiento completo de interacciones  
- **Estilos**: CSS Modules  

## 🗃️ Estructura de Firestore  

Colecciones principales:  

### **genres**  
- `createdAt`: timestamp  
- `createdBy`: string (userId)  
- `id`: string  
- `imageUrl`: string  
- `name`: string  

### **singer (Artistas)**  
- `createdAt`: timestamp  
- `email`: string  
- `generos`: string[] (genreIds)  
- `imageUrl`: string  
- `lastUpdated`: timestamp  
- `nombreArtistico`: string  
- `rol`: 'singer'  

### **songs**  
- `audioUrl`: string  
- `createdAt`: timestamp  
- `description`: string  
- `id`: string  
- `name`: string  
- `singerId`: string  

### **users (Usuarios regulares)**  
- `createdAt`: timestamp  
- `email`: string  
- `nombre`: string  
- `rol`: 'user'  

## 🎨 Paleta de Colores  

- `--color1`: #b3cc57 (Verde claro)  
- `--color2`: #ecf081 (Amarillo claro)  
- `--color3`: #ffbe40 (Naranja)  
- `--color4`: #ef746f (Rojo claro)  
- `--color5`: #ab3e5b (Borgoña)  

## 📊 Analytics Implementados  

### Seguimiento Completo  
- Flujo de creación de géneros  
- Subida de canciones  
- Reproducciones musicales  
- Navegación entre secciones  

### Detección de Problemas  
- Errores comunes en formularios  
- Fallos en subida de archivos  
- Problemas de autenticación  

### Métricas Clave  
- Tasa de éxito en creación de contenido  
- Tiempo en pantalla  
- Interacciones por tipo de usuario  

### Optimización UX  
- Puntos de abandono en flujos  
- Preferencias de navegación  
- Uso de características  

## 🚀 Flujos Principales  

### Para Artistas  
1. Registro/Login → Panel de control  
2. Configuración de perfil (imagen, nombre artístico)  
3. Gestión de canciones:  
   - Subir nuevas canciones (nombre, descripción, audio)  
   - Visualizar catálogo existente  
   - Reproducción previa  
4. Gestión de géneros:  
   - Crear nuevos géneros  
   - Asociarse a géneros existentes  

### Para Usuarios  
1. Registro/Login → Homepage personalizado  
2. Exploración por géneros:  
   - Vista de tarjetas con géneros disponibles  
   - Filtrado de artistas por género  
3. Descubrimiento de artistas:  
   - Perfiles artísticos  
   - Listas de canciones  
   - Reproductor integrado  

## 🏗️ Estructura del Proyecto  

src/
│
├── components/               # Componentes reutilizables
│   ├── ListaGeneros/         # Listado de géneros musicales
│   │   └── styles/           # Estilos CSS modular
│   ├── GeneroForm/           # Formulario creación géneros
│   ├── ListaCanciones/       # Componente de reproducción
│   └── ...                   # +30 componentes
│
├── firebase/                 # Configuración Firebase
│   ├── firebaseInit.ts       # Inicialización
│   └── firebaseConfig.ts     # Claves de acceso
│
├── hooks/                    # Custom Hooks
│   ├── useAuth.ts            # Autenticación
│   └── useAnalytics.ts       # Eventos analytics
│
├── pages/
│   ├── singer/               # Vistas exclusivas artistas
│   │   ├── AdminHomePage.tsx # Panel principal
│   │   └── GenerosPage.tsx   # Gestión de géneros
│   │
│   ├── user/                 # Vistas usuarios normales
│   │   ├── UserHomePage.tsx  # Descubrimiento
│   │   └── GeneroDetalle.tsx # Filtro por género
│   │
│   └── generic/              # Vistas compartidas
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
│
├── services/                 # Lógica de negocio
│   ├── cloudinaryService.ts  # Gestión multimedia
│   ├── generoService.ts      # CRUD géneros
│   ├── songService.ts        # Gestión canciones
│   └── singerService.ts      # Datos artistas
│
└── styles/                   # Estilos globales
    ├── main.css              # Variables CSS
    └── themes.css            # Modos claro/oscuro


## 📈 Métricas Clave de Analytics  

| Evento               | Descripción                     | Parámetros                     |  
|----------------------|---------------------------------|--------------------------------|  
| `screen_view`        | Visita a pantalla               | screen_name, user_type         |  
| `song_play`          | Reproducción canción            | song_id, artist_id             |  
| `genre_creation`     | Creación género                 | genre_name, image_uploaded     |  
| `artist_registration`| Artista se une a género         | artist_id, genre_id            |  
| `file_upload`       | Subida archivo                  | file_type, success             |  
