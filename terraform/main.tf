terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  access_key = "test"
  secret_key = "test"
  region     = "us-east-1"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    ec2 = "http://localhost:4566"
  }
}

resource "aws_security_group" "api_sg" {
  name        = "desafio-6-api-sg"
  description = "Permite acesso a API Node.js"

  ingress {
    description = "API Node.js"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "api_server" {
  ami           = "ami-12345678"
  instance_type = "t2.micro"

  security_groups = [
    aws_security_group.api_sg.name
  ]

  user_data = <<-EOF
    #!/bin/bash

    apt-get update -y
    apt-get install -y nodejs npm

    mkdir -p /app

    cat > /app/package.json <<'PACKAGE'
    ${file("${path.module}/../package.json")}
    PACKAGE

    mkdir -p /app/src

    cat > /app/src/server.js <<'SERVER'
    ${file("${path.module}/../src/server.js")}
    SERVER

    cat > /app/src/app.js <<'APP'
    ${file("${path.module}/../src/app.js")}
    APP

    mkdir -p /app/src/routes
    mkdir -p /app/src/controllers

    cat > /app/src/routes/product.routes.js <<'ROUTES'
    ${file("${path.module}/../src/routes/product.routes.js")}
    ROUTES

    cat > /app/src/controllers/product.controller.js <<'CONTROLLER'
    ${file("${path.module}/../src/controllers/product.controller.js")}
    CONTROLLER

    cd /app

    npm install

    nohup npm start > app.log 2>&1 &
  EOF

  tags = {
    Name = "desafio-6-api"
  }
}

output "instance_id" {
  description = "ID da instancia criada"
  value       = aws_instance.api_server.id
}