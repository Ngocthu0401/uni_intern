1. mvn clean install -DskipTests

# README – UNI Intern Backend (port 8080)

````markdown
# UNI Intern Backend – Run JAR with PM2 (port 8080)

## 1) Yêu cầu môi trường

- Java Runtime: **JDK/JRE 17+** (khuyên dùng 21)
- PM2 (global)
- Nginx (nếu public domain, ví dụ api.intern.oceanmind.id.vn)

## 2) Cấu trúc & đường dẫn

- Thư mục: `/home/uni_intern/backend`
- JAR: `internship-management-0.0.1-SNAPSHOT.jar`
- Tạo symlink để dễ update:
  ```bash
  ln -sfn /home/uni_intern/backend/internship-management-0.0.1-SNAPSHOT.jar /home/uni_intern/backend/app.jar
  ```
````

## 3) Start bằng PM2

```bash
cd /home/uni_intern/backend
pm2 start java --name uni-intern-be --interpreter none -- \
  -jar /home/uni_intern/backend/app.jar \
  --server.port=8080
  # Thêm nếu có profile: --spring.profiles.active=dev

pm2 save
pm2 startup
```

> Có thể thêm JVM RAM flags: `-Xms256m -Xmx512m` trước `-jar`.

## 4) Kiểm tra nhanh

```bash
pm2 list
pm2 logs uni-intern-be
curl -I http://127.0.0.1:8080
```

## 5) Nginx reverse proxy (tuỳ chọn – ví dụ api.intern.oceanmind.id.vn)

```
server {
  server_name api.intern.oceanmind.id.vn;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }

  listen 443 ssl;
  ssl_certificate     /etc/letsencrypt/live/api.intern.oceanmind.id.vn/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.intern.oceanmind.id.vn/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

map $http_upgrade $connection_upgrade { default upgrade; '' close; }

server {
  listen 80;
  server_name api.intern.oceanmind.id.vn;
  return 301 https://$host$request_uri;
}
```

Áp dụng:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 6) Cập nhật JAR (deploy version mới)

```bash
cd /home/uni_intern/backend
# Upload JAR mới, ví dụ internship-management-0.0.2.jar
ln -sfn /home/uni_intern/backend/internship-management-0.0.2.jar /home/uni_intern/backend/app.jar
pm2 reload uni-intern-be
pm2 logs uni-intern-be
```

## 7) Lệnh hữu ích

```bash
pm2 stop uni-intern-be
pm2 restart uni-intern-be
pm2 delete uni-intern-be
pm2 flush uni-intern-be
sudo ss -lntp | grep 8080
```

## 8) Lưu ý

- Nếu thư mục/ file thuộc user `root`, cấp lại quyền cho user chạy PM2 (ví dụ `ocean`):
  `sudo chown -R ocean:ocean /home/uni_intern/backend`
- Kiểm tra DNS nếu dùng domain mới: `dig +short api.intern.oceanmind.id.vn @1.1.1.1`

```

---

Cần mình đóng gói 2 README này thành file và đẩy vào đúng thư mục trên VPS cho bạn không?
```
