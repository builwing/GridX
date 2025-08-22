# 🔧 GridX Nginx設定サンプルドキュメント

## 📋 概要
このドキュメントでは、GridX数独パズルアプリケーションをNginxで配信するための設定サンプルを提供します。

**対象ドメイン**: `gridx.winroad.biz`  
**アプリケーションポート**: `3000`（Next.jsデフォルト）  
**SSL証明書**: 後日Certbotで自動設定

---

## 📝 基本的なNginx設定（SSL無し版）

### `/etc/nginx/sites-available/gridx.winroad.biz`

```nginx
# GridX 数独パズルアプリケーション - Nginx設定（SSL無し版）
# 作成日: 2025-01-22
# ドメイン: gridx.winroad.biz
# 注意: この設定はSSL無しの基本設定です。後日python3-certbot-nginxで自動的にSSL設定が追加されます。

# HTTPメインサーバー設定
server {
    listen 80;
    listen [::]:80;
    server_name gridx.winroad.biz;

    # Let's Encrypt認証用ディレクトリ（Certbot実行時に使用）
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # ルートディレクトリ
    root /var/www/gridx/public;
    index index.html;

    # クライアント最大ボディサイズ
    client_max_body_size 10M;

    # タイムアウト設定
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Gzip圧縮設定
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        image/svg+xml
        application/vnd.ms-fontobject
        application/x-font-ttf
        font/opentype;

    # 静的ファイルのキャッシュ設定
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js静的ファイル（/_next/static/）
    location /_next/static/ {
        alias /var/www/gridx/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js画像最適化
    location /_next/image {
        proxy_pass http://localhost:3000/_next/image;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # APIルート
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # メインアプリケーション
    location / {
        # Next.jsアプリケーションへのプロキシ
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # リアルIPとプロトコルの転送
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # WebSocket対応
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # エラーページ
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    # ログ設定
    access_log /var/log/nginx/gridx.winroad.biz.access.log;
    error_log /var/log/nginx/gridx.winroad.biz.error.log;
}
```

---

## 🚀 高度な設定オプション

### 1. レート制限の追加

```nginx
# /etc/nginx/nginx.conf のhttpブロックに追加
http {
    # レート制限ゾーンの定義
    limit_req_zone $binary_remote_addr zone=gridx_limit:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=gridx_conn:10m;
    
    # ... 他の設定
}

# サーバーブロックに追加
server {
    # APIエンドポイントのレート制限
    location /api/ {
        limit_req zone=gridx_limit burst=20 nodelay;
        limit_conn gridx_conn 10;
        
        proxy_pass http://localhost:3000/api/;
        # ... 他のプロキシ設定
    }
}
```

### 2. キャッシュ設定の強化

```nginx
# プロキシキャッシュの設定
proxy_cache_path /var/cache/nginx/gridx levels=1:2 keys_zone=gridx_cache:10m max_size=1g inactive=60m use_temp_path=off;

server {
    # 静的コンテンツのキャッシュ
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_cache gridx_cache;
        proxy_cache_valid 200 302 60m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_revalidate on;
        proxy_cache_min_uses 1;
        proxy_cache_lock on;
        
        add_header X-Cache-Status $upstream_cache_status;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. WebSocketサポートの完全設定

```nginx
# WebSocket用のアップストリーム
upstream gridx_websocket {
    server localhost:3000;
    keepalive 64;
}

# WebSocketマップ
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    # WebSocketエンドポイント
    location /ws {
        proxy_pass http://gridx_websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocketタイムアウト
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
```

---

## 🔍 設定のテストとデバッグ

### 設定ファイルのテスト

```bash
# Nginx設定の構文チェック
sudo nginx -t

# 詳細な設定テスト
sudo nginx -T
```

### デバッグ用設定

```nginx
# デバッグログの有効化（本番環境では無効化推奨）
error_log /var/log/nginx/gridx.winroad.biz.error.log debug;

# リクエスト詳細のログ
log_format detailed '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent" '
                   'rt=$request_time uct="$upstream_connect_time" '
                   'uht="$upstream_header_time" urt="$upstream_response_time"';

access_log /var/log/nginx/gridx.winroad.biz.detailed.log detailed;
```

---

## 📊 モニタリング設定

### Nginxステータスページ

```nginx
# ステータスページの設定（ローカルアクセスのみ）
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

### ヘルスチェックエンドポイント

```nginx
# アプリケーションヘルスチェック
location /health {
    access_log off;
    proxy_pass http://localhost:3000/api/health;
    proxy_set_header Host $host;
}
```

---

## 🔒 セキュリティ強化設定

### 追加のセキュリティ設定

```nginx
server {
    # DoS攻撃対策
    client_body_timeout 10s;
    client_header_timeout 10s;
    keepalive_timeout 5s 5s;
    send_timeout 10s;
    
    # バッファサイズの制限
    client_body_buffer_size 1K;
    client_header_buffer_size 1k;
    large_client_header_buffers 2 1k;
    
    # 不要なHTTPメソッドの制限
    if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$) {
        return 405;
    }
    
    # 隠しファイルへのアクセス拒否
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # バックアップファイルへのアクセス拒否
    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## 🔄 メンテナンスモード設定

### メンテナンスページの設定

```nginx
# メンテナンスモードの有効化
# touch /var/www/gridx/maintenance.flag でメンテナンスモードON
# rm /var/www/gridx/maintenance.flag でメンテナンスモードOFF

server {
    # メンテナンスチェック
    if (-f /var/www/gridx/maintenance.flag) {
        return 503;
    }
    
    # メンテナンスページ
    error_page 503 @maintenance;
    location @maintenance {
        root /var/www/gridx/public;
        rewrite ^.*$ /maintenance.html break;
    }
}
```

---

## 📝 設定適用手順

```bash
# 1. 設定ファイルを作成/編集
sudo nano /etc/nginx/sites-available/gridx.winroad.biz

# 2. シンボリックリンクを作成
sudo ln -s /etc/nginx/sites-available/gridx.winroad.biz /etc/nginx/sites-enabled/

# 3. デフォルトサイトを無効化（必要に応じて）
sudo rm /etc/nginx/sites-enabled/default

# 4. 設定をテスト
sudo nginx -t

# 5. Nginxをリロード
sudo systemctl reload nginx

# 6. ステータス確認
sudo systemctl status nginx
```

---

## 🐛 トラブルシューティング

### よくある問題と解決方法

#### 1. 502 Bad Gateway
```bash
# Next.jsアプリケーションが起動しているか確認
pm2 status
curl http://localhost:3000

# ログ確認
tail -f /var/log/nginx/gridx.winroad.biz.error.log
```

#### 2. 403 Forbidden
```bash
# ディレクトリ権限確認
ls -la /var/www/gridx/
sudo chown -R www-data:www-data /var/www/gridx
```

#### 3. SSL証明書エラー
```bash
# 証明書の確認
sudo certbot certificates
# 証明書の更新
sudo certbot renew
```

---

## 📅 更新履歴

- 2025-01-22: 初版作成
- Next.js対応、SSL設定、セキュリティ強化設定を含む

---

**注意事項**:
- 本番環境では必ずSSL/TLS証明書を設定してください
- セキュリティヘッダーは環境に応じて調整してください
- レート制限は実際のトラフィックに応じて調整してください