# ✦ Demo personalizado — Guía rápida (LEAO)

Con esto armas un chatbot a la medida de un prospecto en minutos, para
mandárselo y que vea SU propio asistente funcionando. Es tu mejor cierre
para peces gordos (restaurantes, inmobiliarias, colegios).

---

## La idea

En vez de mandarle a Nova (que habla de chatbots en general), le mandas un bot
que ya habla de SU negocio: saluda con el nombre de su restaurante, conoce su
menú, toma reservaciones. Cuando el dueño ve eso, la venta casi se cierra sola.

---

## DOS FORMAS de cargar la info del negocio

El chatbot toma la info del negocio de la carpeta **datos/**. Tienes dos caminos:

### Opción 1 — Archivo de texto (datos/negocio.txt)  [más control]
1. Abre `datos/negocio.txt`.
2. Borra el ejemplo y escribe los datos reales del cliente (nombre, menú,
   horario, servicios, preguntas frecuentes). Escribe normal, como si se lo
   explicaras a una persona.
3. Guarda. Listo.

### Opción 2 — PDF del cliente (datos/negocio.pdf)  [más rápido]
1. ¿El cliente te pasó su menú, folleto o catálogo en PDF? Solo renómbralo
   a `negocio.pdf` y ponlo en la carpeta `datos/`.
2. El chatbot le extrae el texto solo al arrancar. No tienes que escribir nada.

> Si pones AMBOS (txt y pdf), el chatbot usa el .txt.
> Nota: el PDF debe tener texto de verdad (seleccionable). Si es una foto o
> un PDF escaneado, no se puede leer — en ese caso usa el negocio.txt.

El bloque CONFIG (arriba en server.js) sigue existiendo para el nombre del bot,
la ciudad y el saludo. Los datos finos (menú, precios, FAQ) van en el archivo.

---

## Cómo armar uno (5 minutos)

1. En `server.js`, arriba, ajusta el bloque **CONFIG**: NOMBRE_BOT (o deja "Nova"),
   NEGOCIO, GIRO, CIUDAD.
2. Pon la info detallada en `datos/negocio.txt` O `datos/negocio.pdf`.
3. Guarda.

---

## Cómo publicarlo

Igual que Nova:
1. Sube la carpeta a un repo de GitHub (o reusa uno y solo cambia datos/ y CONFIG).
2. Conéctalo a Railway → agrega la variable `ANTHROPIC_API_KEY`.
3. Genera el dominio y mándale ESE link al prospecto por WhatsApp.

IMPORTANTE: cuando cambies el archivo de datos, Railway hace redeploy y el
chatbot lee la info nueva al reiniciar. Si cambiaste el archivo pero no ves el
cambio, fuerza un redeploy en Railway.

TIP: puedes tener un solo proyecto e ir cambiando datos/negocio.txt por prospecto,
o duplicarlo si quieres varios demos vivos a la vez.

---

## Qué verá el prospecto

- El chatbot lo saluda con el nombre de SU negocio.
- Responde sobre lo que ese negocio ofrece (según el archivo que cargaste).
- Toma datos de interesados (los ves en /api/leads-data).
- Trae el chango de Nova y la marca LEAO discreta abajo.

Mensaje sugerido para mandárselo:
"Hola [Nombre] 👋 Te armé una probadita: un asistente para [Negocio].
Platica con él como si fueras tu cliente 👇 [LINK]. Esto es solo un ejemplo,
imagínalo atendiendo tu negocio 24/7. — Ing. Alexandro León, LEAO 💻"
