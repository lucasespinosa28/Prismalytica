
FROM python:3.13-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    make \
    gcc \
    libcairo2 \
    libcairo2-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    && apt-get clean

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --upgrade pip
# Try installing with pip directly from the requirements file
RUN pip install -r requirements.txt

# Copy the rest of the application
COPY . .

EXPOSE 8000
# Set environment variables (these will be overridden by docker-compose)
ENV GOOGLE_API_KEY=""
ENV EXPLORER_API_KEY=""

# Run the application
CMD ["fastapi", "run","main.py"]

