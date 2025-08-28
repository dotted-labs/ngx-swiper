# NgxSwiper Demo

Este es un proyecto demo que muestra el uso de la librería `ngx-swiper`.

## 🚀 Cómo ejecutar el demo

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm

### Instalación y ejecución

1. **Construir la librería ngx-swiper** (necesario la primera vez y cada vez que se modifique la librería):
   ```bash
   npm run lib:build
   ```

2. **Ejecutar el demo en modo desarrollo**:
   ```bash
   npm run demo
   ```

3. **Construir el demo para producción**:
   ```bash
   npm run demo:build
   ```

## 📁 Estructura del proyecto

```
projects/
├── ngx-swiper/           # Librería principal
│   ├── src/
│   │   ├── lib/
│   │   │   ├── ngx-swiper.component.ts
│   │   │   └── ngx-swiper.service.ts
│   │   └── public-api.ts
│   └── package.json
└── ngx-swiper-demo/      # Proyecto demo
    ├── src/
    │   ├── app/
    │   │   ├── app.component.ts
    │   │   ├── app.component.html
    │   │   └── app.component.scss
    │   └── main.ts
    └── README.md (este archivo)
```

## 🎯 Características del demo

- **Componente básico**: Muestra el componente `NgxSwiperComponent` en funcionamiento
- **Integración standalone**: Utiliza la nueva sintaxis de componentes standalone de Angular
- **Desarrollo en paralelo**: Permite desarrollar la librería y el demo simultáneamente

## 🔧 Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run demo` | Ejecuta el demo en modo desarrollo (puerto 4200) |
| `npm run demo:build` | Construye el demo para producción |
| `npm run lib:build` | Construye la librería ngx-swiper |
| `npm run lib:watch` | Construye la librería en modo watch (reconstruye automáticamente) |

## 📝 Desarrollo

### Flujo de trabajo recomendado

1. **Para desarrollar la librería con vista previa inmediata**:
   ```bash
   # Terminal 1: Construir la librería en modo watch
   npm run lib:watch
   
   # Terminal 2: Ejecutar el demo
   npm run demo
   ```

2. **Solo para ver el demo con la librería actual**:
   ```bash
   npm run lib:build && npm run demo
   ```

### Agregar nuevos ejemplos

Para agregar nuevos ejemplos al demo:

1. Crea nuevos componentes en `src/app/`
2. Importa y configura el `NgxSwiperComponent` según tus necesidades
3. Agrega la navegación correspondiente en `app.routes.ts`

## 🤝 Contribuir

Este demo sirve como:
- **Playground** para probar nuevas funcionalidades de la librería
- **Documentación visual** de las capacidades de ngx-swiper
- **Entorno de testing** durante el desarrollo

¡Siéntete libre de experimentar y agregar nuevos ejemplos!
