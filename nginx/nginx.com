server {
    listen 80;
    
    # Nơi chứa các file HTML/JS/CSS của React sau khi build
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Cấu hình quan trọng: Bắt mọi request trỏ về index.html để React Router tự xử lý
    location / {
        try_files $uri $uri/ /index.html;
    }

    # (Tùy chọn) Khắc phục triệt để CORS bằng Reverse Proxy
    # Nếu Backend của bạn đang chạy ở http://192.168.1.100:8080
    # Bạn có thể mở comment đoạn dưới đây:
    
    # location /api/ {
    #     proxy_pass http://192.168.1.100:8080/;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    # }
}
192.168.1.100