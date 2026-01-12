# Chọn Node
FROM node:18

# Thư mục làm việc trong container
WORKDIR /app

# Copy package.json trước
COPY package*.json ./

# Cài thư viện
RUN npm install

# Copy source code
COPY . .

# Mở cổng
EXPOSE 3003

# Chạy server
CMD ["node", "app.js"]