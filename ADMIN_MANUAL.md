# 🧹 Cleaning Pro Quote Engine - Admin Manual

¡Bienvenido al panel de administración de su aplicación SaaS! Este portal lee la "Regla de Oro" (el precio y estimaciones nunca se inventan de la nada). Sigue las matemáticas precisas de tus hojas de cálculo en Ontario.

Si los sueldos mínimos, márgenes operativos o los tiempos de las tareas cambian, aquí están los **5 pasos simples para actualizar todo el motor sin tocar código**:

## Paso 1: Descargar la Plantilla Excel / TSV
Su sistema actual usa 3 archivos vitales extraídos de sus bases de datos maestras:
- `DIM_TASK.tsv` (Lista de tareas, ej: "Barrer suelo").
- `FACT_TASK_RATES.tsv` (Rendimiento por tarea, ej: "10 mins por 1,000 sq ft").
- `DIM_ASSUMPTIONS.tsv` (Precios maestro, ej: `WageAllIn_CAD`, `MarkupTarget`, `MarginTarget`).

## Paso 2: Actualizar sus Precios
Abra estos `.tsv` (que son como Excels) en cualquier editor de texto o software como Microsoft Excel. Cambie el salario por hora en `DIM_ASSUMPTIONS.tsv` (de `$19.87` a `$22.00` por ejemplo), o altere el rendimiento de alguna tarea. **Guarde los cambios.**

## Paso 3: Comprimir los archivos en un `.zip`
Seleccione los 3 archivos y comprímalos en una carpeta ZIP. El motor ignora si los nombres están en mayúsculas o minúsculas.

## Paso 4: Subir en el Backend (Interfaz Admin)
Abra su aplicación en `http://localhost:3000`. Desplácese al final de la página principal donde se encuentra la sección **"Admin / Datasets"**. 

Haga clic en el recuadro gris, seleccione su `.zip` local y suba la información.

## Paso 5: ¡Listo! El "Dataset Versioning" hace su magia.
El motor automáticamente creará una nueva **"ACTIVE dataset version"**. A partir de ese exacto segundo, cada cotización cotizará usando la nueva tarifa bajo la trazabilidad transparente que exige el PDF. Las cotizaciones anteriores guardaran el esquema antiguo por razones de auditoria.

### Extra: Cómo encender el sistema para que no se apague
Si la aplicación se cierra, abre tu consola de terminal y corre estos comandos en la ruta `C:\Users\Luis Martinez\Downloads\Cleaning-app-pro`:

1. `npm install -g pm2` (Una sola vez para instalar el gestor de procesos).
2. `pm2 start npm --name "cleaning-app" -- start` (Esto enciende el servidor Next.js permanentemente en el fondo).
3. `pm2 save` (Guarda este estado).
4. `pm2 startup` (Se auto-encenderá con Windows si aplicas los comandos que arroja).

Visita `http://localhost:3000` siempre desde cualquier computadora en tu red configurada.
