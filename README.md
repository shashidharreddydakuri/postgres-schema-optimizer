# PostgreSQL Schema Optimizer

Web-based tool to optimize PostgreSQL table schemas for storage efficiency.

## Features
- Drag-and-drop SQL file upload
- Side-by-side comparison of original/optimized schemas
- Column reordering based on alignment requirements
- One-click copy optimized schema

## Usage
1. Visit [github.io page](https://shashidharreddydakuri.github.io/postgres-schema-optimizer)
2. Upload your schema-only SQL file
3. Review optimized schema
4. Copy or download the result

## How it Works
- Orders columns by alignment requirements (8-byte first)
- Groups variable-length columns (TEXT, JSON, etc.) last
- Preserves original column definitions and constraints

## Limitations
- Works only with CREATE TABLE statements
- Doesn't modify indexes or other database objects