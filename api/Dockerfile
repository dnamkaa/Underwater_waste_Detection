FROM python:3.11-slim

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    libgl1-mesa-dev \
    libglib2.0-0 \
    libgthread-2.0-0 \
    libfontconfig1 \
    libxcb1 \
    libice6 \
    libxt6 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API code
COPY . .

# Override paths for Docker environment (no api/ prefix needed inside container)
ENV MODEL_PATH="model/best.pt"
ENV RESULTS_CSV="training/results.csv"
ENV METRICS_JSON="training/metrics.json"

# Expose Flask API port
EXPOSE 8000

# Run backend app
CMD ["python", "app.py"]