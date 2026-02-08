-- Seed Data for Pet Cafe Database
USE pet_cafe;

-- Insert Admin User (password: admin123)
-- bcrypt hash for 'admin123' with salt rounds 10
INSERT INTO users (id, email, password, name, role) VALUES
('1', 'admin@petcafe.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin', 'admin'),
('2', 'user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'User', 'user')
ON DUPLICATE KEY UPDATE email=email;

-- Insert Menu Items
INSERT INTO menu_items (id, name, description, price, category, image, qr_code, is_available) VALUES
('1', 'กาแฟอเมริกาโน', 'กาแฟดำเข้มข้น', 80.00, 'drink', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', 'drink-1', TRUE),
('2', 'คาปูชิโน', 'กาแฟกับนม', 90.00, 'drink', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 'drink-2', TRUE),
('3', 'ลาเต้', 'กาแฟกับนมร้อน', 85.00, 'drink', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 'drink-3', TRUE),
('4', 'แซนด์วิช', 'แซนด์วิชไก่ย่าง', 120.00, 'food', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', 'food-1', TRUE),
('5', 'สลัด', 'สลัดผักสด', 100.00, 'food', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 'food-2', TRUE),
('6', 'เค้กช็อคโกแลต', 'เค้กช็อคโกแลตชิ้นใหญ่', 150.00, 'food', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 'food-3', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Insert Menu Item Ingredients
INSERT INTO menu_item_ingredients (id, menu_item_id, ingredient) VALUES
('1', '1', 'กาแฟ'),
('2', '1', 'น้ำ'),
('3', '2', 'กาแฟ'),
('4', '2', 'นม'),
('5', '2', 'โฟม'),
('6', '3', 'กาแฟ'),
('7', '3', 'นม'),
('8', '4', 'ขนมปัง'),
('9', '4', 'ไก่ย่าง'),
('10', '4', 'ผักสลัด'),
('11', '5', 'ผักสลัด'),
('12', '5', 'น้ำสลัด'),
('13', '6', 'แป้ง'),
('14', '6', 'ช็อคโกแลต'),
('15', '6', 'ครีม')
ON DUPLICATE KEY UPDATE ingredient=ingredient;

-- Insert Menu Item Warnings
INSERT INTO menu_item_warnings (id, menu_item_id, warning) VALUES
('1', '1', 'มีคาเฟอีน'),
('2', '2', 'มีคาเฟอีน'),
('3', '2', 'มีนม'),
('4', '3', 'มีคาเฟอีน'),
('5', '3', 'มีนม'),
('6', '4', 'มีกลูเตน'),
('7', '6', 'มีกลูเตน'),
('8', '6', 'มีนม')
ON DUPLICATE KEY UPDATE warning=warning;

-- Insert Pets
INSERT INTO pets (id, name, breed, age, description, image, qr_code, is_active) VALUES
('1', 'น้องหมา', 'โกลเด้นรีทรีฟเวอร์', 2, 'น้องหมาที่น่ารักและเป็นมิตร', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400', 'pet-1', TRUE),
('2', 'น้องแมว', 'เปอร์เซีย', 1, 'น้องแมวที่ขี้อ้อน', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', 'pet-2', TRUE),
('3', 'น้องกระต่าย', 'ฮอลแลนด์ล็อป', 1, 'น้องกระต่ายน่ารัก', 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400', 'pet-3', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- Insert Pet Schedules (Today's schedule)
INSERT INTO pet_schedules (id, pet_id, date) VALUES
('1', '1', CURDATE()),
('2', '2', CURDATE()),
('3', '3', CURDATE())
ON DUPLICATE KEY UPDATE date=date;

-- Insert Pet Schedule Time Slots
INSERT INTO pet_schedule_time_slots (id, pet_schedule_id, start_time, end_time, is_available, is_rest_time, max_rounds, current_round) VALUES
-- Pet 1 (น้องหมา) - Today
('1', '1', '09:00:00', '10:00:00', TRUE, FALSE, 5, 0),
('2', '1', '10:00:00', '11:00:00', TRUE, FALSE, 5, 0),
('3', '1', '11:00:00', '12:00:00', FALSE, TRUE, 0, 0), -- Rest time
('4', '1', '13:00:00', '14:00:00', TRUE, FALSE, 5, 0),
('5', '1', '14:00:00', '15:00:00', TRUE, FALSE, 5, 0),
-- Pet 2 (น้องแมว) - Today
('6', '2', '09:00:00', '10:00:00', TRUE, FALSE, 3, 0),
('7', '2', '10:00:00', '11:00:00', FALSE, TRUE, 0, 0), -- Rest time
('8', '2', '13:00:00', '14:00:00', TRUE, FALSE, 3, 0),
('9', '2', '14:00:00', '15:00:00', TRUE, FALSE, 3, 0),
-- Pet 3 (น้องกระต่าย) - Today
('10', '3', '10:00:00', '11:00:00', TRUE, FALSE, 4, 0),
('11', '3', '11:00:00', '12:00:00', FALSE, TRUE, 0, 0), -- Rest time
('12', '3', '14:00:00', '15:00:00', TRUE, FALSE, 4, 0)
ON DUPLICATE KEY UPDATE start_time=start_time;

-- Insert Promotions
INSERT INTO promotions (id, title, description, discount, start_date, end_date, is_active) VALUES
('1', 'โปรโมชั่นเปิดร้าน', 'ลด 20% ทุกเมนู', 20, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE),
('2', 'โปรโมชั่นสุดสัปดาห์', 'ซื้อ 2 แถม 1', NULL, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), TRUE)
ON DUPLICATE KEY UPDATE title=title;

-- Insert Banners
INSERT INTO banners (id, title, description, image, link, is_active, `order`) VALUES
('1', 'ยินดีต้อนรับสู่ Pet Cafe', 'ร้านคาเฟ่ที่มีสัตว์เลี้ยงน่ารัก', 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200', '/', TRUE, 1),
('2', 'โปรโมชั่นพิเศษ', 'ลด 20% ทุกเมนู', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200', '/promotions', TRUE, 2)
ON DUPLICATE KEY UPDATE title=title;
