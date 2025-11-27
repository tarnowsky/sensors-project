FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy contract sources and config
COPY contracts ./contracts
COPY scripts ./scripts
COPY hardhat.config.js ./

# Compile contracts
RUN npx hardhat compile

# Expose Hardhat node port
EXPOSE 8545

# Create startup script that waits for node to be ready
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx hardhat node --hostname 0.0.0.0 &' >> /app/start.sh && \
    echo 'echo "Waiting for Hardhat node to start..."' >> /app/start.sh && \
    echo 'for i in $(seq 1 30); do' >> /app/start.sh && \
    echo '  if wget -q --spider http://localhost:8545 2>/dev/null; then' >> /app/start.sh && \
    echo '    echo "Hardhat node is ready!"' >> /app/start.sh && \
    echo '    break' >> /app/start.sh && \
    echo '  fi' >> /app/start.sh && \
    echo '  echo "Waiting... ($i/30)"' >> /app/start.sh && \
    echo '  sleep 1' >> /app/start.sh && \
    echo 'done' >> /app/start.sh && \
    echo 'echo "Deploying contract..."' >> /app/start.sh && \
    echo 'npx hardhat run scripts/deploy.js --network localhost' >> /app/start.sh && \
    echo 'echo "Contract deployed! Hardhat node running..."' >> /app/start.sh && \
    echo 'wait' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]
