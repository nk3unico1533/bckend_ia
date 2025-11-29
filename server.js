import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

// 👇 Pasta base onde os arquivos serão criados
const BASE_DIR = process.cwd();

// =========================================================
// Criar / sobrescrever arquivo
// =========================================================
app.post("/tool/create_file", (req, res) => {
  const { filePath, content } = req.body;

  try {
    const fullPath = path.join(BASE_DIR, filePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");

    return res.json({
      success: true,
      message: `Arquivo criado/atualizado: ${filePath}`
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message
    });
  }
});

// =========================================================
// Ler arquivo
// =========================================================
app.post("/tool/read_file", (req, res) => {
  const { filePath } = req.body;

  try {
    const fullPath = path.join(BASE_DIR, filePath);
    const content = fs.readFileSync(fullPath, "utf-8");

    return res.json({
      success: true,
      content
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err.message
    });
  }
});

// =========================================================
// Executar comando shell real
// =========================================================
app.post("/tool/run_command", (req, res) => {
  const { command } = req.body;

  exec(command, { cwd: BASE_DIR }, (error, stdout, stderr) => {

    return res.json({
      success: !error,
      stdout,
      stderr,
      error: error ? error.message : null
    });

  });
});

// =========================================================
app.get("/", (req, res) => {
  res.send("NK TOOL SERVER ONLINE");
});

// =========================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("NK Tool Server rodando na porta " + PORT);
});
