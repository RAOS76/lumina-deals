-- Habilitar extensión para UUIDs si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amazon_id VARCHAR(50) UNIQUE NOT NULL, -- ASIN o ID único de Amazon
    title TEXT NOT NULL,
    clean_title TEXT, -- Título optimizado por IA
    original_price DECIMAL(10, 2),
    current_price DECIMAL(10, 2) NOT NULL,
    discount_percentage INT,
    
    -- Campos de IA
    ai_summary TEXT, -- Resumen persuasivo
    ai_badge VARCHAR(50), -- Ej: "📉 Mínimo Histórico", "🔥 Viral"
    sentiment_score FLOAT, -- 0.0 a 1.0
    sales_phrase TEXT, -- Frase de venta "pain point"
    
    -- Datos Visuales y Enlaces
    image_url TEXT,
    product_url TEXT,
    
    -- Historial de Precios (Array de JSON para simplificar en MVP)
    -- Estructura: [{"date": "2023-10-01", "price": 29.99}, ...]
    price_history JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de consultas comunes
CREATE INDEX IF NOT EXISTS idx_products_discount ON products(discount_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_products_updated ON products(updated_at DESC);

-- 1. Activar la seguridad RLS en la tabla
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Crear Política de LECTURA (Abierta al mundo)
-- Permite que cualquiera vea las ofertas en tu web
DROP POLICY IF EXISTS "Public read access" ON products; -- Limpiar política anterior si existe
CREATE POLICY "Permitir lectura pública"
ON products FOR SELECT
TO anon
USING (true);

-- 3. Crear Política de ESCRITURA (Cerrada, solo Service Role)
-- Al no dar permisos al rol 'anon', nadie desde el navegador puede hackearte.
-- Solo tu script Python (que usa la SERVICE_ROLE KEY) podrá saltarse esta regla.
-- 3. Crear Políticas de ESCRITURA (Cerrada, solo Service Role)
CREATE POLICY "Solo admin puede insertar"
ON products FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "Solo admin puede actualizar"
ON products FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Solo admin puede borrar"
ON products FOR DELETE
TO service_role
USING (true);
