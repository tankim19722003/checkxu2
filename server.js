import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
app.use(cors());

// Route cho trang chính (hiển thị file index.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route để lấy token từ query string và gọi API traodoisub
app.get("/api/profile", async (req, res) => {
  const TDS_token = req.query.token; // Lấy token từ query string
  console.log("TDS_token:", TDS_token); // In token ra console

  if (!TDS_token) {
    return res.status(400).json({ error: "Thiếu token!" });
  }

  const apiUrl = `https://traodoisub.com/api/?fields=profile&access_token=${TDS_token}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data); // Trả dữ liệu về cho frontend
  } catch (error) {
    res.status(500).json({ error: "Có lỗi xảy ra khi gọi API" });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
