# MASTER_BUILD_PLAN: Commercial Cleaning Quoting Web App / PWA (Ontario)

## Misión de la Aplicación
Construir una Web App/PWA escalable para cotizar limpieza comercial en Ontario, utilizando un bundle de archivos TSV como única fuente de la verdad para todos los cálculos y precios.

## Entorno Tecnológico (Tech Stack)
- **Frontend / Framework:** Next.js (App Router, React)
- **Estilos:** Tailwind CSS (Aesthetic UI/UX, responsive, PWA ready)
- **Backend / ORM:** Prisma
- **Base de Datos / Backend-as-a-Service:** Supabase (PostgreSQL)

## Arquitectura Principal

### 1. Multi-tenancy (Múltiples Clientes / Inquilinos)
- Aislamiento de datos a nivel de base de datos utilizando referencias de `tenant_id` en todas las tablas relevantes y complementándolo con Supabase Row Level Security (RLS).
- Autenticación segura para que cada empresa/usuario (Tenant) solo consulte y manipule sus propias cotizaciones, prospectos y configuraciones.

### 2. Dataset Versioning (Control de Versiones de Precios TSV)
- **Única Fuente de Verdad:** Bundle de archivos TSV para tarifas, tiempos de limpieza estándar, salarios base, suministros, overheads e impuestos (HST 13%).
- **Versionado Inmutable:** Cada importación o actualización del bundle de archivos TSV generará una nueva versión en el sistema (ej. `v1`, `v2`).
- **Trazabilidad:** Toda cotización guardará el ID de la versión del dataset con la que fue calculada. Las cotizaciones históricas no cambiarán de precio si se sube un nuevo TSV; las nuevas cotizaciones usarán el dataset marcado como "activo".

## REGLA DE ORO (Golden Rule)
- **NO INVENTAR DATOS.**
- Cada cálculo en la plataforma debe ser estrictamente rastreable hasta el archivo TSV original.
- Si un dato o variable está ausente durante la lógica de cotización (ej. falta precio para un insumo o un tipo de piso), el sistema **NO** debe adivinar ni usar valores por defecto arbitrarios. Debe detener el cálculo y marcar el estado como `NEEDS_INPUT`.

## Hitos (Milestones) del Proyecto
- [x] **Hito M0:** Creación del Plan Maestro y reglas base.
- [ ] **Hito M1:** Estructura de Base de Datos (Esquema de Prisma alineado con Supabase, soporte Multi-tenancy y Versionado de TSVs).
- [ ] **Hito M2:** Iniciar Proyecto Next.js (Configuración Tailwind, Prisma, autenticación y PWA).
- [ ] **Hito M3:** Motor Ingestion de TSVs (Lógica para parsear, validar y almacenar versiones).
- [ ] **Hito M4:** Motor de Cálculos (Lógica de cotización observando estrictamente la Regla de Oro).
- [ ] **Hito M5:** Interfaz de Usuario (UI/UX - Formularios del quote, dashboard interactivo).
- [ ] **Hito M6:** MVP Pruebas y Despliegue.
