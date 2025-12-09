FROM node:20-alpine

RUN apk add --no-cache dumb-init
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

RUN addgroup -g 1001 -S appgroup && adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .

# 1. Build xong ra folder /dist
RUN pnpm run build

# 2. Xóa devDependencies (bao gồm cả vite) cho nhẹ máy
RUN pnpm prune --prod

# 3. Cài đặt gói 'serve' toàn cục để thay thế vite preview
RUN npm install -g serve

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5173
ENTRYPOINT ["dumb-init", "--"]

# 4. Đổi lệnh chạy thành 'serve'
# -s: single page app (để hỗ trợ React Router không bị lỗi 404 khi f5)
# dist: tên thư mục build
CMD ["serve", "-s", "dist", "-l", "5173"]