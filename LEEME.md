# Torneo de golf en Vercel

Esta carpeta es la página del torneo lista para publicar en Vercel. Todos los que entren al link ven la misma información, y lo que carga uno le aparece a los demás en pocos segundos.

## Qué hay en la carpeta

- `index.html`: la página.
- `api/state.js`: guarda y lee los datos del torneo en la base de datos.
- `package.json`: configuración mínima para Vercel. No hay que instalar nada.

## Publicarla (sin usar la terminal)

1. **Subila a GitHub.** Creá una cuenta en github.com si no tenés, tocá "New repository", ponele un nombre (por ejemplo `torneo-golf`) y crealo. En la página del repositorio tocá "uploading an existing file" y arrastrá todo el contenido de esta carpeta, incluida la carpeta `api`. Tocá "Commit changes".
2. **Creá el proyecto en Vercel.** Entrá a vercel.com con tu cuenta de GitHub, tocá "Add New" y después "Project", elegí el repositorio `torneo-golf` y tocá "Deploy". No hace falta cambiar ninguna opción.
3. **Conectá la base de datos.** En el proyecto, andá a la pestaña **Storage**, elegí **Upstash for Redis** (está en el Marketplace), creá la base y conectala a este proyecto.
4. **Volvé a publicar.** Andá a **Deployments**, abrí los tres puntitos del último y tocá **Redeploy**, para que la página tome la conexión a la base.
5. Listo. Compartí el link del proyecto (algo como `torneo-golf.vercel.app`).

Si la base no quedó conectada, la página lo avisa arriba con un cartel amarillo.

## Poner una clave para editar (opcional)

Si no querés que cualquiera con el link pueda cambiar datos:

1. En Vercel, andá a **Settings** y después a **Environment Variables**.
2. Agregá una variable llamada `EDIT_PASSWORD` con la clave que quieras.
3. Hacé **Redeploy** como en el paso 4.

Todos pueden seguir viendo la página, pero para guardar cambios se pide la clave. Cada persona la pone una sola vez en su teléfono o computadora.

## Pasar los datos que cargaste en tu computadora

1. Abrí en tu navegador el archivo del torneo con el que cargaste los datos (la versión con el botón "Descargar copia con mis datos").
2. Tocá **Descargar copia con mis datos**.
3. En la página publicada en Vercel, bajá hasta el final, tocá **Importar datos de un archivo** y elegí la copia que descargaste.

Esto reemplaza lo que haya en la página por lo que trae el archivo.

## Publicarla con la terminal (alternativa)

Si tenés Node.js instalado, desde esta carpeta:

```
npx vercel
npx vercel --prod
```

Después seguí desde el paso 3 (conectar la base de datos).

## Tené en cuenta

- La lectura de fotos de tarjetas y la crónica escrita por Claude funcionan solo dentro de Claude. En Vercel esas opciones no aparecen.
- Las fotos de perfil ocupan lugar en la base. Para un grupo de amigos no hay problema.
- Abajo de todo está **Descargar copia de respaldo**, para guardarte una copia de todo cada tanto.
