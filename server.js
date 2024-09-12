import express from "express";
import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";
import { fileURLToPath } from "url";
import session from "express-session"; // session management

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // var in .env file
});

// session setup for login persistence
app.use(
  session({
    secret: "mysecret", // note: change this to a more secure secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // note: in production, set `secure: true` if using https
  }),
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware to check if the user is logged in
function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

async function encodeImageToBase64(imagePath) {
  try {
    const imageBuffer = await fs.promises.readFile(imagePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    console.error("Error al codificar la imagen:", error);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage });

// redirect root ("/") to the login page
app.get("/", (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect("/login");
  } else {
    res.redirect("/form"); // if logged in, redirect to the form page
  }
});

// login route
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// handle login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    req.session.loggedIn = true;
    res.redirect("/form");
  } else {
    res.send("Invalid username or password. <a href='/login'>Try again</a>");
  }
});

// form page route (protected)
app.get("/form", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

// handle image upload and form processing
app.post("/upload", upload.single("imagen"), checkAuth, async (req, res) => {
  console.log("------ Iniciando subida de imagen ------");

  const file = req.file;
  const formData = req.body;

  if (!file) {
    console.log("No se subió ninguna imagen.");
    return res.status(400).send("No se subió ninguna imagen.");
  }

  const imagePath = path.join(__dirname, "uploads", file.filename);
  console.log("Imagen subida correctamente:", imagePath);

  try {
    const base64Image = await encodeImageToBase64(imagePath);
    if (!base64Image) {
      return res.status(500).send("Error al codificar la imagen en base64.");
    }

    console.log("Imagen codificada en base64 correctamente.");

    console.log("------ Enviando imagen para analizar ------");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Extract the data from the image in the following format:

{
  "Hoja de Inscripción": "string",   // El título o encabezado principal de la hoja (No opcional)
  "Fecha de Registro": {
    "Día": integer,                  // Día en formato numérico (No opcional, entre 1 y 31)
    "Mes": integer,                  // Mes en formato numérico (No opcional, entre 1 y 12)
    "Año": integer                   // Año en formato numérico (No opcional, mayor a 0)
  },
  "Folio": "string",                 // Número de folio (No opcional)

  "Datos Generales": {
    "Nombre": {
      "Apellido Paterno": "string",   // Primer apellido del paciente (No opcional)
      "Apellido Materno": "string",   // Segundo apellido del paciente (No opcional)
      "Nombre": "string"              // Primer nombre del paciente (No opcional)
    },
    "Género": "string",               // solo puede ser "Masculino" o "Femenino" (No opcional)
    "Edad": integer,                  // Edad en años (No opcional)
    "Fecha de nacimiento": {
      "Día": integer,                 // Día de nacimiento (No opcional, entre 1 y 31)
      "Mes": integer,                 // Mes de nacimiento (No opcional, entre 1 y 12)
      "Año": integer                  // Año de nacimiento (No opcional, mayor a 0)
    },
    "Religión": "string" | null,      // Religión del paciente (Opcional)
    "Lugar de nacimiento": "string",  // Ciudad o lugar de nacimiento del paciente (No opcional)
    "Dirección": "string",            // Dirección completa (No opcional)
    "Municipio": "string",            // Municipio (No opcional)
    "CURP": "string"                  // CURP del paciente (No opcional)
  },

  "Datos Médicos": {
    "Diagnóstico": "string",          // Diagnóstico principal (No opcional)
    "Tratamiento": {
      "Inicio Tratamiento": {
        "Día": integer | null,        // Día de inicio de tratamiento (Opcional, entre 1 y 31)
        "Mes": integer | null,        // Mes de inicio de tratamiento (Opcional, entre 1 y 12)
        "Año": integer | null         // Año de inicio de tratamiento (Opcional, mayor a 0)
      },
      "Termino Tratamiento": {
        "Día": integer | null,        // Día de término de tratamiento (Opcional, entre 1 y 31)
        "Mes": integer | null,        // Mes de término de tratamiento (Opcional, entre 1 y 12)
        "Año": integer | null         // Año de término de tratamiento (Opcional, mayor a 0)
      }
    },
    "Tipo de sangre": "string" | null, // Tipo de sangre (Opcional)
    "Recaídas": {
      "Años": [array of integers] | null // Años en los que hubo recaídas, deben estar marcados con algún símbolo (Opcional, puede ser null)
    },
    "Etapa o Status": {
      "Tratamiento": boolean,         // Si el paciente está en tratamiento (true o false)
      "Vigilancia": boolean,          // Si el paciente está en vigilancia (true o false)
      "Superviviente": boolean        // Si el paciente es un superviviente (true o false)
    },
    "Hospital de tratamiento": "string",  // Nombre del hospital donde recibe tratamiento (No opcional)
    "Otras enfermedades": "string" | null, // Otras enfermedades que el paciente pueda tener (Opcional)
    "Número de contacto del hospital y médico": "string",  // Teléfono del hospital o médico tratante (No opcional)
    "Médico tratante/Cédula profesional": "string"         // Nombre del médico tratante y su cédula profesional (No opcional)
  },

  "Datos del Cuidador Primario": {
    "Padre o Tutor": {
      "Apellido Paterno": "string",   // Primer apellido del tutor (No opcional)
      "Apellido Materno": "string",   // Segundo apellido del tutor (No opcional)
      "Nombre": "string"              // Nombre del tutor (No opcional)
    },
    "Fecha de Nacimiento": {
      "Día": integer | null,          // Día de nacimiento del tutor (Opcional, entre 1 y 31)
      "Mes": integer | null,          // Mes de nacimiento del tutor (Opcional, entre 1 y 12)
      "Año": integer | null           // Año de nacimiento del tutor (Opcional, mayor a 0)
    },
    "Edad": integer,                  // Edad del tutor (No opcional)
    "Parentesco": "string",           // Relación del tutor con el paciente (No opcional)
    "Teléfono de contacto": "string", // Teléfono de contacto del tutor (No opcional)
    "CURP": "string",                 // CURP del tutor (No opcional)
    "Identificación Oficial": "string" // Tipo de identificación oficial y número del tutor (No opcional)
  },

  "Documentos Generales": {
    "Acta de Nacimiento": boolean,    // Acta de nacimiento presentada (true para SI, false para NO)
    "Comprobante de domicilio": boolean, // Comprobante de domicilio presentado (true para SI, false para NO)
    "¿Recibe apoyo de alguna otra institución?": {
      "Respuesta": boolean,           // Indica si recibe apoyo de otra institución (true para SI, false para NO)
      "Cuál": "string" | null         // Especifica la institución si recibe apoyo (Opcional)
    }
  }
}

Return as JSON object.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const jsonResponse = JSON.parse(response.choices[0].message.content);

    console.log("Análisis realizado correctamente:", jsonResponse);
    console.log("Form data received:", formData);

    res.json(jsonResponse);
  } catch (error) {
    console.error("Error al enviar la imagen para analizar:", error);
    res.status(500).send("Error al procesar la imagen.");
  }

  console.log("------ Proceso de subida de imagen completado ------");
});

// handle form submission and redirect to confirmation page
app.post("/submit-form", checkAuth, (req, res) => {
  console.log("Form data received:", req.body); // logs the form data received

  // here you would normally save the form data to a database -> future implementation
  res.redirect("/confirmation");
});

// confirmation page
app.get("/confirmation", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "confirmation.html"));
});

// logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/form"); // if there is an error during logout, stay on the form
    }
    res.redirect("/login"); // successful logout
  });
});

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`); // Logs the correct port in use
});
