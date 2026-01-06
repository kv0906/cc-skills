---
type: content
status: active
tags:
  - type/content
  - project/vibecode
  - topic/marketing
  - topic/authentication
  - topic/security
  - series/duc-ket-token
created: 2025-12-04
modified: 2025-12-04
series: Đúc Kết Từ Hàng Trăm Triệu Token
order: 4
---

# Bài 4: Chìa Khóa Và Ổ Khóa

Authentication là thứ AI hay viết sai nhất. Và cũng là thứ nguy hiểm nhất nếu sai.

Mình đã từng thấy code auth do AI generate mà nhìn vào muốn khóc. SQL injection, plain text password, hardcoded secrets. Đủ cả.

Nhưng trước khi nói về cách fix, hãy nói về cách hiểu.

Cơ chế đăng ký, đăng nhập cơ bản giống như **chìa khóa và ổ khóa vào nhà**.

- Đăng ký = Bạn làm một bộ chìa khóa
- Đăng nhập = Bạn dùng chìa để mở cửa
- Token = Thẻ ra vào, chứng minh bạn đã được xác thực
- Token expired = Thẻ hết hạn, cần gia hạn

Khi hiểu ẩn dụ này, debug auth dễ hơn nhiều:

- Không vào được? Sai chìa hay khóa hỏng?
- 401 Unauthorized? Không có chìa
- 403 Forbidden? Có chìa nhưng không được phép vào phòng đó

Đây là lý do mình luôn nói: foundations trước, speed sau.

Bạn có thể vibe code auth trong 10 phút. Nhưng nếu không hiểu nó hoạt động thế nào, bạn sẽ mất 10 tiếng để debug khi nó không chạy.

Ở đây không có đúng hay sai, tùy vào trường hợp. Nhưng nếu bạn muốn đi xa, bạn phải đủ nội lực.

---

## Key Takeaways
- Auth = Chìa khóa và ổ khóa
- 401 = Không có chìa
- 403 = Có chìa nhưng không được phép
- Foundations trước, speed sau

## Auth Analogy Reference

| Khái niệm | Ẩn dụ thực tế |
|-----------|---------------|
| Đăng ký | Làm bộ chìa khóa |
| Đăng nhập | Dùng chìa mở cửa |
| Token | Thẻ ra vào |
| Token expired | Thẻ hết hạn |
| 401 Unauthorized | Không có chìa |
| 403 Forbidden | Có chìa, không được vào phòng đó |

## Common AI Auth Mistakes
- SQL injection vulnerabilities
- Plain text passwords
- Hardcoded secrets
- Missing input validation

## Related
- [[Bài 3 - JSON Căn Cước Của Thế Giới Số]] - Bài trước
- [[Bài 5 - 40-30-30]] - Bài tiếp theo
- [[4.2 - Bảo Mật Code AI]] - Deep dive về security
- [[🗺️ Marketing Content Series MOC]] - Series overview
