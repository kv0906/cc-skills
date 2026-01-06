# Ngân hàng ẩn dụ - Will Vibe Coding

Signature analogies để giải thích technical concepts bằng ngôn ngữ đời thường.

## Nguyên tắc sử dụng

1. **Luôn dùng ẩn dụ TRƯỚC khi giải thích technical**
2. Map từ concept quen thuộc → concept technical
3. Giữ ẩn dụ đơn giản, ai cũng hiểu được
4. Sau ẩn dụ, kết nối ngay sang technical application

---

## Core Analogies

### JSON = Căn cước / Nhân dạng

**Concept:** JSON như căn cước công dân của một thực thể trong hệ thống

**Cách dùng:**
> Bạn có căn cước không? Căn cước chứa họ tên, ngày sinh, địa chỉ - những thông tin xác định BẠN là ai. JSON cũng vậy, nó là "căn cước" của một object trong code, chứa các thuộc tính định nghĩa thực thể đó.

---

### Code = Luật chơi game

**Concept:** Code như bộ luật chơi game - có quy tắc, cú pháp, logic

**Cách dùng:**
> Chơi game bạn phải theo luật đúng không? Nhảy đúng chỗ, bấm đúng nút, timing đúng. Code cũng vậy - một ngôn ngữ có quy củ. Viết sai cú pháp = phạm luật = game crash.

---

### Auth = Chìa khóa và ổ khóa

**Concept:** Authentication như chìa khóa vào nhà

**Cách dùng:**
> Nhà bạn có khóa. Chỉ bạn có chìa. Người khác muốn vào phải có chìa đúng. Auth trong code y hệt - API key, token, password là "chìa khóa" để vào hệ thống. Sai chìa = không vào được.

---

### Sai tool = Dùng rìu chặt thịt

**Concept:** Chọn đúng công cụ cho đúng việc

**Cách dùng:**
> Bạn có dùng rìu để chặt thịt không? Dao mổ để đốn cây? Mỗi tool sinh ra cho một mục đích. Vibe code cũng vậy - planning phase dùng tool khác, execution phase dùng tool khác. Dùng rìu chặt thịt = chọn sai tool = kết quả tệ.

---

### Sword vs Words

**Concept:** Ngôn ngữ có sức mạnh, chỉ cần thay đổi nhỏ

**Cách dùng:**
> Sword và Words chỉ khác nhau chữ S. Một chữ thôi mà từ "thanh kiếm" thành "lời nói". Trong prompt engineering cũng vậy - đổi một từ, thêm một câu, context khác hoàn toàn. Detail matters.

---

## Thêm analogies (cập nhật khi có mới)

### Thư viện = Memory / Context

**Concept:** Context window như thư viện cá nhân

**Cách dùng:**
> Hình dung bạn có 1 thư viện nhỏ. Chỉ chứa được 100 cuốn sách. Khi thêm sách mới, sách cũ phải bỏ ra. Context window của LLM y hệt - có giới hạn. Quản lý context = quản lý kệ sách.

---

### Đặt sách đúng chỗ = Folder structure

**Concept:** Tổ chức code như sắp xếp sách

**Cách dùng:**
> Thư viện không có phân loại thì tìm sách cả ngày. Sách IT để cùng sách nấu ăn, sách triết học lẫn sách thiếu nhi. Code cũng vậy - folder structure, naming convention giúp bạn (và AI) navigate được codebase.

---

### GPS vs Bản đồ giấy = AI vs Traditional coding

**Concept:** AI-assisted coding như có GPS thay vì bản đồ giấy

**Cách dùng:**
> Ngày xưa đi xa phải mở bản đồ giấy, tự tìm đường, nhớ ngã rẽ. Giờ có GPS - nó suggest, cảnh báo, tự tìm route. Vibe coding như có GPS - AI suggest, bạn vẫn phải lái xe. Nhưng không còn phải nhớ hết mọi con đường.

---

## Cách thêm analogy mới

Template:
```markdown
### [Concept A] = [Concept đời thường B]

**Concept:** [Giải thích ngắn gọn mối liên hệ]

**Cách dùng:**
> [Ví dụ narrative dùng trong bài viết]
```

**Tiêu chí analogy tốt:**
- Ai cũng hiểu concept đời thường (không quá niche)
- Mapping 1:1 với technical concept
- Có thể mở rộng khi cần (analogy có "depth")
- Memorable, dễ nhớ
