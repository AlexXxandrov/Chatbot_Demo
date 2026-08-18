# ✦ Demo personalizado — Guía rápida (LEAO)

Con esto armas un chatbot a la medida de un prospecto en 5 minutos, para
mandárselo y que vea SU propio asistente funcionando. Es tu mejor cierre para
peces gordos (restaurantes, inmobiliarias, colegios).

---

## La idea

En vez de mandarle a Nova (que habla de chatbots en general), le mandas un bot
que ya habla de SU negocio: saluda con el nombre de su restaurante, conoce su
menú, toma reservaciones. Cuando el dueño ve eso, la venta casi se cierra sola.

---

## Cómo armar uno (5 minutos)

1. Abre el archivo `server.js`.
2. Hasta arriba está el bloque **CONFIG** entre las líneas marcadas con 👇.
   SOLO edita eso. No toques nada más.
3. Llena los datos del prospecto:
   - `NEGOCIO`: el nombre real (ej: "Restaurante La Troje")
   - `GIRO`: qué es (ej: "restaurante")
   - `CIUDAD`: dónde está
   - `QUE_OFRECE`: 3-6 cosas que vende (sácalas de su Facebook o Google)
   - `FUNCIONES`: qué quieres que haga el bot (reservar, cotizar, informar…)
   - `HORARIO` y `CONTACTO`: si los tienes
4. Guarda.

Ejemplo lleno:
```
NEGOCIO: "Restaurante La Troje",
GIRO: "restaurante de comida mexicana",
CIUDAD: "Metepec",
QUE_OFRECE: ["Comida mexicana contemporánea", "Terraza para eventos", "Servicio a domicilio"],
FUNCIONES: ["mostrar el menú", "tomar reservaciones con nombre y fecha", "informar horarios"],
HORARIO: "Lun-Dom 2pm-11pm",
```

---

## Cómo publicarlo

Igual que Nova:
1. Sube la carpeta a un repo de GitHub (o reusa uno y solo cambia el CONFIG).
2. Conéctalo a Railway → agrega la variable `ANTHROPIC_API_KEY`.
3. Genera el dominio y mándale ESE link al prospecto por WhatsApp.

TIP: puedes tener un solo proyecto en Railway e ir cambiando el CONFIG por
prospecto, o duplicarlo si quieres tener varios demos vivos a la vez.

---

## Qué verá el prospecto

- El chatbot lo saluda con el nombre de SU negocio.
- Responde sobre lo que ese negocio ofrece.
- Toma datos de interesados (los ves en /api/leads-data).
- Trae el chango de Nova y la marca LEAO discreta abajo.

Mensaje sugerido para mandárselo:
"Hola [Nombre] 👋 Te armé una probadita: un asistente para [Negocio].
Platica con él como si fueras tu cliente 👇 [LINK]. Esto es solo un ejemplo,
imagínalo atendiendo tu negocio 24/7. — Ing. Alexandro León, LEAO 💻"
