 FROM python:3.9-slim

# Install ODBC driver dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    unixodbc \
    unixodbc-dev \
    curl \
    gnupg && \
    rm -rf /var/lib/apt/lists/*

# Install ODBC Driver 17 for SQL Server
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    apt-get remove -y curl gnupg && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /backend

# Copy requirements file separately and install dependencies first for caching
COPY requirements.txt /backend/
RUN python -m venv venv
RUN /backend/venv/bin/pip install -r requirements.txt

# Install uvicorn
RUN /backend/venv/bin/pip install uvicorn

# Copy the rest of the application code
COPY . /backend/

# Expose port and define command
EXPOSE 80
CMD ["/backend/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
