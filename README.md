# Sistema de Indexación de Documentos

Sistema de indexación de documentos utilizando **Suffix Tree** y **PATRICIA Tree** para la recuperación de información.

## 🎯 Características

- ✅ Indexación de documentos con índices invertidos
- ✅ Implementación de Suffix Tree para búsqueda de subcadenas
- ✅ Implementación de PATRICIA Tree para almacenamiento eficiente
- ✅ Visualización interactiva de estructuras de árboles
- ✅ Gestión de índices (añadir/eliminar palabras)
- ✅ Búsqueda rápida en documentos indexados
- ✅ Interfaz web moderna con Next.js
- ✅ API REST con FastAPI

## 🏗️ Arquitectura

El proyecto está dividido en dos partes principales:

### Backend (FastAPI)
- **API REST** para gestión de documentos e índices
- **Módulos de indexación** con Suffix Tree y PATRICIA Tree
- **Servicios** para lógica de negocio
- **Utilidades** para procesamiento de texto y persistencia

### Frontend (Next.js)
- **Interfaz web** moderna y responsive
- **Visualización** interactiva de árboles con React Flow
- **Gestión** de documentos e índices
- **Búsqueda** en tiempo real

## 📁 Estructura del Proyecto

```
proyecto/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── api/                 # Endpoints y modelos
│   │   ├── core/                # Configuración
│   │   ├── modules/             # Suffix Tree y PATRICIA Tree
│   │   ├── services/            # Lógica de negocio
│   │   └── utils/               # Utilidades
│   ├── data/                    # Datos y documentos
│   └── tests/                   # Pruebas
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Páginas Next.js
│   │   ├── components/          # Componentes React
│   │   ├── lib/                 # Cliente API
│   │   └── types/               # TypeScript types
│   └── public/                  # Archivos estáticos
│
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Python 3.8+
- Node.js 18+
- npm o yarn

### Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instalar dependencias:
```bash
pip install -r requirements.txt
```

4. Ejecutar el servidor:
```bash
uvicorn app.main:app --reload --port 8000
```

El servidor estará disponible en `http://localhost:8000`
La documentación de la API (Swagger) estará en `http://localhost:8000/docs`

### Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📖 Uso

### 1. Subir Documentos

- Ve a la sección "Documentos"
- Haz clic en "Subir Documento"
- Selecciona un archivo de texto (.txt, .md, etc.)

### 2. Crear Índices

- Ve a la sección de indexación
- Selecciona el tipo de índice (Suffix Tree o PATRICIA Tree)
- Haz clic en "Crear Índice"

### 3. Visualizar Índices

- Ve a "Visualizar Índices"
- Selecciona el tipo de índice
- Explora la estructura del árbol interactivamente

### 4. Gestionar Índices

- En la sección de visualización, puedes:
  - **Añadir palabras** al índice
  - **Eliminar palabras** del índice

### 5. Buscar

- Ve a la sección "Búsqueda"
- Selecciona el tipo de índice
- Escribe tu consulta y haz clic en "Buscar"

## 🧪 Testing

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm run test
```

## 📚 API Endpoints

### Documentos
- `POST /api/documents/upload` - Subir documento
- `GET /api/documents/` - Listar documentos
- `GET /api/documents/{id}` - Obtener documento
- `DELETE /api/documents/{id}` - Eliminar documento

### Indexación
- `POST /api/indexing/create` - Crear índice
- `GET /api/indexing/status/{index_type}` - Estado del índice

### Gestión de Índices
- `GET /api/index/structure/{index_type}` - Estructura del índice
- `GET /api/index/stats/{index_type}` - Estadísticas
- `POST /api/index/words` - Añadir palabra
- `DELETE /api/index/words/{word}` - Eliminar palabra

### Búsqueda
- `POST /api/search/` - Buscar en índices

## 🛠️ Tecnologías

### Backend
- FastAPI >=0.104.0
- Python 3.8+
- suffix-trees >=0.3.0
- patricia-trie >=1.0.0
- NetworkX >=3.0
- Matplotlib >=3.7.0
- Uvicorn >=0.24.0
- Pydantic >=2.0.0
- Tortoise ORM 0.20.0

### Frontend
- Next.js ^16.0.10
- React ^19.0.0
- TypeScript ^5.6.3
- React Flow ^11.11.4
- Tailwind CSS ^3.4.14
- TanStack Query ^5.56.2
- Axios ^1.7.7
- Zustand ^4.5.4

## 👥 Equipo

- René Espinosa Arteaga
- Carlos Elias González Valdés
- Yailedainis Rodriguez Morfa
- Jorge Jesús Santos García

## 📝 Licencia

Este proyecto es parte de una tarea académica para la asignatura de Sistemas de Información.

## 🔗 Enlaces Útiles

- [Documentación FastAPI](https://fastapi.tiangolo.com/)
- [Documentación Next.js](https://nextjs.org/docs)
- [React Flow](https://reactflow.dev/)
- [Suffix Trees](https://github.com/ptrus/suffix-trees)

