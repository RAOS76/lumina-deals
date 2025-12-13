# 🛠️ Manual de Mantenimiento y Operaciones - Lumina Ofertas

Este documento resume la arquitectura técnica, los problemas comunes encontrados durante el desarrollo y sus soluciones definitivas. Úsalo como guía cuando surjan errores en el futuro.

## 1. Arquitectura del Sistema
*   **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Tremor.
*   **Backend (Datos):** Supabase (PostgreSQL).
*   **Backend (Scraping):** Python + Playwright.
*   **Despliegue:** Vercel (Frontend).
*   **Dominio:** `luminaofertas.com` (Gestionado via Vercel DNS).

---

## 2. Solución de Problemas Comunes (Troubleshooting)

### 🔴 Error: "Build Failed: supabaseUrl is required"
**Síntoma:** Al desplegar en Vercel, el build falla con este mensaje, aunque las variables de entorno parezcan estar bien.
**Causa:** Next.js intenta pre-renderizar páginas estáticas y ejecuta el código de conexión a la BD antes de tener acceso a las variables del entorno de producción.
**Solución (Ya aplicada):**
En `src/app/page.tsx`, la inicialización del cliente Supabase está protegida con un `try-catch`.
```typescript
try {
    if (supabaseUrl && supabaseKey) {
        supabase = createClient(...);
    }
} catch (e) { ... }
```
*Nunca elimines este bloque try-catch.*

### 🔴 Error: Imágenes Rotas o Productos "Unknown Title"
**Síntoma:** Aparecen tarjetas de producto vacías o con iconos de imagen rota.
**Causa:**
1.  **Unknown Title:** El scraper falló al leer el título.
2.  **Imágenes Rotas:** Amazon bloqueó la carga de la imagen (Hotlinking protection) o la URL expiró.
**Solución (Ya aplicada):**
*   **Filtro:** `page.tsx` filtra automáticamente cualquier producto con "Unknown Title".
*   **Fallback:** `ProductCard.tsx` tiene un evento `onError` que reemplaza imágenes rotas por un placeholder gris.

### 🔴 Error: "Parking Page" en el Dominio
**Síntoma:** Entras a `luminaofertas.com` y ves una página de anuncios o de "Namecheap/GoDaddy".
**Solución:**
*   Verifica los **Nameservers** en tu registrador de dominio. Deben ser:
    *   `ns1.vercel-dns.com`
    *   `ns2.vercel-dns.com`
*   Si los Nameservers están bien, **ESPERA**. Es un tema de propagación DNS (puede tardar hasta 24h, usualmente 1h). Limpia tu caché con `ipconfig /flushdns`.

---

## 3. Estrategia de Scraping y Amazon

### Estado Actual: Scraping "Híbrido"
Usamos Playwright para leer Amazon. Amazon tiene contramedidas fuertes (ofuscación de precios).
*   Si el scraper falla, la web usa **Mock Data** (datos de ejemplo) para no romperse.

### ⚠️ El Futuro: API Oficial (La Solución Definitiva)
Para escalar y tener precios en tiempo real sin bloqueos, debes migrar a la **Amazon Product Advertising API (PA-API)**.

**Pasos para activar:**
1.  Conseguir 3 ventas legítimas usando tus enlaces de afiliado manuales (SiteStripe).
2.  Obtener `Access Key` y `Secret Key` en Amazon Associates Central.
3.  Reemplazar `scraper.py` por un script que consuma la API oficial.

---

## 4. Comandos Útiles

**Actualizar la web (Desplegar cambios):**
```bash
git add .
git commit -m "Descripción del cambio"
npx vercel --prod
```

**Correr Scraper localmente (Prueba):**
```bash
cd backend
python scraper.py
```
*(Nota: Requiere activar entorno virtual y dependencias)*

---

**Creado por:** Antigravity Agent
**Fecha:** Diciembre 2025
