const express = require('express');
const router = express.Router();
const supabase = require('../../db');

// Config สำหรับ Mapping ภาษากับตารางและ Foreign Key
const langConfig = {
  th: { table: 'room_detail_th_tbls', fk: 'room_detail_th_id' },
  en: { table: 'room_detail_en_tbls', fk: 'room_detail_en_id' },
  cn: { table: 'room_detail_cn_tbls', fk: 'room_detail_cn_id' },
};

// Middleware สำหรับตรวจสอบว่าภาษาที่ส่งมาถูกต้องหรือไม่
const validateLang = (req, res, next) => {
  const { lang } = req.params;
  if (!langConfig[lang]) {
    return res.status(400).json({ message: "Invalid language. Use 'th', 'en', or 'cn'" });
  }
  next();
};

// ==========================================
// GET ALL ROOMS (with specific language)
// ==========================================
// ตัวอย่างการเรียก: GET /th หรือ GET /en
router.get('/:lang', validateLang, async (req, res) => {
  try {
    const { lang } = req.params;
    const config = langConfig[lang];

    // สร้าง string สำหรับ Supabase select แบบ dynamic (เช่น *, room_detail_th_tbls(*))
    const selectQuery = `*, ${config.table}(*)`;

    const { data, error } = await supabase
      .from('room_tbls')
      .select(selectQuery)
      .order('room_id');
      
    if (error) throw error;

    // จัดรูปแบบให้ฝั่ง Frontend ใช้งานง่าย (เอา detail มารวมไว้ใน key ชื่อ details)
    const result = data.map(room => ({
      ...room,
      details: room[config.table],
      [config.table]: undefined, // ลบ key ที่ซ้ำซ้อนออก
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// GET ROOM BY ID (with specific language)
// ==========================================
// ตัวอย่างการเรียก: GET /th/R001
router.get('/:lang/:room_id', validateLang, async (req, res) => {
  try {
    const { lang, room_id } = req.params;
    const config = langConfig[lang];

    const selectQuery = `*, ${config.table}(*)`;

    const { data, error } = await supabase
      .from('room_tbls')
      .select(selectQuery)
      .eq('room_id', room_id)
      .single();
      
    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Room not found" });

    const result = {
      ...data,
      details: data[config.table],
      [config.table]: undefined,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// POST ROOM (ข้อมูลหลักเท่านั้น)
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { 
      room_id, 
      room_capacity, 
      room_price, 
      room_rooms, 
      room_detail_th_id, 
      room_detail_en_id, 
      room_detail_cn_id 
    } = req.body;

    const { data, error } = await supabase
      .from('room_tbls')
      .insert([{ 
        room_id, 
        room_capacity, 
        room_price, 
        room_rooms, 
        room_detail_th_id, 
        room_detail_en_id, 
        room_detail_cn_id 
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// PUT ROOM (อัปเดตข้อมูลหลัก เช่น ราคา, จำนวนคน)
// ==========================================
router.put('/:room_id', async (req, res) => {
  try {
    const { room_id } = req.params;
    const { room_capacity, room_price, room_rooms, room_detail_th_id, room_detail_en_id, room_detail_cn_id } = req.body;

    const updateData = { room_capacity, room_price, room_rooms };
    
    // ถ้ามีการส่ง ID ของ Detail มาใหม่ ให้อัปเดตการเชื่อมโยงด้วย
    if (room_detail_th_id) updateData.room_detail_th_id = room_detail_th_id;
    if (room_detail_en_id) updateData.room_detail_en_id = room_detail_en_id;
    if (room_detail_cn_id) updateData.room_detail_cn_id = room_detail_cn_id;

    const { data, error } = await supabase
      .from('room_tbls')
      .update(updateData)
      .eq('room_id', room_id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Room not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// UPSERT ROOM DETAIL (เพิ่ม/แก้ไข รายละเอียดแยกตามภาษา)
// ==========================================
// ตัวอย่างการเรียก: POST /details/th หรือ PUT /details/cn
router.post('/details/:lang', validateLang, async (req, res) => {
  try {
    const { lang } = req.params;
    const config = langConfig[lang];
    
    // รับข้อมูลจาก body ทั้งหมด (id, name, detail, story1, story2...)
    const detailData = req.body;

    const { data, error } = await supabase
      .from(config.table)
      .insert([detailData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/details/:lang/:detail_id', validateLang, async (req, res) => {
  try {
    const { lang, detail_id } = req.params;
    const config = langConfig[lang];
    
    // แยก id ออกจากข้อมูลที่จะอัปเดต (ไม่ควร update primary key)
    const { [config.fk]: id, ...updateData } = req.body;

    const { data, error } = await supabase
      .from(config.table)
      .update(updateData)
      .eq(config.fk, detail_id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Detail not found" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;