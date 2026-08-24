// ============================================================
//  DEMO PERSONALIZADO ✦ — LEAO
//  Copia de Nova lista para armar un chatbot a la medida de un
//  prospecto en minutos. SOLO edita el bloque CONFIG de abajo,
//  sube a Railway, y mándale el link al cliente.
// ============================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import fetch from 'node-fetch';
import fs from 'fs';

// ╔══════════════════════════════════════════════════════════╗
// ║   👇👇  EDITA SOLO ESTO PARA CADA PROSPECTO  👇👇          ║
// ╚══════════════════════════════════════════════════════════╝
const CONFIG = {
  // Nombre del asistente (invéntale uno o deja "Nova")
  NOMBRE_BOT: "Nova",

  // Datos del negocio del prospecto
  NEGOCIO: "[NOMBRE DEL NEGOCIO]",          // ej: "Restaurante La Troje"
  GIRO: "[GIRO]",                            // ej: "restaurante", "clínica dental", "inmobiliaria"
  CIUDAD: "Metepec",                         // ciudad del negocio

  // Qué ofrece el negocio (3-6 puntos, en lenguaje simple)
  QUE_OFRECE: [
    "[Producto o servicio 1]",
    "[Producto o servicio 2]",
    "[Producto o servicio 3]",
  ],

  // Qué debe HACER el chatbot para ese negocio (elige/edita)
  FUNCIONES: [
    "responder las preguntas más comunes de los clientes",
    "tomar los datos de quien quiera [reservar / agendar / cotizar]",
    "informar horarios, ubicación y formas de contacto",
  ],

  // Horario y contacto reales del negocio (si los tienes)
  HORARIO: "[HORARIO, ej: Lun-Sáb 9am-8pm]",
  CONTACTO: "[TELÉFONO O DIRECCIÓN, opcional]",

  // Frase de saludo (déjala así o edítala)
  SALUDO_EXTRA: "Pregúntame lo que quieras 👇",
};
// ╔══════════════════════════════════════════════════════════╗
// ║   👆👆  NO NECESITAS TOCAR NADA MÁS ABAJO  👆👆            ║
// ╚══════════════════════════════════════════════════════════╝

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

// Persistencia simple (memoria + disco). Para un demo no necesitas Sheets.
let leadsCache = [];
const BACKUP = '/tmp/demo-leads.json';
function guardarDisco(){ try { fs.writeFileSync(BACKUP, JSON.stringify(leadsCache)); } catch(e){} }
function cargarDisco(){ try { if (fs.existsSync(BACKUP)) leadsCache = JSON.parse(fs.readFileSync(BACKUP,'utf8'))||[]; } catch(e){} }

// ============================================================
//  LECTOR DE ARCHIVO DEL NEGOCIO (txt o pdf)
//  Al arrancar, busca en la carpeta datos/ un archivo:
//    - datos/negocio.txt   (texto plano)  ó
//    - datos/negocio.pdf   (se le extrae el texto)
//  Lo que encuentre se le carga al chatbot como conocimiento.
//  Si no hay archivo, usa solo lo del bloque CONFIG.
// ============================================================
async function leerInfoNegocio() {
  const dir = './datos';
  const txtPath = `${dir}/negocio.txt`;
  const pdfPath = `${dir}/negocio.pdf`;

  // 1) Preferir TXT si existe (es lo más simple y rápido)
  try {
    if (fs.existsSync(txtPath)) {
      const texto = fs.readFileSync(txtPath, 'utf8').trim();
      if (texto) {
        console.log(`📄 Info cargada de negocio.txt (${texto.length} caracteres)`);
        return texto;
      }
    }
  } catch (e) {
    console.error('⚠️ No se pudo leer negocio.txt:', e?.message);
  }

  // 2) Si no hay txt, intentar PDF (extracción con pdfjs)
  try {
    if (fs.existsSync(pdfPath)) {
      const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const data = new Uint8Array(fs.readFileSync(pdfPath));
      const doc = await getDocument({ data, useSystemFonts: true }).promise;
      let texto = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        texto += content.items.map(it => it.str).join(' ') + '\n';
      }
      texto = texto.trim();
      if (texto) {
        console.log(`📄 Info extraída de negocio.pdf (${texto.length} caracteres)`);
        return texto;
      }
      console.error('⚠️ El PDF no tenía texto extraíble (¿es una imagen escaneada? Entonces usa negocio.txt).');
    }
  } catch (e) {
    console.error('⚠️ No se pudo leer negocio.pdf:', e?.message);
  }

  // 3) Nada encontrado
  console.log('ℹ️ Sin archivo en datos/. Usando solo el bloque CONFIG.');
  return '';
}

// Se llena al arrancar (abajo, en el listen)
let INFO_ARCHIVO = '';

// ---- System prompt: se arma como función para incluir el archivo ----
function construirSystem() {
  const bloqueArchivo = INFO_ARCHIVO
    ? `\n\n# INFORMACIÓN DETALLADA DEL NEGOCIO (fuente principal — úsala para responder)\n${INFO_ARCHIVO}\n\nUsa la información de arriba como tu fuente principal. Si algo no está ahí, no lo inventes.`
    : '';

  return `Eres ${CONFIG.NOMBRE_BOT} ✦, el asistente virtual de "${CONFIG.NEGOCIO}", un(a) ${CONFIG.GIRO} en ${CONFIG.CIUDAD}. Fuiste creado por LEAO 💻 como demostración.

# TU MISIÓN
Atender a los clientes de ${CONFIG.NEGOCIO} con calidez y rapidez: responder sus dudas, darles información y tomar los datos de quien esté interesado.

# QUÉ OFRECE ${CONFIG.NEGOCIO}
${CONFIG.QUE_OFRECE.map(x => "- " + x).join("\n")}

# QUÉ DEBES HACER
${CONFIG.FUNCIONES.map(x => "- " + x).join("\n")}

# DATOS ÚTILES
- Horario: ${CONFIG.HORARIO}
- Contacto: ${CONFIG.CONTACTO}${bloqueArchivo}

# REGLAS DE ORO
Máximo 30-40 palabras por respuesta. Sé claro, cálido y directo.
NUNCA uses asteriscos (* o **). Usa emojis y saltos de línea.
No inventes precios ni datos que no te dieron; si no sabes algo, ofrece tomar los datos para que alguien del negocio responda.

# CAPTURA DE INTERESADOS
Cuando la persona quiera reservar, agendar, cotizar o dejar sus datos, pídele nombre y teléfono con el tag [FORM:demo] al final de tu mensaje (una sola vez, sin texto después).
Ejemplo: "¡Con gusto! Déjame tus datos y en breve te contactamos. [FORM:demo]"

# SALUDO
Preséntate como ${CONFIG.NOMBRE_BOT}, el asistente de ${CONFIG.NEGOCIO}. ${CONFIG.SALUDO_EXTRA}`;
}

let SYSTEM = construirSystem();

// ---- Chat ----
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [] } = req.body;
    const resp = await anthropic.messages.create({ model: MODEL, max_tokens: 350, system: SYSTEM, messages });
    res.json({ reply: resp.content?.[0]?.text || 'Perdón, tuve un detalle técnico.' });
  } catch (e) {
    console.error('Chat error:', e?.message);
    res.status(500).json({ reply: 'Tuve un problemita técnico. ¿Lo intentamos de nuevo?' });
  }
});

// ---- Config para el front (nombre y saludo) ----
app.get('/api/config', (req, res) => {
  res.json({ nombre: CONFIG.NOMBRE_BOT, negocio: CONFIG.NEGOCIO, saludoExtra: CONFIG.SALUDO_EXTRA });
});

// ---- Leads ----
app.post('/api/lead', async (req, res) => {
  const lead = { ...req.body, negocio: CONFIG.NEGOCIO, timestamp: new Date().toISOString(), estado: 'Nuevo' };
  console.log('🎯 Interesado en demo de', CONFIG.NEGOCIO, ':', lead.nombre, lead.whatsapp);
  leadsCache.unshift(lead); if (leadsCache.length > 500) leadsCache.pop(); guardarDisco();
  res.json({ ok: true });
});
app.get('/api/leads-data', (req, res) => res.json(leadsCache));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  cargarDisco();
  INFO_ARCHIVO = await leerInfoNegocio();  // lee datos/negocio.txt o .pdf
  SYSTEM = construirSystem();               // reconstruye el prompt ya con el archivo
  console.log(`✦ Demo de ${CONFIG.NEGOCIO} en :${PORT}`);
});
